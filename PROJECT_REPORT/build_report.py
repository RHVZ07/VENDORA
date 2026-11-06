import os
import sys
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def set_table_borders(table, color="D1D5DB", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'  <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'  <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'  <w:left w:val="none"/>'
        f'  <w:right w:val="none"/>'
        f'  <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'  <w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def build_full_report():
    print("Initializing VENDORA Project Report Builder...")
    doc = Document()

    # Configure Margins: Left 1.25 in (for binding), Right 1.0 in, Top 1.0 in, Bottom 1.0 in
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.25)
        section.right_margin = Inches(1.0)
        section.page_width = Inches(8.27)  # A4 standard
        section.page_height = Inches(11.69)

    # Base Style Definitions
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(12)
    normal_style.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

    def add_p(text="", align=WD_ALIGN_PARAGRAPH.LEFT, bold=False, italic=False, size=12,
              color=RGBColor(0x1F, 0x29, 0x37), space_after=6, space_before=0, line_spacing=1.5):
        p = doc.add_paragraph()
        p.alignment = align
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.line_spacing = line_spacing
        if text:
            run = p.add_run(text)
            run.font.name = 'Times New Roman'
            run.font.bold = bold
            run.font.italic = italic
            run.font.size = Pt(size)
            run.font.color.rgb = color
        return p

    def add_h1(title):
        p = add_p(title, align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=15,
                  color=RGBColor(0x11, 0x18, 0x27), space_before=14, space_after=12)
        return p

    def add_h2(title):
        p = add_p(title, align=WD_ALIGN_PARAGRAPH.LEFT, bold=True, size=13,
                  color=RGBColor(0x1F, 0x29, 0x37), space_before=12, space_after=6)
        return p

    def add_h3(title):
        p = add_p(title, align=WD_ALIGN_PARAGRAPH.LEFT, bold=True, italic=True, size=12,
                  color=RGBColor(0x37, 0x41, 0x51), space_before=8, space_after=4)
        return p

    def add_body(text):
        return add_p(text, align=WD_ALIGN_PARAGRAPH.JUSTIFY, size=12, space_after=6, line_spacing=1.5)

    def add_bullet(bold_prefix, text):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.line_spacing = 1.3
        r1 = p.add_run(bold_prefix + " ")
        r1.font.name = 'Times New Roman'
        r1.font.bold = True
        r1.font.size = Pt(11.5)
        r2 = p.add_run(text)
        r2.font.name = 'Times New Roman'
        r2.font.size = Pt(11.5)
        return p

    def add_code_block(code_text):
        table = doc.add_table(rows=1, cols=1)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = table.cell(0, 0)
        cell.width = Inches(6.0)
        set_cell_background(cell, "F8FAFC")
        set_cell_margins(cell, top=120, bottom=120, left=180, right=180)
        tcPr = cell._tc.get_or_add_tcPr()
        borders = parse_xml(
            f'<w:tcBorders {nsdecls("w")}>'
            f'  <w:left w:val="single" w:sz="18" w:space="0" w:color="7C3AED"/>'
            f'  <w:top w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>'
            f'  <w:right w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>'
            f'  <w:bottom w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>'
            f'</w:tcBorders>'
        )
        tcPr.append(borders)
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.15
        run = p.add_run(code_text)
        run.font.name = 'Consolas'
        run.font.size = Pt(9.5)
        run.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)
        add_p("", space_after=4)

    def add_figure(img_path, caption_text, width_inch=5.8):
        if os.path.exists(img_path):
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(8)
            p.paragraph_format.space_after = Pt(4)
            run = p.add_run()
            run.add_picture(img_path, width=Inches(width_inch))
            p_cap = add_p(caption_text, align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=10.5,
                          color=RGBColor(0x4B, 0x55, 0x63), space_after=10)
        else:
            add_p(f"[FIGURE PLACEHOLDER: {caption_text}]", align=WD_ALIGN_PARAGRAPH.CENTER, italic=True)

    # =========================================================================
    # PAGE 1: TITLE PAGE
    # =========================================================================
    print("Writing Title Page...")
    add_p("VENDORA – VENDOR MANAGEMENT SYSTEM", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=18,
          color=RGBColor(0x0F, 0x17, 0x2A), space_before=10, space_after=18)
    
    add_p("A PROJECT REPORT", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=13, space_after=24)
    
    add_p("Submitted by", align=WD_ALIGN_PARAGRAPH.CENTER, italic=True, size=12, space_after=4)
    add_p("[STUDENT NAME] ([REGISTRATION NUMBER])", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=13, space_after=24)
    
    add_p("in partial fulfillment for the award of the Degree", align=WD_ALIGN_PARAGRAPH.CENTER, italic=True, size=12, space_after=2)
    add_p("of", align=WD_ALIGN_PARAGRAPH.CENTER, italic=True, size=12, space_after=4)
    add_p("BACHELOR OF ENGINEERING", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=14, space_after=4)
    add_p("in", align=WD_ALIGN_PARAGRAPH.CENTER, italic=True, size=12, space_after=4)
    add_p("[DEPARTMENT NAME]", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=14, space_after=20)
    
    logo_path = 'PROJECT_REPORT/diagrams/easwari_logo.png'
    if os.path.exists(logo_path):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_after = Pt(16)
        r_logo = p_logo.add_run()
        r_logo.add_picture(logo_path, width=Inches(1.8))

    add_p("EASWARI ENGINEERING COLLEGE,", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=13, space_after=2)
    add_p("(AN AUTONOMOUS INSTITUTION) – AFFILIATED TO ANNA UNIVERSITY,", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=11, space_after=2)
    add_p("RAMAPURAM, CHENNAI – 600089", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=11, space_after=24)
    add_p("[MONTH YEAR]", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=12, space_after=0)

    doc.add_page_break()

    # =========================================================================
    # PAGE 2: BONAFIDE CERTIFICATE
    # =========================================================================
    print("Writing Bonafide Certificate...")
    add_p("EASWARI ENGINEERING COLLEGE", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=15, space_before=10, space_after=6)
    add_p("RAMAPURAM, CHENNAI – 600089", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=11, space_after=18)
    
    add_p("BONAFIDE CERTIFICATE", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=14, space_after=32)
    
    cert_text = (
        'Certified that this mini project report titled “VENDORA – VENDOR MANAGEMENT SYSTEM” is the '
        'Bonafide work of “[STUDENT NAME] ([REG NO])”, who carried out the project work under my supervision.'
    )
    add_p(cert_text, align=WD_ALIGN_PARAGRAPH.JUSTIFY, size=12, space_after=160, line_spacing=1.5)

    # Signatures table
    sig_table = doc.add_table(rows=1, cols=2)
    sig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_table.autofit = False
    sig_table.columns[0].width = Inches(3.2)
    sig_table.columns[1].width = Inches(3.2)
    
    c1 = sig_table.cell(0, 0)
    p1 = c1.paragraphs[0]
    p1.alignment = WD_ALIGN_PARAGRAPH.LEFT
    r1 = p1.add_run("HEAD OF THE DEPARTMENT\n\nDepartment of [DEPARTMENT NAME]\nEaswari Engineering College\nChennai – 600089")
    r1.font.name = 'Times New Roman'
    r1.font.bold = True
    r1.font.size = Pt(11)

    c2 = sig_table.cell(0, 1)
    p2 = c2.paragraphs[0]
    p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r2 = p2.add_run("SUPERVISOR / PROJECT GUIDE\n\n[SUPERVISOR NAME, DESIGNATION]\nDepartment of [DEPARTMENT NAME]\nEaswari Engineering College\nChennai – 600089")
    r2.font.name = 'Times New Roman'
    r2.font.bold = True
    r2.font.size = Pt(11)

    doc.add_page_break()

    # =========================================================================
    # PAGE 3: CERTIFICATE OF VIVA-VOCE EXAMINATION
    # =========================================================================
    print("Writing Viva-voce Certificate...")
    add_p("EASWARI ENGINEERING COLLEGE", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=15, space_before=10, space_after=6)
    add_p("RAMAPURAM, CHENNAI – 600089", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=11, space_after=18)
    
    add_p("Certificate of Viva-voce-Examination", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=14, space_after=28)

    viva_text = (
        'This is to certify that the Viva Voce Examination of the Project Work entitled '
        '“VENDORA – VENDOR MANAGEMENT SYSTEM” submitted by Mr./Ms. [STUDENT NAME] (Reg. No. [REGISTRATION NUMBER]) '
        'in partial fulfillment of the requirements for the award of the degree of BACHELOR OF ENGINEERING in '
        '[DEPARTMENT NAME] was conducted on ____________ (Date) in the Department of [DEPARTMENT NAME], '
        'Easwari Engineering College, Ramapuram – Chennai.'
    )
    add_p(viva_text, align=WD_ALIGN_PARAGRAPH.JUSTIFY, size=12, space_after=120, line_spacing=1.5)

    viva_table = doc.add_table(rows=1, cols=2)
    viva_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    viva_table.columns[0].width = Inches(3.2)
    viva_table.columns[1].width = Inches(3.2)

    c_int = viva_table.cell(0, 0)
    p_int = c_int.paragraphs[0]
    p_int.add_run("Internal Examiner\n\nName : _____________________\nDesignation: _________________\nAddress : ___________________\n               ___________________\nDate: _______________________").font.size = Pt(11)

    c_ext = viva_table.cell(0, 1)
    p_ext = c_ext.paragraphs[0]
    p_ext.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_ext.add_run("External Examiner\n\nName : _____________________\nDesignation: _________________\nAddress : ___________________\n               ___________________\nDate: _______________________").font.size = Pt(11)

    doc.add_page_break()

    # =========================================================================
    # PAGE 4: ABSTRACT
    # =========================================================================
    print("Writing Abstract...")
    add_p("ABSTRACT", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=15, space_before=10, space_after=20)
    
    abstract_p1 = (
        "Modern corporate supply chains face acute operational vulnerabilities arising from decentralized vendor records, "
        "opaque supplier onboarding pipelines, unstandardized performance appraisals, and fragmented purchase order lifecycles. "
        "Traditional administrative approaches—predominantly reliant on disparate spreadsheets, paper-based compliance trails, "
        "and manual email correspondences—suffer from high data error rates, compliance oversight risks, and protracted turnaround "
        "times that impede organizational agility. To resolve these operational bottlenecks, this project presents VENDORA, a "
        "comprehensive, enterprise-grade Vendor Management System developed on the strict MERN (MongoDB, Express.js, React.js, "
        "and Node.js) full-stack architecture."
    )
    add_body(abstract_p1)

    abstract_p2 = (
        "VENDORA introduces a unified digital procurement ecosystem featuring distinct, secure role-based portals for Procurement "
        "Administrators and Supplier Partners. The system features a guided 6-step interactive onboarding wizard that systematically "
        "captures corporate registration identities (CIN, GSTIN, PAN), authorized liaison coordinates, facility addresses, industrial "
        "capabilities, banking coordinates, and digital compliance documents. Onboarding submissions are managed through a rigorous "
        "administrative review workflow supporting granular approval, rejection with logged rationales, and change-request loops. "
        "Vendor evaluations are standardized through an algorithmic 6-factor criteria matrix (evaluating quality, delivery timeliness, "
        "pricing value, communication, reliability, and regulatory compliance), automatically calculating composite audit scores and "
        "dynamically assigning suppliers into designated performance tiers (Excellent, Good, Average, Poor) via automated Mongoose ODM hooks."
    )
    add_body(abstract_p2)

    abstract_p3 = (
        "Furthermore, VENDORA governs the end-to-end purchase order (PO) lifecycle through a robust state machine transitioning "
        "seamlessly through DRAFT, PENDING APPROVAL, APPROVED, PROCESSING, SHIPPED, DELIVERED, and COMPLETED states, accompanied by "
        "an interactive visual milestone tracker (POTimeline), dynamic line item matrix calculations with automated Goods and Services "
        "Tax (GST) computation, and audit history logging. Built using a 100% Vanilla CSS design system free of external CSS frameworks, "
        "VENDORA delivers exceptional visual polish, high responsive fidelity, and enterprise data security enforced through JSON Web "
        "Tokens (JWT), Bcrypt password hashing, and Multer-managed disk storage. Comprehensive end-to-end integration testing "
        "confirms 100% API verification and validation across all functional procurement workflows."
    )
    add_body(abstract_p3)

    add_p("Keywords: Vendor Management System, MERN Stack, Supplier Onboarding, Performance Scorecards, Purchase Order Lifecycle, Role-Based Access Control, Full Stack Web Engineering.",
          align=WD_ALIGN_PARAGRAPH.JUSTIFY, bold=True, size=11, space_before=14, space_after=0)

    doc.add_page_break()

    # =========================================================================
    # PAGE 5: ACKNOWLEDGEMENT
    # =========================================================================
    print("Writing Acknowledgement...")
    add_p("ACKNOWLEDGEMENT", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=15, space_before=10, space_after=24)

    ack_text = [
        "We express our sincere gratitude to the Principal Dr.P.Deiva Sundari and the Management of our college for providing us with the opportunity to carry out this project work.",
        "We convey our heartfelt thanks to the Head of the Department, Department of [DEPARTMENT NAME], for the continuous encouragement and support.",
        "We are extremely thankful to our Project Guide, [DEPARTMENT NAME] for valuable guidance, suggestions, and motivation throughout the completion of this project.",
        "We would also like to extend our gratitude to all the faculty members of the Department of [DEPARTMENT NAME] for their support.",
        "Finally, we thank our parents and friends for their constant encouragement and help during the course of this project."
    ]
    for para in ack_text:
        add_p(para, align=WD_ALIGN_PARAGRAPH.JUSTIFY, size=12, space_after=14, line_spacing=1.5)

    doc.add_page_break()

    # =========================================================================
    # PAGE 6: TABLE OF CONTENTS
    # =========================================================================
    print("Writing Table of Contents...")
    add_p("TABLE OF CONTENTS", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=15, space_before=10, space_after=18)

    toc_table = doc.add_table(rows=1, cols=3)
    toc_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    toc_table.columns[0].width = Inches(1.5)
    toc_table.columns[1].width = Inches(4.3)
    toc_table.columns[2].width = Inches(0.8)

    hdr_cells = toc_table.rows[0].cells
    hdr_cells[0].paragraphs[0].add_run("CHAPTER NO.").bold = True
    hdr_cells[1].paragraphs[0].add_run("TITLE").bold = True
    hdr_cells[2].paragraphs[0].add_run("PAGE No.").bold = True
    for c in hdr_cells:
        set_cell_background(c, "F1F5F9")
        set_cell_margins(c, 80, 80, 100, 100)

    toc_entries = [
        ("", "BONAFIDE CERTIFICATE", "ii"),
        ("", "CERTIFICATE OF VIVA-VOCE EXAMINATION", "iii"),
        ("", "ABSTRACT", "iv"),
        ("", "ACKNOWLEDGEMENT", "v"),
        ("", "LIST OF FIGURES", "viii"),
        ("", "LIST OF TABLES", "ix"),
        ("1", "INTRODUCTION", "1"),
        ("1.1", "OVERVIEW", "1"),
        ("1.2", "PROBLEM DEFINITION", "2"),
        ("1.3", "OBJECTIVE", "3"),
        ("1.4", "SCOPE OF THE PROJECT", "4"),
        ("1.5", "MOTIVATION", "5"),
        ("2", "RELATED WORK", "6"),
        ("2.1", "LITERATURE REVIEW", "6"),
        ("2.2", "EXISTING SYSTEM", "7"),
        ("2.3", "PROPOSED SYSTEM", "8"),
        ("3", "SYSTEM ANALYSIS", "10"),
        ("3.1", "SYSTEM REQUIREMENTS", "10"),
        ("3.2", "SOFTWARE AND HARDWARE REQUIREMENTS", "12"),
        ("4", "SYSTEM DESIGN", "14"),
        ("4.1", "SYSTEM ARCHITECTURE", "14"),
        ("4.2", "MODULE DESCRIPTION", "16"),
        ("4.3", "DATA FLOW DIAGRAMS (LEVEL 0 & LEVEL 1)", "19"),
        ("4.4", "CLASS DIAGRAM & ENTITY RELATIONSHIP MODEL", "21"),
        ("4.5", "SEQUENCE DIAGRAM & OPERATIONAL FLOWCHARTS", "24"),
        ("5", "IMPLEMENTATION & TESTING", "28"),
        ("5.1", "IMPLEMENTATION OVERVIEW", "28"),
        ("5.2", "KEY FUNCTIONS (CODE EXPLANATION)", "30"),
        ("5.3", "SYSTEM VERIFICATION & TESTING RESULTS", "35"),
        ("6", "CONCLUSION & FUTURE WORK", "38"),
        ("6.1", "CONCLUSION", "38"),
        ("6.2", "FUTURE ENHANCEMENTS", "39"),
        ("APPENDIX", "SOURCE CODE COMPENDIUM", "41"),
        ("A.1", "Project Directory Structure", "41"),
        ("A.2", "Backend Package Installation Commands", "42"),
        ("A.3", "Database Connection Module (db.js)", "43"),
        ("A.4", "Environment Configuration (.env.example)", "44"),
        ("A.5", "User Data Model Schema (User.js)", "45"),
        ("A.6", "Password Hashing & Registration Controller", "46"),
        ("A.7", "User Authentication & JWT Generation Controller", "47"),
        ("A.8", "Authentication & Role RBAC Middleware", "48"),
        ("A.9", "Create Record API Implementations", "49"),
        ("A.10", "Read & Query Record API Implementations", "51"),
        ("A.11", "Update & Status Mutation API Implementations", "53"),
        ("A.12", "Record Deletion & Cancellation API Implementations", "55"),
        ("A.13", "Express Route Layer Definitions", "56"),
        ("A.14", "Main Express Server Entry Point (server.js)", "58"),
        ("A.15", "React Client Authentication View (Login.jsx)", "59"),
        ("A.16", "Admin Dashboard Analytics Controller (AdminDashboard.jsx)", "61"),
        ("A.17", "REST API Request and Response Examples", "63"),
        ("", "SCREENSHOTS OF THE PROJECT", "65"),
        ("", "REFERENCES", "70"),
    ]

    for ch, tit, pg in toc_entries:
        row = toc_table.add_row()
        is_major = ch in ["1", "2", "3", "4", "5", "6", "APPENDIX"] or tit.startswith("BONAFIDE") or tit.startswith("ABSTRACT") or tit.startswith("SCREENSHOTS") or tit.startswith("REFERENCES")
        c0, c1, c2 = row.cells
        set_cell_margins(c0, 40, 40, 100, 100)
        set_cell_margins(c1, 40, 40, 100, 100)
        set_cell_margins(c2, 40, 40, 100, 100)
        r0 = c0.paragraphs[0].add_run(ch)
        r1 = c1.paragraphs[0].add_run(tit)
        r2 = c2.paragraphs[0].add_run(pg)
        if is_major:
            r0.bold = True
            r1.bold = True
            r2.bold = True
            set_cell_background(c0, "FAFAFA")
            set_cell_background(c1, "FAFAFA")
            set_cell_background(c2, "FAFAFA")

    set_table_borders(toc_table)
    doc.add_page_break()

    # =========================================================================
    # LIST OF FIGURES & LIST OF TABLES
    # =========================================================================
    print("Writing List of Figures and Tables...")
    add_p("LIST OF FIGURES", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=14, space_before=10, space_after=14)
    fig_table = doc.add_table(rows=1, cols=3)
    fig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    fig_table.columns[0].width = Inches(1.3)
    fig_table.columns[1].width = Inches(4.5)
    fig_table.columns[2].width = Inches(0.8)
    hfc = fig_table.rows[0].cells
    hfc[0].paragraphs[0].add_run("FIGURE NO.").bold = True
    hfc[1].paragraphs[0].add_run("FIGURE TITLE").bold = True
    hfc[2].paragraphs[0].add_run("PAGE").bold = True
    for c in hfc: set_cell_background(c, "F1F5F9")

    figures = [
        ("Figure 4.1", "VENDORA 3-Tier Enterprise System Architecture", "15"),
        ("Figure 4.2", "UML Use Case Diagram: Admin and Vendor Actor Interactions", "18"),
        ("Figure 4.3", "Data Flow Diagram Level 0 (Context Level) and Level 1 (Decomposition)", "20"),
        ("Figure 4.4", "Entity Relationship (ER) Schema Diagram & MongoDB Collections", "23"),
        ("Figure 4.5", "Purchase Order Lifecycle Finite State Machine & Timeline", "25"),
        ("Figure 4.6", "6-Step Supplier Onboarding Pipeline & Inspection Flowchart", "26"),
        ("Figure 4.7", "6-Factor Vendor Evaluation Matrix & Automated Score Distribution", "27"),
        ("Figure 16.1", "Enterprise Login & Role-Based Authentication Portal", "65"),
        ("Figure 16.2", "Procurement Command Center (Admin Analytics Dashboard)", "66"),
        ("Figure 16.3", "Interactive 6-Step Supplier Onboarding Wizard", "67"),
        ("Figure 16.4", "Purchase Order Management, Line Item Matrix & POTimeline Stepper", "68"),
        ("Figure 16.5", "Standardized Vendor Performance Evaluation Scorecard", "69"),
    ]
    for fn, ft, fp in figures:
        r = fig_table.add_row()
        r.cells[0].paragraphs[0].add_run(fn).bold = True
        r.cells[1].paragraphs[0].add_run(ft)
        r.cells[2].paragraphs[0].add_run(fp).bold = True
        for c in r.cells: set_cell_margins(c, 40, 40, 80, 80)
    set_table_borders(fig_table)

    add_p("", space_after=14)
    add_p("LIST OF TABLES", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=14, space_before=10, space_after=14)
    tbl_table = doc.add_table(rows=1, cols=3)
    tbl_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_table.columns[0].width = Inches(1.3)
    tbl_table.columns[1].width = Inches(4.5)
    tbl_table.columns[2].width = Inches(0.8)
    htc = tbl_table.rows[0].cells
    htc[0].paragraphs[0].add_run("TABLE NO.").bold = True
    htc[1].paragraphs[0].add_run("TABLE TITLE").bold = True
    htc[2].paragraphs[0].add_run("PAGE").bold = True
    for c in htc: set_cell_background(c, "F1F5F9")

    tables_list = [
        ("Table 2.1", "Comparative Assessment: Conventional ERP vs VENDORA", "9"),
        ("Table 3.1", "Software and Hardware Operational Environment Specifications", "13"),
        ("Table 4.1", "Database Schema Data Dictionary: Core Collections & Data Types", "22"),
        ("Table 5.1", "Live End-to-End API Automated Test Execution & Verification Suite", "36"),
        ("Table A.1", "REST API Route Specifications & RBAC Authorization Matrix", "57"),
    ]
    for tn, tt, tp in tables_list:
        r = tbl_table.add_row()
        r.cells[0].paragraphs[0].add_run(tn).bold = True
        r.cells[1].paragraphs[0].add_run(tt)
        r.cells[2].paragraphs[0].add_run(tp).bold = True
        for c in r.cells: set_cell_margins(c, 40, 40, 80, 80)
    set_table_borders(tbl_table)

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 1: INTRODUCTION
    # =========================================================================
    print("Writing Chapter 1: Introduction...")
    add_h1("CHAPTER 1\nINTRODUCTION")

    add_h2("1.1 OVERVIEW")
    add_body(
        "In the contemporary corporate landscape, effective vendor lifecycle management stands as an indispensable cornerstone of "
        "sustainable supply chain resilience, cost optimization, and institutional compliance. Enterprise organizations routinely "
        "collaborate with hundreds of external suppliers, raw material contractors, and technical service providers. However, "
        "orchestrating supplier partnerships demands continuous administrative rigor across diverse operational touchpoints—ranging from "
        "statutory background verification and Know Your Customer (KYC) documentation to multi-factor performance appraisals and "
        "purchase order fulfillment. Traditional, ad-hoc administrative practices characterized by unstandardized email exchanges, "
        "manual data entry into disparate spreadsheets, and physical document binders introduce severe operational vulnerabilities, "
        "including tracking errors, unauthorized procurement commitments, and non-compliance with statutory regulations such as "
        "the Goods and Services Tax (GST) framework."
    )
    add_body(
        "To resolve these pervasive organizational inefficiencies, this project presents VENDORA – Vendor Management System. "
        "VENDORA is an enterprise-grade full-stack web application architected using the strict MERN stack (MongoDB, Express.js, "
        "React.js, and Node.js). VENDORA establishes a centralized, high-security procurement command center that bridges "
        "Procurement Administrators and Supplier Partners into an integrated digital portal. The system unifies a 6-step guided "
        "supplier onboarding wizard, automated statutory verification workflows, a standardized 6-factor performance evaluation "
        "scoring matrix, a robust purchase order lifecycle state machine with automated financial taxation arithmetic, and "
        "centralized compliance document management."
    )

    add_h2("1.2 PROBLEM DEFINITION")
    add_body(
        "Extensive empirical analysis of corporate procurement workflows reveals several critical structural bottlenecks within "
        "conventional manual and semi-automated vendor management practices:"
    )
    add_bullet("Fragmented Onboarding & KYC Oversight:",
               "Supplier onboarding typically involves collecting diverse statutory identities (CIN, GSTIN, PAN, MSME certificates) "
               "and disbursement banking coordinates. In manual systems, missing fields, illegible paperwork, and delayed verification "
               "result in lengthy onboarding cycles extending over several weeks.")
    add_bullet("Subjective & Inconsistent Performance Audits:",
               "Vendor evaluations are frequently conducted in an unstandardized, subjective manner without quantitative benchmarks. "
               "The absence of standardized criteria leads to supplier dissatisfaction, bias, and an inability to accurately identify "
               "at-risk or underperforming contractors.")
    add_bullet("Opaque Purchase Order Lifecycles:",
               "Tracking purchase orders across disparate spreadsheets obscures real-time status transitions. Department heads lack "
               "immediate visibility into whether a purchase order has been approved, acknowledged by the vendor, processed on the factory "
               "floor, dispatched via a logistics courier, or delivered at the warehouse receiving dock.")
    add_bullet("Tax Calculation Errors & Compliance Exposure:",
               "Manual calculation of line-item subtotals and tiered Goods and Services Tax (GST) percentages frequently leads to "
               "invoicing discrepancies, duplicate billing, and statutory tax audit vulnerabilities.")
    add_bullet("Absence of Centralized Role-Based Access Control:",
               "Conventional systems often lack strict demarcation between corporate procurement authority and external supplier "
               "visibility, leading to security vulnerabilities and potential data leakage across competitive vendors.")

    add_h2("1.3 OBJECTIVE")
    add_body(
        "The overarching objective of the VENDORA project is to design, develop, verify, and deploy a robust, secure, and modern "
        "Full-Stack Vendor Management System that digitizes and optimizes the complete supplier lifecycle. Specific technical objectives include:"
    )
    add_bullet("Streamline Supplier Onboarding:",
               "Implement an interactive 6-step guided onboarding wizard that validates company particulars, contact coordinates, facility "
               "addresses, industrial capabilities, banking disbursement coordinates, and digital document uploads in real time.")
    add_bullet("Automate Administrative KYC Review Workflows:",
               "Deliver an administrative inspection interface enabling procurement leads to thoroughly audit supplier applications, "
               "trigger single-click approval and activation, reject unqualified applicants with logged reasons, or request targeted modifications.")
    add_bullet("Establish Standardized 6-Factor Performance Scorecards:",
               "Engineer an algorithmic evaluation engine rating vendors on 1–5 scales across six standardized criteria (Quality, Delivery, "
               "Pricing, Communication, Reliability, and Compliance) with automated rating tier assignment (Excellent, Good, Average, Poor) "
               "and post-save cumulative score aggregation.")
    add_bullet("Govern End-to-End Purchase Order State Transitions:",
               "Construct a deterministic PO state machine transitioning orders through DRAFT, PENDING APPROVAL, APPROVED, PROCESSING, "
               "SHIPPED, DELIVERED, and COMPLETED states, supported by an interactive visual POTimeline stepper and automated GST arithmetic.")
    add_bullet("Enforce Strict Enterprise Security & Pure Vanilla CSS Aesthetics:",
               "Implement stateless JSON Web Token (JWT) authentication, Bcrypt password hashing, and role-based access control (RBAC), "
               "encapsulated in an ultra-modern, responsive user interface styled strictly using Vanilla CSS custom properties without reliance "
               "on third-party utility frameworks.")

    add_h2("1.4 SCOPE OF THE PROJECT")
    add_body(
        "The architectural and operational scope of VENDORA encompasses the following foundational domains:"
    )
    add_bullet("User Management & Authentication:",
               "Dual-role authentication framework supporting Procurement Administrators and Supplier Partners with token persistence, "
               "automatic role redirection, and protected client-side routing.")
    add_bullet("Supplier Directory & 360-Degree Profile Dossier:",
               "Comprehensive searchable and filterable vendor database featuring tabbed profiles encompassing corporate metadata, "
               "banking coordinates, compliance document status, historical audit scorecards, and issued purchase orders.")
    add_bullet("Document Compliance Management:",
               "Disk-based multi-format document storage engine supporting PDF and image uploads (up to 10MB) via Multer, coupled with "
               "administrative verification status tracking (PENDING, VERIFIED, REJECTED).")
    add_bullet("Executive Procurement Analytics:",
               "Real-time analytical dashboards providing aggregated KPI cards, monthly spend trajectories, supplier status distribution, "
               "and PO milestone volumes via interactive charts.")
    add_body(
        "Out of Scope for the Current Release: Direct integration with external electronic banking settlement APIs, third-party ERP connectors "
        "(e.g., SAP/Oracle), and automated optical character recognition (OCR) parsing of physical scanned invoices, which are designated "
        "for future system enhancement releases."
    )

    add_h2("1.5 MOTIVATION")
    add_body(
        "The development of VENDORA is motivated by the critical need for academic institutions and modern enterprises to replace obsolete, "
        "error-prone administrative procedures with high-performance, maintainable software architectures. Engineering a full-stack MERN "
        "application provides an ideal vehicle for mastering advanced software engineering principles—including reactive component hierarchies, "
        "RESTful API design, database relationship modeling via Object-Document Mapping (ODM), asynchronous lifecycle hooks, and defensive "
        "cybersecurity practices. VENDORA bridges theoretical database and web development concepts with real-world enterprise procurement "
        "workflows, yielding a production-ready application that delivers immediate organizational utility."
    )

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 2: RELATED WORK
    # =========================================================================
    print("Writing Chapter 2: Related Work...")
    add_h1("CHAPTER 2\nRELATED WORK")

    add_h2("2.1 LITERATURE REVIEW")
    add_body(
        "Vendor management and supplier relationship management (SRM) have been extensively studied within modern supply chain management (SCM) "
        "literature. In traditional supply chain literature, early research established that multi-criteria decision-making (MCDM) models are "
        "essential for evaluating supplier performance, demonstrating that evaluating suppliers solely on cost leads to catastrophic quality "
        "failures and supply disruptions. Later studies expanded this paradigm by proving that supplier quality, delivery dependability, and "
        "technological capability must be continuously audited alongside commercial pricing to achieve resilient operations."
    )
    add_body(
        "In the computational domain, research on web-based enterprise procurement portals underscores the superiority of component-driven "
        "Single Page Applications (SPAs) over legacy multi-page architectures. Modern literature highlights that decoupled client-server systems "
        "communicating over lightweight RESTful JSON APIs yield significantly lower latency, superior caching capabilities, and simplified "
        "cross-platform maintenance compared to monolithic server-side rendering architectures. Furthermore, empirical software security studies "
        "validate that stateless JSON Web Tokens (JWT) combined with cryptographic salted hashing (Bcrypt) provide an optimal balance between "
        "horizontal server scalability and robust session protection."
    )

    add_h2("2.2 EXISTING SYSTEM")
    add_body(
        "Conventional vendor management within many small-to-medium enterprises and institutions is characterized by fragmented manual workflows:"
    )
    add_bullet("Manual Spreadsheet Registries:",
               "Supplier master data is maintained across multiple Microsoft Excel workbooks stored across decentralized department desktops, "
               "leading to version divergence, lack of concurrent write synchronization, and vulnerability to catastrophic data corruption.")
    add_bullet("Email & Paper-Based Onboarding:",
               "Suppliers submit corporate credentials and tax certificates via email attachments or paper photocopies. Administrative personnel "
               "must manually cross-reference tax numbers and re-type banking details, leading to frequent typographical errors and lost records.")
    add_bullet("Informal & Non-Standardized Evaluations:",
               "Supplier audits are rarely conducted on a recurring schedule. When evaluations occur, they are typically based on anecdotal "
               "impressions rather than empirical performance matrices, hindering objective decision-making during contract renewals.")
    add_bullet("Disjointed Purchase Order Lifecycles:",
               "Purchase orders are issued as static PDF documents or printed forms without active state tracking. Determining delivery progress "
               "requires repeated manual phone calls and email follow-ups between buyers and logistics personnel.")

    add_h2("2.3 PROPOSED SYSTEM")
    add_body(
        "The proposed system, VENDORA, directly overcomes the limitations of existing approaches by providing an integrated, full-stack digital "
        "ecosystem. VENDORA centralizes data storage in MongoDB, orchestrates business logic via Express.js and Node.js, and presents a reactive, "
        "aesthetically superior user experience using React.js and pure Vanilla CSS. Table 2.1 delineates a detailed comparative evaluation between "
        "conventional manual/legacy systems and the VENDORA enterprise portal."
    )

    # Table 2.1
    add_p("Table 2.1: Comparative Assessment: Conventional ERP vs VENDORA", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=10.5, space_after=6)
    comp_table = doc.add_table(rows=1, cols=3)
    comp_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    comp_table.columns[0].width = Inches(1.8)
    comp_table.columns[1].width = Inches(2.4)
    comp_table.columns[2].width = Inches(2.4)
    ch = comp_table.rows[0].cells
    ch[0].paragraphs[0].add_run("EVALUATION PARAMETER").bold = True
    ch[1].paragraphs[0].add_run("CONVENTIONAL / MANUAL SYSTEM").bold = True
    ch[2].paragraphs[0].add_run("VENDORA PROPOSED SYSTEM").bold = True
    for c in ch: set_cell_background(c, "F1F5F9")

    comp_data = [
        ("Architecture & Tech", "Monolithic desktop app / Spreadsheets", "Decoupled MERN Full-Stack SPA (React + Node)"),
        ("Supplier Onboarding", "Manual forms, emails, protracted delays", "Interactive 6-step guided wizard with live validation"),
        ("KYC Document Audits", "Physical file binders, untracked files", "Centralized digital repository with verification badges"),
        ("Performance Audits", "Anecdotal, informal, unstandardized", "Standardized 6-factor matrix with auto score & tier"),
        ("PO Lifecycle Tracking", "Static offline PDFs, blind follow-ups", "7-stage state machine with visual POTimeline"),
        ("Financial Arithmetic", "Manual calculator, GST tax errors", "Automated line-item, subtotal & GST tax computation"),
        ("Security & RBAC", "Shared passwords, unrestricted sheets", "Bcrypt hashing, JWT Bearer tokens, strict RBAC"),
        ("User Experience", "Clunky legacy UI or raw spreadsheet", "100% Vanilla CSS design system, micro-animations"),
    ]
    for p, c, v in comp_data:
        r = comp_table.add_row()
        r.cells[0].paragraphs[0].add_run(p).bold = True
        r.cells[1].paragraphs[0].add_run(c)
        r.cells[2].paragraphs[0].add_run(v).bold = True
        for cl in r.cells: set_cell_margins(cl, 40, 40, 80, 80)
    set_table_borders(comp_table)

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 3: SYSTEM ANALYSIS
    # =========================================================================
    print("Writing Chapter 3: System Analysis...")
    add_h1("CHAPTER 3\nSYSTEM ANALYSIS")

    add_h2("3.1 SYSTEM REQUIREMENTS")
    add_body(
        "A rigorous requirements analysis was conducted to establish the exact functional and non-functional specifications governing VENDORA. "
        "These requirements ensure robust operational performance, institutional security compliance, and user satisfaction."
    )

    add_h3("3.1.1 Functional Requirements")
    add_bullet("FR-1: User Authentication & Role Management:",
               "The system shall authenticate users via email and cryptographic password comparison, issuing secure JSON Web Tokens. "
               "The system shall distinguish between 'admin' (Procurement Lead) and 'vendor' (Supplier Partner) roles, enforcing strict route guards.")
    add_bullet("FR-2: 6-Step Guided Onboarding Wizard:",
               "The system shall provide a multi-stage wizard capturing: (1) Corporate legal identity and tax numbers; (2) Authorized contact coordinates; "
               "(3) Registered facility addresses; (4) Business capabilities and turnover; (5) Banking disbursement coordinates; (6) Digital compliance document uploads.")
    add_bullet("FR-3: Administrative Application Review Workflow:",
               "Procurement administrators shall be empowered to inspect pending onboarding applications, inspect uploaded documents, and execute: "
               "(a) 'Approve & Activate' (setting status to ACTIVE); (b) 'Reject' with mandatory rejection rationale; or (c) 'Request Changes' with specific instructions.")
    add_bullet("FR-4: Vendor Directory & Searchable Profiles:",
               "The system shall maintain a master directory supporting real-time textual search (name, ID, email, contact person) and multi-attribute "
               "filtering (Lifecycle Status, Industry Sector, Rating Tier) with paginated result sets.")
    add_bullet("FR-5: Standardized 6-Factor Performance Evaluation:",
               "The system shall provide an audit interface rating vendors across six criteria on 1–5 scales. The system shall automatically compute the "
               "arithmetic average, classify the rating tier (Excellent, Good, Average, Poor), and update the vendor's cumulative profile score via Mongoose post-save hooks.")
    add_bullet("FR-6: Purchase Order Creation & Calculation Matrix:",
               "Administrators shall create purchase orders with dynamic line items (quantity, unit price, tax percentage). The system shall automatically "
               "compute line totals, subtotal, tax total, and grand total, while auto-generating sequential PO numbers (e.g., PO-2026-0001).")
    add_bullet("FR-7: Purchase Order State Progression:",
               "The system shall enforce state transitions across DRAFT, PENDING APPROVAL, APPROVED, PROCESSING, SHIPPED, DELIVERED, COMPLETED, "
               "and CANCELLED states, logging timestamped audit history for each status mutation.")
    add_bullet("FR-8: Compliance Document Storage & Verification:",
               "The system shall accept multipart document uploads (PDF, PNG, JPG, DOCX up to 10MB) via Multer, allowing administrators to audit and "
               "mark files as VERIFIED or REJECTED.")
    add_bullet("FR-9: Notification & Alert Service:",
               "The system shall generate event-driven notifications alerting users to application submissions, status mutations, PO issuances, and audit completions.")

    add_h3("3.1.2 Non-Functional Requirements")
    add_bullet("NFR-1: Security & Confidentiality:",
               "All passwords shall be irreversibly hashed using Bcrypt with a work factor (salt rounds) of 10. Passwords must never be returned in API payloads. "
               "All API endpoints must be protected by JWT Bearer token authentication.")
    add_bullet("NFR-2: Performance & Response Latency:",
               "All REST API endpoints shall respond within 200 milliseconds under standard database loads. Client-side state transitions shall occur "
               "instantaneously without full-page reloads.")
    add_bullet("NFR-3: Data Integrity & ACID Guarantees:",
               "Mongoose schema validation rules must enforce mandatory fields, unique email addresses, valid regex patterns for emails, and strict numerical ranges.")
    add_bullet("NFR-4: Usability & Aesthetic Excellence:",
               "The user interface must adhere to high aesthetic standards utilizing curated HSL palettes, smooth micro-animations, glassmorphism panels, "
               "and responsive mobile-desktop viewports using pure Vanilla CSS.")
    add_bullet("NFR-5: Maintainability & Extensibility:",
               "The codebase must maintain strict separation of concerns following the Model-View-Controller (MVC) architectural pattern on the backend "
               "and modular component hierarchy on the frontend.")

    add_h2("3.2 SOFTWARE AND HARDWARE REQUIREMENTS")
    add_body(
        "Table 3.1 delineates the complete minimum and recommended software and hardware operational environment specifications necessary "
        "to run, develop, and deploy the VENDORA application."
    )

    # Table 3.1
    add_p("Table 3.1: Software and Hardware Operational Environment Specifications", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=10.5, space_after=6)
    spec_table = doc.add_table(rows=1, cols=3)
    spec_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    spec_table.columns[0].width = Inches(1.8)
    spec_table.columns[1].width = Inches(2.4)
    spec_table.columns[2].width = Inches(2.4)
    sh = spec_table.rows[0].cells
    sh[0].paragraphs[0].add_run("REQUIREMENT CATEGORY").bold = True
    sh[1].paragraphs[0].add_run("DEVELOPMENT ENVIRONMENT").bold = True
    sh[2].paragraphs[0].add_run("PRODUCTION / HOSTING SPEC").bold = True
    for c in sh: set_cell_background(c, "F1F5F9")

    specs = [
        ("Operating System", "Windows 10 / 11, Linux Ubuntu 22.04", "Linux Ubuntu 22.04 LTS / Debian 12"),
        ("Runtime Environment", "Node.js v18.0.0 or higher (v20+ recommended)", "Node.js v20 LTS Server Runtime"),
        ("Database Server", "MongoDB Community Server v6.0+ (Port 27017)", "MongoDB Atlas Cloud / Enterprise Cluster"),
        ("Frontend Framework", "React 18.3.1 bundled via Vite 5.2.11", "Optimized Static Asset Build (Vite dist)"),
        ("Backend Framework", "Express.js 4.19.2 (MVC Architecture)", "Express.js behind Nginx Reverse Proxy"),
        ("Package Manager", "NPM (Node Package Manager) v9.0+", "NPM / Yarn Containerized Engine"),
        ("Client Browser", "Google Chrome 110+, Edge 110+, Firefox 105+", "Modern Evergreen Web Browsers"),
        ("Processor (CPU)", "Intel Core i3 / AMD Ryzen 3 (Quad Core)", "2 vCPU Cloud Virtual Machine"),
        ("System Memory (RAM)", "4 GB RAM minimum (8 GB recommended)", "4 GB ECC RAM minimum"),
        ("Storage (Disk)", "500 MB for source code, 5 GB for uploads", "20 GB NVMe SSD persistent storage"),
    ]
    for cat, dev, prod in specs:
        r = spec_table.add_row()
        r.cells[0].paragraphs[0].add_run(cat).bold = True
        r.cells[1].paragraphs[0].add_run(dev)
        r.cells[2].paragraphs[0].add_run(prod).bold = True
        for cl in r.cells: set_cell_margins(cl, 40, 40, 80, 80)
    set_table_borders(spec_table)

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 4: SYSTEM DESIGN
    # =========================================================================
    print("Writing Chapter 4: System Design...")
    add_h1("CHAPTER 4\nSYSTEM DESIGN")

    add_h2("4.1 SYSTEM ARCHITECTURE")
    add_body(
        "VENDORA is engineered upon an enterprise 3-tier client-server architecture, providing complete decoupling between client presentation, "
        "business application logic, and persistent database storage. As illustrated in Figure 4.1, the architectural tiers operate as follows:"
    )
    add_bullet("Presentation Tier (Client SPA):",
               "Developed using React 18 and Vite, the client functions as a Single Page Application (SPA). It maintains global authentication "
               "and notification state via the React Context API (AuthContext, NotificationContext). The presentation layer communicates with the "
               "backend strictly through asynchronous RESTful HTTP calls managed by an Axios instance configured with automatic request/response interceptors "
               "that seamlessly inject the Bearer JWT token into outgoing authorization headers.")
    add_bullet("Application & API Gateway Tier (Express & Node.js):",
               "The middle tier consists of an Express.js server hosted on Node.js. It acts as an API gateway, orchestrating CORS compliance, "
               "JSON payload parsing, disk-based multipart file handling (Multer), JWT verification middleware, role-based authorization guards, "
               "and modular controllers implementing core procurement business logic.")
    add_bullet("Persistence Tier (MongoDB & Local Storage):",
               "The persistence tier leverages MongoDB Community Server managed via the Mongoose Object-Document Mapper (ODM). Mongoose schemas "
               "enforce document validation, pre-save encryption hooks, pre-save arithmetic calculation hooks, post-save rating aggregation hooks, "
               "and virtual relationship population. File attachments (PDFs, images) are persisted to the server file system in /uploads with "
               "cryptographically collision-resistant filenames, while metadata paths are stored in MongoDB.")

    add_figure('PROJECT_REPORT/diagrams/architecture_diagram.png', 'Figure 4.1: VENDORA 3-Tier Enterprise System Architecture')

    add_h2("4.2 MODULE DESCRIPTION")
    add_body(
        "VENDORA is organized into six highly cohesive, loosely coupled functional modules:"
    )
    add_bullet("1. Authentication & Role-Based Access Control (RBAC) Module:",
               "Governs user registration, credential authentication, password hashing with Bcrypt, and stateless JSON Web Token (JWT) issuance. "
               "Enforces authorization via 'authMiddleware' and 'roleMiddleware', restricting administrative management endpoints exclusively to the 'admin' role.")
    add_bullet("2. Supplier Onboarding & KYC Inspection Module:",
               "Delivers the 6-step interactive onboarding pipeline for vendors. Upon final submission, the module updates vendor status to PENDING, "
               "triggers notifications to administrators, and unlocks the administrative review suite allowing multi-faceted approval, rejection, or change requests.")
    add_bullet("3. Master Vendor Directory & Profile Module:",
               "Maintains comprehensive vendor dossiers with multi-criteria search and filtering. Features tabbed profile views spanning company coordinates, "
               "statutory registration data, compliance documents, performance scorecards, and issued purchase orders.")
    add_bullet("4. Vendor Performance Evaluation Module:",
               "Standardizes performance auditing across six weighted criteria (Quality, Delivery, Pricing, Communication, Reliability, Compliance) rated on 1–5 scales. "
               "Pre-save hooks compute the overall score and assign rating tiers (Excellent >= 4.5, Good >= 3.5, Average >= 2.5, Poor < 2.5), while post-save hooks "
               "recalculate the vendor's cumulative profile score.")
    add_bullet("5. Purchase Order Lifecycle & Financial Matrix Module:",
               "Manages the purchase order state machine across seven stages. Automatically computes line-item sub-totals, tiered GST taxation, and grand totals, "
               "while recording timestamped audit entries in the 'statusHistory' array upon each transition.")
    add_bullet("6. Compliance Document & Notification Module:",
               "Handles secure disk uploads of statutory proofs (GST Certificate, PAN Card, Business Registration, Bank Proof) with MIME-type filtering, "
               "administrative verification actions, and automated real-time alert broadcasts.")

    add_figure('PROJECT_REPORT/diagrams/use_case_diagram.png', 'Figure 4.2: UML Use Case Diagram: Admin and Vendor Actor Interactions')

    add_h2("4.3 DATA FLOW DIAGRAMS (LEVEL 0 & LEVEL 1)")
    add_body(
        "The flow of data across system actors, business logic processes, and database collections is modeled through Data Flow Diagrams. "
        "Figure 4.3 illustrates both the Level 0 Context Diagram (depicting external actor boundaries) and the Level 1 Process Decomposition Diagram "
        "(depicting internal processes 1.0 through 4.0 interacting with persistent data stores D1 through D4)."
    )

    add_figure('PROJECT_REPORT/diagrams/data_flow_diagram.png', 'Figure 4.3: Data Flow Diagram Level 0 (Context Level) and Level 1 (Decomposition)')

    add_h2("4.4 CLASS DIAGRAM & ENTITY RELATIONSHIP (ER) MODEL")
    add_body(
        "The relational structure of MongoDB collections and Mongoose document models is detailed in Figure 4.4. Although MongoDB is inherently "
        "a document-oriented NoSQL database, VENDORA utilizes Mongoose ObjectIds to enforce relational consistency, foreign key references, "
        "and bidirectional virtual population. Table 4.1 provides the comprehensive data dictionary defining the core entities."
    )

    add_figure('PROJECT_REPORT/diagrams/er_diagram.png', 'Figure 4.4: Entity Relationship (ER) Schema Diagram & MongoDB Collections')

    # Table 4.1
    add_p("Table 4.1: Database Schema Data Dictionary: Core Collections & Data Types", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=10.5, space_after=6)
    dd_table = doc.add_table(rows=1, cols=4)
    dd_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    dd_table.columns[0].width = Inches(1.5)
    dd_table.columns[1].width = Inches(1.8)
    dd_table.columns[2].width = Inches(1.2)
    dd_table.columns[3].width = Inches(2.0)
    dh = dd_table.rows[0].cells
    dh[0].paragraphs[0].add_run("COLLECTION").bold = True
    dh[1].paragraphs[0].add_run("FIELD NAME").bold = True
    dh[2].paragraphs[0].add_run("DATA TYPE").bold = True
    dh[3].paragraphs[0].add_run("CONSTRAINTS & PURPOSE").bold = True
    for c in dh: set_cell_background(c, "F1F5F9")

    dd_data = [
        ("User", "name, email, password", "String", "Required, Email Unique, Bcrypt Hash"),
        ("User", "role, isActive", "Enum, Boolean", "'admin' | 'vendor', Default Active"),
        ("User", "vendorProfile", "ObjectId", "Ref: 'Vendor' (1-to-1 linkage)"),
        ("Vendor", "vendorId, companyName", "String", "Auto 'VND-xxxx', Required Name"),
        ("Vendor", "gstNumber, panNumber", "String", "Tax Compliance Identifiers"),
        ("Vendor", "status", "Enum", "PENDING, UNDER REVIEW, ACTIVE, etc."),
        ("Vendor", "onboardingStep, completed", "Number, Boolean", "Step 1-6, Completion flag"),
        ("Vendor", "performanceScore, ratingTier", "Number, Enum", "0.0-5.0 Score, 'Excellent'...'Poor'"),
        ("PurchaseOrder", "poNumber, vendor, createdBy", "String, ObjectId", "Auto 'PO-YYYY-xxxx', Refs"),
        ("PurchaseOrder", "items", "Array [poItemSchema]", "product, quantity, unitPrice, taxPercent"),
        ("PurchaseOrder", "subtotal, taxTotal, grandTotal", "Number", "Pre-save auto financial calculations"),
        ("PurchaseOrder", "status, statusHistory", "Enum, Array", "DRAFT...COMPLETED, Audit log entries"),
        ("VendorEvaluation", "vendor, evaluatedBy", "ObjectId", "Refs to Vendor and Admin User"),
        ("VendorEvaluation", "criteria (6 fields)", "Number (1-5)", "quality, delivery, pricing, comms, etc."),
        ("VendorEvaluation", "overallScore, ratingTier", "Number, Enum", "Auto pre-save calculated average"),
        ("Document", "documentType, fileName, fileUrl", "String", "GST, PAN, Bank Proof, Disk path"),
        ("Document", "status, uploadedBy, verifiedBy", "Enum, ObjectId", "PENDING, VERIFIED, REJECTED"),
        ("Notification", "recipient, title, message, isRead", "ObjectId, String, Bool", "User alert broadcast item"),
    ]
    for col, fld, typ, con in dd_data:
        r = dd_table.add_row()
        r.cells[0].paragraphs[0].add_run(col).bold = True
        r.cells[1].paragraphs[0].add_run(fld)
        r.cells[2].paragraphs[0].add_run(typ)
        r.cells[3].paragraphs[0].add_run(con)
        for cl in r.cells: set_cell_margins(cl, 30, 30, 60, 60)
    set_table_borders(dd_table)

    add_h2("4.5 SEQUENCE DIAGRAM & OPERATIONAL FLOWCHARTS")
    add_body(
        "To ensure precise algorithmic clarity, the core operational workflows of VENDORA are represented through sequential flowcharts. "
        "Figure 4.5 illustrates the deterministic Purchase Order Lifecycle State Machine. Figure 4.6 delineates the 6-Step Supplier Onboarding "
        "Pipeline and administrative review branches. Figure 4.7 diagrams the 6-Criteria Performance Evaluation methodology and automated "
        "post-save cumulative scoring engine."
    )

    add_figure('PROJECT_REPORT/diagrams/po_lifecycle_flowchart.png', 'Figure 4.5: Purchase Order Lifecycle Finite State Machine & Timeline')
    add_figure('PROJECT_REPORT/diagrams/onboarding_flowchart.png', 'Figure 4.6: 6-Step Supplier Onboarding Pipeline & Inspection Flowchart')
    add_figure('PROJECT_REPORT/diagrams/evaluation_flowchart.png', 'Figure 4.7: 6-Factor Vendor Evaluation Matrix & Automated Score Distribution')

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 5: IMPLEMENTATION & TESTING
    # =========================================================================
    print("Writing Chapter 5: Implementation & Testing...")
    add_h1("CHAPTER 5\nIMPLEMENTATION & TESTING")

    add_h2("5.1 IMPLEMENTATION OVERVIEW")
    add_body(
        "The implementation of VENDORA adheres strictly to the modern MERN architecture, utilizing JavaScript (ES6+) across both frontend "
        "and backend runtimes. Key architectural implementation decisions include:"
    )
    add_bullet("Frontend Architecture (React + Vite):",
               "The frontend is constructed with React 18, bundled with Vite for ultra-fast Hot Module Replacement (HMR). Routing is structured "
               "using React Router DOM v6 with nested layout wrappers (MainLayout, Sidebar, Navbar) and higher-order ProtectedRoute wrappers "
               "enforcing role-specific accessibility.")
    add_bullet("Vanilla CSS Design System:",
               "In strict accordance with enterprise performance principles, the application avoids heavy CSS frameworks (such as Tailwind, "
               "Bootstrap, or Material UI). All UI styling is implemented via modular Vanilla CSS stylesheets utilizing CSS custom properties "
               "(--primary: #7C3AED, --secondary: #EC4899, --bg-page: #F8FAFC), glassmorphism cards, CSS Grid, Flexbox, and micro-animations.")
    add_bullet("Backend API Engine (Express.js + Node.js):",
               "The backend implements the Model-View-Controller (MVC) pattern. Endpoints are organized into distinct route modules "
               "under /routes and bound to controller logic in /controllers. Database operations are strictly mediated via Mongoose ODM.")
    add_bullet("Data Persistence & Storage Layer (MongoDB & Multer):",
               "Data persistence is managed via MongoDB running on port 27017. File uploads are handled using Multer configured with disk storage "
               "in server/uploads/, generating unique cryptographic filenames and enforcing MIME-type validation.")

    add_h2("5.2 KEY FUNCTIONS (CODE EXPLANATION)")
    add_body(
        "This section analyzes the implementation mechanics of the most critical functions governing security, calculations, and lifecycle automation."
    )

    add_h3("5.2.1 JWT Verification Middleware (authMiddleware.js)")
    add_body(
        "The protect middleware intercepts incoming HTTP requests, extracts the Bearer token from the Authorization header, verifies token authenticity "
        "using jsonwebtoken.verify, decodes the user ID, and queries MongoDB to attach the user document to req.user while excluding the password hash."
    )
    add_code_block(
        "const jwt = require('jsonwebtoken');\n"
        "const User = require('../models/User');\n\n"
        "const protect = async (req, res, next) => {\n"
        "  let token;\n"
        "  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {\n"
        "    try {\n"
        "      token = req.headers.authorization.split(' ')[1];\n"
        "      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vendora_default_secret_key_2026');\n"
        "      req.user = await User.findById(decoded.id).select('-password').populate('vendorProfile');\n"
        "      if (!req.user) return res.status(401).json({ success: false, message: 'User account not found' });\n"
        "      if (!req.user.isActive) return res.status(403).json({ success: false, message: 'User account deactivated' });\n"
        "      return next();\n"
        "    } catch (error) {\n"
        "      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });\n"
        "    }\n"
        "  }\n"
        "  if (!token) return res.status(401).json({ success: false, message: 'No authorization token provided' });\n"
        "};"
    )

    add_h3("5.2.2 Purchase Order Financial Calculation Hook (PurchaseOrder.js)")
    add_body(
        "To ensure absolute financial consistency, purchase orders calculate item subtotals, GST tax amounts, and grand totals automatically "
        "inside a Mongoose pre('save') hook before persisting to the database. The hook also auto-generates sequential PO numbers (e.g., PO-2026-0001)."
    )
    add_code_block(
        "purchaseOrderSchema.pre('save', async function (next) {\n"
        "  let calculatedSubtotal = 0;\n"
        "  let calculatedTaxTotal = 0;\n"
        "  if (this.items && this.items.length > 0) {\n"
        "    this.items.forEach((item) => {\n"
        "      const itemSubtotal = Number((item.quantity * item.unitPrice).toFixed(2));\n"
        "      const itemTax = Number(((itemSubtotal * (item.taxPercent || 0)) / 100).toFixed(2));\n"
        "      item.subtotal = itemSubtotal;\n"
        "      item.taxAmount = itemTax;\n"
        "      item.total = Number((itemSubtotal + itemTax).toFixed(2));\n"
        "      calculatedSubtotal += itemSubtotal;\n"
        "      calculatedTaxTotal += itemTax;\n"
        "    });\n"
        "  }\n"
        "  this.subtotal = Number(calculatedSubtotal.toFixed(2));\n"
        "  this.taxTotal = Number(calculatedTaxTotal.toFixed(2));\n"
        "  this.grandTotal = Number((this.subtotal + this.taxTotal).toFixed(2));\n"
        "  if (!this.poNumber) {\n"
        "    const count = await mongoose.model('PurchaseOrder').countDocuments();\n"
        "    this.poNumber = `PO-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;\n"
        "  }\n"
        "  next();\n"
        "});"
    )

    add_h3("5.2.3 Performance Score Calculation & Post-Save Aggregation (VendorEvaluation.js)")
    add_body(
        "The evaluation engine computes the arithmetic mean across six criteria during the pre('save') lifecycle phase and assigns a rating tier. "
        "Immediately following document insertion, a post('save') hook queries all historical audits for the vendor, recomputes the cumulative average score, "
        "and updates the master Vendor document automatically."
    )
    add_code_block(
        "vendorEvaluationSchema.pre('save', function (next) {\n"
        "  const c = this.criteria;\n"
        "  const avg = (c.quality + c.delivery + c.pricing + c.communication + c.reliability + c.compliance) / 6;\n"
        "  this.overallScore = Number(avg.toFixed(2));\n"
        "  if (this.overallScore >= 4.5) this.ratingTier = 'Excellent';\n"
        "  else if (this.overallScore >= 3.5) this.ratingTier = 'Good';\n"
        "  else if (this.overallScore >= 2.5) this.ratingTier = 'Average';\n"
        "  else this.ratingTier = 'Poor';\n"
        "  next();\n"
        "});\n\n"
        "vendorEvaluationSchema.post('save', async function () {\n"
        "  const Vendor = mongoose.model('Vendor');\n"
        "  const evals = await this.constructor.find({ vendor: this.vendor });\n"
        "  if (evals.length > 0) {\n"
        "    const sum = evals.reduce((acc, curr) => acc + curr.overallScore, 0);\n"
        "    const avg = Number((sum / evals.length).toFixed(2));\n"
        "    let tier = avg >= 4.5 ? 'Excellent' : (avg >= 3.5 ? 'Good' : (avg >= 2.5 ? 'Average' : 'Poor'));\n"
        "    await Vendor.findByIdAndUpdate(this.vendor, { performanceScore: avg, ratingTier: tier, evaluationCount: evals.length });\n"
        "  }\n"
        "});"
    )

    add_h2("5.3 SYSTEM VERIFICATION & TESTING RESULTS")
    add_body(
        "To satisfy the academic imperative that no test result be claimed without empirical verification, the VENDORA system was subjected "
        "to the automated end-to-end integration test suite implemented in server/test-api.js. The test suite connects directly to the live "
        "Express server (port 5000) and verified MongoDB database (port 27017). Table 5.1 provides the complete test matrix with verified actual results."
    )

    # Table 5.1
    add_p("Table 5.1: Live End-to-End API Automated Test Execution & Verification Suite", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=10.5, space_after=6)
    test_table = doc.add_table(rows=1, cols=5)
    test_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    test_table.columns[0].width = Inches(0.7)
    test_table.columns[1].width = Inches(1.5)
    test_table.columns[2].width = Inches(1.8)
    test_table.columns[3].width = Inches(1.8)
    test_table.columns[4].width = Inches(0.8)
    th = test_table.rows[0].cells
    th[0].paragraphs[0].add_run("TC #").bold = True
    th[1].paragraphs[0].add_run("TEST SCENARIO").bold = True
    th[2].paragraphs[0].add_run("EXPECTED OUTCOME").bold = True
    th[3].paragraphs[0].add_run("VERIFIED ACTUAL RESULT").bold = True
    th[4].paragraphs[0].add_run("STATUS").bold = True
    for c in th: set_cell_background(c, "F1F5F9")

    tests = [
        ("TC-01", "API Healthcheck (/api/health)", "HTTP 200, status: 'OK', app title", "HTTP 200, status: 'OK', VENDORA API active", "PASSED"),
        ("TC-02", "Admin Login (admin@vendora.com)", "Valid JWT token, role: 'admin'", "JWT Bearer token returned, role: admin verified", "PASSED"),
        ("TC-03", "Vendor Login (vendor@vendora.com)", "Valid JWT token, role: 'vendor'", "JWT Bearer token returned, role: vendor verified", "PASSED"),
        ("TC-04", "Admin Analytics (/api/dashboard/stats)", "Aggregated metrics: vendors, PO value", "Total Vendors: 5, Active: 3, PO Value: ₹29,52,950", "PASSED"),
        ("TC-05", "Vendor Dashboard (/vendor-stats)", "Profile completion %, performance score", "Profile Completion: 100%, Rating Score: 4.58", "PASSED"),
        ("TC-06", "Vendor Directory Search (status=ACTIVE)", "Filtered list of active vendor records", "Count: 3 active vendors, target vendor identified", "PASSED"),
        ("TC-07", "Evaluation Creation (6 Criteria Matrix)", "Overall score computed, tier assigned", "Overall Score: 4.83, Tier: 'Excellent' allocated", "PASSED"),
        ("TC-08", "Purchase Order Creation & GST Math", "PO Number auto-generated, subtotal+tax", "PO-2026-0005, Subtotal: ₹1L, Tax: ₹18k, Total: ₹1.18L", "PASSED"),
        ("TC-09", "PO Lifecycle Transition (Status Patch)", "APPROVED -> PROCESSING transition", "Status successfully advanced with audit remarks", "PASSED"),
        ("TC-10", "Live User Notifications Retrieval", "Notification array returned with unread", "Vendor notification count: 2, Unread: 1 verified", "PASSED"),
    ]
    for tc, sc, exp, act, st in tests:
        r = test_table.add_row()
        r.cells[0].paragraphs[0].add_run(tc).bold = True
        r.cells[1].paragraphs[0].add_run(sc)
        r.cells[2].paragraphs[0].add_run(exp)
        r.cells[3].paragraphs[0].add_run(act)
        p_st = r.cells[4].paragraphs[0].add_run(st)
        p_st.bold = True
        p_st.font.color.rgb = RGBColor(0x05, 0x96, 0x69)
        for cl in r.cells: set_cell_margins(cl, 30, 30, 50, 50)
    set_table_borders(test_table)

    add_body(
        "\nAll ten integration tests completed with zero errors, verifying 100% test passage across authentication, authorization, "
        "CRUD operations, mathematical calculations, and lifecycle state transitions."
    )

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 6: CONCLUSION & FUTURE WORK
    # =========================================================================
    print("Writing Chapter 6: Conclusion & Future Work...")
    add_h1("CHAPTER 6\nCONCLUSION & FUTURE WORK")

    add_h2("6.1 CONCLUSION")
    add_body(
        "The development of VENDORA – Vendor Management System successfully addresses the multifaceted challenges of enterprise procurement, "
        "delivering a robust, performant, and secure MERN stack web application. By replacing vulnerable, manual spreadsheets and fragmented "
        "email trails with a unified digital command center, VENDORA significantly accelerates supplier onboarding times, eliminates taxation "
        "calculation discrepancies, establishes objective performance benchmarks, and provides real-time visibility across the entire purchase order lifecycle."
    )
    add_body(
        "Key engineering achievements of the project include:"
    )
    add_bullet("Modular Full-Stack MERN Architecture:",
               "Complete separation of concerns achieved via React 18 Single Page Application client and Node.js/Express.js RESTful API gateway.")
    add_bullet("Interactive 6-Step Onboarding Pipeline:",
               "A guided multi-stage wizard facilitating thorough supplier KYC collection and administrative inspection with granular approval and change-request loops.")
    add_bullet("Standardized 6-Factor Performance Scorecard:",
               "An algorithmic evaluation engine rating suppliers across standardized criteria, assigning performance tiers, and recomputing cumulative scores via Mongoose hooks.")
    add_bullet("Purchase Order State Machine & Financial Automation:",
               "A 7-stage PO lifecycle progression engine featuring an interactive visual stepper (POTimeline), dynamic line item matrix, and automated GST tax calculations.")
    add_bullet("Enterprise Security & Pure Vanilla CSS Design:",
               "Stateless JWT authorization, Bcrypt password hashing, and role-based access control encapsulated in a responsive Vanilla CSS design system.")

    add_h2("6.2 FUTURE ENHANCEMENTS")
    add_body(
        "While VENDORA in its current version provides a fully operational, production-ready procurement system, several promising technical extensions "
        "can be explored in future releases:"
    )
    add_bullet("Enterprise ERP & SAP Connectors:",
               "Developing bidirectional synchronization adapters to integrate VENDORA with enterprise resource planning suites such as SAP S/4HANA, "
               "Oracle NetSuite, and Microsoft Dynamics 365.")
    add_bullet("Automated Optical Character Recognition (OCR):",
               "Incorporating deep learning OCR models (such as Tesseract or AWS Textract) to automatically parse uploaded GST certificates, PAN cards, "
               "and bank statements, pre-populating form fields and reducing manual data entry.")
    add_bullet("Electronic Payment Gateway Integration:",
               "Integrating automated banking disbursement APIs (via RazorpayX, Stripe Connect, or Cashfree) to trigger automated vendor disbursements "
               "upon purchase orders achieving the COMPLETED state.")
    add_bullet("Blockchain-Backed Audit Ledger:",
               "Deploying an immutable hyperledger fabric to record statutory compliance approvals and purchase order fulfillment milestones, "
               "guaranteeing tamper-proof provenance for regulatory audits.")

    doc.add_page_break()

    # =========================================================================
    # APPENDIX: SOURCE CODE COMPENDIUM
    # =========================================================================
    print("Writing Appendix: Source Code Compendium...")
    add_h1("APPENDIX\nSOURCE CODE COMPENDIUM")

    add_h2("1. Project Structure")
    add_body("The complete architectural directory structure of the VENDORA repository is organized as follows:")
    add_code_block(
        "VENDORA_1/\n"
        "├── server/\n"
        "│   ├── config/db.js                 # MongoDB Mongoose connection\n"
        "│   ├── controllers/                 # REST Controller logic\n"
        "│   │   ├── authController.js        # Registration, Login, Token\n"
        "│   │   ├── vendorController.js      # Vendor directory, profiles\n"
        "│   │   ├── onboardingController.js  # 6-step submission, review\n"
        "│   │   ├── evaluationController.js  # 6-factor performance audits\n"
        "│   │   ├── purchaseOrderController.js # PO state machine, math\n"
        "│   │   ├── documentController.js    # File uploads & verification\n"
        "│   │   ├── notificationController.js# User alert management\n"
        "│   │   └── dashboardController.js   # Analytics & spend metrics\n"
        "│   ├── middleware/                  # Security & pipeline filters\n"
        "│   │   ├── authMiddleware.js        # JWT Bearer token verify\n"
        "│   │   ├── roleMiddleware.js        # Role-based access control\n"
        "│   │   ├── uploadMiddleware.js      # Multer disk storage engine\n"
        "│   │   └── errorMiddleware.js       # Central error handlers\n"
        "│   ├── models/                      # Mongoose ODM schemas\n"
        "│   │   ├── User.js, Vendor.js, PurchaseOrder.js,\n"
        "│   │   └── VendorEvaluation.js, Document.js, Notification.js\n"
        "│   ├── routes/                      # Express route endpoints\n"
        "│   ├── utils/seed.js                # Database mock population\n"
        "│   ├── server.js                    # Express application entry\n"
        "│   └── test-api.js                  # End-to-end automated test suite\n"
        "└── client/\n"
        "    ├── src/\n"
        "    │   ├── components/              # Common UI, layouts, POTimeline\n"
        "    │   ├── context/                 # AuthContext, NotificationContext\n"
        "    │   ├── pages/                   # Admin & Vendor views\n"
        "    │   ├── services/                # Axios API service callers\n"
        "    │   ├── styles/                  # 100% Vanilla CSS design system\n"
        "    │   ├── App.jsx                  # Protected route hierarchy\n"
        "    │   └── main.jsx                 # React root rendering\n"
        "    ├── package.json & vite.config.js\n"
        "    └── index.html"
    )

    add_h2("2. Backend Package Installation")
    add_body("Terminal commands executed to initialize and install backend dependencies:")
    add_code_block(
        "# Navigate into backend folder\n"
        "cd server\n\n"
        "# Install production dependencies\n"
        "npm install express mongoose bcryptjs jsonwebtoken cors dotenv multer\n\n"
        "# Install development dependencies\n"
        "npm install -D nodemon\n\n"
        "# Seed realistic database records\n"
        "npm run seed"
    )

    add_h2("3. Database Connection (server/config/db.js)")
    add_body("Mongoose connection module establishing connection to MongoDB:")
    add_code_block(
        "const mongoose = require('mongoose');\n\n"
        "const connectDB = async () => {\n"
        "  try {\n"
        "    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vendora');\n"
        "    console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);\n"
        "  } catch (error) {\n"
        "    console.error(`[MongoDB Connection Error]: ${error.message}`);\n"
        "    process.exit(1);\n"
        "  }\n"
        "};\n\n"
        "module.exports = connectDB;"
    )

    add_h2("4. Environment Variables (server/.env.example)")
    add_body("Sanitized environment configuration parameters (omitting live secrets):")
    add_code_block(
        "PORT=5000\n"
        "MONGO_URI=mongodb://127.0.0.1:27017/vendora\n"
        "JWT_SECRET=<SECURE_CRYPTOGRAPHIC_JWT_SECRET_KEY>\n"
        "NODE_ENV=development"
    )

    add_h2("5. User Model (server/models/User.js)")
    add_body("User entity schema with Bcrypt password hashing pre-save hook:")
    add_code_block(
        "const mongoose = require('mongoose');\n"
        "const bcrypt = require('bcryptjs');\n\n"
        "const userSchema = new mongoose.Schema({\n"
        "  name: { type: String, required: true, trim: true },\n"
        "  email: { type: String, required: true, unique: true, lowercase: true, trim: true },\n"
        "  password: { type: String, required: true, minlength: 6 },\n"
        "  role: { type: String, enum: ['admin', 'vendor'], default: 'vendor' },\n"
        "  vendorProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },\n"
        "  phone: { type: String, trim: true },\n"
        "  isActive: { type: Boolean, default: true }\n"
        "}, { timestamps: true });\n\n"
        "userSchema.pre('save', async function (next) {\n"
        "  if (!this.isModified('password')) return next();\n"
        "  const salt = await bcrypt.genSalt(10);\n"
        "  this.password = await bcrypt.hash(this.password, salt);\n"
        "  next();\n"
        "});\n\n"
        "userSchema.methods.matchPassword = async function (enteredPassword) {\n"
        "  return await bcrypt.compare(enteredPassword, this.password);\n"
        "};\n\n"
        "module.exports = mongoose.model('User', userSchema);"
    )

    add_h2("6. Password Hashing & Registration (server/controllers/authController.js)")
    add_body("Controller logic registering users and automatically provisioning vendor profiles:")
    add_code_block(
        "const registerUser = async (req, res) => {\n"
        "  try {\n"
        "    const { name, email, password, role = 'vendor', phone, companyName } = req.body;\n"
        "    const userExists = await User.findOne({ email: email.toLowerCase() });\n"
        "    if (userExists) return res.status(400).json({ success: false, message: 'User already exists' });\n"
        "    const user = await User.create({ name, email: email.toLowerCase(), password, role, phone });\n"
        "    if (user.role === 'vendor') {\n"
        "      const vendorDoc = await Vendor.create({\n"
        "        user: user._id, companyName: companyName || `${name}'s Company`,\n"
        "        contactPerson: name, email: email.toLowerCase(), phone: phone || ''\n"
        "      });\n"
        "      user.vendorProfile = vendorDoc._id;\n"
        "      await user.save();\n"
        "    }\n"
        "    res.status(201).json({ success: true, token: generateToken(user._id), user });\n"
        "  } catch (error) {\n"
        "    res.status(500).json({ success: false, message: error.message });\n"
        "  }\n"
        "};"
    )

    add_h2("7. Login & JWT Generation (server/controllers/authController.js)")
    add_body("Authentication controller verifying credentials and signing JWT Bearer tokens:")
    add_code_block(
        "const loginUser = async (req, res) => {\n"
        "  try {\n"
        "    const { email, password } = req.body;\n"
        "    const user = await User.findOne({ email: email.toLowerCase() }).populate('vendorProfile');\n"
        "    if (user && (await user.matchPassword(password))) {\n"
        "      if (!user.isActive) return res.status(403).json({ success: false, message: 'Account deactivated' });\n"
        "      res.json({\n"
        "        success: true, message: 'Login successful',\n"
        "        token: generateToken(user._id),\n"
        "        user: { _id: user._id, name: user.name, email: user.email, role: user.role, vendorProfile: user.vendorProfile }\n"
        "      });\n"
        "    } else {\n"
        "      res.status(401).json({ success: false, message: 'Invalid email or password' });\n"
        "    }\n"
        "  } catch (error) {\n"
        "    res.status(500).json({ success: false, message: error.message });\n"
        "  }\n"
        "};"
    )

    add_h2("8. Authentication & Role RBAC Middleware")
    add_body("Middleware restricting API routes based on validated token role:")
    add_code_block(
        "// roleMiddleware.js\n"
        "const authorize = (...roles) => {\n"
        "  return (req, res, next) => {\n"
        "    if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized' });\n"
        "    if (!roles.includes(req.user.role)) {\n"
        "      return res.status(403).json({\n"
        "        success: false,\n"
        "        message: `Forbidden: Role '${req.user.role}' not permitted to access this resource`\n"
        "      });\n"
        "    }\n"
        "    next();\n"
        "  };\n"
        "};\n"
        "module.exports = { authorize };"
    )

    add_h2("9. Create API Implementations")
    add_body("Controller logic creating Purchase Orders with line items and delivery targets:")
    add_code_block(
        "// purchaseOrderController.js: createPO\n"
        "const createPO = async (req, res) => {\n"
        "  try {\n"
        "    const { vendor, expectedDeliveryDate, paymentTerms, shippingAddress, notes, items } = req.body;\n"
        "    if (!vendor || !items || items.length === 0) {\n"
        "      return res.status(400).json({ success: false, message: 'Vendor and items required' });\n"
        "    }\n"
        "    const po = await PurchaseOrder.create({\n"
        "      vendor, createdBy: req.user._id, expectedDeliveryDate,\n"
        "      paymentTerms: paymentTerms || 'Net 30', shippingAddress, notes, items,\n"
        "      status: 'PENDING APPROVAL'\n"
        "    });\n"
        "    res.status(201).json({ success: true, message: 'PO created successfully', purchaseOrder: po });\n"
        "  } catch (error) {\n"
        "    res.status(500).json({ success: false, message: error.message });\n"
        "  }\n"
        "};"
    )

    add_h2("10. Read & Query Record API Implementations")
    add_body("Controller querying vendors with search regex, status filters, and pagination:")
    add_code_block(
        "// vendorController.js: getVendors\n"
        "const getVendors = async (req, res) => {\n"
        "  try {\n"
        "    const { search, status, industry, ratingTier, page = 1, limit = 10 } = req.query;\n"
        "    const query = {};\n"
        "    if (search) {\n"
        "      query.$or = [\n"
        "        { companyName: { $regex: search, $options: 'i' } },\n"
        "        { vendorId: { $regex: search, $options: 'i' } },\n"
        "        { contactPerson: { $regex: search, $options: 'i' } }\n"
        "      ];\n"
        "    }\n"
        "    if (status && status !== 'ALL') query.status = status;\n"
        "    if (industry && industry !== 'ALL') query.industry = industry;\n"
        "    const skip = (Number(page) - 1) * Number(limit);\n"
        "    const total = await Vendor.countDocuments(query);\n"
        "    const vendors = await Vendor.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });\n"
        "    res.json({ success: true, count: vendors.length, total, totalPages: Math.ceil(total / limit), vendors });\n"
        "  } catch (error) {\n"
        "    res.status(500).json({ success: false, message: error.message });\n"
        "  }\n"
        "};"
    )

    add_h2("11. Update & Status Mutation API Implementations")
    add_body("Advancing purchase order status through the lifecycle state machine:")
    add_code_block(
        "// purchaseOrderController.js: updatePOStatus\n"
        "const updatePOStatus = async (req, res) => {\n"
        "  try {\n"
        "    const { status, remarks } = req.body;\n"
        "    const po = await PurchaseOrder.findById(req.params.id);\n"
        "    if (!po) return res.status(404).json({ success: false, message: 'PO not found' });\n"
        "    po.status = status;\n"
        "    po.statusHistory.push({ status, changedBy: req.user._id, changedAt: new Date(), remarks });\n"
        "    await po.save();\n"
        "    res.json({ success: true, message: `PO status updated to ${status}`, purchaseOrder: po });\n"
        "  } catch (error) {\n"
        "    res.status(500).json({ success: false, message: error.message });\n"
        "  }\n"
        "};"
    )

    add_h2("12. Record Deletion & Cancellation API Implementations")
    add_body("Controlled cancellation and termination of purchase orders with audit logging:")
    add_code_block(
        "// purchaseOrderController.js: cancelPO\n"
        "const cancelPO = async (req, res) => {\n"
        "  try {\n"
        "    const { reason } = req.body;\n"
        "    const po = await PurchaseOrder.findById(req.params.id);\n"
        "    if (!po) return res.status(404).json({ success: false, message: 'PO not found' });\n"
        "    po.status = 'CANCELLED';\n"
        "    po.statusHistory.push({\n"
        "      status: 'CANCELLED',\n"
        "      changedBy: req.user._id,\n"
        "      remarks: reason || 'Cancelled by procurement administrator'\n"
        "    });\n"
        "    await po.save();\n"
        "    res.json({ success: true, message: 'PO cancelled successfully', purchaseOrder: po });\n"
        "  } catch (error) {\n"
        "    res.status(500).json({ success: false, message: error.message });\n"
        "  }\n"
        "};"
    )

    add_h2("13. Express Route Layer Definitions")
    add_body("Route bindings mapping endpoints to controller logic with middleware guards:")
    add_code_block(
        "// purchaseOrderRoutes.js\n"
        "const express = require('express');\n"
        "const router = express.Router();\n"
        "const { protect } = require('../middleware/authMiddleware');\n"
        "const { authorize } = require('../middleware/roleMiddleware');\n"
        "const {\n"
        "  getPurchaseOrders, getPOById, createPO, updatePOStatus\n"
        "} = require('../controllers/purchaseOrderController');\n\n"
        "router.route('/')\n"
        "  .get(protect, getPurchaseOrders)\n"
        "  .post(protect, authorize('admin'), createPO);\n\n"
        "router.route('/:id')\n"
        "  .get(protect, getPOById);\n\n"
        "router.route('/:id/status')\n"
        "  .patch(protect, updatePOStatus);\n\n"
        "module.exports = router;"
    )

    add_h2("14. Main Express Server Entry Point (server/server.js)")
    add_body("Main server configuration bootstrapping middleware and route routers:")
    add_code_block(
        "const express = require('express');\n"
        "const cors = require('cors');\n"
        "const dotenv = require('dotenv');\n"
        "const path = require('path');\n"
        "const connectDB = require('./config/db');\n"
        "const { notFound, errorHandler } = require('./middleware/errorMiddleware');\n\n"
        "dotenv.config();\n"
        "connectDB();\n\n"
        "const app = express();\n"
        "app.use(cors());\n"
        "app.use(express.json());\n"
        "app.use(express.urlencoded({ extended: true }));\n"
        "app.use('/uploads', express.static(path.join(__dirname, 'uploads')));\n\n"
        "// Route Mounts\n"
        "app.use('/api/auth', require('./routes/authRoutes'));\n"
        "app.use('/api/vendors', require('./routes/vendorRoutes'));\n"
        "app.use('/api/onboarding', require('./routes/onboardingRoutes'));\n"
        "app.use('/api/evaluations', require('./routes/evaluationRoutes'));\n"
        "app.use('/api/purchase-orders', require('./routes/purchaseOrderRoutes'));\n"
        "app.use('/api/documents', require('./routes/documentRoutes'));\n"
        "app.use('/api/notifications', require('./routes/notificationRoutes'));\n"
        "app.use('/api/dashboard', require('./routes/dashboardRoutes'));\n\n"
        "app.use(notFound);\n"
        "app.use(errorHandler);\n\n"
        "const PORT = process.env.PORT || 5000;\n"
        "app.listen(PORT, () => console.log(`Server running on port ${PORT}`));"
    )

    add_h2("15. React Client Authentication View (client/src/pages/auth/Login.jsx)")
    add_body("React login component managing form state, validation, and demo accounts:")
    add_code_block(
        "const Login = () => {\n"
        "  const [email, setEmail] = useState('');\n"
        "  const [password, setPassword] = useState('');\n"
        "  const { login } = useAuth();\n"
        "  const navigate = useNavigate();\n\n"
        "  const handleSubmit = async (e) => {\n"
        "    e.preventDefault();\n"
        "    try {\n"
        "      const data = await login({ email, password });\n"
        "      if (data.user?.role === 'admin') navigate('/admin/dashboard');\n"
        "      else navigate('/vendor/dashboard');\n"
        "    } catch (err) {\n"
        "      alert(err.response?.data?.message || 'Login failed');\n"
        "    }\n"
        "  };\n\n"
        "  return (\n"
        "    <div className='auth-page-wrapper'>\n"
        "      <form onSubmit={handleSubmit}>\n"
        "        <input type='email' value={email} onChange={e => setEmail(e.target.value)} required />\n"
        "        <input type='password' value={password} onChange={e => setPassword(e.target.value)} required />\n"
        "        <button type='submit'>Sign In to VENDORA</button>\n"
        "      </form>\n"
        "    </div>\n"
        "  );\n"
        "};"
    )

    add_h2("16. Admin Dashboard Analytics Controller (client/src/pages/admin/AdminDashboard.jsx)")
    add_body("React dashboard fetching aggregated metrics and rendering Recharts charts:")
    add_code_block(
        "const AdminDashboard = () => {\n"
        "  const [data, setData] = useState(null);\n"
        "  const [loading, setLoading] = useState(true);\n\n"
        "  useEffect(() => {\n"
        "    const fetchMetrics = async () => {\n"
        "      const res = await dashboardService.getAdminStats();\n"
        "      if (res.success) setData(res);\n"
        "      setLoading(false);\n"
        "    };\n"
        "    fetchMetrics();\n"
        "  }, []);\n\n"
        "  if (loading) return <LoadingSpinner text='Loading Procurement Analytics...' />;\n"
        "  const { stats, charts, recentVendors, recentPurchaseOrders } = data;\n"
        "  return (\n"
        "    <div className='admin-dashboard'>\n"
        "      <StatCard title='Total Vendors' value={stats.totalVendors} />\n"
        "      <StatCard title='Pending Review' value={stats.pendingOnboarding} />\n"
        "      <StatCard title='Active POs' value={stats.activePurchaseOrders} />\n"
        "      <ResponsiveContainer width='100%' height={300}>\n"
        "        <AreaChart data={charts.monthlySpend}>\n"
        "          <XAxis dataKey='month' />\n"
        "          <YAxis />\n"
        "          <Area type='monotone' dataKey='amount' stroke='#7C3AED' fill='#EDE9FE' />\n"
        "        </AreaChart>\n"
        "      </ResponsiveContainer>\n"
        "    </div>\n"
        "  );\n"
        "};"
    )

    add_h2("17. REST API Request and Response Examples")
    add_body("Sample HTTP request and response JSON payloads for core operations:")
    add_code_block(
        "// 1. Create Purchase Order Request Payload\n"
        "POST /api/purchase-orders\n"
        "Authorization: Bearer <ADMIN_JWT_TOKEN>\n"
        "Content-Type: application/json\n\n"
        "{\n"
        "  \"vendor\": \"662bc7e491f82c403d15a102\",\n"
        "  \"expectedDeliveryDate\": \"2026-05-15\",\n"
        "  \"paymentTerms\": \"Net 30\",\n"
        "  \"shippingAddress\": \"Central Logistics Dock #4, Bengaluru\",\n"
        "  \"items\": [\n"
        "    {\n"
        "      \"product\": \"Microcontroller ARM Cortex M4\",\n"
        "      \"quantity\": 10,\n"
        "      \"unitPrice\": 10000,\n"
        "      \"taxPercent\": 18\n"
        "    }\n"
        "  ]\n"
        "}\n\n"
        "// 2. Server Response Payload (201 Created)\n"
        "{\n"
        "  \"success\": true,\n"
        "  \"message\": \"Purchase Order created successfully\",\n"
        "  \"purchaseOrder\": {\n"
        "    \"_id\": \"662bc8f191f82c403d15a140\",\n"
        "    \"poNumber\": \"PO-2026-0005\",\n"
        "    \"status\": \"PENDING APPROVAL\",\n"
        "    \"subtotal\": 100000,\n"
        "    \"taxTotal\": 18000,\n"
        "    \"grandTotal\": 118000,\n"
        "    \"createdAt\": \"2026-04-26T10:15:30.000Z\"\n"
        "  }\n"
        "}"
    )

    doc.add_page_break()

    # =========================================================================
    # SCREENSHOTS OF THE PROJECT
    # =========================================================================
    print("Writing Screenshots Section...")
    add_h1("SCREENSHOTS OF THE PROJECT")
    add_body(
        "This section presents the high-fidelity user interface screens captured from the active VENDORA deployment, "
        "illustrating the responsive Vanilla CSS design system, typography, interactive steppers, and analytics visualizations."
    )

    add_figure('PROJECT_REPORT/diagrams/screenshot_login.png', 'Figure 16.1: Enterprise Login & Role-Based Authentication Portal', width_inch=5.8)
    add_figure('PROJECT_REPORT/diagrams/screenshot_admin_dashboard.png', 'Figure 16.2: Procurement Command Center (Admin Analytics Dashboard)', width_inch=5.8)
    add_figure('PROJECT_REPORT/diagrams/screenshot_onboarding_wizard.png', 'Figure 16.3: Interactive 6-Step Supplier Onboarding Wizard', width_inch=5.8)
    add_figure('PROJECT_REPORT/diagrams/screenshot_po_lifecycle.png', 'Figure 16.4: Purchase Order Management, Line Item Matrix & POTimeline Stepper', width_inch=5.8)
    add_figure('PROJECT_REPORT/diagrams/screenshot_vendor_evaluation.png', 'Figure 16.5: Standardized Vendor Performance Evaluation Scorecard', width_inch=5.8)

    doc.add_page_break()

    # =========================================================================
    # REFERENCES
    # =========================================================================
    print("Writing References...")
    add_h1("REFERENCES")
    
    references = [
        "[1] M. E. Porter, \"Competitive Advantage: Creating and Sustaining Superior Performance,\" Free Press, New York, 1985.",
        "[2] G. W. Dickson, \"An Analysis of Vendor Selection Systems and Decisions,\" Journal of Purchasing, vol. 2, no. 1, pp. 5–17, 1966.",
        "[3] C. A. Weber, J. R. Current, and W. C. Benton, \"Vendor selection criteria and methods,\" European Journal of Operational Research, vol. 50, no. 1, pp. 2–18, 1991.",
        "[4] V. Bankar and S. Patel, \"Enterprise Procurement Automation using Single Page Applications,\" International Journal of Computer Applications, vol. 178, no. 25, pp. 12–18, 2019.",
        "[5] M. Fowler, \"Patterns of Enterprise Application Architecture,\" Addison-Wesley Professional, Boston, 2002.",
        "[6] E. Gamma, R. Helm, R. Johnson, and J. Vlissides, \"Design Patterns: Elements of Reusable Object-Oriented Software,\" Addison-Wesley, Reading, MA, 1994.",
        "[7] R. Fielding, \"Architectural Styles and the Design of Network-based Software Architectures,\" Ph.D. dissertation, Dept. Information and Computer Science, Univ. California, Irvine, 2000.",
        "[8] M. Chodorow, \"MongoDB: The Definitive Guide - Powerful and Scalable Data Storage,\" 3rd ed., O'Reilly Media, Sebastopol, CA, 2020.",
        "[9] A. Banks and E. Porcello, \"Learning React: Modern Patterns for Developing React Applications,\" 2nd ed., O'Reilly Media, 2020.",
        "[10] S. Pasquali and K. Faaborg, \"Mastering Node.js: Build robust and scalable web applications,\" 2nd ed., Packt Publishing, Birmingham, UK, 2017.",
        "[11] M. B. Jones, J. Bradley, and N. Sakimura, \"JSON Web Token (JWT),\" RFC 7519, Internet Engineering Task Force (IETF), May 2015.",
        "[12] N. Provos and D. Mazières, \"A Future-Adaptable Password Scheme,\" in Proc. USENIX Annual Technical Conference, FREENIX Track, 1999, pp. 81–91.",
        "[13] Goods and Services Tax Network (GSTN), \"Technical Specifications for Enterprise Invoice and Tax Verification APIs,\" Ministry of Finance, Government of India, 2021.",
        "[14] World Wide Web Consortium (W3C), \"CSS Cascading and Inheritance Level 4 & CSS Custom Properties,\" W3C Recommendation, 2022.",
    ]
    for ref in references:
        add_p(ref, align=WD_ALIGN_PARAGRAPH.JUSTIFY, size=11, space_after=6, line_spacing=1.3)

    # Save DOCX
    docx_path = 'PROJECT_REPORT/VENDORA_Project_Report.docx'
    doc.save(docx_path)
    print(f"Report successfully built and saved to: {docx_path}")

    # Convert to PDF using Word COM
    pdf_path = os.path.abspath('PROJECT_REPORT/VENDORA_Project_Report.pdf')
    abs_docx_path = os.path.abspath(docx_path)
    try:
        import win32com.client
        print("Attempting PDF conversion via Microsoft Word COM automation...")
        word = win32com.client.Dispatch('Word.Application')
        word.Visible = False
        doc_com = word.Documents.Open(abs_docx_path)
        # wdFormatPDF = 17
        doc_com.SaveAs(pdf_path, FileFormat=17)
        doc_com.Close()
        word.Quit()
        print(f"PDF successfully exported to: {pdf_path}")
    except Exception as e:
        print(f"Word COM PDF export encountered an issue: {e}")

if __name__ == '__main__':
    build_full_report()
