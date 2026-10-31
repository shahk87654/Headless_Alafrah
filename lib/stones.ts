export type Stone = {
  name: string;
  handle: string;
  origin: string;
  hex: string;
  character: string;
  care: string;
  uses: string;
};

export const STONES: Stone[] = [
  {
    name: "Travertine",
    handle: "travertine-marble",
    origin: "Turkey and Italy",
    hex: "#D8CCB5",
    character: "Open pores, warm body, fills well for tabletops.",
    care: "Neutral pH cleaner. Seal honed tops once a year in a UAE kitchen.",
    uses: "Coffee tables, consoles, planters, wet-area trays.",
  },
  {
    name: "Calacatta",
    handle: "calacatta-marble",
    origin: "Carrara district, Italy",
    hex: "#F1F2EF",
    character: "White ground, grey to gold veins, often bookmatched.",
    care: "Wipe acids immediately. Honed hides etching better than polish.",
    uses: "Dining tables, bathroom vanities, statement tops.",
  },
  {
    name: "Arabescato",
    handle: "arabescato-marble",
    origin: "Apuan Alps, Italy",
    hex: "#E2E0DA",
    character: "Moving grey veins, high contrast on a pale ground.",
    care: "Same as other calcites: no vinegar, no bleach.",
    uses: "Feature tables, wall panels, bookmatched headboards.",
  },
  {
    name: "Onyx",
    handle: "onyx-marble",
    origin: "Iran and Pakistan",
    hex: "#C9B48A",
    character: "Translucent bands. Can be backlit.",
    care: "Softer than marble. Use pads under objects. Avoid point loads.",
    uses: "Bakhoor burners, lamp bases, reception desks.",
  },
  {
    name: "Black Marquina",
    handle: "black-marquina",
    origin: "Markina, Spain",
    hex: "#16181B",
    character: "Black body with white calcite veins.",
    care: "Shows dust; wipe with a damp microfibre. Seal edges.",
    uses: "Side tables, office accessories, contrast inlay.",
  },
  {
    name: "Emperador Dark",
    handle: "emperador-dark",
    origin: "Spain",
    hex: "#4A342C",
    character: "Brown ground, lighter crystalline veins.",
    care: "Keep dry after cleaning. Brown stones show water rings.",
    uses: "Desktops, consoles, hotel corridors.",
  },
  {
    name: "Jungle Green",
    handle: "jungle-green",
    origin: "India",
    hex: "#2D4A3E",
    character: "Deep green with white and black movement.",
    care: "Seal before first use in wet rooms.",
    uses: "Bathroom accessories, outdoor-adjacent tables under cover.",
  },
  {
    name: "Red Travertine",
    handle: "red-travertine",
    origin: "Iran",
    hex: "#8F4A38",
    character: "Iron-rich body, open pores like beige travertine.",
    care: "Fill and seal for dining use. Expect colour variation slab to slab.",
    uses: "Planters, accent tables, feature walls.",
  },
];

export function stoneByName(value: string | undefined | null) {
  if (!value) return undefined;
  const needle = value.toLowerCase();
  return STONES.find((stone) => needle.includes(stone.name.toLowerCase()) || needle.includes(stone.handle));
}

export function hexForMaterial(value: string | undefined | null, fallback = "#A9ABA6") {
  return stoneByName(value)?.hex ?? fallback;
}
