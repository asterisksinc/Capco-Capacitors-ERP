import re
from PIL import Image

Image.MAX_IMAGE_PIXELS = None

# Load the reference image
ref_path = r"C:\Users\YASWANTH\Downloads\Solutions - OEM.png"
print("Opening reference image...")
img = Image.open(ref_path)
print(f"Dimensions: {img.size}")

# Let's crop key areas and save them to .tmp/crops/ for quick reference
import os
os.makedirs(".tmp/crops", exist_ok=True)

# Scale factor: 32768 / 11450.84 ~= 2.8616238
scale_y = img.size[1] / 11450.84
scale_x = img.size[0] / 1920.0

print(f"Scale X: {scale_x}, Scale Y: {scale_y}")

# Define section Y coordinates in Figma (approximate based on raw CSS):
# 1. Hero: 0 to 1194
# 2. Built for Equipment Manufacturers: ~1194 to ~2400
# 3. Dedicated Support: ~2400 to ~4600
# 4. Logos: ~4600 to ~4900
# 5. OEM Success Stories: ~4900 to ~6100
# 6. Browse by Product Category: ~6100 to ~7200
# 7. Where We Operate: ~7200 to ~8300
# 8. Start Your OEM Journey: ~8300 to ~9600
# 9. FAQ: ~9600 to ~10400
# 10. CTA: ~10400 to ~10900
# 11. Footer: ~10900 to 11450

sections = [
    ("01_hero", 0, 1250),
    ("02_built_for_equipment", 1150, 2400),
    ("03_dedicated_support", 2350, 4700),
    ("04_logos", 4600, 5000),
    ("05_stories", 4950, 6200),
    ("06_products", 6150, 7300),
    ("07_where_we_operate", 7250, 8400),
    ("08_oem_journey", 8350, 9700),
    ("09_faq", 9650, 10450),
    ("10_cta", 10400, 11000),
    ("11_footer", 10900, 11451)
]

for name, y1, y2 in sections:
    py1 = int(y1 * scale_y)
    py2 = int(y2 * scale_y)
    crop = img.crop((0, py1, img.size[0], min(py2, img.size[1])))
    # Resize to width 1920 for easy 1:1 inspection
    resized = crop.resize((1920, int(crop.size[1] * 1920 / crop.size[0])), Image.Resampling.LANCZOS)
    out_path = f".tmp/crops/{name}_ref.png"
    resized.save(out_path)
    print(f"Saved {out_path} ({resized.size})")

