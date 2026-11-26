---
title: IRS WISP & FTC Safeguards for tax preparers
description: IRS WISP and FTC Safeguards Rule for tax preparers: 9 controls, a 7-day plan from Pub 5708, and original data on 604 US Hispanic business domains.
date: 2026-11-26
updated: 2026-11-26
tags: irs wisp, ftc safeguards rule, written information security plan, tax preparers, dmarc
image: /blog/irs-wisp-ftc-safeguards-tax-preparers/dmarc-camaras-hispanas.svg
imageAlt: DMARC policy distribution across 604 email domains of US Hispanic chamber members
lang: en
alternate: plan-wisp-irs-ftc-safeguards-preparadores-impuestos
---

# IRS WISP and the FTC Safeguards Rule for tax preparers: 9 controls, and what 604 Hispanic chamber member domains reveal

**Short answer:** if you prepare tax returns in the United States, federal law requires a **Written Information Security Plan (WISP)**. The requirement comes from the Gramm-Leach-Bliley Act and is enforced by the FTC through the **Safeguards Rule (16 CFR Part 314)**, which names *tax preparation firms* as "financial institutions." The IRS asks about it every year: **line 11 of Form W-12 (Rev. 10-2026)**, the PTIN application, has you confirm you are aware that "paid tax return preparers are required by law to create and maintain a written information security plan."

PTIN renewal for 2027 is due **December 31, 2026**. This guide gets the plan written in one week, in plain English, using the exact terms the IRS, the FTC and your cyber insurer use. A Spanish version is linked at the top for bilingual offices.

## 1. Original data: 62.7% of measured Hispanic businesses can be spoofed by email

Before writing about the plan, we measured where the money is lost: email. On November 26, 2026 we walked the **public member directories of two US Hispanic chambers of commerce** (Fort Worth Hispanic Chamber, Texas, and the Statewide Hispanic Chamber of Commerce of New Jersey): **915 listings**, taking only the "Visit Website" link each member publishes. That produced **604 domains that receive email** (MX record), which we read through public DNS without touching their servers.

![DMARC policy distribution across 604 email domains of US Hispanic chamber members](/blog/irs-wisp-ftc-safeguards-tax-preparers/dmarc-camaras-hispanas.svg)

| Measurement (604 email domains, Nov 26, 2026) | Domains | % |
|---|---|---|
| No DMARC record | 171 | 28.3% |
| DMARC `p=none` (monitor only) | 208 | 34.4% |
| DMARC `p=quarantine` | 111 | 18.4% |
| DMARC `p=reject` | 114 | 18.9% |
| **Spoofable (no DMARC or `p=none`)** | **379** | **62.7%** |
| No SPF record | 51 | 8.4% |

Three takeaways for an accounting or tax office:

- **Finance does better, not well.** In the directories' *Finance & Insurance* category (91 email domains: banks, insurers, accountants and tax preparers), 45.1% are still spoofable and 37.4% already block fake mail with `p=reject`. Restaurants (80.8%), law offices (75%) and construction (68.1%) are worse.
- **The chambers themselves fail too.** Of 27 Hispanic chamber and `.org` domains we measured, 59.3% are spoofable and only 7.4% enforce `p=reject`.
- **The federal government already solved this.** All 3 federal `.gov` portals with email in the sample (CISA, FTC and MBDA) are at `p=reject`, because CISA's BOD 18-01 made it mandatory for federal agencies in 2018.

On the homepages of the same sites (654 active), **72.2% send no Content-Security-Policy**, **45.1% send no HSTS** and **27.9% send none** of five basic security headers. In Mexico, with the same method, 66% of 285 domains were spoofable: the problem does not change at the border.

**Why it matters for your WISP:** Business Email Compromise (BEC) caused **$2.77 billion in reported losses** in 2024, according to the FBI IC3 annual report. In a tax office, the same fake email is used to request W-2s and ID copies or to change the account a refund lands in. Check your own domain for free with the [SPF and DMARC checker](/en/dmarc-spf-checker).

## 2. What the FTC Safeguards Rule requires, in 9 controls

Section 314.4 lists the program elements. This table sizes them for a 1–10 person office:

| Element (16 CFR 314.4) | What to do in a small office | Evidence to keep |
|---|---|---|
| (a) Qualified Individual | Name one responsible person in writing (usually the owner). | Page 1 of the WISP with name and date. |
| (b) Risk assessment | List where SSNs, ITINs, W-2s and bank accounts live: tax software, email, cloud, paper. | Dated risk table. |
| (c)(1)-(2) Access and inventory | One account per employee, no shared logins; inventory of devices and apps. | Device inventory and who can access what. |
| (c)(3) Encryption | Encrypted disks (BitLocker or FileVault), a secure client portal, never unencrypted attachments. | Screenshot of encryption per device. |
| (c)(5) Multi-factor authentication | MFA for **anyone** accessing a system with client data: tax software, email, cloud. | MFA settings per user. |
| (c)(6) Secure disposal | Delete or destroy data no later than **2 years** after last use, unless law requires keeping it. | Retention policy and disposal log. |
| (c)(8) Monitoring and logs | Sign-in alerts; review forwarding rules in Microsoft 365 or Google Workspace. | Monthly alert export. |
| (e)-(f) People and vendors | Yearly phishing training; IT and cloud contracts that require safeguards. | Attendance list and signed contracts. |
| (j) FTC notification | If an incident exposes data of **500 or more consumers**, notify the FTC through its web form **within 30 days** (in force since May 13, 2024). | Response plan with the form link. |

**The small-office exemption is narrower than it looks.** Section 314.6 exempts institutions holding data on **fewer than 5,000 consumers** from only four items: the written risk assessment, annual penetration testing with scans every six months, the written incident response plan and the annual board report. **Everything else still applies**: a designated individual, encryption, MFA, disposal, training, vendor oversight and FTC notification. The IRS still recommends a written data theft response plan, and your insurer will almost certainly ask for one.

## 3. Your WISP in 7 days, following IRS Publication 5708

The IRS and the Security Summit published **Publication 5708** (*Creating a Written Information Security Plan for your Tax & Accounting Practice*, rev. August 2024), a template of about 28 pages for small practices, and **Publication 4557** (*Safeguarding Taxpayer Data*) with the technical controls. This order works:

1. **Day 1 · Owner and scope.** Name the Qualified Individual; list offices, devices and people (seasonal staff included).
2. **Day 2 · Data map.** Where client documents arrive (email, WhatsApp, portal, paper), where they are stored and who sees them.
3. **Day 3 · Email and domain.** One SPF record ending in `-all`, DKIM signing, DMARC moving to `p=quarantine` and then `p=reject`. Check every mailbox for hidden forwarding rules.
4. **Day 4 · MFA and accounts.** MFA on tax software, email and cloud; remove former employees and shared users.
5. **Day 5 · Encryption and backup.** Encrypted disks, an off-site backup tested with a real restore.
6. **Day 6 · Response plan.** Who calls whom: your IRS Stakeholder Liaison, police, your insurer, the FTC if 500+ consumers, and any state authorities that apply.
7. **Day 7 · Sign and schedule.** Sign it, keep it accessible, schedule the yearly review and training before January.

Meanwhile, do not: collect documents over personal WhatsApp or unencrypted email, share the tax software password among seasonal staff, or accept a bank account change by email without calling a number you already had.

## 4. If you use AI or WhatsApp with clients

Many bilingual offices already receive documents over WhatsApp or test AI assistants to book appointments. Both belong in the WISP: the channel is an "information system" under the rule and the provider is a "service provider" you must oversee. At minimum, the assistant **must not keep SSNs or ID photos in its history**, its permissions should be read-only wherever possible, and every handoff to a person should be logged. More in our [bilingual commercial AI page](/en/commercial-ai) and [security services](/en/security).

## 5. Method and limits

- **Sample:** public ChamberMaster directories of FWHCC (Texas, 716 listings) and SHCCNJ (New Jersey, 199 listings), excluding the government and education category; 689 listings had a website and 604 domains had MX. This is not a random sample of all US Hispanic businesses: they are chamber members who publish their site.
- **What we did:** DNS-over-HTTPS queries (MX, SPF, `_dmarc`) and one homepage visit (http and https) to read headers. No hidden paths, no port scans, no offensive testing.
- **What we publish:** aggregates only. Names of domains with weaknesses are never published.
- **Not legal advice.** Omona performs **defensive-only** reviews with written authorization from the system owner; it does not perform penetration tests. If you hold data on 5,000 or more consumers, the annual penetration test must come from a qualified provider.

**Sources:** 16 CFR Part 314 (eCFR, as of Nov 24, 2026); IRS Form W-12 (Rev. 10-2026), line 11; IRS Publications 5708 and 4557; FBI IC3 *2024 Internet Crime Report*; CISA BOD 18-01; Omona's own measurement of Nov 26, 2026.
