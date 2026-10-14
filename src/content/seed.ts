// Launch content for New Ankur Furnishers.
// Used to seed Supabase (scripts/generate-seed.mts) and as a fallback when
// Supabase env vars are not configured (local preview).
import type { Category, NatureElement, PageSection, Sector, SiteSettings, Testimonial } from "./types";

const img = (name: string) => `/images/brochure/${name}.webp`;

export const settings: SiteSettings = {
  business_name: "New Ankur Furnishers",
  tagline: "Your Home, Your Story!",
  established_year: 1984,
  phones: ["+91 93343 31429", "+91 70915 94907", "+91 80179 69914"],
  whatsapp: "+919334331429",
  email: null,
  address: "Saket Tower, S.P. Verma Road, Patna 800001, Bihar",
  map_embed_url: null,
  instagram_url: "https://www.instagram.com/new.ankur.furnishers/",
  facebook_url: null,
  seo_title: "Home Furnishings & Interiors in Patna | New Ankur Furnishers",
  seo_description:
    "Patna's trusted home furnishing house since 1984. Curtains, blinds, flooring, wallpaper, mattresses, rugs and furniture — measured and fitted by our own team, for homes and businesses alike.",
};

const elImg = (slug: string) => `/images/elements/${slug}.webp`;

export const elements: NatureElement[] = [
  {
    slug: "earth",
    name: "Earth",
    sanskrit: "Prithvi",
    tagline: "What holds you",
    description:
      "Grounding materials underfoot and around you: floors of wood and stone-like vinyl, rugs that soften a room, and furniture built to stay.",
    image_url: elImg("earth"),
    image_alt: "Earthy room with a stone sculpture, terracotta leather sofa and an autumn tree",
    sort: 1,
    subtitle: "Foundation, Craft, Permanence",
    lead: null,
    principle:
      "Earth grounds us — materiality, authenticity, the honest expression of wood, stone, clay and natural fibre.",
    in_design: "Visible joinery. Tactile surfaces. Furniture that reveals its construction. Textiles that age beautifully.",
    story_label: "The craft story",
    story_text:
      "Our mastery lies in understanding materials deeply — how wood moves, how leather develops a patina, how upholstery holds its form across decades. This is not mass production. It is stewardship.",
    visual_language: "Warm ochre, terracotta and deep browns. Textures that invite touch. Compositions that feel rooted and stable.",
  },
  {
    slug: "water",
    name: "Water",
    sanskrit: "Jal",
    tagline: "What restores you",
    description:
      "Rest and renewal: mattresses, bed linen and bath textiles chosen for softness, freshness and a good night's sleep.",
    image_url: elImg("water"),
    image_alt: "Seaside setting with a glass table, sheer glassware and the ocean beyond",
    sort: 2,
    subtitle: "Flow, Adaptability, Softness",
    lead: null,
    principle:
      "Water flows and adapts to its container — gentle and powerful. In living spaces: flexibility, comfort, the softness that makes a house a home.",
    in_design: "Curved forms. Layered textiles. Upholstery that invites you to sink in. Lighting that shifts through the day.",
    story_label: "The comfort story",
    story_text:
      "Luxury is not hardness or severity. It is the moment you sit into a perfectly proportioned sofa, the weight of a linen curtain, the temperature of a room at dusk.",
    visual_language: "Soft blues, greens and greys. Flowing lines. Generous proportions. Spaces that breathe.",
  },
  {
    slug: "fire",
    name: "Fire",
    sanskrit: "Agni",
    tagline: "What warms you",
    description:
      "Warmth and glow: lighting, rich upholstery and the decorative accents that give a room its personality.",
    image_url: elImg("fire"),
    image_alt: "Coral arched alcove with a fire and a cream curved sofa",
    sort: 3,
    subtitle: "Warmth, Character, Energy",
    lead: null,
    principle:
      "Fire brings warmth and character — the spark of personality in a space. Without it, even the most beautiful room feels cold.",
    in_design:
      "Accent colours that surprise. Lighting that creates drama and intimacy. Materials with depth — velvet, brass, dark wood. Compositions with a point of view.",
    story_label: "The personality story",
    story_text:
      "A space should reflect the people who live in it. Our role is to provide the palette, the forms and the materials — tools that let you express your own warmth. We design for living, not for magazines.",
    visual_language: "Deep jewel tones. Warm metallics. Dramatic contrasts. Moments of unexpected richness.",
  },
  {
    slug: "air",
    name: "Air",
    sanskrit: "Vayu",
    tagline: "What lets you breathe",
    description:
      "Light and air in balance: sheer and blackout curtains, blinds and motorised window systems that shape how a room feels through the day.",
    image_url: elImg("air"),
    image_alt: "Soft pink and blue scene with clouds, an arch and a boucle stool",
    sort: 4,
    subtitle: "Light, Openness, Freedom",
    lead: "Luxury today is not about abundance — it is about clarity. Every piece in a space should earn its place.",
    principle:
      "Air is invisible but essential: the space between objects, the light that defines form, the freedom to move and breathe.",
    in_design: "Generous spacing. Minimal visual clutter. Furniture scaled to human proportion. Negative space as a design element.",
    story_label: null,
    story_text: null,
    visual_language: "Light, neutral backgrounds. Breathing room. Clarity of form. Simplicity that reveals complexity.",
  },
  {
    slug: "space",
    name: "Space",
    sanskrit: "Akasha",
    tagline: "What surrounds you",
    description:
      "The envelope of a room: wallpapers, wall panelling, glass films and the finishes that define the space itself.",
    image_url: elImg("space"),
    image_alt: "Beige fluted arch with a palm, a coral disc and a terracotta shell chair",
    sort: 5,
    subtitle: "Architecture, Possibility, Balance",
    lead: null,
    principle:
      "Space is the container — the fifth element that holds all others in balance. Architecture and interior design are inseparable.",
    in_design:
      "Furniture as architecture. Spatial planning that considers sightlines, acoustics and movement. Collections that work as a system, not isolated pieces.",
    story_label: "Systems thinking",
    story_text:
      "We do not design individual products; we design environments. A sofa is never separate from the wall behind it, the light above it, the rug beneath it. Every element is in conversation.",
    visual_language: "Architectural clarity. Balanced compositions. Spatial depth. Harmony across scales.",
  },
];

export const sectors: Sector[] = [
  {
    slug: "home",
    name: "Home Furnishings",
    tagline: "Where every corner tells a story.",
    summary:
      "Curtains, flooring, furniture, bedding and wall finishes — everything your home needs, chosen with you and fitted by our own team.",
    highlights: [
      { title: "Curtains & blinds", text: "Blackout, sheer and motorised options, measured and fitted at your doorstep." },
      { title: "Flooring", text: "Wooden, herringbone, SPC and vinyl floors, installed quickly and cleanly." },
      { title: "Bedroom", text: "Mattresses, bed-backs, linen and duvets, chosen for better rest." },
      { title: "Walls", text: "Wallpaper, murals and panelling to set the tone of a room." },
    ],
    image_url: img("sector-home"),
    image_alt: "Bright living room with a cream sofa and panelled walls",
    sort: 1,
  },
  {
    slug: "hospitality",
    name: "Hotels & Restaurants",
    tagline: "Hospitality that feels effortless.",
    summary:
      "Carpets, linen, curtains and furnishings for hotels, restaurants and banquet halls — hotel-grade, hard-wearing and installed on schedule.",
    highlights: [
      { title: "Wall-to-wall carpets", text: "Designer and corporate patterns for banquets, lobbies, suites and boardrooms." },
      { title: "Room linen", text: "Bedsheets, duvets, mattress protectors and bath linen in hotel grades." },
      { title: "Table linen", text: "Linens and overlays that dress up every event." },
      { title: "Window solutions", text: "Blackout curtains and blinds for restful guest rooms." },
    ],
    image_url: img("sector-hospitality"),
    image_alt: "Hotel room with dark wood panelling and a chandelier",
    sort: 2,
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    tagline: "Hygienic, hard-wearing, humane.",
    summary:
      "Flooring, curtains, mattresses and wallcoverings built for hospitals and clinics — specified for hygiene and durability, supplied and fitted end to end.",
    highlights: [
      { title: "Healthcare flooring", text: "Homogeneous, conductive and heterogeneous PVC flooring for ICU, OPD and more." },
      { title: "Hospital curtains & tracks", text: "Quick, easy installation at your doorstep." },
      { title: "Hospital mattresses & pillows", text: "Made to your dimensions and requirements." },
      { title: "Anti-bacterial wallpapers", text: "Wallcoverings made for healthcare settings." },
      { title: "Window solutions", text: "Vertical, roller and sheer dimout blinds." },
      { title: "Hygienic mats", text: "Exterior, interior, anti-skid and bath mats." },
      { title: "Bedsheets & blankets", text: "Durable, comfortable options for patient care." },
      { title: "Glass films", text: "Heat control and privacy for plain glass surfaces." },
    ],
    image_url: img("sector-healthcare"),
    image_alt: "Hospital ward with privacy curtains and patient beds",
    sort: 3,
  },
  {
    slug: "education",
    name: "Institutions & Education",
    tagline: "Spaces that help learning happen.",
    summary:
      "Flooring, blinds, wallcoverings and sports surfaces for schools, colleges and coaching institutes — practical, durable and easy to maintain.",
    highlights: [
      { title: "Flooring", text: "Classroom and gym flooring, carpets and carpet tiles for auditoriums and cabins." },
      { title: "Sports flooring", text: "For playing areas, tennis and badminton courts." },
      { title: "Window solutions", text: "Room-darkening, light-filtering and acoustic blinds." },
      { title: "Wallcoverings", text: "From budget-friendly to niche, plus digital murals for play areas and libraries." },
      { title: "Wall panelling", text: "For smart classes and music rooms." },
      { title: "Green turf & green walls", text: "For aesthetics and everyday use." },
      { title: "Glass films", text: "Frosted, reflective, printed and PVC." },
      { title: "Heat insulation & gifting", text: "Roofing insulation and corporate gifting for institutions." },
    ],
    image_url: img("sector-institutions"),
    image_alt: "Lecture hall with rows of chairs and a projection screen",
    sort: 4,
  },
  {
    slug: "office",
    name: "Office & Industrial",
    tagline: "Workspaces that work harder.",
    summary:
      "Carpet tiles, blinds, glass films and specialist flooring for offices and industrial spaces — quiet underfoot, hard-wearing and glare-free.",
    highlights: [
      { title: "Carpet tiles", text: "Hard-wearing, easy to replace, quiet underfoot." },
      { title: "Blinds", text: "Roller and vertical blinds for glare-free work." },
      { title: "Glass films", text: "Privacy and branding for cabins and partitions." },
      { title: "Anti-static & PVC stud flooring", text: "For server rooms, ramps, parking and entrances." },
    ],
    image_url: img("sector-office"),
    image_alt: "Executive office with bookshelves and a sculptural desk",
    sort: 5,
  },
  {
    slug: "art-decor",
    name: "Art & Decor",
    tagline: "The details that make a room yours.",
    summary:
      "Lighting, cushions, runners and accent furniture — the finishing touches that give a space its character.",
    highlights: [
      { title: "Lighting", text: "Fabric lamps and statement pieces for serene spaces." },
      { title: "Cushions & runners", text: "A pop of colour and texture for sofas and beds." },
      { title: "Accent furniture", text: "Consoles, tea tables and carved wooden partitions (jharokhas)." },
    ],
    image_url: img("sector-art-decor"),
    image_alt: "Calm lounge with two armchairs, a floor lamp and a low table",
    sort: 6,
  },
];

const c = (
  sort: number,
  slug: string,
  name: string,
  tagline: string,
  icon: string,
  element: Category["element"],
  sectors: string[],
  intro: string,
  subtypes: string[],
  hero: [string, string],
  images: [string, string][],
): Category => ({
  slug,
  name,
  tagline,
  icon,
  element,
  sectors,
  intro,
  subtypes,
  hero_image_url: img(hero[0]),
  hero_image_alt: hero[1],
  images: images.map(([n, alt]) => ({ url: img(n), alt })),
  sort,
});

export const categories: Category[] = [
  c(1, "mattresses", "Mattresses", "Rest, made to measure", "mattress", "water", ["home", "hospitality", "healthcare"],
    "Spring, foam and coir mattresses chosen for how you actually sleep — including hospital mattresses made to your exact dimensions. Supportive, comfortable and built to last.",
    ["Spring mattresses", "Foam mattresses", "Coir mattresses", "Hospital mattresses", "Mattress protectors"],
    ["mattress", "Tufted spring mattress on an upholstered bed"],
    [["mattress", "Tufted spring mattress"], ["mattress-protector", "Fitted mattress protector being put on"], ["mattresses-pillows", "Made-up bed with patterned cushions"]]),
  c(2, "pillows-bedding", "Pillows & Bedding", "Dressed for a good night", "pillow", "water", ["home", "hospitality", "healthcare"],
    "Pillows, bedsheets, duvets and covers in every size and thread count — from easy everyday cotton to soft premium weaves for the whole family.",
    ["Pillows & cushions", "Bedsheets", "Duvets & duvet covers", "Mattress protectors", "Bed runners"],
    ["pillows-cushions", "Textured cushion resting on white pillows"],
    [["pillows-cushions", "Textured cushions on white pillows"], ["bedsheets", "Quilted bed runner on white bedsheets"], ["duvets", "Stack of soft microfibre duvets"]]),
  c(3, "bath-linen", "Bath Linen & Mats", "Soft, absorbent, everyday", "towel", "water", ["home", "hospitality", "healthcare"],
    "Bath, hand, pool and face towels with quick-dry twist technology, plus anti-slip, water-absorbent bath mats — for homes, hotels and poolsides.",
    ["Bath towels", "Hand & face towels", "Pool towels", "Bath mats", "Exterior mats"],
    ["bath-linen", "Stacked pastel towels beside a pool"],
    [["bath-linen", "Stacked pastel towels"], ["bed-bath-towels", "Folded towels on a bed"], ["bath-mat", "Plush white bath mat"]]),
  c(4, "curtains-upholstery", "Curtains & Upholstery", "The right light, beautifully framed", "curtain", "air", ["home", "hospitality", "healthcare", "office"],
    "Blackout and sheer curtains for privacy and light control, upholstery fabrics in every colour, and the rods and tracks to finish them — measured and fitted at your doorstep.",
    ["Blackout curtains", "Sheer curtains", "Hospital curtains & tracks", "Upholstery fabrics", "Exterior-grade fabrics & leatherette", "Curtain rods & accessories"],
    ["curtains-sheer", "Sheer curtains filtering light into a living room"],
    [["curtains-sheer", "Sheer pleated curtains"], ["curtains-blinds", "Grey curtains with a sheer layer"], ["upholstery-fabrics", "Fan of upholstery fabric swatches"], ["curtain-rods", "Brushed steel curtain rod with eyelet curtains"], ["exterior-fabrics", "Outdoor seating on a deck"]]),
  c(5, "blinds", "Blinds", "Light, exactly how you want it", "blinds", "air", ["home", "healthcare", "education", "office"],
    "Roller, sheer dimout, vertical and wooden venetian blinds — including room-darkening and acoustic options for homes, offices and institutions.",
    ["Roller blinds", "Sheer dimout blinds", "Vertical blinds", "Wooden venetian blinds", "Acoustic blinds"],
    ["blinds-venetian", "Venetian blinds casting soft light on a green sofa"],
    [["blinds-venetian", "Wooden venetian blinds"], ["office-blinds-films", "Office cabins with blinds and frosted glass"]]),
  c(6, "floorings", "Floorings", "A floor that lasts for years", "flooring", "earth", ["home", "hospitality", "healthcare", "education", "office"],
    "Wooden, engineered, herringbone, SPC and vinyl floors — plus healthcare and sports flooring — engineered for quick installation, minimal wastage and a seamless finish.",
    ["Wooden flooring", "Engineered wood", "Herringbone & fishbone", "SPC flooring", "PVC / vinyl flooring", "Healthcare PVC flooring", "Sports & gym flooring", "Anti-static flooring"],
    ["floor-herringbone", "Herringbone floor in a calm bedroom"],
    [["floor-wooden", "Wide hall with wooden flooring"], ["floor-fishbone", "Fishbone floor under a low sofa"], ["floor-herringbone", "Herringbone flooring"], ["floor-spc", "SPC flooring planks fanned out"], ["floor-pvc", "Rolls of PVC flooring"], ["floor-engineered", "Engineered wood floor in a living room"], ["institution-floor", "Sports hall flooring"]]),
  c(7, "wallpapers", "Wallpapers & Panelling", "Walls with real character", "wallpaper", "space", ["home", "hospitality", "healthcare", "education"],
    "Designer and custom digital wallpapers, murals and wall panelling — from budget-friendly to bespoke, including anti-bacterial papers for healthcare settings.",
    ["Designer wallpapers", "Custom murals", "Anti-bacterial wallpapers", "Wall panelling", "Bed-backs"],
    ["wallcovering-mural", "Botanical mural behind a velvet sofa"],
    [["wallcovering-mural", "Botanical wall mural"], ["wallpaper-bedroom", "Toile wallpaper above a panelled bedroom wall"], ["bedback-panelling", "Sculpted wall panelling behind a bed"]]),
  c(8, "furniture", "Furniture", "Made to live with", "chair", "earth", ["home", "hospitality", "office"],
    "Sofas, chairs, ottomans, bespoke bed-backs and fine wooden pieces — crafted for comfort and made to your preference, by a team that understands materials.",
    ["Sofas & couches", "Chairs & ottomans", "Bed-backs (fabric & leatherette)", "Wooden furniture", "Consoles & tea tables", "Partitions (jharokhas)"],
    ["sofa-curved", "Curved boucle sofa in a sunlit room"],
    [["sofa-curved", "Curved sofa"], ["sofa-living", "Cream sofa with patterned cushions"], ["chairs-ottomans", "Mustard armchair"], ["bedback-pink", "Channel-tufted pink bed-back"], ["wooden-furniture", "Carved wooden writing desk"]]),
  c(9, "landscaping", "Landscaping & Outdoor", "Bring the outdoors in", "leaf", "earth", ["home", "hospitality", "education"],
    "UV-treated artificial grass in multiple pile heights, green walls, weatherproof decking and awnings — for balconies, terraces and gardens.",
    ["Artificial grass", "Green walls", "Decking", "Fixed & retractable awnings"],
    ["green-turf", "Lush green turf in a backyard"],
    [["green-turf", "Green turf lawn"], ["green-wall", "Round green wall feature"], ["decking", "Wooden deck under a pergola"]]),
  c(10, "home-decor", "Home Decor & Lighting", "The finishing touch", "vase", "fire", ["home", "hospitality", "art-decor"],
    "Fabric lamps, cushion covers, bed runners, table linen and decorative accents — the small, considered details that give a room its personality.",
    ["Fabric lamps", "Cushion covers & bed runners", "Table linen & overlays", "Decor accents"],
    ["art-decor-lounge", "Lounge with bronze wall sconces"],
    [["art-decor-lounge", "Decor-led lounge"], ["fabric-lamps", "Fabric pendant lamps"], ["cushion-covers", "Sofa with warm-toned cushions"], ["table-linen", "Banquet table with white linen"]]),
  c(11, "rugs-carpets", "Rugs & Carpets", "Warmth underfoot", "rug", "earth", ["home", "hospitality", "office", "education"],
    "Rugs in standard and custom sizes, plus wall-to-wall carpets in designer and corporate patterns for banquets, lobbies and boardrooms.",
    ["Custom rugs", "Regular rugs", "Wall-to-wall carpets", "Carpet tiles"],
    ["rug-living", "Plush rug under a sectional sofa"],
    [["rug-living", "Plush living-room rug"], ["custom-rug", "Round custom-carved rug"], ["wtw-carpet-banquet", "Patterned banquet carpet"], ["wtw-carpet-room", "Carpeted lounge with panelled walls"]]),
  c(12, "glass-films", "Glass Films", "Privacy, with a view", "window", "space", ["office", "healthcare", "education"],
    "Frosted, reflective, printed and PVC films that bring privacy, heat control and design to any glass surface — for offices, clinics and homes.",
    ["Frosted films", "Reflective films", "Printed / designer films", "Heat control films"],
    ["glass-films", "Reflective film on a glass facade"],
    [["glass-films", "Reflective glass facade"], ["office-blinds-films", "Frosted film on office cabins"]]),
  c(13, "home-automation", "Home Automation", "Comfort at a touch", "remote", "air", ["home", "hospitality"],
    "Motorised curtains and blinds with smart-home control, so light and privacy are a tap — or a voice command — away.",
    ["Motorised curtains", "Motorised blinds", "Smart home control"],
    ["home-automation", "Smart home app controlling a living room"],
    [["home-automation", "Smart home control on a phone"]]),
  c(14, "specialty-solutions", "Gym Mats & Specialty", "Built to work hard", "layers", "earth", ["office", "education", "healthcare"],
    "Rubber and gym mats, PVC stud flooring for ramps and parking, floor protectors and heat insulation — practical surfaces for demanding spaces.",
    ["Rubber & gym mats", "PVC stud flooring", "Floor protectors", "Heat insulation", "Bubble wraps"],
    ["gym-mats", "Gym with rubber mats and turf lanes"],
    [["gym-mats", "Gym rubber flooring"]]),
];

// No named testimonials in the launch brochure; staff add real ones via the admin.
export const testimonials: Testimonial[] = [];

export const sections: PageSection[] = [
  {
    page: "home", key: "hero", label: "Home: hero", sort: 1,
    eyebrow: "Patna · Since 1984",
    heading: "Your home, your story.",
    body: "Curtains, floors, walls and furniture — chosen with you and fitted by our own team, the way we've furnished homes and businesses across Patna for over forty years.",
    image_url: "/images/hero/living-arch.webp", image_alt: "A calm living room with a curved sage sofa and a live-edge table, open to a sunset valley through an arch",
    cta_label: "Explore products", cta_href: "/products",
  },
  {
    page: "home", key: "story", label: "Home: story strip", sort: 2,
    eyebrow: "Since 1984",
    heading: "Furnishing relationships, not just rooms.",
    body: "What began in 1984 as a furnishing shop on S.P. Verma Road now dresses homes, hotels, hospitals, schools and offices across Bihar — from the first measurement to the final fitting.",
  },
  {
    page: "home", key: "philosophy", label: "Home: philosophy teaser", sort: 3,
    eyebrow: "Our philosophy",
    heading: "Every home is made of five elements.",
    body: "Earth, water, fire, air and space — the five elements we furnish, so a room feels not just finished, but in balance.",
    cta_label: "Explore the philosophy", cta_href: "/philosophy",
  },
  {
    page: "home", key: "categories", label: "Home: categories heading", sort: 4,
    eyebrow: "What we do",
    heading: "Everything your space needs, in one place.",
    cta_label: "Browse all products", cta_href: "/products",
  },
  {
    page: "home", key: "sectors", label: "Home: sectors heading", sort: 5,
    eyebrow: "Where we work",
    heading: "From quiet homes to busy hospitals.",
    body: "The same care and craft, scaled to the space.",
    cta_label: "See our expertise", cta_href: "/expertise",
  },
  {
    page: "home", key: "cta", label: "Home: enquiry banner", sort: 6,
    heading: "Let's bring your space to life.",
    body: "Tell us what you're planning. We'll visit, measure and suggest options that suit your space and your budget.",
    image_url: img("why-dining"), image_alt: "Dining corner with ceramic pendant lamps",
    cta_label: "Make an enquiry", cta_href: "/contact",
  },
  {
    page: "about", key: "intro", label: "About: introduction", sort: 1,
    eyebrow: "About us",
    heading: "Furnishing homes and businesses since 1984.",
    body: "New Ankur Furnishers began as a furnishing shop in the heart of Patna, and has spent four decades doing one thing well: helping people create spaces that feel like home.\n\nFrom living rooms to hotels, hospitals to offices, we bring the same eye for materials and the same care in fitting — so every space we touch feels considered, comfortable and built to last.",
    image_url: img("about-armchair"), image_alt: "Teal armchair with a blush cushion beside a side table",
  },
  {
    page: "about", key: "why", label: "About: why choose us", sort: 2,
    heading: "Why choose us",
    image_url: img("why-dining"), image_alt: "Dining corner with ceramic pendant lamps",
    items: [
      { title: "Four decades of experience", text: "Furnishing homes and businesses across Bihar since 1984." },
      { title: "Fitted by our own team", text: "From measurement to installation, handled start to finish — no loose ends." },
      { title: "Materials you can trust", text: "Honest, hard-wearing materials chosen to last, not just to look good on day one." },
      { title: "Priced for real budgets", text: "Options at every price point, with honest advice on what's worth it." },
    ],
  },
  {
    page: "about", key: "founder", label: "About: founder's note", sort: 3,
    eyebrow: "From our founder",
    heading: "Forty years of furnishing relationships.",
    body: "For us, a home is not just a place but a feeling — where the presence of loved ones becomes comfort, where relationships breathe, and where dreams take shape.\n\nFor over forty years, New Ankur Furnishers has tried to fill every home with warmth, belonging and memory, so that your home doesn't only look beautiful but becomes a part of your story.\n\nYour trust and your affection are our greatest strength. Come, let us shape the home you have in mind, together.",
    cta_label: "Santosh Kumar Agrawal", // signature line
    image_url: img("sector-home"), image_alt: "Bright living room with panelled walls",
  },
  {
    page: "about", key: "heritage", label: "About: heritage intro", sort: 4,
    eyebrow: "Our story",
    heading: "Rooted in Patna, since 1984.",
    body: "In 1984, we set out with a singular conviction: that a home is not furnished with objects, but with memories, textures and enduring grace.",
    cta_label: "Santosh Kumar Agrawal", // quote attribution
    image_url: img("wooden-furniture"), image_alt: "Master craftsman and apprentice at the workbench",
  },
  {
    page: "about", key: "pillars", label: "About: what we stand for + timeline", sort: 5,
    heading: "What we stand for.",
    body: "From a single shop on S.P. Verma Road, New Ankur Furnishers has grown into a trusted name for furnishings and interiors across Patna and Bihar — for homes, hotels, hospitals, offices and institutions.",
    items: [
      { title: "1984 — Where it began", text: "New Ankur Furnishers opened on S.P. Verma Road in Patna, with a simple belief: honest materials, measured well and fitted properly." },
      { title: "Over the years — Beyond the home", text: "The same craft grew from living rooms to hotels, hospitals, schools and offices across Bihar." },
      { title: "Today — Start to finish", text: "From the first site visit and measurement to the final fitting, every project is handled end to end by our own team." },
    ],
  },
  {
    page: "about", key: "concierge", label: "About: consultation CTA", sort: 6,
    eyebrow: "Visit or get in touch",
    heading: "Planning a project? Let's start with a conversation.",
    cta_label: "Make an enquiry", cta_href: "/contact",
  },
  {
    page: "philosophy", key: "intro", label: "Philosophy: intro", sort: 1,
    eyebrow: "The brand idea",
    heading: "Five Elements of Nature",
    body: "Rooted in Indian philosophy and design tradition, the five elements are our organizing intelligence — a lens for every material we choose, every proportion we draw and every room we compose.",
  },
  {
    page: "philosophy", key: "framework", label: "Philosophy: framework cards", sort: 2,
    items: [
      { title: "A timeless framework", text: "Rooted in Indian philosophy and design tradition. Each element is a principle of balance, harmony and human flourishing — not a material or an aesthetic." },
      { title: "A complete philosophy", text: "Together, the five elements form a coherent lens through which every design decision, every material choice and every spatial composition is made." },
      { title: "Not a gimmick", text: "This is how we think, how we create, how we live. It is the organizing intelligence of everything we do." },
    ],
  },
  {
    page: "expertise", key: "intro", label: "Expertise: intro", sort: 1,
    eyebrow: "Where we work",
    heading: "From quiet homes to busy hospitals.",
    body: "For over forty years we've furnished every kind of space across Patna and Bihar — homes, hotels, hospitals, schools and offices — measuring, supplying and installing with the same care, whether it's a single bedroom or an entire hospital wing.",
  },
  {
    page: "products", key: "intro", label: "Products: intro", sort: 1,
    eyebrow: "What we do",
    heading: "Everything your space needs.",
    body: "Curtains, flooring, wallpaper, mattresses, rugs, furniture and more — every category measured, supplied and fitted by our own team. Filter by one of the five elements, or browse the full range.",
  },
  {
    page: "blog", key: "intro", label: "Blog: intro", sort: 1,
    eyebrow: "Journal",
    heading: "Notes on furnishing a home you love.",
    body: "Practical advice from four decades of furnishing homes and businesses in Patna — from choosing curtains for the summer heat to picking the right floor for a busy clinic.",
  },
  {
    page: "contact", key: "intro", label: "Contact: intro", sort: 1,
    eyebrow: "Contact",
    heading: "Let's talk about your space.",
    body: "Tell us what you're planning. We'll visit, measure and suggest options that suit your space and your budget — then supply and fit it with our own team.",
  },
];
