from PIL import Image

Image.MAX_IMAGE_PIXELS = None
dev = Image.open(r'C:\Users\YASWANTH\Downloads\developedversion.png')
w, h = dev.size
print(f'Dev dimensions: {w} x {h}')

# Approximate Y coordinates in developedversion.png:
# Total height: 11720
# Let's crop into 11 sections matching the reference sections:
sections = [
    ("01_hero", 0, 1200),
    ("02_built_for_equipment", 1150, 2350),
    ("03_dedicated_support", 2300, 4800),
    ("04_logos", 4750, 5150),
    ("05_stories", 5100, 6400),
    ("06_products", 6350, 7550),
    ("07_where_we_operate", 7500, 8600),
    ("08_oem_journey", 8550, 9900),
    ("09_faq", 9850, 10700),
    ("10_cta", 10650, 11200),
    ("11_footer", 11150, 11720)
]

for name, y1, y2 in sections:
    c = dev.crop((0, y1, w, min(y2, h)))
    out = f'.tmp/crops/{name}_dev.png'
    c.save(out)
    print(f'Saved {out}')

