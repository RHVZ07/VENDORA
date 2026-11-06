import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

output_dir = 'PROJECT_REPORT/diagrams'

# 1. SCREENSHOT: LOGIN PORTAL
def create_login_screenshot():
    fig, ax = plt.subplots(figsize=(10, 6.2), dpi=250)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Browser window chrome
    win = patches.FancyBboxPatch((2, 2), 96, 96, boxstyle="round,pad=0.5", facecolor='#F8FAFC', edgecolor='#CBD5E1', lw=1.5)
    ax.add_patch(win)
    # Browser bar
    bar = patches.Rectangle((2, 92), 96, 6, facecolor='#E2E8F0')
    ax.add_patch(bar)
    for i, c in enumerate(['#EF4444', '#F59E0B', '#10B981']):
        ax.add_patch(patches.Circle((5 + i*2.5, 95), 1, facecolor=c))
    ax.text(50, 95, 'https://vendora-procure.internal/login', ha='center', va='center', fontsize=7.5, color='#475569')

    # Left Brand Side
    left = patches.Rectangle((2, 2), 48, 90, facecolor='#1E1B4B')
    ax.add_patch(left)
    ax.text(8, 80, 'VEN', fontsize=18, fontweight='bold', color='#FFFFFF')
    ax.text(20, 80, 'DORA', fontsize=18, fontweight='bold', color='#EC4899')
    ax.text(8, 73, 'Enterprise Vendor Management Platform', fontsize=8, color='#A5B4FC')

    ax.text(8, 60, 'Intelligent Supplier\nLifecycle & PO Tracking', fontsize=14, fontweight='bold', color='#FFFFFF')
    ax.text(8, 45, '• 6-Step Multi-Stage Supplier Onboarding\n• Real-Time GST & PAN Verification\n• 6-Factor Algorithmic Performance Audits\n• End-to-End Purchase Order State Machine',
            fontsize=8, color='#E0E7FF', linespacing=1.6)

    # Right Login Form Side
    ax.text(54, 78, 'Welcome Back', fontsize=14, fontweight='bold', color='#1E293B')
    ax.text(54, 73, 'Access your enterprise procurement command center', fontsize=7.5, color='#64748B')

    # Quick Demo Pills
    demo_box = patches.FancyBboxPatch((54, 58), 40, 12, boxstyle="round,pad=0.3", facecolor='#F5F3FF', edgecolor='#DDD6FE', lw=1)
    ax.add_patch(demo_box)
    ax.text(56, 66.5, 'Instant 1-Click Demo Login:', fontsize=7.5, fontweight='bold', color='#5B21B6')
    ax.add_patch(patches.FancyBboxPatch((56, 60), 17, 5, boxstyle="round,pad=0.2", facecolor='#7C3AED'))
    ax.text(64.5, 62.5, 'Admin Demo', ha='center', va='center', fontsize=7, color='#FFFFFF', fontweight='bold')
    ax.add_patch(patches.FancyBboxPatch((75, 60), 17, 5, boxstyle="round,pad=0.2", facecolor='#EC4899'))
    ax.text(83.5, 62.5, 'Vendor Demo', ha='center', va='center', fontsize=7, color='#FFFFFF', fontweight='bold')

    # Input Fields
    ax.text(54, 53, 'Work Email Address', fontsize=7.5, fontweight='bold', color='#334155')
    ax.add_patch(patches.FancyBboxPatch((54, 46), 40, 5.5, boxstyle="round,pad=0.2", facecolor='#FFFFFF', edgecolor='#CBD5E1', lw=1))
    ax.text(56, 48.7, 'admin@vendora.com', fontsize=7.5, color='#1E293B')

    ax.text(54, 41, 'Password', fontsize=7.5, fontweight='bold', color='#334155')
    ax.add_patch(patches.FancyBboxPatch((54, 34), 40, 5.5, boxstyle="round,pad=0.2", facecolor='#FFFFFF', edgecolor='#CBD5E1', lw=1))
    ax.text(56, 36.7, '••••••••••••', fontsize=7.5, color='#1E293B')

    # Sign In Button
    ax.add_patch(patches.FancyBboxPatch((54, 23), 40, 6.5, boxstyle="round,pad=0.3", facecolor='#7C3AED'))
    ax.text(74, 26.2, 'Sign In to VENDORA  ->', ha='center', va='center', fontsize=8.5, fontweight='bold', color='#FFFFFF')

    plt.tight_layout()
    fig.savefig(os.path.join(output_dir, 'screenshot_login.png'), dpi=250, bbox_inches='tight')
    plt.close()
    print("Created screenshot_login.png")

# 2. SCREENSHOT: ADMIN DASHBOARD
def create_admin_dashboard_screenshot():
    fig, ax = plt.subplots(figsize=(10, 6.2), dpi=250)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Frame
    ax.add_patch(patches.FancyBboxPatch((1, 1), 98, 98, boxstyle="round,pad=0.4", facecolor='#F8FAFC', edgecolor='#CBD5E1', lw=1.2))
    # Top navbar
    ax.add_patch(patches.Rectangle((1, 91), 98, 8, facecolor='#FFFFFF', edgecolor='#E2E8F0', lw=1))
    ax.text(5, 95, 'VENDORA', fontsize=11, fontweight='bold', color='#7C3AED')
    ax.text(20, 95, 'Dashboard  |  Vendors  |  Onboarding  |  Purchase Orders  |  Evaluations  |  Reports',
            fontsize=7.5, color='#64748B')
    ax.text(92, 95, 'Eleanor (Admin)', ha='right', fontsize=7.5, fontweight='bold', color='#1E293B')

    # Page Header
    ax.text(5, 85, 'Procurement Command Center', fontsize=12, fontweight='bold', color='#1E293B')
    ax.text(5, 82, 'Real-time metrics across 5 active vendors and ₹29.5L issued purchase orders', fontsize=7, color='#64748B')

    # 4 Stat Cards
    kpis = [
        ('TOTAL VENDORS', '5 Registered', '+2 this month', '#7C3AED', 5),
        ('PENDING ONBOARDING', '2 Applications', 'Requires review', '#F59E0B', 28),
        ('ACTIVE PURCHASE ORDERS', '4 In-Progress', '₹29,52,950 total', '#3B82F6', 51),
        ('AVERAGE AUDIT SCORE', '4.42 / 5.0', 'High compliance', '#10B981', 74),
    ]
    for title, val, sub, col, kx in kpis:
        ax.add_patch(patches.FancyBboxPatch((kx, 66), 21, 13, boxstyle="round,pad=0.3", facecolor='#FFFFFF', edgecolor='#E2E8F0', lw=1))
        ax.add_patch(patches.Rectangle((kx, 77), 21, 2, facecolor=col))
        ax.text(kx + 2, 74, title, fontsize=6.2, fontweight='bold', color='#64748B')
        ax.text(kx + 2, 70, val, fontsize=8.5, fontweight='bold', color='#1E293B')
        ax.text(kx + 2, 67.5, sub, fontsize=6, color=col)

    # 2 Charts Panels
    # Left Chart: Vendor Lifecycle Breakdown
    ax.add_patch(patches.FancyBboxPatch((5, 30), 44, 33, boxstyle="round,pad=0.3", facecolor='#FFFFFF', edgecolor='#E2E8F0', lw=1))
    ax.text(8, 59, 'Supplier Status Breakdown', fontsize=8, fontweight='bold', color='#1E293B')
    bars = [('Active', 3, '#10B981'), ('Pending', 1, '#F59E0B'), ('Under Review', 1, '#8B5CF6'), ('Approved', 0, '#3B82F6')]
    for idx, (bname, bval, bcol) in enumerate(bars):
        by = 53 - idx * 6
        ax.text(8, by, bname, fontsize=7, color='#475569')
        ax.add_patch(patches.Rectangle((22, by - 1), bval * 6 + 1, 3.5, facecolor=bcol))
        ax.text(24 + bval * 6, by + 0.5, str(bval), fontsize=7, fontweight='bold', color='#1E293B')

    # Right Chart: Monthly Spend
    ax.add_patch(patches.FancyBboxPatch((51, 30), 44, 33, boxstyle="round,pad=0.3", facecolor='#FFFFFF', edgecolor='#E2E8F0', lw=1))
    ax.text(54, 59, 'Procurement Spend Trajectory (₹ Lakhs)', fontsize=8, fontweight='bold', color='#1E293B')
    # Simulated area points
    pts = [(56, 36), (62, 40), (68, 38), (74, 46), (80, 48), (88, 52)]
    for i in range(len(pts) - 1):
        ax.plot([pts[i][0], pts[i+1][0]], [pts[i][1], pts[i+1][1]], color='#7C3AED', lw=2)
    ax.text(56, 33, 'Nov', fontsize=6.5, color='#64748B')
    ax.text(68, 33, 'Jan', fontsize=6.5, color='#64748B')
    ax.text(80, 33, 'Mar', fontsize=6.5, color='#64748B')
    ax.text(88, 33, 'Apr', fontsize=6.5, color='#64748B')

    # Bottom Table: Recent Orders
    ax.add_patch(patches.FancyBboxPatch((5, 5), 90, 22, boxstyle="round,pad=0.3", facecolor='#FFFFFF', edgecolor='#E2E8F0', lw=1))
    ax.text(8, 23, 'Recent Purchase Orders & State Milestones', fontsize=8, fontweight='bold', color='#1E293B')
    ax.text(8, 18, 'PO NUMBER           VENDOR NAME                           DELIVERY DATE       AMOUNT           STATUS',
            fontsize=6.8, fontweight='bold', color='#64748B')
    rows = [
        ('PO-2026-0001', 'Apex Microelectronics Ltd.', '15-Apr-2026', '₹6,49,000', 'COMPLETED', '#10B981'),
        ('PO-2026-0002', 'Zenith Logistics & Supply', '22-Apr-2026', '₹11,80,000', 'SHIPPED', '#EC4899'),
        ('PO-2026-0005', 'Quantum Alloy & Steel', '28-Apr-2026', '₹1,18,000', 'PROCESSING', '#3B82F6'),
    ]
    for idx, (pnum, vname, ddate, amt, st, sc) in enumerate(rows):
        ry = 13.5 - idx * 4
        ax.text(8, ry, f'{pnum:<18} {vname:<34} {ddate:<18} {amt:<16}', fontsize=6.8, color='#1E293B')
        ax.add_patch(patches.FancyBboxPatch((81, ry - 1), 12, 3.2, boxstyle="round,pad=0.1", facecolor=sc))
        ax.text(87, ry + 0.5, st, ha='center', va='center', fontsize=5.8, fontweight='bold', color='#FFFFFF')

    plt.tight_layout()
    fig.savefig(os.path.join(output_dir, 'screenshot_admin_dashboard.png'), dpi=250, bbox_inches='tight')
    plt.close()
    print("Created screenshot_admin_dashboard.png")

# 3. SCREENSHOT: ONBOARDING WIZARD
def create_onboarding_wizard_screenshot():
    fig, ax = plt.subplots(figsize=(10, 6.2), dpi=250)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    ax.add_patch(patches.FancyBboxPatch((2, 2), 96, 96, boxstyle="round,pad=0.4", facecolor='#F8FAFC', edgecolor='#CBD5E1', lw=1.2))
    ax.text(6, 92, 'VENDORA SUPPLIER ONBOARDING WIZARD', fontsize=12, fontweight='bold', color='#7C3AED')
    ax.text(6, 88.5, 'Step 1 of 6: Enterprise Company Information & Statutory Identifiers', fontsize=7.5, color='#64748B')

    # Stepper bar
    step_labels = ['1. Company', '2. Contact', '3. Address', '4. Capabilities', '5. Banking', '6. Documents']
    for idx, slab in enumerate(step_labels):
        sx = 8 + idx * 15
        is_active = (idx == 0)
        c_bg = '#7C3AED' if is_active else '#E2E8F0'
        c_fg = '#FFFFFF' if is_active else '#64748B'
        ax.add_patch(patches.Circle((sx + 2, 80), 2.5, facecolor=c_bg))
        ax.text(sx + 2, 80, str(idx + 1), ha='center', va='center', fontsize=7, fontweight='bold', color=c_fg)
        ax.text(sx + 6, 80, slab.split('. ')[1], va='center', fontsize=6.8, fontweight='bold' if is_active else 'normal', color='#1E293B')

    # Form Container
    ax.add_patch(patches.FancyBboxPatch((6, 10), 88, 63, boxstyle="round,pad=0.4", facecolor='#FFFFFF', edgecolor='#E2E8F0', lw=1))
    ax.text(10, 68, 'Corporate Registration & Legal Coordinates', fontsize=9.5, fontweight='bold', color='#1E293B')

    form_fields = [
        ('Company Legal Name *', 'Apex Microelectronics & Hardware Ltd.', 10, 56),
        ('Business Constitution *', 'Private Limited Company', 54, 56),
        ('Industry Classification *', 'Electronics & Hardware', 10, 44),
        ('Corporate Identity (CIN/Reg) *', 'U72900TN2020PTC134567', 54, 44),
        ('Goods & Services Tax (GSTIN) *', '33AAACA1234A1Z5', 10, 32),
        ('Permanent Account Number (PAN) *', 'AAACA1234A', 54, 32),
        ('Year Established', '2020', 10, 20),
        ('Employee Strength', '51-200 Employees', 54, 20),
    ]

    for lbl, val, fx, fy in form_fields:
        ax.text(fx, fy + 6.5, lbl, fontsize=7.2, fontweight='bold', color='#334155')
        ax.add_patch(patches.FancyBboxPatch((fx, fy), 38, 5.2, boxstyle="round,pad=0.2", facecolor='#F8FAFC', edgecolor='#CBD5E1', lw=0.8))
        ax.text(fx + 2, fy + 2.5, val, fontsize=7.5, color='#1E293B')

    # Next Button
    ax.add_patch(patches.FancyBboxPatch((72, 12), 20, 5.5, boxstyle="round,pad=0.2", facecolor='#7C3AED'))
    ax.text(82, 14.7, 'Save & Proceed ->', ha='center', va='center', fontsize=7.5, fontweight='bold', color='#FFFFFF')

    plt.tight_layout()
    fig.savefig(os.path.join(output_dir, 'screenshot_onboarding_wizard.png'), dpi=250, bbox_inches='tight')
    plt.close()
    print("Created screenshot_onboarding_wizard.png")

# 4. SCREENSHOT: PURCHASE ORDER DETAILS & TIMELINE
def create_po_details_screenshot():
    fig, ax = plt.subplots(figsize=(10, 6.2), dpi=250)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    ax.add_patch(patches.FancyBboxPatch((2, 2), 96, 96, boxstyle="round,pad=0.4", facecolor='#F8FAFC', edgecolor='#CBD5E1', lw=1.2))
    ax.text(6, 92, 'PURCHASE ORDER: PO-2026-0005', fontsize=12, fontweight='bold', color='#1E293B')
    ax.add_patch(patches.FancyBboxPatch((48, 90.5), 18, 3.5, boxstyle="round,pad=0.2", facecolor='#3B82F6'))
    ax.text(57, 92.2, 'STATUS: PROCESSING', ha='center', va='center', fontsize=6.5, fontweight='bold', color='#FFFFFF')
    ax.text(6, 88, 'Issued to: Quantum Alloy & Steel Fabricators | Delivery Target: 28-Apr-2026', fontsize=7.5, color='#64748B')

    # PO Timeline Stepper
    t_stages = ['DRAFT', 'PENDING', 'APPROVED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED']
    for idx, tname in enumerate(t_stages):
        tx = 8 + idx * 13
        is_done = idx < 3
        is_curr = idx == 3
        bg = '#10B981' if is_done else ('#3B82F6' if is_curr else '#E2E8F0')
        fg = '#FFFFFF' if (is_done or is_curr) else '#64748B'
        ax.add_patch(patches.Circle((tx + 2, 79), 2.2, facecolor=bg))
        ax.text(tx + 2, 79, '✓' if is_done else str(idx + 1), ha='center', va='center', fontsize=6.8, fontweight='bold', color=fg)
        ax.text(tx + 2, 74, tname, ha='center', fontsize=5.8, fontweight='bold' if is_curr else 'normal', color='#1E293B')

    # Line Items Table
    ax.add_patch(patches.FancyBboxPatch((6, 26), 88, 43, boxstyle="round,pad=0.3", facecolor='#FFFFFF', edgecolor='#E2E8F0', lw=1))
    ax.text(10, 64, 'Order Line Items & GST Calculation Matrix', fontsize=8.5, fontweight='bold', color='#1E293B')
    ax.text(10, 59, 'ITEM DESCRIPTION                      QTY    UNIT PRICE (₹)   GST %    TAX AMT (₹)   TOTAL (₹)',
            fontsize=6.8, fontweight='bold', color='#64748B')
    ax.plot([10, 90], [57, 57], color='#E2E8F0', lw=1)

    items = [
        ('Industrial Titanium Alloy Sheets (Grade 5)', '10', '₹8,000.00', '18%', '₹14,400.00', '₹94,400.00'),
        ('Precision Steel Fastener Pack (500pc)', '4', '₹5,000.00', '18%', '₹3,600.00', '₹23,600.00'),
    ]
    for idx, (desc, q, up, gst, tax, tot) in enumerate(items):
        iy = 52 - idx * 6
        ax.text(10, iy, f'{desc:<40} {q:<6} {up:<16} {gst:<8} {tax:<14} {tot}', fontsize=6.8, color='#1E293B')

    # Summary totals panel
    ax.add_patch(patches.FancyBboxPatch((60, 6), 34, 18, boxstyle="round,pad=0.3", facecolor='#F5F3FF', edgecolor='#DDD6FE', lw=1))
    ax.text(63, 20, 'Subtotal:               ₹1,00,000.00', fontsize=7.2, color='#475569')
    ax.text(63, 16, 'Total GST Tax (18%):     ₹18,000.00', fontsize=7.2, color='#475569')
    ax.plot([63, 91], [14, 14], color='#C4B5FD', lw=1)
    ax.text(63, 10, 'Grand Total:     ₹1,18,000.00', fontsize=8.5, fontweight='bold', color='#5B21B6')

    plt.tight_layout()
    fig.savefig(os.path.join(output_dir, 'screenshot_po_lifecycle.png'), dpi=250, bbox_inches='tight')
    plt.close()
    print("Created screenshot_po_lifecycle.png")

# 5. SCREENSHOT: VENDOR PERFORMANCE EVALUATION
def create_evaluation_screenshot():
    fig, ax = plt.subplots(figsize=(10, 6.2), dpi=250)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    ax.add_patch(patches.FancyBboxPatch((2, 2), 96, 96, boxstyle="round,pad=0.4", facecolor='#F8FAFC', edgecolor='#CBD5E1', lw=1.2))
    ax.text(6, 92, 'VENDOR PERFORMANCE AUDIT & EVALUATION', fontsize=12, fontweight='bold', color='#7C3AED')
    ax.text(6, 88, 'Vendor: Apex Microelectronics & Hardware Ltd. (VND-0001)', fontsize=7.5, color='#64748B')

    # 6 Sliders Card
    ax.add_patch(patches.FancyBboxPatch((6, 10), 56, 74, boxstyle="round,pad=0.3", facecolor='#FFFFFF', edgecolor='#E2E8F0', lw=1))
    ax.text(10, 79, 'Evaluation Matrix (Rated 1.0 to 5.0 Stars)', fontsize=8.5, fontweight='bold', color='#1E293B')

    crit_vals = [
        ('1. Product / Component Quality', 5.0),
        ('2. Delivery Performance & SLA', 4.5),
        ('3. Pricing Value & Competitiveness', 4.0),
        ('4. Communication & Responsiveness', 5.0),
        ('5. Operational Reliability & Uptime', 5.0),
        ('6. Statutory & Environmental Compliance', 5.0),
    ]

    for idx, (cname, val) in enumerate(crit_vals):
        cy = 71 - idx * 10
        ax.text(10, cy + 2.5, cname, fontsize=7.2, fontweight='bold', color='#334155')
        # Track
        ax.add_patch(patches.Rectangle((10, cy - 2), 40, 2.5, facecolor='#E2E8F0'))
        # Fill
        ax.add_patch(patches.Rectangle((10, cy - 2), (val / 5.0) * 40, 2.5, facecolor='#7C3AED'))
        ax.text(53, cy - 1, f'{val:.1f} ★', fontsize=7.5, fontweight='bold', color='#7C3AED')

    # Right Scorecard spotlight
    ax.add_patch(patches.FancyBboxPatch((66, 32), 28, 52, boxstyle="round,pad=0.4", facecolor='#F0FDF4', edgecolor='#86EFAC', lw=1.5))
    ax.text(80, 76, 'OVERALL AUDIT SCORE', ha='center', fontsize=7.8, fontweight='bold', color='#166534')
    ax.text(80, 64, '4.75', ha='center', fontsize=26, fontweight='bold', color='#15803D')
    ax.text(80, 56, 'out of 5.00', ha='center', fontsize=7.5, color='#166534')

    ax.add_patch(patches.FancyBboxPatch((70, 46), 20, 5.5, boxstyle="round,pad=0.2", facecolor='#15803D'))
    ax.text(80, 48.7, 'EXCELLENT TIER', ha='center', va='center', fontsize=7.5, fontweight='bold', color='#FFFFFF')

    ax.text(80, 38, 'Preferred Tier Supplier\nApproved for High-Volume POs', ha='center', fontsize=6.8, color='#14532D', multialignment='center')

    plt.tight_layout()
    fig.savefig(os.path.join(output_dir, 'screenshot_vendor_evaluation.png'), dpi=250, bbox_inches='tight')
    plt.close()
    print("Created screenshot_vendor_evaluation.png")

create_login_screenshot()
create_admin_dashboard_screenshot()
create_onboarding_wizard_screenshot()
create_po_details_screenshot()
create_evaluation_screenshot()
print("All 5 project screenshots successfully rendered!")
