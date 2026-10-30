/* ---------- Acabados ---------- */

export type FinishId = "matte" | "glossy" | "stars" | "rainbow" | "glass" | "dots";

export type Finish = {
  id: FinishId;
  name: string;
  desc: string;
  /** Texto corto para las listas */
  short: string;
  holo: boolean;
  /** Muestra real del acabado (recortada de la infografía); se usa cuando no hay imagen de producto. */
  thumb: string;
};

export const HOLO_EXTRA = 1;

export const finishes: Finish[] = [
  { id: "matte", name: "Mate", desc: "Suave, liso y sin reflejos.", short: "Suave y sin reflejos", holo: false, thumb: "/brand/finish-matte.jpg" },
  { id: "glossy", name: "Brillante", desc: "Colores vibrantes con un brillo precioso.", short: "Brillo vibrante", holo: false, thumb: "/brand/finish-glossy.jpg" },
  { id: "stars", name: "Estrellas", desc: "Holográfico premium con estrellitas.", short: "Con estrellitas", holo: true, thumb: "/brand/finish-stars.jpg" },
  { id: "rainbow", name: "Arcoíris", desc: "Holográfico premium con destellos arcoíris.", short: "Destellos arcoíris", holo: true, thumb: "/brand/finish-rainbow.jpg" },
  { id: "glass", name: "Vidrio roto", desc: "Holográfico premium con efecto cristal.", short: "Efecto cristal", holo: true, thumb: "/brand/finish-glass.jpg" },
  { id: "dots", name: "Puntitos", desc: "Holográfico premium con puntitos brillantes.", short: "Puntitos brillantes", holo: true, thumb: "/brand/finish-dots.jpg" },
];

export const finishById = (id: FinishId) => finishes.find((f) => f.id === id)!;

/* ---------- Modelos de e-reader ---------- */

export type Brand = { id: string; name: string; models: string[] };

export const brands: Brand[] = [
  {
    id: "kindle",
    name: "Kindle",
    models: [
      "Kindle Paperwhite 7th Generation",
      "Kindle Paperwhite 10th Generation",
      "Kindle Paperwhite 11th Generation",
      "Kindle Paperwhite 12th Generation",
      "Kindle Colorsoft",
      "Kindle Basic 2022/2024 (11th Gen)",
      "Kindle Basic 10th Generation",
      "Kindle Oasis 9th Generation",
      "Kindle Oasis 10th Generation",
    ],
  },
  {
    id: "kobo",
    name: "Kobo",
    models: ["Kobo Clara Colour", "Kobo Clara BW", "Kobo Clara 2E", "Kobo Libra Colour", "Kobo Libra 2", "Kobo Libra H2O"],
  },
  { id: "boox", name: "Onyx Boox", models: ["BOOX Go Color 7", "BOOX Go 7"] },
  { id: "xteink", name: "Xteink", models: ["Xteink x3", "Xteink x4", "Xteink x4 Pro"] },
  { id: "bigme", name: "Bigme", models: ["Bigme B6 Color", "Bigme B6 Black & White", "Bigme B6 Pro"] },
];

/* ---------- Precios ---------- */

export const PRICES = {
  skin: 6,
  insert: 3,
  bookmark: 3.5,
  stickers: 5,
  customSkin: 8,
  customInsert: 5,
} as const;

/* ---------- Diseño de reserva (vista previa de skins personalizadas) ---------- */

export type Motif = "flower" | "star" | "leaf" | "moon" | "heart" | "rose";

export type Design = {
  id: string;
  name: string;
  bg: [string, string];
  accents: string[];
  motifs: Motif[];
  seed: number;
};

export const designs: Design[] = [
  {
    id: "lavanda",
    name: "Lavanda",
    bg: ["#e9e1f2", "#cdc4d7"],
    accents: ["#7b5fa0", "#ffffff", "#b8e8ee"],
    motifs: ["leaf", "flower"],
    seed: 41,
  },
];

export const designById = (id: string) => designs.find((d) => d.id === id) ?? designs[0];

/* ---------- Categorías ---------- */

export type CategoryId =
  | "skins"
  | "inserts"
  | "marcapaginas-magneticos"
  | "pegatinas"
  | "marcapaginas"
  | "pop-sockets"
  | "vasos";

export type Category = {
  id: CategoryId;
  name: string;
  short: string;
  blurb: string;
  soon: boolean;
  cover?: string;
};

export const categories: Category[] = [
  {
    id: "skins",
    name: "Skins",
    short: "Skins",
    blurb: "Dale un nuevo capítulo a tu e-reader con diseños de vinilo hechos para enamorarte.",
    soon: false,
    cover: "/brand/skins/Lazos-Rosa-Coquette.jpeg",
  },
  {
    id: "inserts",
    name: "Inserts",
    short: "Inserts",
    blurb: "El detalle que se ve a través de tu funda transparente. Mismo diseño, otro toque.",
    soon: false,
    cover: "/brand/inserts/sbc.jpeg",
  },
  {
    id: "marcapaginas-magneticos",
    name: "Marcapáginas magnéticos",
    short: "Marcapáginas magnéticos",
    blurb: "Tus personajes favoritos marcando tu lectura. Se quedan en su sitio con un imán.",
    soon: false,
    cover: "/brand/marcapaginas-magneticos/principe-cruel/los-habitantes-del-aire.jpeg",
  },
  {
    id: "pegatinas",
    name: "Hojas de pegatinas",
    short: "Hojas de pegatinas",
    blurb: "Packs de hojas de pegatinas para decorar tus libros, libretas y e-reader.",
    soon: false,
    cover: "/brand/pegatinas/pegatina1.jpeg",
  },
  {
    id: "marcapaginas",
    name: "Marcapáginas tradicionales",
    short: "Marcapáginas clásicos",
    blurb: "Los de toda la vida, con diseños pensados para lectoras.",
    soon: true,
  },
  {
    id: "pop-sockets",
    name: "Pop sockets",
    short: "Pop sockets",
    blurb: "Agarra tu e-reader o tu móvil con comodidad y con diseño.",
    soon: true,
  },
  {
    id: "vasos",
    name: "Vasos de vidrio",
    short: "Vasos de vidrio",
    blurb: "Vasos con diseño para acompañar tus tardes de lectura.",
    soon: true,
  },
];

export const categoryById = (id: string) => categories.find((c) => c.id === id);

/* ---------- Productos ---------- */

export type Kind = "skin" | "insert" | "bookmark" | "stickers";

/** spread: diseño plano (trasera + frontal) · photo: foto del producto · plain: imagen subida por la clienta */
export type ImgKind = "spread" | "photo" | "plain";
export type Img = { src: string; kind: ImgKind };

export type VariantOption = { id: string; label: string; swatch?: string; images: Img[] };

export type Product = {
  slug: string;
  name: string;
  kind: Kind;
  category: CategoryId;
  price: number;
  description: string;
  images: Img[];
  variants?: { label: string; options: VariantOption[] };
  /** Pide modelo de e-reader */
  needsDevice: boolean;
  /** Permite elegir acabado */
  hasFinish: boolean;
  badge?: string;
};

export const kindLabel: Record<Kind, string> = {
  skin: "Skin",
  insert: "Insert",
  bookmark: "Marcapáginas magnético",
  stickers: "Pegatinas",
};

const spread = (src: string): Img => ({ src, kind: "spread" });
const photo = (src: string): Img => ({ src, kind: "photo" });
const S = (f: string) => `/brand/skins/${f}`;
const I = (f: string) => `/brand/inserts/${f}`;
const M = (f: string) => `/brand/marcapaginas-magneticos/${f}`;
const P = (f: string) => `/brand/pegatinas/${f}`;

const SKIN_TAIL = "Skin de vinilo para tu e-reader, cortada a medida para tu modelo.";

const skin = (slug: string, name: string, blurb: string, img: Img, extra?: Partial<Product>): Product => ({
  slug,
  name,
  kind: "skin",
  category: "skins",
  price: PRICES.skin,
  description: `${blurb} ${SKIN_TAIL}`,
  images: [img],
  needsDevice: true,
  hasFinish: true,
  ...extra,
});

const insert = (slug: string, name: string, blurb: string, images: Img[]): Product => ({
  slug,
  name,
  kind: "insert",
  category: "inserts",
  price: PRICES.insert,
  description: `${blurb} Insert para la funda transparente de tu e-reader, a medida de tu modelo.`,
  images,
  needsDevice: true,
  hasFinish: true,
});

const bookmark = (slug: string, name: string, book: string, images: Img[], extra?: Partial<Product>): Product => ({
  slug,
  name,
  kind: "bookmark",
  category: "marcapaginas-magneticos",
  price: PRICES.bookmark,
  description: `Marcapáginas magnético de ${name} (${book}). Se queda en su sitio y marca tu lectura con mucho estilo.`,
  images,
  needsDevice: false,
  hasFinish: false,
  ...extra,
});

const coquetteColors: { id: string; label: string; swatch: string; file: string }[] = [
  { id: "rosa", label: "Rosa", swatch: "#f4c3d3", file: "Lazos-Rosa-Coquette.jpeg" },
  { id: "azul", label: "Azul", swatch: "#b9d3ee", file: "Lazos-Azul-Coquette.jpeg" },
  { id: "beige", label: "Beige", swatch: "#e8dcc9", file: "Lazos-Beige-Coquette.jpeg" },
  { id: "verde", label: "Verde", swatch: "#c5d9bf", file: "Lazos-Verde-Coquette.jpeg" },
  { id: "morado", label: "Morado", swatch: "#cbbbe6", file: "lazos-morado-coquette.jpeg" },
  { id: "naranja", label: "Naranja", swatch: "#f6cfa6", file: "lazos-naranja-coquette.jpeg" },
];

const coquette = skin(
  "lazos-coquette-skin",
  "Lazos Coquette",
  "Rayas suaves y lazos delicados. Una colección en 6 colores.",
  spread(S(coquetteColors[0].file)),
  {
    badge: "6 colores",
    variants: {
      label: "Color",
      options: coquetteColors.map((c) => ({ id: c.id, label: c.label, swatch: c.swatch, images: [spread(S(c.file))] })),
    },
  },
);

const offCampusGroup = spread(M("off-campus/off-campus.jpeg"));
const cruelGroup = spread(M("principe-cruel/los-habitantes-del-aire.jpeg"));

const jude = bookmark(
  "jude-duarte-marcapaginas",
  "Jude Duarte",
  "El príncipe cruel",
  [photo(M("principe-cruel/jude-duarte.jpeg")), photo(M("principe-cruel/los-habitantes-del-aire.jpeg"))],
  {
    variants: {
      label: "Versión",
      options: [
        { id: "aventura", label: "Aventurera", images: [photo(M("principe-cruel/jude-duarte.jpeg")), photo(cruelGroup.src)] },
        { id: "gala", label: "Vestido de gala", images: [photo(M("principe-cruel/jude-duarte-2.jpeg")), photo(cruelGroup.src)] },
      ],
    },
  },
);

export const products: Product[] = [
  coquette,
  skin("acotar-skin", "ACOTAR", "Noche violeta, rosas y montañas para las lectoras de fantasía.", spread(S("Acotar-Skin.jpeg"))),
  skin("celestial-dreams-skin", "Celestial Dreams", "Un cielo nocturno lleno de constelaciones doradas.", spread(S("Celestial-Dreams.jpeg"))),
  skin("emerald-bloom-skin", "Emerald Bloom", "Líneas doradas sobre verde esmeralda.", spread(S("Emerald-Bloom.jpeg"))),
  skin("enchanted-garden-skin", "Enchanted Garden", "Rosas y vidrieras en un jardín encantado.", spread(S("Enchanted-Garden.jpeg"))),
  skin("born-to-read-skin", "Born to Read", "Lazos y detalles en azul pastel para lectoras de nacimiento.", spread(S("born-to-read.jpeg"))),
  skin("love-yourself-skin", "Love Yourself & Love Reading", "Rosa coquette con mariposa, lazos y libros.", spread(S("love-yourself-and-love-reading.jpeg"))),
  skin("cinnamon-cafe-skin", "Cinnamon Café", "Una cafetería otoñal con olor a canela.", spread(S("cinnamon-cafe.jpeg"))),
  skin("cozy-chapter-skin", "Cozy Chapter", "Tazas, libros y mantitas: otoño en estado puro.", spread(S("cozy-chapter.jpeg"))),
  skin("falling-leaves-skin", "Falling Leaves", "Hojas, bellotas y calabazas de otoño.", spread(S("falling-leaves.jpeg"))),
  skin("gingham-burgundy-skin", "Gingham Burgundy", "Cuadros vichy en granate.", spread(S("gingham-burgundy.jpeg"))),
  skin("pumpkin-patch-stories-skin", "Pumpkin Patch Stories", "Historias entre calabazas y cuadros naranjas.", spread(S("pumkin-patch-stories.jpeg"))),
  skin("pumpkin-bloom-skin", "Pumpkin Bloom", "Calabazas y florecitas sobre un tono melocotón.", spread(S("pumpkin-bloom.jpeg"))),

  insert("ghostly-reads-insert", "Ghostly Reads", "Fantasmitas, calabazas y lecturas de otoño.", [
    photo(I("ghostly-reads-foto.jpeg")),
    spread(I("ghostly-reads.jpeg")),
  ]),
  insert("spooky-book-club-insert", "Spooky Book Club", "Fantasmas y hojas moradas para tu club de lectura más misterioso.", [
    photo(I("sbc.jpeg")),
    spread(I("spooky-book-club.jpeg")),
  ]),
  insert("vampire-bite-insert", "Vampire Bite", "Ataúdes, labios y murciélagos para lectoras de romance oscuro.", [
    photo(I("vb.jpeg")),
    spread(I("vampire-bite.jpeg")),
  ]),

  bookmark("allie-hayes-marcapaginas", "Allie Hayes", "Off Campus", [photo(M("off-campus/allie-hayes.jpeg")), photo(offCampusGroup.src)]),
  bookmark("dean-di-laurentis-marcapaginas", "Dean Di Laurentis", "Off Campus", [photo(M("off-campus/dean-dilaurentis.jpeg")), photo(offCampusGroup.src)]),
  bookmark("garrett-graham-marcapaginas", "Garrett Graham", "Off Campus", [photo(M("off-campus/garrett-graham.jpeg")), photo(offCampusGroup.src)]),
  bookmark("hannah-wells-marcapaginas", "Hannah Wells", "Off Campus", [photo(M("off-campus/hanna-wells.jpeg")), photo(offCampusGroup.src)]),
  bookmark("cardan-greenbriar-marcapaginas", "Cardan Greenbriar", "El príncipe cruel", [photo(M("principe-cruel/cardan-greenbriar.jpeg")), photo(cruelGroup.src)]),
  jude,

  {
    slug: "pack-4-hojas-pegatinas",
    name: "Pack de 4 hojas de pegatinas",
    kind: "stickers",
    category: "pegatinas",
    price: PRICES.stickers,
    description:
      "Cuatro hojas de pegatinas Flork para decorar tus libros, libretas y e-reader. Las hojas pueden variar entre packs.",
    images: ["pegatina1.jpeg", "pegatina2.jpeg", "pegatina3.jpeg", "pegatina4.jpeg", "pegatina5.jpeg"].map((f) => photo(P(f))),
    needsDevice: false,
    hasFinish: false,
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

export const productCover = (p: Product) => (p.variants ? p.variants.options[0].images[0] : p.images[0]);

export const unitPrice = (p: Pick<Product, "price" | "hasFinish">, finish?: FinishId) =>
  p.price + (p.hasFinish && finish && finishById(finish).holo ? HOLO_EXTRA : 0);

/* ---------- Reseñas de ejemplo ---------- */

export const reviews = [
  { name: "Lucía M.", text: "La skin quedó perfecta en mi Paperwhite, el acabado arcoíris es una pasada.", stars: 5, slug: "lazos-coquette-skin" },
  { name: "Carmen R.", text: "Pedí una personalizada con la portada de mi libro favorito y es preciosa.", stars: 5, slug: "acotar-skin" },
  { name: "Paula G.", text: "Los marcapáginas son una monada y se quedan perfectos en el libro.", stars: 5, slug: "jude-duarte-marcapaginas" },
  { name: "Irene S.", text: "Los inserts son un detallazo, mi Kobo parece otro.", stars: 5, slug: "spooky-book-club-insert" },
];

/** 6 € si es entero, 6,50 € si no */
export const eur = (n: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);
