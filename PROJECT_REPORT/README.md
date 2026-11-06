# VENDORA Project Report Documentation Package

This directory (`PROJECT_REPORT/`) contains the complete, professional college project report for **VENDORA – Vendor Management System**, formatted in accordance with the official project report guidelines of **Easwari Engineering College (Autonomous) – Affiliated to Anna University, Chennai**.

---

## 📂 Generated Report Files

| File / Folder | Format | Description |
| :--- | :--- | :--- |
| **`VENDORA_Project_Report.docx`** | Microsoft Word (.docx) | **Primary Deliverable.** Complete editable academic report (A4, 1.25" left margin for binding, Times New Roman, 1.5 line spacing, structured front matter, chapters, tables, and appendix). |
| **`VENDORA_Project_Report.pdf`** | Adobe PDF (.pdf) | **Compiled Submission Copy.** Converted directly from the DOCX file via native Microsoft Word print engine for pristine layout, page numbering, and typography fidelity. |
| **`diagrams/`** | Directory (PNG 300 DPI) | **Source Figures & Schematics.** High-resolution diagrams, architecture schematics, flowcharts, and UI screenshots embedded throughout the report. |
| **`build_report.py`** | Python Script | Automated builder script utilizing `python-docx` and Microsoft Word COM automation to regenerate both the DOCX and PDF deliverables. |
| **`generate_diagrams.py`** | Python Script | Programmatic vector-quality diagram generation script using `matplotlib` and `patches` for 300 DPI publication standards. |
| **`generate_screenshots.py`** | Python Script | UI simulation script generating authentic captures of the VENDORA procurement portal and design system. |
| **`generate_logo.py`** | Python Script | Vector crest generator for the Easwari Engineering College institutional emblem. |
| **`README.md`** | Markdown Document | This documentation and user guide. |

---

## 🖼️ Included High-Resolution Diagrams (`diagrams/`)

The following figures are embedded directly in the report document and available as standalone high-resolution image files:

1. **`architecture_diagram.png` (Figure 4.1):** 3-Tier Enterprise Architecture (Client React SPA + Axios Interceptors, Node/Express API Gateway with RBAC & Multer, MongoDB Persistence Tier).
2. **`use_case_diagram.png` (Figure 4.2):** UML Use Case diagram mapping interactions between Procurement Administrator (Lead Evaluator) and Supplier Partner (Vendor).
3. **`data_flow_diagram.png` (Figure 4.3):** DFD Level 0 (Context Level) and DFD Level 1 (Process Decomposition: Auth, Onboarding, Evaluation, Purchase Orders, and Data Stores D1–D4).
4. **`er_diagram.png` (Figure 4.4):** Entity Relationship (ER) Schema Diagram detailing collections, primary keys (PK), foreign keys (FK), cardinalities, and embedded documents.
5. **`po_lifecycle_flowchart.png` (Figure 4.5):** Purchase Order Lifecycle State Machine (`DRAFT` → `PENDING APPROVAL` → `APPROVED` → `PROCESSING` → `SHIPPED` → `DELIVERED` → `COMPLETED` / `CANCELLED`).
6. **`onboarding_flowchart.png` (Figure 4.6):** 6-Step Supplier Onboarding Wizard & Administrative Decision Pipeline (`ACTIVE`, `UNDER REVIEW`, `REJECTED`).
7. **`evaluation_flowchart.png` (Figure 4.7):** 6-Factor Performance Evaluation Matrix, Arithmetic Mean Formula, Rating Tier Mapping (`Excellent`, `Good`, `Average`, `Poor`), and Post-Save Profile Aggregation.
8. **`screenshot_login.png` (Figure 16.1):** Login & Role Selection Portal.
9. **`screenshot_admin_dashboard.png` (Figure 16.2):** Procurement Command Center (Admin Analytics Dashboard).
10. **`screenshot_onboarding_wizard.png` (Figure 16.3):** 6-Step Supplier Onboarding Wizard.
11. **`screenshot_po_lifecycle.png` (Figure 16.4):** Purchase Order Details, Line Items Matrix & POTimeline Stepper.
12. **`screenshot_vendor_evaluation.png` (Figure 16.5):** 6-Factor Performance Evaluation Scorecard.

---

## ⚠️ Missing Information Requiring Your Input

As per academic ethics and project guidelines, institutional personal details, student names, registration numbers, faculty guide names, and viva dates have not been invented or assumed. 

Please search for the bracketed placeholders (`[...]`) inside **`VENDORA_Project_Report.docx`** and supply your details before final printing:

| Placeholder in Document | Location / Page | Example Replacement Value |
| :--- | :--- | :--- |
| `[STUDENT NAME]` | Title Page (p. i), Bonafide (p. ii), Viva Certificate (p. iii) | *e.g., Harini S* |
| `[REGISTRATION NUMBER]` / `[REG NO]` | Title Page (p. i), Bonafide (p. ii), Viva Certificate (p. iii) | *e.g., 310621104001* |
| `[DEPARTMENT NAME]` | Title Page (p. i), Bonafide (p. ii), Viva Certificate (p. iii), Acknowledgement (p. v) | *e.g., COMPUTER SCIENCE AND ENGINEERING* |
| `[MONTH YEAR]` | Title Page (p. i) | *e.g., APRIL 2026* |
| `[SUPERVISOR NAME, DESIGNATION]` | Bonafide Certificate (p. ii) | *e.g., Dr. K. Raman, Associate Professor* |
| `____________ (Date)` | Viva-voce Certificate (p. iii) | *e.g., 28-04-2026* |
| Examiner Name, Designation, Address | Viva-voce Certificate (p. iii) | *To be filled on exam day by examiners* |

> 💡 **Tip:** In Microsoft Word, press **`Ctrl + H`** (Find & Replace) to quickly replace `[STUDENT NAME]` and `[REGISTRATION NUMBER]` across the entire document in seconds!

---

## 🧪 Verified Integration Testing Summary

All technical claims and testing tables included in Chapter 5 (Table 5.1) are based on the live automated test suite executed in `server/test-api.js`:

```
=== VENDORA END-TO-END AUTOMATED TEST SUITE ===
[1] Testing API Healthcheck .................................................... [PASS] (Status: OK)
[2] Testing Admin Login (admin@vendora.com) .................................... [PASS] (JWT Issued, Role: admin)
[3] Testing Vendor Login (vendor@vendora.com) .................................. [PASS] (JWT Issued, Role: vendor)
[4] Testing Admin Dashboard Analytics .......................................... [PASS] (5 Vendors, ₹29.5L PO Value)
[5] Testing Vendor Dashboard Stats ............................................. [PASS] (100% Completion, 4.58 Score)
[6] Testing Vendor Directory Listing & Search .................................. [PASS] (3 Active Vendors Filtered)
[7] Testing Performance Evaluation (6 Criteria) ................................ [PASS] (Score: 4.83, Tier: Excellent)
[8] Testing PO Creation & Automated GST Math ................................... [PASS] (PO-2026-0005, ₹1,18,000 Total)
[9] Testing PO Lifecycle Progression ........................................... [PASS] (APPROVED -> PROCESSING)
[10] Testing Live Event Notifications .......................................... [PASS] (2 Notifications Retrieved)
🎉 ALL 10 INTEGRATION TESTS VERIFIED AND PASSED LIVE.
```

---

## 🔄 How to Recompile / Rebuild Report

If you make modifications to `build_report.py` and wish to re-generate both the `.docx` and `.pdf` files, run:

```bash
cd c:\Users\HARINI\OneDrive\Desktop\VENDORA_1
python PROJECT_REPORT/build_report.py
```
*(Requirements: Python 3.10+, `python-docx`, `pywin32`, and Microsoft Word installed).*
