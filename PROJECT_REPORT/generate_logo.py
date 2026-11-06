import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

output_path = 'PROJECT_REPORT/diagrams/easwari_logo.png'

fig, ax = plt.subplots(figsize=(3, 3), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

# Outer gold ring
ax.add_patch(patches.Circle((50, 50), 46, facecolor='#0D5C3A', edgecolor='#D4AF37', lw=3))
ax.add_patch(patches.Circle((50, 50), 41, facecolor='#FFFFFF', edgecolor='#D4AF37', lw=1.5))

# Center Crest Shield
shield = patches.Polygon([[50, 22], [74, 38], [74, 62], [50, 72], [26, 62], [26, 38]], closed=True,
                         facecolor='#0D5C3A', edgecolor='#D4AF37', lw=2)
ax.add_patch(shield)

# Inner book / gear graphic
ax.text(50, 50, 'EEC', ha='center', va='center', fontsize=14, fontweight='bold', color='#D4AF37')
ax.text(50, 36, 'SRM', ha='center', va='center', fontsize=8, fontweight='bold', color='#FFFFFF')

# Text circular arc approximation
ax.text(50, 83, 'EASWARI ENGINEERING COLLEGE', ha='center', va='center', fontsize=6, fontweight='bold', color='#0D5C3A')
ax.text(50, 12, 'EDUCATE AND EXCEL', ha='center', va='center', fontsize=5.5, fontweight='bold', color='#0D5C3A')
ax.text(50, 5, 'AUTONOMOUS', ha='center', va='center', fontsize=5, fontweight='bold', color='#B91C1C')

plt.tight_layout()
fig.savefig(output_path, dpi=300, bbox_inches='tight', transparent=True)
plt.close()
print("Created easwari_logo.png")
