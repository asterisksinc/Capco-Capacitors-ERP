from PIL import Image

Image.MAX_IMAGE_PIXELS = None
ref = Image.open(r"C:\Users\YASWANTH\Downloads\Solutions - OEM.png")
print("Reference size:", ref.size)

scale_x = ref.size[0] / 1920.0
scale_y = ref.size[1] / 11450.84

def crop_and_save(x, y, w, h, out_path):
    box = (int(x * scale_x), int(y * scale_y), int((x + w) * scale_x), int((y + h) * scale_y))
    cropped = ref.crop(box)
    cropped.save(out_path)
    print(f"Saved {out_path} {cropped.size}")

# 1. Leybold Machine in Section 2:
# In Figma, Section 2 is at y ≈ 1194 to 2400.
# The card is 1800 wide, left image is roughly x=60, width=870, height=580.
# Let's inspect where it is in 02_built_for_equipment_ref.png:
crop_and_save(60, 1530, 840, 580, "public/figma/solutions/oem-leybold.png")

# 2. HVAC rooftop in Section 5 (Stories):
# In 05_stories_ref.png, Story card 1 starts at x=60, y≈5350 to 6250.
crop_and_save(60, 5320, 1512, 750, "public/figma/solutions/oem-story-hvac.png")
crop_and_save(1596, 5320, 280, 750, "public/figma/solutions/oem-story-pump.png")

# 3. OEM Journey in Section 8:
# 3 cards around y≈8700 to 9350
# Each card width ≈ 580, height ≈ 580
crop_and_save(60, 8740, 574, 580, "public/figma/solutions/oem-journey-1.png")
crop_and_save(674, 8740, 574, 580, "public/figma/solutions/oem-journey-2.png")
crop_and_save(1286, 8740, 574, 580, "public/figma/solutions/oem-journey-3.png")

