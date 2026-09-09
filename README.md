# DailyPulse — Daily Work Goal & End-of-Day Report Automation

A modern, streamlined web application for managing daily morning goals, end-of-day reports, competitor research tracking, and aggregated performance reporting across weekly, monthly, and custom date ranges.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Firebase Firestore** with zero-setup offline fallback.

---

## 🌟 Key Features

1. **Daily Morning Goals (`08:00 AM`)**:
   - Pre-configured targets matching your exact workflow:
     - **Lead Generation**: Target leads to find (15–20), qualified prospects to contact (5+), follow-ups (10–15).
     - **Client Onboarding**: Existing prospect follow-up actions & target onboarding conversions.
     - **Customer Support**: Planned calls/messages, pending issues to clear, customer follow-ups.
     - **Competitor Research**: Target competitors to check, content types to monitor, organic lead-gen angles.
   - Dynamic custom fields & items.
   - **Save as Default Template** button to persist your preferred targets for every upcoming morning.

2. **End-of-Day Work Update (`06:00 PM`)**:
   - Side-by-side comparison with your morning targets (Target vs Actual).
   - Actual metrics:
     - 🎯 **Lead Generation**: Leads found, prospects contacted, follow-ups, positive responses, serious prospects, onboarding discussions.
     - 📞 **Customer Support**: Calls handled, issues resolved, pending issues, follow-ups required.
     - 📊 **Competitor Research**: Competitors checked, interactive tag list of observed activities (case studies, reels, promotional offers, etc.), and potential organic strategies to test.
     - 📋 **Daily Summary & Tomorrow's Priority**: Automatic summary calculation + high-priority tomorrow focus.

3. **1-Click "Beautiful Copy Text" (Emoji & Markdown)**:
   - Formats the report with crisp typography and emojis (🎯, 📞, 📊, 📋) matching your exact structure.
   - Ready to paste immediately into **WhatsApp**, **Slack**, **Telegram**, **Notion**, or **Email**.

4. **PDF Report Export**:
   - Clean, professional executive print view with custom print styling (`@media print`).
   - Generates high-resolution PDF summaries with KPI metric cards, badges, and competitor findings.

5. **Weekly, Monthly & Custom Date Range Analytics**:
   - Filter by: *Today*, *Yesterday*, *This Week*, *Last 7 Days*, *This Month*, *Last 30 Days*, or any *Custom Date Range*.
   - Calculates aggregate metrics:
     - Total Leads Found
     - Total Prospects Contacted
     - Positive Response Rate (%)
     - Onboarding Discussions & Conversion Rate (%)
     - Customer Support Resolution Rate (%)
     - Competitor Audits Logged
   - Day-by-day logs with direct jump-to-edit and one-click copy buttons.

6. **Firebase Firestore Database + Zero-Setup Fallback**:
   - Connect directly to your Firebase project by clicking the **Database** button in the header or via `.env.local`.
   - If Firebase credentials are not yet entered, the app functions immediately using local storage with initial sample data so you never hit a blocking error screen.

---

## 🚀 Quick Start

### 1. Install & Run Locally

```bash
cd /Users/dev3/.gemini/antigravity/scratch/daily-report-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Connect Firebase Firestore (Optional)

You can either:
1. Click the **"Local Database" / "Database"** badge in the top-right header and paste your Firebase Project ID and API Key.
2. OR create a `.env.local` file based on `.env.example`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
```

---

## 📂 Project Architecture

```
daily-report-app/
├── src/
│   ├── app/
│   │   ├── globals.css          # Theme configuration & print styling
│   │   ├── layout.tsx           # Google Font (Plus Jakarta Sans) & Root shell
│   │   └── page.tsx             # Main reactive dashboard
│   ├── components/
│   │   ├── layout/
│   │   │   └── Header.tsx       # Date navigator, tab switcher, DB status
│   │   ├── goals/
│   │   │   └── MorningGoalForm.tsx  # Dynamic morning target inputs
│   │   ├── eod/
│   │   │   └── EODReportForm.tsx    # Actuals entry, target vs actual comparison
│   │   ├── analytics/
│   │   │   └── RangeReportView.tsx  # Weekly/Monthly aggregated reporting
│   │   ├── export/
│   │   │   ├── CopyTextModal.tsx    # 1-click formatted copy with clipboard toast
│   │   │   └── PrintReportView.tsx  # Printable PDF executive view
│   │   ├── settings/
│   │   │   └── FirebaseConfigModal.tsx # In-app Firebase Firestore setup
│   │   └── ui/
│   │       └── Toast.tsx        # Notification toasts
│   ├── lib/
│   │   ├── firebase.ts          # Firebase SDK initializers
│   │   ├── storage.ts           # Dual-layer Firestore + LocalStorage sync
│   │   ├── formatters.ts        # Beautiful text & date formatters
│   │   └── defaultData.ts       # Predefined templates matching user spec
│   └── types/
│       └── report.ts            # Strongly-typed TypeScript data models
├── .env.example
├── package.json
└── tsconfig.json
```
