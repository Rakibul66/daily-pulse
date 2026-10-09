import React from "react";
import { MessageCircle, Phone, Check } from "lucide-react";

export const PricingHardwareSection: React.FC = () => {
  return (
    <div className="mb-20">
      <div className="border-4 border-black bg-amber-300 p-6 sm:p-8 shadow-[8px_8px_0px_#000] mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 bg-black text-amber-300 font-display font-black text-xs uppercase tracking-widest border border-black inline-block mb-2">
              HARDWARE INTEGRATION
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-black">
              COMPATIBLE POS HARDWARE & MACHINES
            </h2>
            <p className="text-xs sm:text-sm font-bold text-black uppercase tracking-wider mt-1">
              Pre-tested, plug-and-play barcode scanners, thermal receipt printers & label makers with 1-Year Warranty
            </p>
          </div>
          <a
            href="https://wa.me/8801315861003?text=Hello%20Shomporko%20CRM,%20I%20am%20interested%20in%20ordering%20POS%20Hardware."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-black hover:bg-slate-900 text-white font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all shrink-0 flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" /> ORDER VIA WHATSAPP (01315861003)
          </a>
        </div>
      </div>

      {/* Hardware Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Barcode Scanner (with wire) */}
        <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000] flex flex-col justify-between relative hover:-translate-y-1 transition-all">
          <div className="absolute top-4 right-4 px-3 py-1 bg-red-600 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000]">
            40% OFF
          </div>

          <div>
            <div className="h-44 w-full bg-slate-50 border-2 border-black mb-4 flex items-center justify-center p-4 relative overflow-hidden">
              <div className="flex flex-col items-center">
                <div className="w-16 h-28 bg-slate-800 rounded-t-xl rounded-b-md border-2 border-black flex flex-col items-center justify-between p-2 shadow-inner">
                  <div className="w-12 h-3 bg-red-500 rounded-sm animate-pulse" />
                  <div className="w-6 h-8 bg-slate-700 rounded-md" />
                </div>
                <div className="w-2 h-10 bg-black" />
                <span className="text-[10px] font-mono font-black text-slate-500 mt-1">[USB WIRED]</span>
              </div>
            </div>

            <h3 className="font-display font-black text-lg uppercase text-black mb-1">
              Barcode Scanner (with wire)
            </h3>
            <p className="text-xs font-bold text-slate-600 uppercase mb-4">
              High-speed 1D laser scanning, USB Plug & Play with drop-resistant ergonomic handle.
            </p>

            <div className="flex items-baseline gap-2 mb-4 pb-3 border-b-2 border-black">
              <span className="font-display font-black text-2xl text-black">
                ৳ 1,650
              </span>
              <span className="text-xs font-bold text-slate-400 line-through">
                ৳ 2,800
              </span>
            </div>

            <ul className="text-xs font-bold text-slate-700 space-y-1.5 mb-6 uppercase">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Fast 300 scans/sec laser sensor
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Zero driver installation needed
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> 1-Year replacement warranty
              </li>
            </ul>
          </div>

          <a
            href="https://wa.me/8801315861003?text=Hello%20Shomporko%20CRM,%20I%20want%20to%20order%20the%20Wired%20Barcode%20Scanner%20(40%25%20Off)."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-white hover:bg-slate-100 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] text-center transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-3.5 h-3.5" /> CALL US: 01315861003
          </a>
        </div>

        {/* 2. Barcode Scanner (wireless) */}
        <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000] flex flex-col justify-between relative hover:-translate-y-1 transition-all">
          <div className="absolute top-4 right-4 px-3 py-1 bg-red-600 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000]">
            15% OFF
          </div>

          <div>
            <div className="h-44 w-full bg-slate-50 border-2 border-black mb-4 flex items-center justify-center p-4 relative overflow-hidden">
              <div className="flex flex-col items-center">
                <div className="w-16 h-28 bg-slate-900 rounded-t-xl rounded-b-md border-2 border-black flex flex-col items-center justify-between p-2 shadow-inner">
                  <div className="w-12 h-3 bg-cyan-400 rounded-sm animate-pulse" />
                  <div className="w-6 h-8 bg-indigo-500 rounded-md" />
                </div>
                <span className="text-[10px] font-mono font-black text-indigo-600 mt-2">[2.4G WIRELESS + BT]</span>
              </div>
            </div>

            <h3 className="font-display font-black text-lg uppercase text-black mb-1">
              Barcode Scanner (wireless)
            </h3>
            <p className="text-xs font-bold text-slate-600 uppercase mb-4">
              Long-range 2.4GHz wireless + Bluetooth dongle with 2000mAh rechargeable lithium battery.
            </p>

            <div className="flex items-baseline gap-2 mb-4 pb-3 border-b-2 border-black">
              <span className="font-display font-black text-2xl text-black">
                ৳ 2,850
              </span>
              <span className="text-xs font-bold text-slate-400 line-through">
                ৳ 3,400
              </span>
            </div>

            <ul className="text-xs font-bold text-slate-700 space-y-1.5 mb-6 uppercase">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Up to 100m barrier-free range
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Up to 30,000 scans per single charge
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> 1-Year replacement warranty
              </li>
            </ul>
          </div>

          <a
            href="https://wa.me/8801315861003?text=Hello%20Shomporko%20CRM,%20I%20want%20to%20order%20the%20Wireless%20Barcode%20Scanner%20(15%25%20Off)."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-white hover:bg-slate-100 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] text-center transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-3.5 h-3.5" /> CALL US: 01315861003
          </a>
        </div>

        {/* 3. Thermal Receipt Printer (80mm) */}
        <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000] flex flex-col justify-between relative hover:-translate-y-1 transition-all">
          <div className="absolute top-4 right-4 px-3 py-1 bg-amber-300 text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000]">
            TOP SELLER
          </div>

          <div>
            <div className="h-44 w-full bg-slate-50 border-2 border-black mb-4 flex items-center justify-center p-4 relative overflow-hidden">
              <div className="flex flex-col items-center">
                <div className="w-28 h-24 bg-slate-900 border-3 border-black rounded-md p-2 flex flex-col justify-between shadow-md">
                  <div className="w-full h-3 bg-white border border-black flex items-center px-1">
                    <div className="w-8 h-1 bg-slate-300" />
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[9px] font-mono text-white font-bold">80mm ESC/POS</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-black text-slate-600 mt-2">[AUTO CUTTER]</span>
              </div>
            </div>

            <h3 className="font-display font-black text-lg uppercase text-black mb-1">
              Thermal POS Receipt Printer (80mm)
            </h3>
            <p className="text-xs font-bold text-slate-600 uppercase mb-4">
              Ultra-fast 260mm/s speed, automatic paper cutter, ESC/POS, USB & LAN network interface.
            </p>

            <div className="flex items-baseline gap-2 mb-4 pb-3 border-b-2 border-black">
              <span className="font-display font-black text-2xl text-black">
                ৳ 5,400
              </span>
              <span className="text-xs font-bold text-slate-400 line-through">
                ৳ 6,500
              </span>
            </div>

            <ul className="text-xs font-bold text-slate-700 space-y-1.5 mb-6 uppercase">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Auto cash drawer kickout port
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> No ribbon or ink cartridges needed
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> 1-Year service warranty
              </li>
            </ul>
          </div>

          <a
            href="https://wa.me/8801315861003?text=Hello%20Shomporko%20CRM,%20I%20want%20to%20order%20the%2080mm%20Thermal%20Receipt%20Printer."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-white hover:bg-slate-100 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] text-center transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-3.5 h-3.5" /> CALL US: 01315861003
          </a>
        </div>

        {/* 4. Thermal Barcode Sticker & Label Printer */}
        <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000] flex flex-col justify-between relative hover:-translate-y-1 transition-all">
          <div className="absolute top-4 right-4 px-3 py-1 bg-indigo-600 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000]">
            LABEL MAKER
          </div>

          <div>
            <div className="h-44 w-full bg-slate-50 border-2 border-black mb-4 flex items-center justify-center p-4 relative overflow-hidden">
              <div className="flex flex-col items-center">
                <div className="w-28 h-24 bg-indigo-950 border-3 border-black rounded-md p-2 flex flex-col justify-between shadow-md">
                  <div className="w-full h-4 bg-white border border-black flex items-center justify-center">
                    <span className="text-[8px] font-mono font-black text-black">||||| 50x30mm |||||</span>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-[9px] font-mono text-white font-bold">STICKER ROLL</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-black text-slate-600 mt-2">[DIRECT THERMAL]</span>
              </div>
            </div>

            <h3 className="font-display font-black text-lg uppercase text-black mb-1">
              Thermal Barcode Label Printer
            </h3>
            <p className="text-xs font-bold text-slate-600 uppercase mb-4">
              High resolution barcode label printer for clothing tags, retail stickers, and shelf pricing.
            </p>

            <div className="flex items-baseline gap-2 mb-4 pb-3 border-b-2 border-black">
              <span className="font-display font-black text-2xl text-black">
                ৳ 6,900
              </span>
              <span className="text-xs font-bold text-slate-400 line-through">
                ৳ 8,500
              </span>
            </div>

            <ul className="text-xs font-bold text-slate-700 space-y-1.5 mb-6 uppercase">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Compatible with 50x30mm & 40x25mm rolls
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> High density 203 DPI print head
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> 1-Year service warranty
              </li>
            </ul>
          </div>

          <a
            href="https://wa.me/8801315861003?text=Hello%20Shomporko%20CRM,%20I%20want%20to%20order%20the%20Barcode%20Label%20Printer."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-white hover:bg-slate-100 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] text-center transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-3.5 h-3.5" /> CALL US: 01315861003
          </a>
        </div>

        {/* 5. Electric Cash Drawer */}
        <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000] flex flex-col justify-between relative hover:-translate-y-1 transition-all">
          <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000]">
            HEAVY DUTY
          </div>

          <div>
            <div className="h-44 w-full bg-slate-50 border-2 border-black mb-4 flex items-center justify-center p-4 relative overflow-hidden">
              <div className="flex flex-col items-center">
                <div className="w-36 h-20 bg-slate-800 border-3 border-black rounded-sm p-1.5 flex flex-col justify-between shadow-md">
                  <div className="grid grid-cols-4 gap-1 h-8 bg-slate-900 border border-black p-1">
                    <div className="bg-slate-700 h-full rounded-[1px]" />
                    <div className="bg-slate-700 h-full rounded-[1px]" />
                    <div className="bg-slate-700 h-full rounded-[1px]" />
                    <div className="bg-slate-700 h-full rounded-[1px]" />
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[9px] font-mono text-white font-bold">5 BILLS / 8 COINS</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-black text-slate-600 mt-2">[RJ11 KICKOUT]</span>
              </div>
            </div>

            <h3 className="font-display font-black text-lg uppercase text-black mb-1">
              Electronic Metal Cash Drawer
            </h3>
            <p className="text-xs font-bold text-slate-600 uppercase mb-4">
              Heavy-duty cold rolled steel construction with key lock & automatic receipt printer trigger.
            </p>

            <div className="flex items-baseline gap-2 mb-4 pb-3 border-b-2 border-black">
              <span className="font-display font-black text-2xl text-black">
                ৳ 3,800
              </span>
              <span className="text-xs font-bold text-slate-400 line-through">
                ৳ 4,500
              </span>
            </div>

            <ul className="text-xs font-bold text-slate-700 space-y-1.5 mb-6 uppercase">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Connects to POS printer via RJ11
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> 3-Position secure lock (Lock/Manual/Auto)
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> 1-Year replacement warranty
              </li>
            </ul>
          </div>

          <a
            href="https://wa.me/8801315861003?text=Hello%20Shomporko%20CRM,%20I%20want%20to%20order%20the%20Electric%20Metal%20Cash%20Drawer."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-white hover:bg-slate-100 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] text-center transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-3.5 h-3.5" /> CALL US: 01315861003
          </a>
        </div>

        {/* 6. Complete Retail Counter Hardware Combo Package */}
        <div className="bg-[#FFFDF0] border-4 border-black p-6 shadow-[8px_8px_0px_#000] flex flex-col justify-between relative hover:-translate-y-1 transition-all border-amber-500">
          <div className="absolute top-4 right-4 px-3 py-1 bg-amber-400 text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000]">
            SAVE ৳3,000
          </div>

          <div>
            <div className="h-44 w-full bg-amber-100 border-2 border-black mb-4 flex items-center justify-center p-4 relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-12 h-20 bg-slate-900 border-2 border-black rounded-md flex flex-col justify-between p-1">
                  <div className="w-full h-2 bg-red-500" />
                  <span className="text-[7px] text-white font-mono">SCANNER</span>
                </div>
                <span className="font-black text-lg">+</span>
                <div className="w-16 h-16 bg-slate-900 border-2 border-black rounded-md flex flex-col justify-between p-1">
                  <div className="w-full h-2 bg-white" />
                  <span className="text-[7px] text-white font-mono">PRINTER</span>
                </div>
                <span className="font-black text-lg">+</span>
                <div className="w-16 h-12 bg-slate-800 border-2 border-black rounded-sm flex items-center justify-center">
                  <span className="text-[7px] text-white font-mono">DRAWER</span>
                </div>
              </div>
            </div>

            <h3 className="font-display font-black text-lg uppercase text-black mb-1">
              Complete Retail Counter Bundle
            </h3>
            <p className="text-xs font-bold text-slate-600 uppercase mb-4">
              Scanner (Wired/Wireless) + 80mm Thermal Printer + Cash Drawer + 10 Paper Rolls.
            </p>

            <div className="flex items-baseline gap-2 mb-4 pb-3 border-b-2 border-black">
              <span className="font-display font-black text-3xl text-indigo-700">
                ৳ 10,500
              </span>
              <span className="text-xs font-bold text-slate-400 line-through">
                ৳ 13,800
              </span>
            </div>

            <ul className="text-xs font-bold text-slate-700 space-y-1.5 mb-6 uppercase">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Complete hardware suite for 1 Counter
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Free doorstep delivery & driver setup
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> 1-Year comprehensive warranty
              </li>
            </ul>
          </div>

          <a
            href="https://wa.me/8801315861003?text=Hello%20Shomporko%20CRM,%20I%20want%20to%20order%20the%20Complete%20Retail%20Counter%20Bundle%20(৳10,500)."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] text-center transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-emerald-300" /> ORDER BUNDLE COMBO
          </a>
        </div>

      </div>
    </div>
  );
};
