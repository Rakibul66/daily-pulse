"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, X, AlertCircle, RefreshCw, CheckCircle2, SwitchCamera, Video, Sparkles, Send } from 'lucide-react';

interface CameraBarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onDetected: (barcode: string) => void;
}

interface VideoDevice {
  deviceId: string;
  label: string;
}

export const CameraBarcodeScanner: React.FC<CameraBarcodeScannerProps> = ({
  isOpen,
  onClose,
  onDetected,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [detectorSupported, setDetectorSupported] = useState(true);
  const [videoDevices, setVideoDevices] = useState<VideoDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [manualCode, setManualCode] = useState<string>('');
  const [isZXingLoading, setIsZXingLoading] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const zxingReaderRef = useRef<any>(null);

  // Play high-precision retail scanner beep (Web Audio API)
  const playBeep = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1450, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch {
      // AudioContext unavailable
    }
  }, []);

  const handleBarcodeFound = useCallback((rawCode: string) => {
    const clean = rawCode.trim();
    if (!clean) return;
    playBeep();
    onDetected(clean);
    onClose();
  }, [playBeep, onDetected, onClose]);

  // Enumerate Mac / device cameras (FaceTime camera, Continuity camera, external webcams)
  const enumerateCameras = async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices
        .filter(d => d.kind === 'videoinput')
        .map((d, index) => ({
          deviceId: d.deviceId,
          label: d.label || `Camera ${index + 1}`
        }));
      setVideoDevices(videoInputs);
      if (videoInputs.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoInputs[0].deviceId);
      }
    } catch (err) {
      console.warn('Could not enumerate cameras:', err);
    }
  };

  const stopCamera = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (zxingReaderRef.current) {
      try {
        zxingReaderRef.current.reset();
      } catch {}
      zxingReaderRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  }, [stream]);

  const startDetectionLoop = useCallback(() => {
    // 1. If native BarcodeDetector API exists (Chrome, Edge on Mac, Android)
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
      try {
        // @ts-ignore
        const detector = new window.BarcodeDetector({
          formats: [
            'code_128',
            'code_39',
            'code_93',
            'ean_13',
            'ean_8',
            'upc_a',
            'upc_e',
            'qr_code',
            'data_matrix',
            'itf',
          ],
        });

        const detectFrame = async () => {
          if (!videoRef.current || videoRef.current.readyState < 2) {
            animationFrameRef.current = requestAnimationFrame(detectFrame);
            return;
          }

          try {
            const barcodes = await detector.detect(videoRef.current);
            if (barcodes && barcodes.length > 0) {
              const code = barcodes[0].rawValue;
              if (code && code.trim()) {
                handleBarcodeFound(code);
                return;
              }
            }
          } catch {
            // Ignore transient frame errors
          }

          animationFrameRef.current = requestAnimationFrame(detectFrame);
        };

        animationFrameRef.current = requestAnimationFrame(detectFrame);
        return;
      } catch (e) {
        console.warn('Native BarcodeDetector init failed:', e);
      }
    }

    // 2. Fallback: If native BarcodeDetector not available (e.g. Safari on Mac)
    // Dynamically load ZXing browser library for software barcode decoding
    if (typeof window !== 'undefined') {
      if ((window as any).ZXing) {
        try {
          const ZXing = (window as any).ZXing;
          const codeReader = new ZXing.BrowserMultiFormatReader();
          zxingReaderRef.current = codeReader;
          codeReader.decodeFromVideoElement(videoRef.current, (result: any, err: any) => {
            if (result && result.getText()) {
              handleBarcodeFound(result.getText());
            }
          });
          return;
        } catch (e) {
          console.warn('ZXing decoding error:', e);
        }
      } else {
        setIsZXingLoading(true);
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@zxing/library@0.21.3/umd/index.min.js';
        script.async = true;
        script.onload = () => {
          setIsZXingLoading(false);
          try {
            const ZXing = (window as any).ZXing;
            if (ZXing && videoRef.current) {
              const codeReader = new ZXing.BrowserMultiFormatReader();
              zxingReaderRef.current = codeReader;
              codeReader.decodeFromVideoElement(videoRef.current, (result: any) => {
                if (result && result.getText()) {
                  handleBarcodeFound(result.getText());
                }
              });
            }
          } catch (e) {
            console.warn('ZXing startup error:', e);
          }
        };
        script.onerror = () => {
          setIsZXingLoading(false);
          setDetectorSupported(false);
        };
        document.head.appendChild(script);
      }
    }
  }, [handleBarcodeFound]);

  const startCamera = useCallback(async () => {
    setErrorMsg(null);
    stopCamera();

    try {
      const constraints: MediaStreamConstraints = {
        video: selectedDeviceId 
          ? { deviceId: { exact: selectedDeviceId } }
          : { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        setIsScanning(true);
        startDetectionLoop();
      }

      await enumerateCameras();
    } catch (err: any) {
      console.error('Camera access error:', err);
      setErrorMsg(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Click the lock/camera icon in your browser address bar to allow camera access.'
          : 'Unable to access Mac webcam / camera. Ensure it is connected and not in use by another app.'
      );
    }
  }, [selectedDeviceId, stopCamera, startDetectionLoop]);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, selectedDeviceId]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleBarcodeFound(manualCode.trim());
    }
  };

  const handleSwitchCamera = () => {
    if (videoDevices.length <= 1) return;
    const currentIndex = videoDevices.findIndex(d => d.deviceId === selectedDeviceId);
    const nextIndex = (currentIndex + 1) % videoDevices.length;
    setSelectedDeviceId(videoDevices[nextIndex].deviceId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white border-4 border-black shadow-[10px_10px_0px_#000] overflow-hidden flex flex-col my-auto">
        
        {/* Header Bar */}
        <div className="px-4 py-3 bg-amber-300 border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-black stroke-[2.5]" />
            <div>
              <h3 className="font-black text-sm uppercase tracking-wider text-black">
                Mac &amp; Device Barcode Scanner
              </h3>
              <p className="text-[10px] font-bold text-slate-700">
                Live webcam &amp; camera barcode recognition
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-black/10 border-2 border-black bg-white cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
          >
            <X className="w-4 h-4 text-black stroke-[2.5]" />
          </button>
        </div>

        {/* Camera Selector / Controls Header (Mac FaceTime / Continuity / Webcams) */}
        {videoDevices.length > 1 && (
          <div className="px-4 py-2 bg-slate-100 border-b-2 border-black flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Video className="w-4 h-4 text-slate-700 shrink-0" />
              <select
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                className="w-full text-xs font-bold bg-white border border-black px-2 py-1 truncate focus:outline-none"
              >
                {videoDevices.map((d) => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleSwitchCamera}
              className="px-2.5 py-1 bg-white hover:bg-amber-100 text-black border border-black text-[11px] font-black uppercase flex items-center gap-1 shrink-0 cursor-pointer"
              title="Switch to next camera"
            >
              <SwitchCamera className="w-3.5 h-3.5" /> Switch
            </button>
          </div>
        )}

        {/* Viewport Area */}
        <div className="relative bg-black aspect-4/3 flex items-center justify-center overflow-hidden">
          {errorMsg ? (
            <div className="p-6 text-center text-white space-y-3 max-w-sm">
              <AlertCircle className="w-9 h-9 text-rose-400 mx-auto" />
              <p className="text-xs font-bold leading-relaxed">{errorMsg}</p>
              <button
                type="button"
                onClick={startCamera}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 text-black border-2 border-black text-xs font-black uppercase cursor-pointer shadow-[2px_2px_0px_#000]"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry Camera
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Aiming Reticle / Laser Scanning Guideline */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                <div className="w-4/5 max-w-xs h-36 border-2 border-emerald-400 rounded-lg relative shadow-[0_0_20px_rgba(52,211,153,0.6)] flex items-center justify-center">
                  {/* Corner Target Markers */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-emerald-400" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-emerald-400" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-emerald-400" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-emerald-400" />
                  
                  {/* Animated Laser Scan Bar */}
                  <div className="w-full h-0.5 bg-rose-500 shadow-[0_0_10px_#f43f5e] animate-pulse" />

                  <div className="absolute top-2 left-2 text-[9px] font-black uppercase tracking-wider text-emerald-300 bg-black/75 px-1.5 py-0.5 border border-emerald-500/50">
                    Align Barcode Here
                  </div>
                </div>
              </div>

              {isZXingLoading && (
                <div className="absolute top-3 right-3 bg-black/80 text-amber-300 px-2 py-1 text-[10px] font-bold border border-amber-300">
                  Loading barcode engine...
                </div>
              )}
            </>
          )}
        </div>

        {/* Manual Barcode Input Fallback & Scanner Machine Tip */}
        <div className="p-3 bg-slate-50 border-t-2 border-black space-y-2.5">
          <form onSubmit={handleManualSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Or type/paste barcode manually here..."
              className="flex-1 px-3 py-1.5 text-xs font-bold text-black bg-white border-2 border-black focus:outline-none focus:bg-amber-50 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!manualCode.trim()}
              className="px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-black border-2 border-black text-xs font-black uppercase flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3 h-3" /> Apply
            </button>
          </form>

          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 bg-amber-100 p-2 border border-black">
            <span className="flex items-center gap-1.5">
              <span>⚡</span> <strong>Machine Scanner:</strong> Plug USB or Bluetooth barcode gun &amp; pull trigger anytime!
            </span>
            <span className="text-emerald-700 font-black uppercase text-[10px]">
              Ready
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
