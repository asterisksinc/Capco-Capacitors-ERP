from PIL import Image

# 1. Leybold Image:
img2 = Image.open('.tmp/crops/02_built_for_equipment_ref.png')
leybold = img2.crop((60, 269, 850, 1057))
leybold.save('public/figma/solutions/oem-leybold.png')
print('Saved public/figma/solutions/oem-leybold.png', leybold.size)

# 2. HVAC rooftop (Story 1):
img5 = Image.open('.tmp/crops/05_stories_ref.png')
# Card 1 x from 60 to 1572, y from 0 to 805
# But wait, in 05_stories_ref.png, the text and glass card are over the photo at the bottom.
# Wait, let's check what image files exist for the story backgrounds.
# In public/figma/solutions/:
# Let's see what each png in public/figma/solutions contains!

# 3. OEM Journey Cards:
img8 = Image.open('.tmp/crops/08_oem_journey_ref.png')
j1 = img8.crop((60, 151, 636, 616))
j1.save('public/figma/solutions/oem-journey-1.png')
print('Saved oem-journey-1.png', j1.size)

j2 = img8.crop((668, 151, 1244, 616))
j2.save('public/figma/solutions/oem-journey-2.png')
print('Saved oem-journey-2.png', j2.size)

j3 = img8.crop((1276, 151, 1852, 616))
j3.save('public/figma/solutions/oem-journey-3.png')
print('Saved oem-journey-3.png', j3.size)
