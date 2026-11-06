import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from PIL import Image, ImageDraw, ImageFont

os.makedirs('PROJECT_REPORT/diagrams', exist_ok=True)
output_dir = 'PROJECT_REPORT/diagrams'

# Set global matplotlib parameters for publication-quality figures
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial', 'Helvetica']
plt.rcParams['axes.edgecolor'] = '#CCCCCC'
plt.rcParams['axes.linewidth'] = 0.8

# -------------------------------------------------------------
# 1. SYSTEM ARCHITECTURE DIAGRAM
# -------------------------------------------------------------
def create_architecture_diagram():
    fig, ax = plt.subplots(figsize=(12, 8.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Title Banner
    ax.text(50, 97, 'VENDORA – 3-TIER SYSTEM ARCHITECTURE', ha='center', va='center',
            fontsize=15, fontweight='bold', color='#1E293B')
    ax.text(50, 94, 'Modular Enterprise Architecture for Full-Stack Vendor Management',
            ha='center', va='center', fontsize=10, color='#64748B')

    # 1. Client Presentation Tier
    rect_client = patches.FancyBboxPatch((4, 68), 92, 23, boxstyle="round,pad=1",
                                         facecolor='#F5F3FF', edgecolor='#8B5CF6', linewidth=2)
    ax.add_patch(rect_client)
    ax.text(8, 88, 'PRESENTATION TIER (CLIENT BROWSER - SINGLE PAGE APPLICATION)',
            fontsize=11, fontweight='bold', color='#5B21B6')

    client_boxes = [
        ('React 18 SPA (Vite)', 'Component-driven reactive UI hierarchy', 8, 71, 19, 13, '#EDE9FE'),
        ('Vanilla CSS System', 'Modern CSS variables, responsive layouts', 29, 71, 19, 13, '#EDE9FE'),
        ('State & Context API', 'AuthContext & NotificationContext', 50, 71, 19, 13, '#EDE9FE'),
        ('Axios HTTP Client', 'Auto JWT Authorization Bearer interceptors', 71, 71, 22, 13, '#EDE9FE'),
    ]
    for title, desc, x, y, w, h, bg in client_boxes:
        b = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.5", facecolor=bg, edgecolor='#C4B5FD', linewidth=1)
        ax.add_patch(b)
        ax.text(x + w/2, y + h - 3.5, title, ha='center', va='center', fontsize=9, fontweight='bold', color='#4C1D95')
        ax.text(x + w/2, y + 4, desc, ha='center', va='center', fontsize=7.5, color='#374151', wrap=True)

    # Down/Up Arrows between Tiers
    ax.annotate('', xy=(30, 60), xytext=(30, 67),
                arrowprops=dict(arrowstyle="<->", color='#7C3AED', lw=2.5))
    ax.text(32, 63.5, 'RESTful JSON APIs over HTTP/HTTPS', fontsize=8.5, fontweight='bold', color='#7C3AED')
    ax.annotate('', xy=(70, 60), xytext=(70, 67),
                arrowprops=dict(arrowstyle="<->", color='#EC4899', lw=2.5))
    ax.text(72, 63.5, 'Multipart Form-Data (File Uploads)', fontsize=8.5, fontweight='bold', color='#DB2777')

    # 2. Application & Business Logic Tier
    rect_server = patches.FancyBboxPatch((4, 27), 92, 32, boxstyle="round,pad=1",
                                         facecolor='#FDF2F8', edgecolor='#EC4899', linewidth=2)
    ax.add_patch(rect_server)
    ax.text(8, 56, 'APPLICATION & API GATEWAY TIER (NODE.JS + EXPRESS.JS SERVER)',
            fontsize=11, fontweight='bold', color='#9D174D')

    # Middleware Layer Sub-box
    rect_mw = patches.FancyBboxPatch((7, 43), 86, 9.5, boxstyle="round,pad=0.5",
                                     facecolor='#FCE7F3', edgecolor='#F472B6', linewidth=1)
    ax.add_patch(rect_mw)
    ax.text(9, 50, 'Security, Routing & Processing Middleware', fontsize=9, fontweight='bold', color='#831843')
    mw_items = ['CORS Policy', 'Express JSON Parser', 'JWT Auth Verification', 'Role RBAC (Admin/Vendor)', 'Multer Disk Storage', 'Central Error Handling']
    for i, it in enumerate(mw_items):
        bx = 8 + i * 14.1
        bb = patches.FancyBboxPatch((bx, 44), 13.5, 4.5, boxstyle="round,pad=0.2", facecolor='#FFFFFF', edgecolor='#F472B6', linewidth=0.8)
        ax.add_patch(bb)
        ax.text(bx + 6.75, 46.2, it, ha='center', va='center', fontsize=7.5, fontweight='bold', color='#9D174D')

    # Controllers Sub-boxes
    ctrl_items = [
        ('Auth Controller', 'Login, Register,\nToken Generation'),
        ('Vendor Controller', 'Directory, Profiles,\nSearch & Filtering'),
        ('Onboard Controller', '6-Step Submission,\nApprove / Reject'),
        ('PO Controller', 'PO Lifecycle,\nAuto-Calculations'),
        ('Evaluation Controller', '6-Criteria Score,\nTier Allocation'),
        ('Document Controller', 'Compliance Uploads,\nFile Verification'),
    ]
    for i, (ctitle, cdesc) in enumerate(ctrl_items):
        cx = 7 + i * 14.5
        cy = 29
        cb = patches.FancyBboxPatch((cx, cy), 13.8, 12, boxstyle="round,pad=0.4", facecolor='#FFFFFF', edgecolor='#FBCFE8', linewidth=1)
        ax.add_patch(cb)
        ax.text(cx + 6.9, cy + 9, ctitle, ha='center', va='center', fontsize=8, fontweight='bold', color='#831843')
        ax.text(cx + 6.9, cy + 4, cdesc, ha='center', va='center', fontsize=7, color='#4B5563', multialignment='center')

    # Down/Up Arrows to Data Tier
    ax.annotate('', xy=(50, 19), xytext=(50, 26),
                arrowprops=dict(arrowstyle="<->", color='#059669', lw=2.5))
    ax.text(52, 22.5, 'Mongoose ODM / TCP Port 27017', fontsize=8.5, fontweight='bold', color='#059669')

    # 3. Data Persistence Tier
    rect_data = patches.FancyBboxPatch((4, 2), 92, 16, boxstyle="round,pad=1",
                                       facecolor='#F0FDF4', edgecolor='#10B981', linewidth=2)
    ax.add_patch(rect_data)
    ax.text(8, 15.5, 'PERSISTENCE TIER (MONGODB DATABASE & DISK STORAGE)',
            fontsize=11, fontweight='bold', color='#065F46')

    db_items = [
        ('Users Collection', 'Credentials, RBAC role, account status'),
        ('Vendors Collection', '6-step onboarding, KYC, audit score'),
        ('Purchase Orders', 'Line items, GST tax, audit history'),
        ('Vendor Evaluations', '6 criteria ratings, auto score, tier'),
        ('Documents Collection', 'Metadata, MIME type, verify status'),
        ('Local Disk (/uploads)', 'Encrypted/unique stored PDF & images'),
    ]
    for i, (dtitle, ddesc) in enumerate(db_items):
        dx = 7 + i * 14.5
        dy = 4
        db = patches.FancyBboxPatch((dx, dy), 13.8, 9.5, boxstyle="round,pad=0.4", facecolor='#FFFFFF', edgecolor='#A7F3D0', linewidth=1)
        ax.add_patch(db)
        ax.text(dx + 6.9, dy + 6.8, dtitle, ha='center', va='center', fontsize=7.5, fontweight='bold', color='#065F46')
        ax.text(dx + 6.9, dy + 3, ddesc, ha='center', va='center', fontsize=6.5, color='#374151', multialignment='center')

    plt.tight_layout()
    fig.savefig(os.path.join(output_dir, 'architecture_diagram.png'), dpi=300, bbox_inches='tight')
    plt.close()
    print("Created architecture_diagram.png")

# -------------------------------------------------------------
# 2. USE CASE DIAGRAM
# -------------------------------------------------------------
def create_use_case_diagram():
    fig, ax = plt.subplots(figsize=(12, 9), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    ax.text(50, 97, 'VENDORA – UML USE CASE DIAGRAM', ha='center', va='center',
            fontsize=15, fontweight='bold', color='#1E293B')
    ax.text(50, 94, 'Role-Based Actor Interactions across System Boundary',
            ha='center', va='center', fontsize=10, color='#64748B')

    # System boundary box
    sys_box = patches.FancyBboxPatch((24, 4), 52, 87, boxstyle="round,pad=1",
                                    facecolor='#F8FAFC', edgecolor='#334155', linewidth=2, linestyle='--')
    ax.add_patch(sys_box)
    ax.text(50, 88.5, 'VENDORA SYSTEM BOUNDARY', ha='center', va='center',
            fontsize=11, fontweight='bold', color='#1E293B')

    # Actors: Admin (Left) and Vendor (Right)
    # Draw Admin Actor
    ax.plot([10, 10], [55, 62], color='#7C3AED', lw=3) # body
    ax.plot([5, 15], [59, 59], color='#7C3AED', lw=3)  # arms
    ax.plot([10, 5], [55, 48], color='#7C3AED', lw=3)  # left leg
    ax.plot([10, 15], [55, 48], color='#7C3AED', lw=3) # right leg
    head_admin = patches.Circle((10, 64.5), 2.5, facecolor='#EDE9FE', edgecolor='#7C3AED', lw=2)
    ax.add_patch(head_admin)
    ax.text(10, 44, 'Procurement Admin\n(Lead Evaluator)', ha='center', va='center',
            fontsize=9.5, fontweight='bold', color='#5B21B6')

    # Draw Vendor Actor
    ax.plot([90, 90], [55, 62], color='#EC4899', lw=3) # body
    ax.plot([85, 95], [59, 59], color='#EC4899', lw=3)  # arms
    ax.plot([90, 85], [55, 48], color='#EC4899', lw=3)  # left leg
    ax.plot([90, 95], [55, 48], color='#EC4899', lw=3) # right leg
    head_vendor = patches.Circle((90, 64.5), 2.5, facecolor='#FDF2F8', edgecolor='#EC4899', lw=2)
    ax.add_patch(head_vendor)
    ax.text(90, 44, 'Supplier Partner\n(Vendor User)', ha='center', va='center',
            fontsize=9.5, fontweight='bold', color='#9D174D')

    # Use Cases (Ellipses)
    use_cases = [
        ('Authenticate User & Issue JWT', 50, 83, True, True),
        ('Review & Process Onboarding Applications', 50, 75, True, False),
        ('Complete 6-Step Supplier Onboarding Wizard', 50, 67, False, True),
        ('Maintain Supplier Directory & Profiles', 50, 59, True, False),
        ('Upload Compliance Documents (GST, PAN)', 50, 51, False, True),
        ('Verify / Reject Compliance Documents', 50, 43, True, False),
        ('Conduct 6-Factor Vendor Performance Audit', 50, 35, True, False),
        ('Issue & Calculate Purchase Orders (Tax & Subtotal)', 50, 27, True, False),
        ('Update & Track PO Lifecycle Status', 50, 19, True, True),
        ('Analyze Executive Spend & Performance Metrics', 50, 11, True, False),
    ]

    for uc, x, y, admin_linked, vendor_linked in use_cases:
        ellipse = patches.Ellipse((x, y), 38, 5.8, facecolor='#FFFFFF', edgecolor='#6366F1', lw=1.5)
        ax.add_patch(ellipse)
        ax.text(x, y, uc, ha='center', va='center', fontsize=8.5, fontweight='bold', color='#1E293B')

        if admin_linked:
            ax.plot([14, x - 19], [58, y], color='#7C3AED', lw=1.2, linestyle='-')
        if vendor_linked:
            ax.plot([86, x + 19], [58, y], color='#EC4899', lw=1.2, linestyle='-')

    plt.tight_layout()
    fig.savefig(os.path.join(output_dir, 'use_case_diagram.png'), dpi=300, bbox_inches='tight')
    plt.close()
    print("Created use_case_diagram.png")

# -------------------------------------------------------------
# 3. ENTITY RELATIONSHIP (ER) / SCHEMA DIAGRAM
# -------------------------------------------------------------
def create_er_diagram():
    fig, ax = plt.subplots(figsize=(13, 9.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    ax.text(50, 97.5, 'VENDORA – ENTITY RELATIONSHIP (ER) DIAGRAM', ha='center', va='center',
            fontsize=15, fontweight='bold', color='#1E293B')
    ax.text(50, 94.5, 'Relational Mapping of MongoDB Collections, Mongoose References, and Embedded Schemas',
            ha='center', va='center', fontsize=10, color='#64748B')

    def draw_entity(x, y, w, h, title, fields, color_header='#7C3AED'):
        # Header
        box_hdr = patches.FancyBboxPatch((x, y + h - 4.5), w, 4.5, boxstyle="round,pad=0.2",
                                        facecolor=color_header, edgecolor=color_header, lw=1)
        ax.add_patch(box_hdr)
        ax.text(x + w/2, y + h - 2.2, title, ha='center', va='center', fontsize=9, fontweight='bold', color='#FFFFFF')

        # Body
        box_body = patches.FancyBboxPatch((x, y), w, h - 4.5, boxstyle="round,pad=0.2",
                                         facecolor='#FFFFFF', edgecolor='#CBD5E1', lw=1.2)
        ax.add_patch(box_body)

        for idx, (f_name, f_type, is_pk, is_fk) in enumerate(fields):
            fy = y + h - 7 - (idx * 2.5)
            badge = 'PK ' if is_pk else ('FK ' if is_fk else '   ')
            prefix_color = '#DC2626' if is_pk else ('#2563EB' if is_fk else '#6B7280')
            ax.text(x + 1.2, fy, badge, fontsize=7.5, fontweight='bold', color=prefix_color)
            ax.text(x + 5, fy, f_name, fontsize=8, color='#1F2937')
            ax.text(x + w - 1.2, fy, f_type, ha='right', fontsize=7.5, color='#64748B', style='italic')

    # 1. USER
    user_fields = [
        ('_id', 'ObjectId', True, False),
        ('name', 'String', False, False),
        ('email', 'String (Unique)', False, False),
        ('password', 'String (Bcrypt)', False, False),
        ('role', "Enum ('admin','vendor')", False, False),
        ('vendorProfile', 'ObjectId -> VENDOR', False, True),
        ('phone', 'String', False, False),
        ('isActive', 'Boolean', False, False),
    ]
    draw_entity(3, 64, 28, 27, 'USER ENTITY', user_fields, '#4F46E5')

    # 2. VENDOR
    vendor_fields = [
        ('_id', 'ObjectId', True, False),
        ('vendorId', 'String (VND-xxxx)', False, False),
        ('user', 'ObjectId -> USER', False, True),
        ('companyName', 'String', False, False),
        ('industry', 'String', False, False),
        ('gstNumber / panNumber', 'String', False, False),
        ('contactPerson / email', 'String', False, False),
        ('bankName / accountNumber', 'String', False, False),
        ('status', "Enum ('ACTIVE',...)", False, False),
        ('onboardingStep / completed', 'Number / Boolean', False, False),
        ('performanceScore', 'Number (1.0-5.0)', False, False),
        ('ratingTier', "Enum ('Excellent',...)", False, False),
    ]
    draw_entity(36, 52, 32, 39, 'VENDOR ENTITY', vendor_fields, '#7C3AED')

    # 3. PURCHASE ORDER
    po_fields = [
        ('_id', 'ObjectId', True, False),
        ('poNumber', 'String (PO-YYYY-xxxx)', False, False),
        ('vendor', 'ObjectId -> VENDOR', False, True),
        ('createdBy', 'ObjectId -> USER', False, True),
        ('poDate / expectedDelivery', 'Date', False, False),
        ('paymentTerms / shipping', 'String', False, False),
        ('items[] (Embedded Items)', 'Array [poItemSchema]', False, False),
        ('subtotal / taxTotal', 'Number (INR)', False, False),
        ('grandTotal', 'Number (INR)', False, False),
        ('status', "Enum ('DRAFT',...)", False, False),
        ('statusHistory[]', 'Array [HistorySchema]', False, False),
    ]
    draw_entity(73, 54, 25, 37, 'PURCHASE ORDER ENTITY', po_fields, '#0D9488')

    # 4. VENDOR EVALUATION
    eval_fields = [
        ('_id', 'ObjectId', True, False),
        ('vendor', 'ObjectId -> VENDOR', False, True),
        ('evaluatedBy', 'ObjectId -> USER', False, True),
        ('criteria.quality (1-5)', 'Number', False, False),
        ('criteria.delivery (1-5)', 'Number', False, False),
        ('criteria.pricing (1-5)', 'Number', False, False),
        ('criteria.communication', 'Number', False, False),
        ('criteria.reliability (1-5)', 'Number', False, False),
        ('criteria.compliance (1-5)', 'Number', False, False),
        ('overallScore', 'Number (Computed)', False, False),
        ('ratingTier', 'String (Allocated)', False, False),
        ('evaluationDate', 'Date', False, False),
    ]
    draw_entity(3, 8, 30, 39, 'VENDOR EVALUATION ENTITY', eval_fields, '#D97706')

    # 5. DOCUMENT
    doc_fields = [
        ('_id', 'ObjectId', True, False),
        ('vendor', 'ObjectId -> VENDOR', False, True),
        ('documentType', 'String (GST, PAN, ...)', False, False),
        ('documentName', 'String', False, False),
        ('fileName / fileUrl', 'String (Uploads)', False, False),
        ('fileSize / mimeType', 'Number / String', False, False),
        ('status', "Enum ('PENDING',...)", False, False),
        ('uploadedBy / verifiedBy', 'ObjectId -> USER', False, True),
    ]
    draw_entity(38, 8, 29, 29, 'DOCUMENT ENTITY', doc_fields, '#DB2777')

    # 6. NOTIFICATION
    notif_fields = [
        ('_id', 'ObjectId', True, False),
        ('recipient', 'ObjectId -> USER', False, True),
        ('title', 'String', False, False),
        ('message', 'String', False, False),
        ('type', "Enum ('info','success',...)", False, False),
        ('link', 'String (Route)', False, False),
        ('isRead', 'Boolean', False, False),
        ('createdAt', 'Date', False, False),
    ]
    draw_entity(72, 8, 26, 29, 'NOTIFICATION ENTITY', notif_fields, '#475569')

    # Cardinality relationship lines
    # USER (1) to VENDOR (1)
    ax.annotate('', xy=(36, 75), xytext=(31, 75),
                arrowprops=dict(arrowstyle="<->", color='#4F46E5', lw=2))
    ax.text(33.5, 76.5, '1 : 1', ha='center', fontsize=8, fontweight='bold', color='#4F46E5')

    # VENDOR (1) to PURCHASE ORDER (N)
    ax.annotate('', xy=(73, 75), xytext=(68, 75),
                arrowprops=dict(arrowstyle="->", color='#0D9488', lw=2))
    ax.text(70.5, 76.5, '1 : N', ha='center', fontsize=8, fontweight='bold', color='#0D9488')

    # VENDOR (1) to EVALUATION (N)
    ax.annotate('', xy=(33, 30), xytext=(40, 52),
                arrowprops=dict(arrowstyle="->", color='#D97706', lw=2))
    ax.text(37, 40, '1 : N', ha='center', fontsize=8, fontweight='bold', color='#D97706')

    # VENDOR (1) to DOCUMENT (N)
    ax.annotate('', xy=(50, 37), xytext=(50, 52),
                arrowprops=dict(arrowstyle="->", color='#DB2777', lw=2))
    ax.text(51.5, 45, '1 : N', ha='left', fontsize=8, fontweight='bold', color='#DB2777')

    # USER (1) to NOTIFICATION (N)
    ax.annotate('', xy=(80, 37), xytext=(20, 64),
                arrowprops=dict(arrowstyle="->", color='#475569', lw=1.5, linestyle=':'))
    ax.text(50, 50, '1 : N Recipient', ha='center', fontsize=8, fontweight='bold', color='#475569')

    plt.tight_layout()
    fig.savefig(os.path.join(output_dir, 'er_diagram.png'), dpi=300, bbox_inches='tight')
    plt.close()
    print("Created er_diagram.png")

# -------------------------------------------------------------
# 4. DATA FLOW DIAGRAM (DFD LEVEL 0 & LEVEL 1)
# -------------------------------------------------------------
def create_dfd_diagram():
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 11), dpi=300)
    
    # DFD LEVEL 0 (Context Diagram)
    ax1.set_xlim(0, 100)
    ax1.set_ylim(0, 45)
    ax1.axis('off')
    ax1.text(50, 42, 'DATA FLOW DIAGRAM – LEVEL 0 (CONTEXT LEVEL)', ha='center', va='center',
             fontsize=12, fontweight='bold', color='#1E293B')

    # Entity: Supplier Vendor
    ent_v = patches.Rectangle((4, 14), 18, 16, facecolor='#FDF2F8', edgecolor='#EC4899', lw=2)
    ax1.add_patch(ent_v)
    ax1.text(13, 22, 'EXTERNAL ENTITY:\nSUPPLIER / VENDOR', ha='center', va='center',
             fontsize=8.5, fontweight='bold', color='#9D174D')

    # Central System Process
    proc_0 = patches.Circle((50, 22), 11, facecolor='#EDE9FE', edgecolor='#7C3AED', lw=2.5)
    ax1.add_patch(proc_0)
    ax1.text(50, 24, '0.0\nVENDORA\nSYSTEM', ha='center', va='center',
             fontsize=10, fontweight='bold', color='#5B21B6')

    # Entity: Procurement Admin
    ent_a = patches.Rectangle((78, 14), 18, 16, facecolor='#F5F3FF', edgecolor='#8B5CF6', lw=2)
    ax1.add_patch(ent_a)
    ax1.text(87, 22, 'EXTERNAL ENTITY:\nPROCUREMENT ADMIN', ha='center', va='center',
             fontsize=8.5, fontweight='bold', color='#5B21B6')

    # Flows Vendor <-> Process
    ax1.annotate('', xy=(39, 26), xytext=(22, 26), arrowprops=dict(arrowstyle="->", color='#EC4899', lw=1.8))
    ax1.text(30.5, 28, 'KYC, Onboarding, PO Updates', ha='center', fontsize=7.5, color='#9D174D')

    ax1.annotate('', xy=(22, 18), xytext=(39, 18), arrowprops=dict(arrowstyle="->", color='#EC4899', lw=1.8))
    ax1.text(30.5, 15.5, 'PO Directives, Scorecards, Alerts', ha='center', fontsize=7.5, color='#9D174D')

    # Flows Process <-> Admin
    ax1.annotate('', xy=(61, 26), xytext=(78, 26), arrowprops=dict(arrowstyle="->", color='#7C3AED', lw=1.8))
    ax1.text(69.5, 28, 'Approvals, PO Creation, Audits', ha='center', fontsize=7.5, color='#5B21B6')

    ax1.annotate('', xy=(78, 18), xytext=(61, 18), arrowprops=dict(arrowstyle="->", color='#7C3AED', lw=1.8))
    ax1.text(69.5, 15.5, 'Analytics, Supplier Logs, Reports', ha='center', fontsize=7.5, color='#5B21B6')

    # DFD LEVEL 1 (Decomposition)
    ax2.set_xlim(0, 100)
    ax2.set_ylim(0, 55)
    ax2.axis('off')
    ax2.text(50, 52, 'DATA FLOW DIAGRAM – LEVEL 1 (PROCESS DECOMPOSITION)', ha='center', va='center',
             fontsize=12, fontweight='bold', color='#1E293B')

    processes = [
        ('1.0', 'Authentication\n& Session Service', 14, 38, '#F0FDF4', '#10B981'),
        ('2.0', 'Onboarding &\nKYC Pipeline', 38, 38, '#EDE9FE', '#7C3AED'),
        ('3.0', 'Performance\nEvaluation Engine', 62, 38, '#FEF3C7', '#F59E0B'),
        ('4.0', 'PO Lifecycle &\nTax Calculation', 86, 38, '#E0F2FE', '#0284C7'),
    ]

    for pid, pname, cx, cy, bg, border in processes:
        c = patches.Circle((cx, cy), 7.5, facecolor=bg, edgecolor=border, lw=2)
        ax2.add_patch(c)
        ax2.text(cx, cy + 2.5, pid, ha='center', va='center', fontsize=8.5, fontweight='bold', color='#1E293B')
        ax2.text(cx, cy - 2, pname, ha='center', va='center', fontsize=7, color='#1E293B')

    # Data Stores
    stores = [
        ('D1: Users Store', 14, 14),
        ('D2: Vendors Store', 38, 14),
        ('D3: Evaluations Store', 62, 14),
        ('D4: Purchase Orders Store', 86, 14),
    ]

    for sname, sx, sy in stores:
        # Open ended rectangle for DFD Data Store
        ax2.plot([sx - 10, sx + 10], [sy + 4, sy + 4], color='#334155', lw=1.8)
        ax2.plot([sx - 10, sx + 10], [sy - 4, sy - 4], color='#334155', lw=1.8)
        ax2.plot([sx - 10, sx - 10], [sy - 4, sy + 4], color='#334155', lw=1.8)
        ax2.text(sx, sy, sname, ha='center', va='center', fontsize=8, fontweight='bold', color='#1E293B')

    # Connections between processes and data stores
    for idx in range(4):
        px = processes[idx][2]
        ax2.annotate('', xy=(px, 18), xytext=(px, 30.5),
                     arrowprops=dict(arrowstyle="<->", color='#475569', lw=1.5))

    # Cross process data links
    ax2.annotate('', xy=(30.5, 38), xytext=(21.5, 38), arrowprops=dict(arrowstyle="->", color='#64748B', lw=1.2))
    ax2.annotate('', xy=(54.5, 38), xytext=(45.5, 38), arrowprops=dict(arrowstyle="->", color='#64748B', lw=1.2))
    ax2.annotate('', xy=(78.5, 38), xytext=(69.5, 38), arrowprops=dict(arrowstyle="->", color='#64748B', lw=1.2))

    plt.tight_layout()
    fig.savefig(os.path.join(output_dir, 'data_flow_diagram.png'), dpi=300, bbox_inches='tight')
    plt.close()
    print("Created data_flow_diagram.png")

# -------------------------------------------------------------
# 5. PURCHASE ORDER LIFECYCLE FLOWCHART
# -------------------------------------------------------------
def create_po_lifecycle_flowchart():
    fig, ax = plt.subplots(figsize=(11, 7.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    ax.text(50, 96, 'VENDORA – PURCHASE ORDER LIFECYCLE STATE MACHINE', ha='center', va='center',
            fontsize=14, fontweight='bold', color='#1E293B')
    ax.text(50, 92, 'Sequential Milestones, Role Governance, and Automatic Financial Audits',
            ha='center', va='center', fontsize=9.5, color='#64748B')

    stages = [
        ('1. DRAFT', 'PO Drafted by Admin\nLine items & GST added', 10, 72, '#94A3B8'),
        ('2. PENDING APPROVAL', 'Submitted for Internal Review\nAuto PO Number Generated', 35, 72, '#F59E0B'),
        ('3. APPROVED', 'Authorized by Procurement Lead\nVendor Notified in Real-time', 60, 72, '#8B5CF6'),
        ('4. PROCESSING', 'Acknowledged by Vendor\nManufacturing / Packing underway', 85, 72, '#3B82F6'),
        ('5. SHIPPED', 'Consignment Dispatched\nLogistics Carrier Tracking Active', 85, 30, '#EC4899'),
        ('6. DELIVERED', 'Consignment Arrived at Dock\nPhysical QC Inspection verified', 60, 30, '#06B6D4'),
        ('7. COMPLETED', 'Goods Accepted & Passed\nFinal Financial Settlement Ready', 35, 30, '#10B981'),
    ]

    for title, desc, cx, cy, col in stages:
        b = patches.FancyBboxPatch((cx - 10, cy - 8), 20, 16, boxstyle="round,pad=0.5",
                                   facecolor='#FFFFFF', edgecolor=col, lw=2.2)
        ax.add_patch(b)
        # Header strip inside box
        hdr = patches.FancyBboxPatch((cx - 10, cy + 3.5), 20, 4.5, boxstyle="round,pad=0.2",
                                    facecolor=col, edgecolor=col, lw=1)
        ax.add_patch(hdr)
        ax.text(cx, cy + 5.7, title, ha='center', va='center', fontsize=8, fontweight='bold', color='#FFFFFF')
        ax.text(cx, cy - 2, desc, ha='center', va='center', fontsize=6.8, color='#374151', multialignment='center')

    # Connections along lifecycle
    # 1 -> 2
    ax.annotate('', xy=(25, 72), xytext=(20, 72), arrowprops=dict(arrowstyle="->", color='#64748B', lw=2))
    # 2 -> 3
    ax.annotate('', xy=(50, 72), xytext=(45, 72), arrowprops=dict(arrowstyle="->", color='#64748B', lw=2))
    # 3 -> 4
    ax.annotate('', xy=(75, 72), xytext=(70, 72), arrowprops=dict(arrowstyle="->", color='#64748B', lw=2))
    # 4 -> 5 (down)
    ax.annotate('', xy=(85, 38), xytext=(85, 64), arrowprops=dict(arrowstyle="->", color='#64748B', lw=2))
    # 5 -> 6 (left)
    ax.annotate('', xy=(70, 30), xytext=(75, 30), arrowprops=dict(arrowstyle="->", color='#64748B', lw=2))
    # 6 -> 7 (left)
    ax.annotate('', xy=(45, 30), xytext=(50, 30), arrowprops=dict(arrowstyle="->", color='#64748B', lw=2))

    # Alternate Cancelled State Box
    b_cancel = patches.FancyBboxPatch((0, 22), 20, 16, boxstyle="round,pad=0.5",
                                      facecolor='#FEF2F2', edgecolor='#EF4444', lw=2)
    ax.add_patch(b_cancel)
    ax.text(10, 33, 'CANCELLED STATE', ha='center', va='center', fontsize=8.5, fontweight='bold', color='#B91C1C')
    ax.text(10, 26, 'Terminated by Admin\nwith Audit Remarks', ha='center', va='center', fontsize=7, color='#7F1D1D')

    # Arrow from Pending/Approved to Cancelled
    ax.annotate('', xy=(10, 38), xytext=(35, 64),
                arrowprops=dict(arrowstyle="->", color='#EF4444', lw=1.8, linestyle='--'))
    ax.text(20, 52, 'Admin Rejection / Cancel', ha='center', fontsize=7, color='#EF4444', rotation=40)

    plt.tight_layout()
    fig.savefig(os.path.join(output_dir, 'po_lifecycle_flowchart.png'), dpi=300, bbox_inches='tight')
    plt.close()
    print("Created po_lifecycle_flowchart.png")

# -------------------------------------------------------------
# 6. SUPPLIER ONBOARDING 6-STEP WORKFLOW FLOWCHART
# -------------------------------------------------------------
def create_onboarding_flowchart():
    fig, ax = plt.subplots(figsize=(11, 8), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    ax.text(50, 96, 'VENDORA – 6-STEP SUPPLIER ONBOARDING PIPELINE', ha='center', va='center',
            fontsize=14, fontweight='bold', color='#1E293B')
    ax.text(50, 92, 'Step-by-Step Supplier KYC Verification & Admin Review Decision Flow',
            ha='center', va='center', fontsize=9.5, color='#64748B')

    steps = [
        ('Step 1', 'Company Details\n(Name, GST, PAN, Industry)', 12, 75),
        ('Step 2', 'Contact Liaison\n(Person, Email, Phone)', 37, 75),
        ('Step 3', 'Facility Address\n(Street, City, State, Pin)', 62, 75),
        ('Step 4', 'Capabilities\n(Turnover, Experience)', 87, 75),
        ('Step 5', 'Banking Coordinates\n(Bank Name, A/C, IFSC)', 87, 45),
        ('Step 6', 'Document Uploads\n(GST/PAN/Cheque Proofs)', 62, 45),
    ]

    for stitle, sdesc, sx, sy in steps:
        b = patches.FancyBboxPatch((sx - 10, sy - 8), 20, 16, boxstyle="round,pad=0.4",
                                   facecolor='#FFFFFF', edgecolor='#7C3AED', lw=1.8)
        ax.add_patch(b)
        ax.text(sx, sy + 4, stitle, ha='center', va='center', fontsize=8.5, fontweight='bold', color='#7C3AED')
        ax.text(sx, sy - 2.5, sdesc, ha='center', va='center', fontsize=7, color='#374151', multialignment='center')

    # Step connectors
    ax.annotate('', xy=(27, 75), xytext=(22, 75), arrowprops=dict(arrowstyle="->", color='#7C3AED', lw=2))
    ax.annotate('', xy=(52, 75), xytext=(47, 75), arrowprops=dict(arrowstyle="->", color='#7C3AED', lw=2))
    ax.annotate('', xy=(77, 75), xytext=(72, 75), arrowprops=dict(arrowstyle="->", color='#7C3AED', lw=2))
    ax.annotate('', xy=(87, 53), xytext=(87, 67), arrowprops=dict(arrowstyle="->", color='#7C3AED', lw=2))
    ax.annotate('', xy=(72, 45), xytext=(77, 45), arrowprops=dict(arrowstyle="->", color='#7C3AED', lw=2))

    # Submission diamond
    sub_diamond = patches.Polygon([[37, 45], [42, 50], [47, 45], [42, 40]], closed=True,
                                  facecolor='#EDE9FE', edgecolor='#6D28D9', lw=2)
    ax.add_patch(sub_diamond)
    ax.text(42, 45, 'Final\nSubmit?', ha='center', va='center', fontsize=7.5, fontweight='bold', color='#4C1D95')

    ax.annotate('', xy=(47, 45), xytext=(52, 45), arrowprops=dict(arrowstyle="<-", color='#7C3AED', lw=2))

    # Decision branches
    ax.annotate('', xy=(42, 33), xytext=(42, 40), arrowprops=dict(arrowstyle="->", color='#7C3AED', lw=2))
    ax.text(43.5, 36.5, 'Admin Inspection', fontsize=7.5, color='#4C1D95')

    decisions = [
        ('APPROVE & ACTIVATE', 'Vendor Status -> ACTIVE\nIssue VND-xxxx ID\nAccount Fully Unlocked', 15, 18, '#10B981', '#ECFDF5'),
        ('REQUEST CHANGES', 'Status -> UNDER REVIEW\nAdmin Feedback Remarks Sent\nVendor Edits Resubmitted', 42, 18, '#F59E0B', '#FFFBEB'),
        ('REJECT APPLICATION', 'Vendor Status -> REJECTED\nOfficial Reason Logged\nApplication Terminated', 75, 18, '#EF4444', '#FEF2F2'),
    ]

    for dtitle, ddesc, dx, dy, col, bg in decisions:
        b = patches.FancyBboxPatch((dx - 12, dy - 8), 24, 16, boxstyle="round,pad=0.4",
                                   facecolor=bg, edgecolor=col, lw=2)
        ax.add_patch(b)
        ax.text(dx, dy + 4.5, dtitle, ha='center', va='center', fontsize=8, fontweight='bold', color=col)
        ax.text(dx, dy - 2, ddesc, ha='center', va='center', fontsize=7, color='#1F2937', multialignment='center')

    ax.annotate('', xy=(15, 26), xytext=(36, 33), arrowprops=dict(arrowstyle="->", color='#10B981', lw=2))
    ax.annotate('', xy=(42, 26), xytext=(42, 33), arrowprops=dict(arrowstyle="->", color='#F59E0B', lw=2))
    ax.annotate('', xy=(75, 26), xytext=(48, 33), arrowprops=dict(arrowstyle="->", color='#EF4444', lw=2))

    plt.tight_layout()
    fig.savefig(os.path.join(output_dir, 'onboarding_flowchart.png'), dpi=300, bbox_inches='tight')
    plt.close()
    print("Created onboarding_flowchart.png")

# -------------------------------------------------------------
# 7. VENDOR EVALUATION SCORING ALGORITHM FLOWCHART
# -------------------------------------------------------------
def create_evaluation_flowchart():
    fig, ax = plt.subplots(figsize=(11, 8.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    ax.text(50, 96.5, 'VENDORA – 6-CRITERIA PERFORMANCE EVALUATION MATRIX', ha='center', va='center',
            fontsize=14, fontweight='bold', color='#1E293B')
    ax.text(50, 93, 'Standardized Evaluation Methodology, Automated Rating Tier, and Post-Save Aggregation',
            ha='center', va='center', fontsize=9.5, color='#64748B')

    # 6 Criteria Inputs
    c_box = patches.FancyBboxPatch((10, 68), 80, 20, boxstyle="round,pad=0.6",
                                  facecolor='#F5F3FF', edgecolor='#8B5CF6', lw=2)
    ax.add_patch(c_box)
    ax.text(50, 85, 'INPUT: 6 STANDARDIZED PERFORMANCE DIMENSIONS (RATED 1 TO 5)',
            ha='center', va='center', fontsize=9.5, fontweight='bold', color='#5B21B6')

    crit = [
        ('1. Product Quality', 'Defect-free rate, specs match'),
        ('2. Delivery Timeliness', 'On-time delivery performance'),
        ('3. Pricing Value', 'Price competitive vs benchmarks'),
        ('4. Communication', 'Responsiveness to queries'),
        ('5. Reliability', 'Commitment fulfillment SLA'),
        ('6. Compliance', 'Regulatory, tax, safety norms'),
    ]
    for idx, (cname, cdesc) in enumerate(crit):
        cx = 13 + (idx % 3) * 26
        cy = 76 if idx < 3 else 70
        cb = patches.FancyBboxPatch((cx, cy - 2.5), 24, 5, boxstyle="round,pad=0.2",
                                    facecolor='#FFFFFF', edgecolor='#C4B5FD', lw=1)
        ax.add_patch(cb)
        ax.text(cx + 1, cy, cname, fontsize=7.5, fontweight='bold', color='#4C1D95')

    # Formula Calculation Box
    ax.annotate('', xy=(50, 58), xytext=(50, 68), arrowprops=dict(arrowstyle="->", color='#7C3AED', lw=2.2))
    f_box = patches.FancyBboxPatch((20, 48), 60, 10, boxstyle="round,pad=0.5",
                                  facecolor='#FFFFFF', edgecolor='#059669', lw=2)
    ax.add_patch(f_box)
    ax.text(50, 54.5, 'ARITHMETIC OVERALL SCORE CALCULATION (Pre-Save Hook)',
            ha='center', va='center', fontsize=9, fontweight='bold', color='#065F46')
    ax.text(50, 50.5, 'Overall Score = (Quality + Delivery + Pricing + Communication + Reliability + Compliance) / 6',
            ha='center', va='center', fontsize=7.8, fontweight='bold', color='#047857')

    # Rating Tier Classification
    ax.annotate('', xy=(50, 39), xytext=(50, 48), arrowprops=dict(arrowstyle="->", color='#059669', lw=2.2))

    tiers = [
        ('EXCELLENT TIER', 'Score >= 4.5\nPreferred Partner\nPriority PO Issuance', 15, 28, '#10B981', '#ECFDF5'),
        ('GOOD TIER', '3.5 <= Score < 4.5\nStandard Compliant\nRegular Ordering', 38, 28, '#7C3AED', '#F5F3FF'),
        ('AVERAGE TIER', '2.5 <= Score < 3.5\nMarginal Performance\nRequires Monitoring', 62, 28, '#F59E0B', '#FFFBEB'),
        ('POOR TIER', 'Score < 2.5\nHigh Risk Supplier\nProbation / Suspended', 85, 28, '#EF4444', '#FEF2F2'),
    ]

    for tname, tdesc, tx, ty, col, bg in tiers:
        b = patches.FancyBboxPatch((tx - 10, ty - 8), 20, 16, boxstyle="round,pad=0.4",
                                   facecolor=bg, edgecolor=col, lw=2)
        ax.add_patch(b)
        ax.text(tx, ty + 5, tname, ha='center', va='center', fontsize=8, fontweight='bold', color=col)
        ax.text(tx, ty - 2, tdesc, ha='center', va='center', fontsize=6.8, color='#1F2937', multialignment='center')

    # Post-Save Aggregation Box
    for tx in [15, 38, 62, 85]:
        ax.annotate('', xy=(50, 10), xytext=(tx, 20),
                    arrowprops=dict(arrowstyle="->", color='#64748B', lw=1.2))

    agg_box = patches.FancyBboxPatch((15, 2), 70, 8, boxstyle="round,pad=0.4",
                                    facecolor='#F8FAFC', edgecolor='#334155', lw=1.8)
    ax.add_patch(agg_box)
    ax.text(50, 6.8, 'POST-SAVE ASYNC HOOK: VENDOR PROFILE RE-AGGREGATION',
            ha='center', va='center', fontsize=8.5, fontweight='bold', color='#1E293B')
    ax.text(50, 4, 'Recalculates Cumulative Vendor Average & Updates Vendor.performanceScore & Vendor.ratingTier in MongoDB',
            ha='center', va='center', fontsize=7.2, color='#475569')

    plt.tight_layout()
    fig.savefig(os.path.join(output_dir, 'evaluation_flowchart.png'), dpi=300, bbox_inches='tight')
    plt.close()
    print("Created evaluation_flowchart.png")

# Execute all diagram generators
create_architecture_diagram()
create_use_case_diagram()
create_er_diagram()
create_dfd_diagram()
create_po_lifecycle_flowchart()
create_onboarding_flowchart()
create_evaluation_flowchart()
print("All 7 professional diagrams successfully generated at 300 DPI!")
