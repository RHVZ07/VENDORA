# VENDORA – Vendor Management System

> **A Complete Full Stack Development (FSD) MERN Project**  
> *"A modern procurement portal for onboarding suppliers, evaluating vendor performance, and managing purchase order lifecycles."*

---

## 🌟 Demo Credentials

| Role | Email | Password | Dashboard Access |
| :--- | :--- | :--- | :--- |
| **Admin (Procurement Lead)** | `admin@vendora.com` | `Admin@123` | Full administrative control, onboarding review, evaluations, PO issuance, reports |
| **Vendor (Supplier Partner)** | `vendor@vendora.com` | `Vendor@123` | Supplier portal, 6-step onboarding wizard, PO fulfillment, scorecards, documents |

> 💡 **Tip:** The login page features **1-Click Quick Demo Login** buttons for instant access to both roles!

---

## 🎨 Visual Identity & Design System

- **Primary Color:** `#7C3AED` (Royal Purple)
- **Secondary Color:** `#EC4899` (Vibrant Pink)
- **Background Color:** `#F8FAFC` (Slate 50)
- **Typography:** *Outfit* (Headings & Metrics) + *Inter* (Body)
- **Styling:** **100% Vanilla CSS** using CSS custom properties (`var(--primary)`, `var(--secondary)`, etc.), glassmorphism panels, soft elevation shadows, rounded corners, and micro-animations. **No Tailwind, No Bootstrap, No Material UI.**

---

## 🛠️ Technology Stack (Strict MERN Only)

- **Frontend:**
  - **React.js** (Vite)
  - **Vanilla CSS** (Structured modular stylesheets)
  - **React Router DOM v6** (Protected & Role-based routes)
  - **Axios** (API requests with automatic JWT interceptors)
  - **Lucide React** (Clean modern procurement icons)
  - **Recharts** (Interactive dashboard spend, performance, and lifecycle charts)
- **Backend:**
  - **Node.js** & **Express.js** (MVC architecture)
  - **MongoDB** & **Mongoose ODM**
  - **JWT (JSON Web Tokens)** & **Bcrypt.js** (Secure authentication)
  - **Multer** (Disk-based compliance file upload handling)
  - **CORS** & **Dotenv**

---

## 🚀 Core Features & Workflows

### 1. 📋 Supplier Onboarding (6-Step Interactive Wizard)
- **Step 1 – Company Information:** Company Name, Business Type, Industry, Registration #, GSTIN, PAN, Year Established, Employee Strength.
- **Step 2 – Contact Information:** Authorized Liaison, Work Email, Phone Numbers, Website.
- **Step 3 – Registered Address:** Facility street address, City, State, Pincode, Country.
- **Step 4 – Business & Capabilities:** Products/Services offered, Business Description, Years of Experience, Annual Turnover scale.
- **Step 5 – Banking Coordinates:** Bank Name, Account Holder, Account Number, IFSC Code.
- **Step 6 – Compliance Documents:** GST Certificate, PAN Card, Incorporation Certificate, Bank Proof uploads.
- **Admin Review Workflow:** Complete multi-step data inspection, document verification, **Approve & Activate**, **Reject** (with reason), or **Request Changes** (with feedback notes).

### 2. 🏢 Vendor Management & Directory
- Real-time search across company name, vendor ID, email, and contact person.
- Multi-dimensional filters: Lifecycle status (`ACTIVE`, `PENDING`, `UNDER REVIEW`, `APPROVED`, `SUSPENDED`, `REJECTED`), Industry sector, and Rating tier (`Excellent`, `Good`, `Average`, `Poor`).
- Detailed **Tabbed Vendor Profile View**:
  - *Overview Tab* (Scorecard spotlight, contact coordinates, business overview)
  - *Company & Bank Info Tab* (Corporate IDs, registration numbers, disbursement accounts)
  - *Compliance Documents Tab* (File previews, status badges, verification actions)
  - *Performance History Tab* (Historical audit scores, feedback comments)
  - *Purchase Orders Tab* (Summary of orders issued to this vendor)

### 3. ⭐ Vendor Performance Evaluation (6-Factor Criteria Matrix)
- Standardized criteria rated on a 1 – 5 scale with interactive sliders and star ratings:
  1. **Product / Service Quality**
  2. **Delivery Performance**
  3. **Pricing Competitiveness**
  4. **Communication & Responsiveness**
  5. **Operational Reliability**
  6. **Regulatory Compliance**
- **Live Automatic Overall Score Calculation:** Computed average score, rating tier allocation (`Excellent` ≥4.5, `Good` ≥3.5, `Average` ≥2.5, `Poor` <2.5), and historical review logs.

### 4. 📦 Purchase Order Lifecycle Management
- **Lifecycle Stages:**
  $$\text{DRAFT} \longrightarrow \text{PENDING APPROVAL} \longrightarrow \text{APPROVED} \longrightarrow \text{PROCESSING} \longrightarrow \text{SHIPPED} \longrightarrow \text{DELIVERED} \longrightarrow \text{COMPLETED}$$
  *(Alternative: $\text{CANCELLED}$)*
- **Visual Progress Timeline (`POTimeline`):** Stepper with completed checkmarks, glowing active stage indicator, timestamps, and audit history.
- **Dynamic Line Item Matrix:** Add/remove items with quantity, unit price, tax (GST) %, and auto-calculated line item subtotal and taxes.
- **Financial Calculation Summary:** Automatic Subtotal, Tax Total, and Grand Total.
- **Automated PO Numbering:** E.g., `PO-2026-0001`.
- **Printable Invoice Docket:** Formatted for direct printing and invoicing.

### 5. 📁 Document Management
- Multi-document upload via Multer stored locally in `server/uploads/`.
- Verification statuses (`PENDING`, `VERIFIED`, `REJECTED`).
- Verification actions for procurement admins with rejection remarks.

### 6. 🔔 Real-time Notifications & Reports
- Instant notification alerts on application submissions, approvals, PO creations, and status changes.
- **Procurement Reports:** Executive spend charts, order volumes, supplier category distributions, and printable summaries.

---

## 📁 Project Directory Structure

```
VENDORA_1/
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── vendorController.js
│   │   ├── onboardingController.js
│   │   ├── evaluationController.js
│   │   ├── purchaseOrderController.js
│   │   ├── documentController.js
│   │   ├── notificationController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   ├── roleMiddleware.js     # Role-based access control
│   │   ├── uploadMiddleware.js   # Multer file upload storage
│   │   └── errorMiddleware.js    # Error handling
│   ├── models/
│   │   ├── User.js
│   │   ├── Vendor.js
│   │   ├── VendorEvaluation.js
│   │   ├── PurchaseOrder.js
│   │   ├── Document.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── vendorRoutes.js
│   │   ├── onboardingRoutes.js
│   │   ├── evaluationRoutes.js
│   │   ├── purchaseOrderRoutes.js
│   │   ├── documentRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── dashboardRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── seed.js               # Database population script
│   ├── uploads/                  # Uploaded compliance documents
│   ├── .env                      # Environment variables
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express server entry point
├── client/
│   ├── public/
│   │   └── favicon.svg           # Brand SVG icon
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Button, FormField, StatusBadge, StatCard, DataTable, Modal, etc.
│   │   │   ├── layouts/          # MainLayout, Sidebar, Navbar
│   │   │   ├── purchaseOrders/   # POTimeline
│   │   │   └── evaluations/      # CriteriaMeter
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── NotificationContext.jsx
│   │   ├── pages/
│   │   │   ├── auth/             # Login, Register
│   │   │   ├── admin/            # Dashboard, Vendors, Onboarding, Evaluations, POs, Documents, Reports, Settings
│   │   │   ├── vendor/           # Dashboard, Wizard, Profile, Documents, POs, Performance, Notifications, Settings
│   │   │   └── NotFound.jsx
│   │   ├── services/             # Axios API service modules
│   │   ├── styles/               # Pure Vanilla CSS files (variables, layout, components, auth, dashboard, etc.)
│   │   ├── App.jsx               # Protected routes configuration
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── package.json                  # Root orchestration scripts
└── README.md
```

---

## ⚙️ Installation & Running Locally

### 1. Clone or Open Workspace
Ensure MongoDB is running locally on default port `27017` (e.g. `mongodb://127.0.0.1:27017/vendora`).

### 2. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Seed Realistic Procurement Data
```bash
cd server
npm run seed
```

### 4. Run Application
In one terminal, start the Express backend:
```bash
cd server
npm run dev
# Server running at http://localhost:5000
```

In a second terminal, start the React Vite frontend:
```bash
cd client
npm run dev
# React Client running at http://localhost:5173
```

---

## 📡 REST API Documentation Summary

| Endpoint | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Register new user / supplier |
| `/api/auth/login` | `POST` | Public | Authenticate user & get JWT token |
| `/api/auth/me` | `GET` | Private | Get logged-in user profile |
| `/api/vendors` | `GET` | Admin | List all vendors with search/filter/pagination |
| `/api/vendors/:id` | `GET` | Private | Get single vendor with populated relations |
| `/api/vendors/:id/status` | `PATCH` | Admin | Update vendor status (`ACTIVE`, `SUSPENDED`) |
| `/api/onboarding/step` | `POST` | Vendor | Save/submit multi-step onboarding data |
| `/api/onboarding` | `GET` | Admin | List onboarding applications |
| `/api/onboarding/:id/approve` | `PATCH` | Admin | Approve & activate supplier |
| `/api/onboarding/:id/reject` | `PATCH` | Admin | Reject onboarding application |
| `/api/onboarding/:id/request-changes` | `PATCH` | Admin | Request modifications from supplier |
| `/api/evaluations` | `GET`, `POST` | Private | List evaluations / Create performance audit |
| `/api/purchase-orders` | `GET`, `POST` | Private | List POs / Issue new Purchase Order |
| `/api/purchase-orders/:id/status` | `PATCH` | Private | Advance PO status along lifecycle |
| `/api/documents` | `GET`, `POST` | Private | List documents / Upload compliance file |
| `/api/documents/:id/verify` | `PATCH` | Admin | Mark document as verified |
| `/api/notifications` | `GET`, `PATCH` | Private | Fetch alerts / Mark as read |
| `/api/dashboard/stats` | `GET` | Admin | Admin analytics & charts |
| `/api/dashboard/vendor-stats` | `GET` | Vendor | Vendor portal stats & completion % |

---

## 🎯 Verification & Testing

The project includes an end-to-end automated test suite in [server/test-api.js](file:///c:/Users/HARINI/OneDrive/Desktop/VENDORA_1/server/test-api.js):
```bash
cd server
node test-api.js
```
**Output:**
```
=== VENDORA END-TO-END AUTOMATED TEST SUITE ===
✓ Health status: OK
✓ Admin login successful! Role: admin
✓ Vendor login successful! Role: vendor
✓ Admin Dashboard Analytics: Total Vendors: 5, Active: 3, Total PO Value: ₹29.5L
✓ Vendor Dashboard: Profile Completion: 100%, Rating Score: 4.58
✓ Retrieved active vendors count: 3
✓ Evaluation created! Overall Score: 4.83 (Excellent Tier)
✓ PO Created: PO-2026-0005, Grand Total: ₹1,18,000
✓ Status changed to: APPROVED -> PROCESSING
✓ Live Notifications verified
🎉 ALL FULL STACK MERN INTEGRATION TESTS PASSED!
```
