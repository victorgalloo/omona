---
title: Cyber insurance for small business: checklist
description: Cyber insurance requirements for small business: the application questions, the outside-in scan, immutable backups, and data on 595 US Hispanic businesses.
date: 2026-11-27
updated: 2026-11-27
tags: cyber insurance small business, cyber insurance requirements, cyber insurance application, immutable backup, underwriting
image: /blog/cyber-insurance-small-business-checklist/senales-aseguradora.svg
imageAlt: Share of US Hispanic chamber member businesses that pass all 6 outside-in signals an insurer's scan checks, by group
lang: en
alternate: seguro-cibernetico-pequenas-empresas
---

# Cyber insurance for small business: what the application asks, what the insurer scans, and how to answer "yes" honestly

**Short answer:** a small-business cyber insurance application is a list of yes/no questions about a handful of controls: **MFA** on email and remote access, **EDR** on every device, **encrypted backups kept offline or immutable** and tested, **patching**, **no RDP open to the internet**, **phishing training** and a **written incident plan**. Before anyone reads your answers, many carriers also run an **outside-in scan** of your domain: email authentication (SPF, DMARC), HTTPS and exposed software. We ran those outside signals on **595 US Hispanic businesses**: only **17.3% pass all six**. And read the policy twice: the **NAIC** warns that standard cyber policies frequently **exclude or sharply limit social engineering and funds transfer fraud**, the loss Hispanic contractors and suppliers suffer most.

## 1. The market in 2026: more policies, more claims, lower prices

The National Association of Insurance Commissioners' **Report on the Cybersecurity Insurance Market** (2025 reporting year, published October 2026) counted:

| Indicator (US, 2025) | Value |
|---|---|
| Direct written premium, incl. alien surplus lines | **$9.46 billion** (+3.5%) |
| Domestic policies in force | **5.84 million** (+33%); nearly two-thirds are cyber **endorsements** to other commercial policies |
| Reported claims | **56,323** (+20%) |
| Industry loss ratio | **53**, up from 48.7 |
| Average claim severity, small and mid-sized enterprises (carrier data cited by NAIC) | about **$142,000**, down from about $215,000 in 2024 |
| Price trend | Q1 2026 was the **eighth straight quarter** of US cyber rate cuts |

Two takeaways for an owner of a 5–50 person business: coverage is cheaper and easier to get than in the 2021 hard market, and many owners "have cyber" only as an endorsement on a package policy, with low limits. Ask your agent which one you have.

## 2. The 12 controls behind almost every application

Marsh, one of the largest brokers, publishes the **12 key controls** that carriers correlate with fewer claims. They map almost one to one onto the questions you will see:

| Control | How the question usually reads | Evidence to keep |
|---|---|---|
| 1. MFA for remote and privileged access | "Is MFA enforced for email, remote access and admin accounts?" | Screenshot of the conditional-access or 2-step policy |
| 2. Email filtering and web security | "Do you filter inbound email? Do you use SPF/DMARC?" | Filtering console + DMARC record |
| 3. Secured, encrypted, tested backups | "Are backups offline/immutable? When did you last test a restore?" | Date and result of the last restore |
| 4. Privileged access management | "Are admin accounts separate from daily accounts?" | List of admin accounts |
| 5. EDR | "Do you have EDR on all endpoints and servers?" | Device count in the EDR console |
| 6. Patch and vulnerability management | "Are critical patches applied within 30 days?" | Update report |
| 7. Incident response plan | "Do you have a written, tested plan?" | One-page plan with phone numbers |
| 8. Awareness training and phishing tests | "How often do you train staff?" | Training log |
| 9. RDP mitigation and hardening | "Is RDP exposed to the internet?" | Firewall rule showing it is closed |
| 10. Logging and monitoring | "Do you keep and review logs?" | Retention setting |
| 11. End-of-life systems | "Any unsupported software?" | Inventory |
| 12. Digital supply chain risk | "Do you review vendors' security?" | Vendor list with MFA status |

**Never answer "yes" to a control you do not have.** A misstatement on the application is one of the common reasons a claim gets contested. If you are halfway, write "in progress" and the date.

## 3. Original data: what an insurer sees from outside, before reading your answers

On November 26, 2026 we measured **595 member businesses** of two US Hispanic chambers of commerce (Fort Worth Hispanic Chamber, Texas, and the Statewide Hispanic Chamber of Commerce of New Jersey) that publish both an email domain and an active website ([method](/blog/irs-wisp-ftc-safeguards-tax-preparers)). We checked six signals any outside scan can see: **(1)** valid SPF, **(2)** DMARC enforced (`p=quarantine` or `p=reject`), **(3)** HTTPS with a valid certificate, **(4)** HTTP redirecting to HTTPS, **(5)** HSTS, **(6)** no software version banner.

![Share of US Hispanic chamber member businesses that pass all 6 outside-in signals an insurer's scan checks, by group](/blog/cyber-insurance-small-business-checklist/senales-aseguradora.svg)

| Signal | Businesses failing it (of 595) |
|---|---|
| DMARC not enforced (none or `p=none`) | **377 · 63.4%** |
| No HSTS | **274 · 46.1%** |
| Invalid or missing SPF | 72 · 12.1% |
| Software version announced (e.g. `PHP/7.4`) | 69 · 11.6% |
| HTTP does not redirect to HTTPS | 60 · 10.1% |
| No valid HTTPS certificate | 14 · 2.4% |

- **Only 103 of 595 (17.3%) pass all six**; 275 (46.2%) pass four or fewer.
- **Construction:** 8.7% pass all six (n=69). **Health care:** 6.9% (n=29). **Finance & Insurance**, the sector that sells and underwrites policies: 34.1% (n=91).
- **By mail provider:** Google Workspace 7.6% (n=158), Microsoft 365 22.7% (n=220), businesses behind a filtering gateway 39.1% (n=69).
- **14 sites** still announce a PHP version without security support (older than 8.2).

These signals do not make you insurable by themselves, but they are the cheapest to fix and the first an outside scan reports. Check yours in two seconds with the [free passive domain diagnostic](/#diagnostico): its downloadable `.md` now includes the same six signals plus the application checklist above.

## 4. Immutable backups, in plain English

An **immutable backup** is a copy that nobody can change or delete for a set retention period, not even an administrator with a stolen password. Ransomware crews go after backups first; immutability (object lock or "WORM" storage) or a copy kept physically offline is what lets you restore without paying.

- **Rule of thumb:** three copies, on two kinds of storage, one offline or immutable.
- **Turn it on where you already pay:** most cloud storage and backup services for Microsoft 365 and Google Workspace offer object lock or immutable retention.
- **Test the restore.** The application asks *when* you last restored, not whether you have backups. Write down the date and how long it took.

## 5. The gap that hurts Hispanic contractors most: social engineering

The NAIC report is blunt: standard cyber policies **frequently exclude, or sharply limit, social engineering and funds transfer fraud losses**, often relying on a separate **crime** policy to respond. For a subcontractor paid by wire or ACH, that is the core risk: Business Email Compromise cost US victims **$3.05 billion** in 2025 across 24,768 complaints (FBI IC3).

Ask your agent, in writing: *"Does this policy cover social engineering / funds transfer fraud? What is the sublimit? Does it require a callback verification?"* Many policies pay only if you followed a callback procedure, so put yours on paper: our [wire and ACH fraud playbook](/blog/wire-fraud-ach-fraud-small-business) has a one-page version.

## 6. A 7-day plan before your renewal

1. **Day 1:** Turn on MFA for every mailbox and every admin; screenshot the policy.
2. **Day 2:** Publish DMARC at `p=none` with reports, fix SPF to a single record ([free checker](/en/dmarc-spf-checker)).
3. **Day 3:** Confirm EDR is on every laptop and server; count devices.
4. **Day 4:** Make one backup immutable or offline and run a test restore.
5. **Day 5:** Close RDP to the internet; check the router and any cloud VM.
6. **Day 6:** Write the one-page incident plan: insurer hotline, bank fraud line, ic3.gov.
7. **Day 7:** Move DMARC to `p=quarantine`, re-run the [diagnostic](/#diagnostico) and fill in the application with evidence.

If you are a tax preparer or bookkeeper, the same controls also cover most of your **IRS WISP** and **FTC Safeguards Rule** duties: see our [WISP guide](/blog/irs-wisp-ftc-safeguards-tax-preparers). If you run AI agents or a WhatsApp assistant, add them to the inventory: who can they email, which keys do they hold ([secure AI agents on AWS](/blog/seguridad-agentes-ia-aws-bedrock-mcp)).

## 7. Method and limits

- **Sample:** members with MX records and an active homepage from the public ChamberMaster directories of FWHCC (TX) and SHCCNJ (NJ), excluding government and education. Not a random sample of all US Hispanic businesses.
- **What we did:** re-read the same-day DNS-over-HTTPS (SPF, DMARC, MX) and single-homepage-request measurements; no new traffic, no hidden paths, no port scans.
- **What it is not:** an insurer's real scan (carriers also look for open ports, leaked credentials and end-of-life software we do not test). Aggregates only; no business is named.
- **Not insurance or legal advice.** Omona performs **defensive-only** reviews with written authorization from the system owner; it does not run penetration tests or sell insurance.

**Sources:** NAIC, *Report on the Cybersecurity Insurance Market, 2025 reporting year* (October 2026); Marsh, *Cyber resilience: 12 key controls to strengthen your security*; FBI IC3 *2025 Internet Crime Report*; Omona's own passive measurement of Nov 26, 2026.
