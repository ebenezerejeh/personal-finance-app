# Component Reference
> Extracted from Figma Design System screenshots.
> Use this as a build guide alongside `tokens.css`.

---

## Sidebar

### Variants
| Variant            | Breakpoint | Description                                              |
|--------------------|------------|----------------------------------------------------------|
| Desktop Expanded   | `lg+`      | Vertical, dark bg (`grey-900`), logo + nav labels        |
| Desktop Collapsed  | `lg+`      | Vertical, dark bg (`grey-900`), icons only, narrow       |
| Tablet             | `md`       | Horizontal bar, icons + labels                           |
| Mobile             | `sm`       | Horizontal bar, icons only, no labels                    |

### Structure (Desktop Expanded)
- Top: "finance" logo/wordmark (white)
- Middle: Nav items list
  - Each item: icon + label
  - Nav items: Overview, Transactions, Budgets, Pots, Recurring Bills
- Bottom: "Minimize Menu" button (icon + label)

### Nav Item States
- **Default:** icon + label, muted/grey text, no background
- **Active:** white rounded pill background, dark text + icon (uses `green` accent on icon or active indicator)
- **Hover:** subtle highlight (to be confirmed from full design screens)

### Sidebar Icons (nav)
| Page            | Icon description         |
|-----------------|--------------------------|
| Overview        | House/home icon          |
| Transactions    | Up-down arrows icon      |
| Budgets         | Pie/donut chart icon     |
| Pots            | Savings pot/jar icon     |
| Recurring Bills | Receipt/bill icon        |

---

## Buttons

### Variants
| Variant     | Background       | Text         | Usage                        |
|-------------|------------------|--------------|------------------------------|
| Primary     | `grey-900`       | `white`      | Main CTA actions             |
| Secondary   | `beige-100`      | `grey-900`   | Secondary actions            |
| Text Link   | Transparent      | `grey-900`   | Inline links with arrow `›`  |
| Destructive | `red` (#C94736)  | `white`      | Delete / destructive actions |

### Notes
- All buttons appear in two sizes (regular + small)
- Border radius: rounded (pill-style based on screenshots)
- Font: Public Sans Bold, 14px (Text Preset 4 Bold)
- Text link variant uses a trailing arrow icon (`›`)

---

## Icons Collection
A custom icon set used throughout the app. Key icons identified:

**Navigation:**
- Home (Overview)
- Transactions (up-down arrows)
- Budgets (chart/donut)
- Pots (jar/pot)
- Recurring Bills (receipt)
- Minimize menu (arrow left)

**UI / Utility:**
- Search (magnifier)
- Sort / filter (lines)
- Arrow right / left / up / down
- Close (X)
- More options (ellipsis `...`)
- List view
- Settings / wrench
- Shield
- Eye / eye-off
- Plus / add
- Notification bell
- Dollar / currency
- Refresh / recurring indicator

> Note: Icons appear to be a custom SVG set. Source SVGs should be placed in `public/icons/` and used via Next.js `<Image>` or inlined as React components.

---

## Input Fields

### Variants
| Variant             | Description                                              |
|---------------------|----------------------------------------------------------|
| Basic Field         | Plain text input, label above, helper text below         |
| Field With Icon     | Input + search icon on the right                         |
| Field With Prefix   | `$` prefix on the left inside the input                  |
| Field With Color Tag| Colored dot on left + dropdown arrow on right (select)   |

### Styling
- Border: 1px solid `grey-300`, rounded corners
- Background: `white`
- Label: `grey-900`, Text Preset 5 Bold (12px bold), above the field
- Placeholder: `grey-500`, Text Preset 4 (14px regular)
- Helper text: `grey-500`, Text Preset 5 (12px regular), below the field
- Prefix (`$`): `grey-500`
- Color tag: circular dot using theme color (e.g. `green`)
- Dropdown arrow: `grey-500`, right-aligned
- Focus state: border color `grey-900`

### Field States (4 states)
- Default
- Hover
- Focus (border darkens to `grey-900`)
- Disabled / Error (to be confirmed from page-level designs)

---

## Pagination

### Structure
`← Prev | 1  2  [active]  4  5 | Next →`

### Styling
- Prev/Next: outlined button, border `grey-300`, text `grey-900`, arrow icon
- Page number (inactive): transparent bg, text `grey-500`
- Page number (active): `grey-900` bg, `white` text, rounded
- Font: Text Preset 5 Bold (12px)

---

## Profile Pictures / Avatars

### Company Logos
- Shape: square with rounded corners
- Background: solid theme color (varies per company)
- Content: white icon/logo inside
- Size: ~40px (list view)

### Person Photos
- Shape: square with rounded corners (or circle in list view)
- Content: real photo avatar
- Size: ~40px (list view)

---

## Company & Person Data
> Source of truth for transaction avatars and recurring bill merchants.

### Companies (with category)
| Company                    | Category       |
|----------------------------|----------------|
| Elevate Education          | Education      |
| Serenity Spa & Wellness    | Personal Care  |
| Spark Electric Solutions   | Bills          |
| Swift Ride Share           | Transportation |
| Pixel Playground           | Entertainment  |
| Aqua Flow Utilities        | Bills          |
| EcoFuel Energy             | Bills          |
| Savory Bites Bistro        | Dining Out     |
| Flavor Fiesta              | Dining Out     |
| Buzz Marketing Group       | General        |
| TechNova Innovations       | Shopping       |
| Green Plate Eatery         | Groceries      |
| ByteWise                   | Lifestyle      |
| Urban Services Hub         | General        |
| Nimbus Data Storage        | Bills          |

### People (with category)
| Person               | Category       |
|----------------------|----------------|
| Emma Richardson      | General        |
| Sun Park             | General        |
| Liam Hughes          | Groceries      |
| Ethan Clark          | Dining Out     |
| James Thompson       | Bills          |
| Yuna Kim             | Dining Out     |
| Mason Martinez       | Lifestyle      |
| William Harris       | General        |
| Daniel Carter        | General        |
| Harper Edwards       | Shopping       |
| Lily Ramirez         | General        |
| Rina Sato            | Bills          |
| Ella Phillips        | Dining Out     |
| Sofia Peterson       | Transportation |
| Sebastian Cook       | Transportation |

---

## Login / Signup Illustration
- **Usage:** Decorative full-height image on the left panel of the login and signup pages
- **Content:** Illustrated person running/jumping toward a large savings pot (jar), dark background
- **Color palette:** Cyan/teal, beige/cream, dark (`grey-900`) background — matches app theme
- **Layout:** Takes up ~50% of the screen on desktop (split layout: illustration left, form right)
- **Source:** Store in `public/images/illustration-auth.svg` (or `.png`)
- **Mobile:** Hidden on small screens — form takes full width

---

## Responsive Behaviour Summary
| Component        | Mobile (`sm`)               | Tablet (`md`)              | Desktop (`lg+`)                    |
|------------------|-----------------------------|----------------------------|------------------------------------|
| Sidebar          | Bottom icon bar (no labels) | Bottom/top icon+label bar  | Left vertical panel (collapsible)  |
| Buttons          | Full width where appropriate| —                          | Fixed width or inline              |
| Login/Signup     | Form only, no illustration  | Form only                  | Split: illustration left, form right |
| Input Fields     | Full width                  | Full width                 | Constrained width                  |
| Pagination       | Prev/Next only              | Full                       | Full                               |
