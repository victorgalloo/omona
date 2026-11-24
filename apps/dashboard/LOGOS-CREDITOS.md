# Logo credits: SuperLeads startup programs (omona.tech/about → Origin)

The "SuperLeads, where I work, is part of" strip on `/about` comes from `PROGRAMAS_SL` in `src/lib/perfil.ts`.
These programs accepted **SuperLeads** (the company Victor works at), not Victor or Omona; acceptances verified in the
victor@superleads.mx inbox. Footnote: "Trademarks belong to their owners; their use does not imply sponsorship or
endorsement." Reviewed 2026-11-24.

## Owner decision (2026-11-24)
Victor (site owner), after being told that Google, AWS and Anthropic require **prior written permission** to use
their logos, decided: «Sí, ponlos» (yes, show them). Since 2026-11-24 all four programs show their official logo.
**Written permission from Google, AWS and Anthropic: pending** (request it and record the answer here).

**Revert:** if an owner asks to remove its logo, set its key to `false` in `LOGO_PROGRAMAS` (`src/lib/perfil.ts`) and
push; that cell falls back to the program name in plain text.

## How they are shown
Files are **byte-identical** to the owner's originals (sha256 below), never recolored or cropped, light-background
full-color versions. Each cell is 120 × 52 px; the visible box is 108 × 40 px: the NVIDIA badge has its own, the other
three sit on a white 108 × 40 plate (light background as each guide asks; clear space 7–11 px top/bottom, 9–18 px on
the sides, plus 20 px column gap). The program name sits underneath. Each logo links to its program page; `alt`
carries the program name.

| Program | File in `public/logos/programas/` | Official source | sha256 | Size |
|---|---|---|---|---|
| Google for Startups Cloud Program | `googleforstartups-cloudprogramidentifier-horizontal-rgb-13.svg` | Official program identifier on https://startup.google.com/cloud/ (`https://www.gstatic.com/marketing-cms/assets/images/aa/b1/cc68de8d4a2cb3d377be3715e9ee/googleforstartups-cloudprogramidentifier-horizontal-rgb-13.svg`). Google publishes no downloadable "Google for Startups" lockup (its header is the Google logo + HTML text), so the name goes underneath instead of building our own lockup | `1119a52aa0fe9ef282d94f035f19190e6ebfc1d97ce713914221af14d26d8214` | 90 × 22 |
| AWS Activate | `powered-by-aws.png` | "Powered by AWS" logo (light-background version) from https://aws.amazon.com/co-marketing/ (`https://d0.awsstatic.com/logos/powered-by-aws.png`, 200 × 72). No public AWS Activate artwork exists (its logo page is gone and required written authorization) | `e794fa14354931946566471329dc7cecee7d319c8d4a15d062902d5c918d8d93` | 72 × 26 |
| NVIDIA Inception | `nvidia-inception-program-badge-rgb-for-screen.svg` | "Download Badge" on https://design.nvidia.com/partners/inception/nvidia-inception-program/member-badge → zip "Inception Badges 8/8/2023", `for-screen/…-rgb-for-screen.svg`. Members may use it on their web pages; colors unchanged; 30 px digital minimum; one NVIDIA eye of clear space | `d2f1fc25616ba02933506b21fa668289169e58ac4c76b5f7f209f2632f289f2e` | 120 × 52 (box ~108 × 40) |
| Claude Startups (Anthropic) | `claude-logo-slate.svg` | Official press kit https://www.anthropic.com/press-kit (redirects to `https://assets.claude.com/ae59ca4ca194dac9c9dc3bc78c5829468cb0e8af.zip`) → `Claude logos/1 Claude logo/SVG/Claude logo - Slate.svg` (renamed without spaces; content untouched) | `02737f748297f2c6e4863b775809038bda8549c7297e57070ed9e5ceafdf2871` | 82 × 18 |

## Guidelines that ask for permission (why it is pending)
- **Google:** "Google for Startups Cloud Program – Social Sharing Guidance" (Jul 2023): plain text is fine; the Google
  Cloud logo needs prior approval from Cloud Brand & Creative. https://about.google/brand-resource-center/guidance/partnerships/.
- **AWS:** https://aws.amazon.com/trademark-guidelines/: "Powered by AWS" is licensed to customers to identify content
  that uses AWS (SuperLeads does), but "never… to indicate an affiliation with AWS"; the AWS Activate logo needs
  written authorization.
- **Anthropic:** https://www.anthropic.com/legal/trademark-guidelines: "materials we approve beforehand"; contact
  marketing@anthropic.com.

## Permission requests (record date and answer here)
- Google Cloud: SuperLeads' Cloud Program contact, with a mock-up. — pending
- AWS: SuperLeads' AWS Startups team. — pending
- Anthropic: marketing@anthropic.com. — pending

Other logos on the site (home "I contribute to / I build on" strip) are documented in the omona-tech skill and
`src/lib/perfil.ts` (`CONTRIBUYO`, `CONSTRUYO_SOBRE`).
