# Design decisions: The Slab Rack

Al Afrah is a Dubai marble workshop. The site is built like a slab rack in a yard: large rectangles of photography and flat honed colour, 8px gutters, square-cut images, text on flat panels. Nothing floats. Nothing pretends to be stone with a CSS gradient.

## Palette

Named from stones we actually sell. Cool white, not cream. Near-black, not navy. Green from Jungle Green, not a generic “luxury gold”.

| Name | Hex | Role |
|---|---|---|
| Calacatta | `#F1F2EF` | Page background |
| Marquina | `#16181B` | Text and dark panels |
| Honed | `#A9ABA6` | Borders, disabled, secondary on dark |
| Jungle | `#2D4A3E` | Primary actions, links, focus ring |
| Travertine | `#D8CCB5` | One secondary panel per viewport, max |
| Onyx Amber | `#C4873A` | Sale and low-stock badges only |

On the product page the header band uses the selected material’s `color_hex` (fallback Honed). Text on that band is chosen programmatically for WCAG AA contrast: Marquina or Calacatta, never a third colour.

## Type

- **Display:** Italiana, 400. Inscriptional, carved-letter. Never below 40px. Sentence case, tight tracking, no italics, no single-word accent.
- **UI / body:** Instrument Sans, 16px, line-height 1.6, measure ≤ 70ch. Tabular figures on prices.
- **Arabic (later RTL):** IBM Plex Sans Arabic, same scale, loaded now so the switch does not change metrics later.

Scale (rem, fluid with `clamp`): 0.8125 · 0.9375 · 1 · 1.125 · 1.375 · 1.75 · 2.5 · 3.5 · 5.5.

Dimensions use a true multiplication sign: 79 × 42 × 31.

## Alignment

- 12 columns, 8px gutter, outer margin 16 / 32, max 1600px.
- Spacing: 4 · 8 · 16 · 24 · 40 · 64 · 104 · 168.
- Left-aligned text everywhere except 404 / empty / error.
- Headlines start in column 1. Body sits in columns 1–5 or 7–11.
- Images: product 4:5; slabs and rooms 3:2 or 16:9. Shopify focal points when present.
- Borders only for selected state, table row, or input.

## Motion (only these)

1. Home hero seam: halves start 24px apart, close in 900ms, once per session; skipped with `prefers-reduced-motion`.
2. Cart drawer 240ms; accordion; material texture and header tint 300ms; price roll 200ms; add-to-cart label in the button; mobile filter drawer.
3. Product card second image on hover only if a second image exists. No scale, no shadow.

## Layout concept

The memorable thing is **material-led pages**. Choosing a stone retints the product header and swaps the macro strip. The rest of the site stays quiet so that change is readable.

### Home

```
[ bookmatched slab: two halves | headline in the seam                    ]
[ Shop furniture | Design a custom table ]   left-aligned under seam
[ three facts, one Travertine panel                                      ]
[ Coffee tables (wide) | Dining (tall) | Side | Console                  ]
[ eight material slabs in a horizontal rail, name + origin               ]
[ featured: photo 7 cols | name, stones, price 5 cols                    ]
[ Clearance: Marquina panel, headline left, photo right                  ]
[ Shop the look: room + pins | product list                              ]
[ Custom table: five numbered steps (this is a real sequence)            ]
[ Magazine: one large + two small                                        ]
[ three reviews, no carousel                                             ]
[ newsletter, one line                                                   ]
```

### Collection

```
[ slab photo 7 cols | title + count 5 cols, not over the photo           ]
[ optional material facts: origin, character, care, uses                 ]
[ filters sticky left (drawer on small screens) | 4/2 product grid       ]
[ chips for active filters                                               ]
[ Load more + ?page=                                                     ]
[ SEO + FAQ in a narrow column                                           ]
```

### Product

```
[ header band = selected stone colour: breadcrumb, name                  ]
[ gallery 7 cols + thumbs | info 5 cols: swatches, size, price, add      ]
[ macro texture strip, full width, 280px                                 ]
[ specs table left | care and delivery right                             ]
[ three related products                                                 ]
[ reviews                                                                ]
```

### Custom table

```
[ sticky SVG preview (shape × size × stone texture) | numbered steps     ]
[ estimate range, labelled as an estimate                                ]
```

## Critique against the brief (what would have been generic)

A first pass of this plan still read like a home-decor template: a full-bleed lifestyle hero, a four-up equal card row, gold-on-cream, tracked eyebrows, “crafted for living”, and a carousel of reviews. That is any furniture site.

Changes made after that pass:

1. **Hero is a bookmatched slab, not a room.** The seam is a workshop fact (how slabs are sold), not a cinematic interior. Headline sits in the joint, not over a dark gradient.
2. **No eyebrows.** Collection count is allowed because it is data. “The collection” as a label is not.
3. **Mosaic tiles instead of equal cards.** Coffee tables get the wide slab because that is the volume seller; dining is tall; side and console are small. Same gutter, different proportions — like mixed slabs on a rack.
4. **Jungle Green as the action colour**, taken from a stone on the price list, instead of terracotta, gold, or black-and-neon.
5. **Calacatta page ground is cool** (`#F1F2EF`), not ivory. Cream-and-gold is the cliché the brief forbids.
6. **Reviews are three static quotes**, not a slider. Numbered markers only on the custom-table sequence.
7. **Material change is the only theatrical moment on product pages.** Everything else is a rack of rectangles.

## Screenshot notes

Filled in after each page is built. Format: width · memorable element · anything decorative removed · grid / contrast issues.

### Removal of one accessory (per page, before sign-off)

Recorded here as pages ship, so a reviewer can see what was cut rather than added.

## Build notes after implementation

- Tokens live in `app/globals.css` (`@theme` + `:root`). No leftover v1 names.
- Contrast helper: `lib/contrast.ts`.
- Fallback stone colours when a metaobject `color_hex` is missing: `lib/stones.ts`.
