from PIL import Image, ImageDraw


SIZE = 1024
SCALE = SIZE / 512


def s(value: float) -> float:
    return value * SCALE


def cubic_points(p0, p1, p2, p3, steps=100):
    points = []
    for i in range(steps + 1):
        t = i / steps
        mt = 1 - t
        x = (
            (mt ** 3) * p0[0]
            + 3 * (mt ** 2) * t * p1[0]
            + 3 * mt * (t ** 2) * p2[0]
            + (t ** 3) * p3[0]
        )
        y = (
            (mt ** 3) * p0[1]
            + 3 * (mt ** 2) * t * p1[1]
            + 3 * mt * (t ** 2) * p2[1]
            + (t ** 3) * p3[1]
        )
        points.append((s(x), s(y)))
    return points


image = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
draw = ImageDraw.Draw(image)

draw.rounded_rectangle((0, 0, SIZE, SIZE), radius=s(96), fill="#0A0808")
draw.ellipse(
    (s(52), s(52), s(460), s(460)),
    fill="#13100F",
    outline="#E63946",
    width=round(s(18)),
)

main_mark = [
    (154, 333),
    (154, 168),
    (197, 168),
    (257, 253),
    (317, 168),
    (360, 168),
    (360, 333),
    (311, 333),
    (311, 249),
    (271, 306),
    (243, 306),
    (203, 249),
    (203, 333),
]
draw.polygon([(s(x), s(y)) for x, y in main_mark], fill="#F5EFE4")

flame = []
flame.extend(cubic_points((371, 116), (371, 116), (392, 154), (376, 190), 80))
flame.extend(cubic_points((376, 190), (364, 216), (337, 225), (337, 225), 80)[1:])
flame.extend(cubic_points((337, 225), (337, 225), (349, 197), (339, 178), 80)[1:])
flame.extend(cubic_points((339, 178), (329, 159), (309, 151), (309, 151), 80)[1:])
flame.extend(cubic_points((309, 151), (309, 151), (354, 145), (371, 116), 80)[1:])
draw.polygon(flame, fill="#FF6B35")

smile = cubic_points((149, 370), (214, 407), (299, 407), (364, 370), 160)
draw.line(smile, fill="#F2B705", width=round(s(18)), joint="curve")

draw.line(
    [(s(144), s(130)), (s(185), s(106)), (s(226), s(130))],
    fill="#E63946",
    width=round(s(14)),
    joint="curve",
)

image.save("public/logo.png")
