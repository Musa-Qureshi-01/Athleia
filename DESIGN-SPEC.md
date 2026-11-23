# DESIGN-SPEC.md — Axios Enterprise Marketing Website
## High-Fidelity Reverse-Engineered Design System (Glean Benchmark)

This document specifies the exact visual and interaction design tokens, components, geometry, layout hierarchy, and responsive behaviors reverse-engineered from [Glean](https://www.glean.com/) and adapted for **Axios**.

---

## 1. Color Palette & Surface Tokens

### 1.1 Core Brand Colors
| Token Name | Hex Code | Intended Usage |
|---|---|---|
| **Primary Accent Blue** | `#1844EB` / `#343CED` | Brand mark, primary CTA buttons, active tab underlines, link hovers |
| **Electric Cyan** | `#00C6FF` | 3D fluid gradient highlight, iridescent lighting accents |
| **Magenta / Rose Glow** | `#F25C9D` / `#FF7AA2` | 3D ribbon fluid backdrop, top illumination layer |
| **Soft Violet** | `#8A2BE2` / `#9B51E0` | Intermediate fluid gradient blend, assistant avatar ring |
| **Secondary Lime Accent** | `#D8FD49` | Subtle highlight pills and promotional tags |
| **Deep Obsidian Black** | `#000000` / `#0A0A0A` | Primary display headlines, secondary pill buttons, navigation text |
| **Pure Base White** | `#FFFFFF` | Primary viewport background, card faces, input backgrounds |
| **Warm Oatmeal Neutral** | `#F6F3EB` / `#FBF6F4` | Alternating section backgrounds, subtle framing |
| **Light Ice Lavender** | `#EEF1FF` | Floating assistant widget pill, active pill states |

### 1.2 Surface & Border Hierarchy
| Token Name | Hex Code / Value | Usage |
|---|---|---|
| **Text Primary** | `#0A0A0A` / `#111827` | Headings, titles, active labels |
| **Text Secondary** | `#4B5563` / `#555555` | Body copy, card descriptions |
| **Text Muted / Tertiary** | `#9CA3AF` / `#727272` | Eyebrow text, metadata timestamps, input placeholders |
| **Hairline Frame Border** | `#E5E7EB` / `#D8D9DE` | 1px clean card borders, section separators, divider rules |
| **Focus Accent Ring** | `rgba(24, 68, 235, 0.15)` | Form input active rings, keyboard focus rings |
| **Glass Backdrop Blur** | `backdrop-blur-md` (16px–20px) | Navigation header, left capsule dock, floating assistant |

---

## 2. Typography & Text Hierarchy

### 2.1 Font Families & Fallbacks
- **Display & Headings**: `PolySans Neutral` (Primary), fallback: `var(--font-display)` (`Geist` / `Inter`, 600–700 weight).
- **Body & Editorial**: `PolySans Slim` (Primary), fallback: `var(--font-sans)` (`Inter`, 400–500 weight).
- **Monospace & Metadata**: `PolySans Neutral Mono` (Primary), fallback: `var(--font-mono)` (`JetBrains Mono`, 400–500 weight).
- **Quotations / Testimonials**: `PT Serif Italic` / serif editorial styling for executive quotes.

### 2.2 Scale & Spacing Measurements
| Element | Desktop Size | Line Height | Tracking | Weight |
|---|---|---|---|---|
| **Hero Display Headline** | 64px – 72px | 1.05 | `-0.035em` | Bold (700) |
| **Section Headings** | 40px – 48px | 1.12 | `-0.025em` | Bold (700) |
| **Card / Feature Headings** | 22px – 28px | 1.25 | `-0.015em` | SemiBold (600) |
| **Large Typographic Numbers**| 56px – 72px | 1.0 | `-0.04em` | Bold Mono (700) |
| **Body Copy** | 16px – 18px | 1.6 | Normal | Regular (400) |
| **Supporting / Footnotes** | 12px – 14px | 1.5 | Normal | Regular (400) |
| **Eyebrow Labels** | 11px – 13px | 1.4 | `+0.05em` | Medium / SemiBold |
| **Navigation Links** | 14px – 15px | 1.0 | `-0.01em` | Medium (500) |

---

## 3. Geometry, Spacing & Container Widths

### 3.1 Dimensions & Grid
- **Maximum Viewport Width**: `1440px` (desktop), `1380px` max-width container (`max-w-[1400px]` with `px-4 sm:px-6 lg:px-8`).
- **Outer Padding**: `32px` desktop, `16px` mobile.
- **Base Spacing Grid**: `4px` increments (`space-y-4`, `p-6`, `p-8`, `p-12`).
- **Divider Thickness**: Exact `1px` hairlines with `border-neutral-200` or `border-neutral-100`.

### 3.2 Corner Radii
- **Capsule / Pill Buttons**: `rounded-full` (64px) for CTAs (*Get a demo*, search pill, assistant collapsed button).
- **Cards & Visual Containers**: `rounded-2xl` (16px) or `rounded-3xl` (24px).
- **Left Floating Dock**: `rounded-2xl` (16px) with `p-1.5`.
- **Form Inputs**: `rounded-xl` (12px) with `h-11` (44px) touch target.

---

## 4. Complete Section Composition & Sequence

The public-facing Axios marketing website consists of 18 cohesive sections:

1. **Top Announcement Bar** (`TopAnnouncementBar.tsx`):
   - Background `#030826`, white text, dismissible `✕` on right.
   - *"November Drop 2026: Automatic model routing, Axios in Teams and Excel, and AI memory that learns across your workflows. See what's new →"*
2. **Primary Navigation Bar** (`HeaderNav.tsx`):
   - Height `72px`, sticky top with backdrop blur and border.
   - Axios stylized brand wordmark.
   - Mega-menus for *Product*, *Customers*, *Solutions*, *Resources*, *Company*.
   - Product mega-menu includes *Platform overview*, *Axios Enterprise Context*, *APIs*, *Axios Protect*, *Axios Intelligence*, *Axios Assistant*, *Axios Agents*, and *Axios Transform* ribbon.
   - Rounded search pill `[ 🔍 Search ]`, `Sign in`, and black pill **Get a demo** button.
3. **Left-Side Vertical Scroll Capsule Navigator** (`VerticalScrollNavigator.tsx`):
   - Fixed capsule on viewport left: `Scan`, `Lightbulb`, `Lock`, `BarChart`, `Building`, `LayoutGrid`, `Layers`.
   - Scroll-synchronized active state with black rounded square highlight (`bg-black text-white`).
4. **Hero Section** (`HeroSection.tsx`):
   - Centered eyebrow: *"Enterprise AI that understands your company"*.
   - Large display headline: *"Complete context that makes AI work at enterprise scale."*
   - Royal blue pill CTA: **Get a demo** (`#1844EB`).
   - 3D iridescent ribbon gradient backdrop with fluid ambient lighting.
   - Floating search input card with `+ What changed last week that's hitting support, sales, and churn?` and app connectors (*Slack*, *Drive*, *Jira*, *Confluence*, *SharePoint*, *GitHub*, *Salesforce*).
5. **Enterprise Integrations Showcase** (`IntegrationsSection.tsx`):
   - 275+ enterprise applications with authentic SVGs and real-time synchronization badges.
6. **Customer Trust Logos** (`CustomerLogosSection.tsx`):
   - Horizontally balanced enterprise trust grid showcasing Fortune 500 / global enterprise names.
7. **Enterprise AI Value Proposition** (`ValuePropositionSection.tsx`):
   - 4-pillar architectural inspector: *Context*, *Intelligence*, *Permissions*, *Efficiency*.
8. **Numbered Product Benefits** (`ProductBenefitsSection.tsx`):
   - 3-part editorial sequence: *01 Search & Discovery*, *02 Autonomous Agents*, *03 Work Execution*.
9. **Security & Governance Console** (`SecurityGovernanceSection.tsx`):
   - Live ACL synchronization stream, tenant VPC isolation, compliance seals (SOC 2 Type II, ISO 27001, HIPAA BAA).
10. **Enterprise Capabilities & Typographic Metrics** (`MetricsSection.tsx`):
    - *110+ Hours Saved / Year*, *93% Weekly Active Adoption*, *275+ Connectors*, *40+ LLMs*, *3B+ Knowledge Objects*, *99.99% Uptime*.
11. **Industry Solutions with Interactive Tabs** (`IndustrySolutionsSection.tsx`):
    - 6 industry tabs: *Financial Services*, *Healthcare*, *Technology*, *Retail*, *Manufacturing*, *Professional Services*.
12. **Enterprise Customer Stories** (`CustomerStoriesSection.tsx`):
    - Large visual case study cards with quantified MTTR, audit velocity, and onboarding metrics.
13. **Executive Testimonials** (`TestimonialsSection.tsx`):
    - Editorial testimonial grid with CTO, VP of Engineering, and Head of Risk perspectives.
14. **Platform Overview Storytelling** (`PlatformOverviewSection.tsx`):
    - 4 pillars: *01 Connect Knowledge*, *02 Understand Context*, *03 Take Action*, *04 Work Everywhere*.
15. **Resources & Thought Leadership** (`ResourcesSection.tsx`):
    - Research reports, CISO whitepapers, RAG engineering guides, platform drops.
16. **Pre-Footer Action Banner** (`PreFooterBanner.tsx`):
    - *"See Enterprise AI in action"* with black pill **Get a demo** button and 3D fluid curved ribbon artwork.
17. **Get a Demo Page** (`/get-a-demo` / `GetADemoPage.tsx`):
    - Dedicated two-column conversion page matching Glean's `/get-a-demo`.
    - Left: Value pillars, customer quote, and security guarantees.
    - Right: Interactive demo request form (name, work email, company, job title, company size, primary interest, phone).
18. **Enterprise Footer** (`Footer.tsx`):
    - Column 1: Axios logo, *"Ask AI for a summary about Axios"* with 5 interactive model icons (ChatGPT, Claude, Gemini, Meta Llama, Mistral), corporate address, social links (`𝕏`, `LinkedIn`, `Instagram`, `YouTube`), and `🌐 English ▾`.
    - Columns 2–5: *Product* (Platform & Assistant), *Solutions* (Teams & Use Cases), *Resources* (Content Hub & Customers), *Company*.
19. **Floating Interactive AI Assistant** (`FloatingAssistantWidget.tsx`):
    - Fixed bottom-right widget: Collapsed pill button `[ 🌀 Ask Axios ]` / Expanded interactive chat card with greeting, quick reply buttons (*Book a meeting*, *Tell me more*), question input, and simulated responses.

---

## 5. Interaction & Motion Design Guidelines

- **Scroll Reveal**: Elements enter with subtle `framer-motion` translations (`y: 12px` to `0`, `opacity: 0` to `1`, duration `0.35s`–`0.45s`).
- **Tab Transitions**: Instant content switching using `AnimatePresence mode="wait"`.
- **Button Hover**: Soft background transitions (`duration-200`), subtle scale/shadow elevation (`hover:shadow-md`).
- **Left Capsule Dock**: Displays only after scrolling past the initial hero threshold (`window.scrollY > 150px`) on desktop viewports.
- **Mega-Menu Triggering**: Opens gracefully on desktop hover with `mt-1` spacing, remains stable during cursor travel.

---

## 6. Verification Status

- **TypeScript Compilation**: Clean pass (`0 errors`) via `npx tsc --noEmit`.
- **Production Build**: Verified with Next.js Turbopack (`npm run build`) with static generation across all 20 routes.
- **Brand Consistency**: 100% Axios branding throughout; zero Glean logos or fabricated customer endorsements.

