# Shomporko CRM & POS (সম্পর্ক সিআরএম ও পিওএস)

> **The Ultimate POS & ERP Software for Modern Businesses in Bangladesh.**  
> Fast, reliable, user-friendly retail automation, sales pipeline CRM, inventory management, and plug-and-play POS hardware integration.

---

## 🚀 Live Demo & Navigation Routes

- **Homepage (`/`)**: Neo-Brutalist landing page featuring POS & ERP overview, system capabilities, hardware compatibility strip, and transparent pricing.
- **About Us (`/about`)**: Our story, mission, why retail businesses choose Shomporko CRM, and automated architecture.
- **Pricing & Hardware (`/pricing`)**: 
  - Software Subscriptions: Starter POS (৳650/mo), Business Pro (৳1,450/mo), Enterprise ERP (৳2,850/mo).
  - Compatible POS Hardware & Machines: Barcode Scanners (Wired 40% Off, Wireless 15% Off), 80mm Thermal Receipt Printers, Thermal Label Sticker Printers, and Electric Cash Drawers.
- **Contact Us (`/contact`)**: Neo-Brutalist contact & inquiry form saving to Firebase Firestore `lead_requests` + direct WhatsApp hotline (`01315861003`).
- **Admin Dashboard & POS Terminal (`/`)**: Authenticated admin workspace featuring 25+ modules across POS, CRM, Inventory, Purchases, Accounts, and HRM.

---

## 🛠️ Key Implemented Modules & Features

### 1. ⚡ POS Terminal & Hardware Machine Integration
- **USB & Wireless Barcode Scanner Engine**:
  - Global high-speed keystroke listener detects standard HID keyboard-emulation barcode scanners (300 scans/second).
  - Web Audio API sound synthesis produces an authentic high-frequency retail checkout beep on every scan.
  - Automatic product lookup by Barcode (SKU) or Product ID.
  - Repeated scans automatically increment item quantity in real time.
- **Thermal Receipt Printing (ESC/POS 80mm & 58mm)**:
  - Formatted for standard retail thermal printers (Xprinter, Rongta, Bixolon, Epson).
  - Itemized layout with Store Name, Invoice Number, Date/Time, Customer Details, Item Rows, Subtotal, Discount, Net Payable, Cash Received, and Change Due.
  - Barcode footer and auto-cash drawer kickout trigger (`RJ11`).
  - Specialized `@media print` CSS ensures **only** the receipt paper prints with zero margins.
- **Quick Cash Tender & Discounts**:
  - One-click tender buttons: Exact Cash, ৳500, ৳1,000, ৳1,500, ৳2,000, ৳5,000.
  - Flat discount (৳) or Percentage discount (%) with live net payable calculation.

---

### 2. 🏷️ Barcode Label & Sticker Generator (`/purchase-generate-barcode`)
- **Direct Thermal Label Roll Printing**:
  - Compatible with Xprinter XP-365B, XP-420B, Zebra ZD220, TSC, and standard thermal sticker printers.
  - Formats supported:
    - `50mm x 30mm` (1-Column Thermal Sticker Roll)
    - `40mm x 25mm` (2-Up Column Thermal Sticker Roll)
    - `A4 Standard Sheet` (3 Columns × 8 Rows = 24 Stickers per Page)
- **Live SVG Vector Barcode Rendering**:
  - High-density Code-128 barcode bars with human-readable numbers.
  - Configurable Store Name on top and MRP Price in BDT (৳).
  - Print Queue summary allowing bulk label generation for product inventory.

---

### 3. 📦 Inventory & Stock Management
- **Centralized Product Directory**:
  - Manage SKU, product name, category, cost price, selling price, stock on hand, and alert threshold.
  - Real-time stock decrement upon completing POS sales.
  - Filter by category and search by title or barcode.

---

### 4. 🛒 Purchases & Vendor Management
- **Vendor Setup**: Directory of suppliers, contact persons, phone numbers, and addresses.
- **Product Lifting & Purchases**: Track cash/credit purchases against vendor accounts.
- **Purchase Returns**: Damaged or expired inventory returns with adjustment logs.
- **Vendor Payments**: Record bank transfers, cash payments, and ledger balances.

---

### 5. 💼 Sales, Invoices & Collections
- **Client Directory**: Customer profiles, loyalty tiers, credit limits, and contact info.
- **Sales Invoices**: Standard wholesale/B2B invoice generation with payment status.
- **Payment Collections**: Log collections across Cash, Bank, bKash Merchant, and Nagad.
- **Sales Returns & Approvals**: Multistep return authorization workflow.

---

### 6. 👥 HRM, Attendance & Payroll
- **Employee Directory**: Staff profiles, designations, joining dates, and departments.
- **Daily Attendance**: Track check-in/check-out and working hours.
- **Overtime & Loans**: Staff loan disbursements and overtime calculation.
- **Monthly Payroll**: Automated salary slips with deductions and allowances.
- **Catering & Meals**: Office canteen meal tracking and catering vendor management.

---

### 7. 🤝 CRM & Lead Pipelines
- **CRM Dashboard**: Real-time sales conversion funnel and active opportunities.
- **Leads & Contacts**: Pipeline tracking from prospect to qualified lead.
- **AI Lead Prospector**: Smart recommendations for high-conversion accounts.
- **Customer Feedback & Lost/Found**: In-store customer service management.

---

### 8. 🏢 System Setup & Multi-Branch Support
- **Company Profile**: Business legal name, logo, trade license, and contact details.
- **Branch Management**: Central sync across multiple outlets (Main Branch, Dhanmondi, Gulshan, Mirpur, Chattogram).
- **Subscriptions & Billing**: Plan management and renewal tracking.

---

## 🖨️ How to Connect POS Hardware Machines

### 1. Connecting Barcode Scanners (USB Wired or Wireless)
1. **USB Wired Scanner**: Plug the USB cable into any USB port on your PC or POS terminal. The computer will automatically detect it as an HID Keyboard device.
2. **Wireless 2.4GHz Scanner**: Insert the USB wireless dongle into the computer. Turn on the barcode scanner; it pairs instantly without software drivers.
3. **Usage in Shomporko POS**:
   - Open the **POS Sales** screen.
   - Point the scanner at any product barcode and pull the trigger.
   - You will hear the **audio beep**, and the item will instantly appear in the cart!

### 2. Connecting Thermal Receipt Printers (80mm / 58mm)
1. Plug the printer into power and connect via USB or LAN cable.
2. In Windows / macOS printer settings, ensure the printer is set up with standard paper size:
   - For 80mm printers: Select **80(72.1) x 297 mm** or Roll Paper.
   - Set Margins to **None / Minimum**.
3. In Shomporko POS, when saving a sale with **"Print Receipt"** enabled:
   - Click **PRINT NOW**. The browser print dialog appears with the receipt styled cleanly.
   - Select your thermal printer and click Print.

### 3. Connecting Barcode Sticker / Label Printers
1. Load a roll of thermal sticker labels (e.g. 50mm × 30mm) into your label printer (e.g. Xprinter XP-365B or Zebra).
2. Go to **Purchase -> Generate Barcode** in the admin sidebar.
3. Select your product and the number of stickers needed.
4. Click **PRINT LABELS NOW**. In the print dialog, select your label printer and print directly onto thermal sticker rolls!

---

## 💻 Tech Stack & Architecture

- **Framework**: Next.js 15 (App Router with dynamic sharding)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Strict Neo-Brutalist design language: crisp white bg, solid black borders `border-4 border-black`, hard shadows `shadow-[8px_8px_0px_#000]`)
- **Icons**: Lucide React
- **Database & Storage**: Firebase Firestore (with resilient local storage fallback for offline resilience)
- **Authentication**: Firebase Authentication (Email/Password, Google OAuth)
- **Audio API**: Web Audio API oscillator synthesis for hardware checkout feedback

---

## 🏃 Getting Started & Local Development

### 1. Prerequisites
- Node.js 18.18+ or Node.js 20+
- npm or yarn

### 2. Installation
```bash
git clone https://github.com/your-username/shomporko-crm.git
cd shomporko-crm
npm install
```

### 3. Running Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build
```bash
npm run build
npm start
```

---

## 📞 Support & Hardware Sales Helpline

For inquiries, custom deployment, or ordering compatible POS hardware (Barcode Scanners, Printers, Cash Drawers):
- **Phone / WhatsApp**: `+880 1315-861003`
- **Email**: `info@shomporko.com`
- **Location**: Dhaka, Bangladesh
