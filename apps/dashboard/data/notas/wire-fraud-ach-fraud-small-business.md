---
title: Wire fraud & ACH fraud: small business guide
description: Stop wire fraud, ACH fraud and fake invoices: callback rule, Positive Pay, 2026 Nacha rules, and original data on 604 US Hispanic business domains.
date: 2026-11-26
updated: 2026-11-26
tags: wire fraud, ach fraud, positive pay, business email compromise, nacha rules 2026
image: /blog/wire-fraud-ach-fraud-small-business/suplantables-por-proveedor.svg
imageAlt: Share of spoofable email domains by mail provider among 604 US Hispanic chamber member domains
lang: en
alternate: fraude-ach-wire-facturas-falsas-contratistas
---

# Wire fraud and ACH fraud for small businesses: stop the "new bank account" email before it costs you a payroll

**Short answer:** almost every wire or ACH fraud against a small business starts with one email: a supplier, subcontractor, title company or employee "updating" their bank account. You stop it with four controls, none of them expensive: **(1)** a written **callback rule** to a number you already had, **(2)** **two approvals** for any new payee, **(3)** **Positive Pay / ACH Positive Pay** and debit blocks from your bank, and **(4)** a domain that cannot be spoofed (**DMARC at `p=reject`** with DKIM). Since **June 19, 2026**, the Nacha Operating Rules also require every business that originates ACH payments to run risk-based fraud monitoring.

## 1. The numbers: $3.05 billion in 2025, and the money is harder to get back

The FBI's **2025 Internet Crime Report** (IC3, published April 2026) counted **24,768 Business Email Compromise complaints** with **$3,046,598,558 in adjusted losses**, up from 21,442 complaints and $2.77 billion in 2024. BEC was the second-costliest crime type after investment fraud.

Speed decides recovery. In 2025 the IC3 Recovery Asset Team ran its **Financial Fraud Kill Chain** on **3,900 incidents** with **$1.16 billion** in attempted theft and froze **$679 million (58%)**: $507 million on 3,574 domestic transfers and $172 million on 326 international ones. The FBI's own guidance in that report: if you discover a fraudulent transfer, **immediately contact your bank and request a recall**, and file at **ic3.gov** with full transaction details, regardless of the amount.

## 2. Original data: which mail setups leave Hispanic businesses spoofable

On November 26, 2026 we took the **604 email domains** published by members of two US Hispanic chambers of commerce (Fort Worth Hispanic Chamber, Texas, and the Statewide Hispanic Chamber of Commerce of New Jersey; [method in our WISP guide](/blog/irs-wisp-ftc-safeguards-tax-preparers)) and read, through public DNS only, who hosts their email and whether a stranger can send mail as them.

![Share of spoofable email domains by mail provider among 604 US Hispanic chamber member domains](/blog/wire-fraud-ach-fraud-small-business/suplantables-por-proveedor.svg)

| Mail provider (MX record) | Domains | Share | Spoofable (no DMARC or `p=none`) | DMARC `p=reject` | DKIM on default selector |
|---|---|---|---|---|---|
| Microsoft 365 | 225 | 37.3% | **48.4%** | 23.1% | 67.1% |
| Google Workspace | 159 | 26.3% | **84.9%** | 3.8% | 39.6% |
| Other hosting | 139 | 23.0% | **77.7%** | 10.8% | — |
| Filtering gateway (Proofpoint, Mimecast…) | 72 | 11.9% | **25.0%** | 56.9% | — |
| **All 604 domains** | 604 | 100% | **62.7%** | 18.9% | 55.7% of 384 measurable |

What it means for the owner:

- **Google Workspace is the weakest setup we measured.** 135 of 159 domains (84.9%) can be spoofed and only 6 enforce `p=reject`. Google does not sign your custom domain with DKIM until an admin generates the key: only 39.6% publish it on the default `google` selector (a floor: custom selectors are invisible to this method).
- **Microsoft 365 does better, not well.** Half (48.4%) are still spoofable.
- **Businesses that pay for a filtering gateway enforce DMARC** (56.9% at `p=reject`). The control is free; the difference is that someone owns it.
- **Payment-heavy sectors are not safer.** Across construction, equipment, transportation, real estate, manufacturing/wholesale and industrial supplies (129 domains), **65.9% are spoofable** and 15.5% enforce `p=reject`. MTA-STS, which protects mail in transit, appears on only 1.7% of all domains.

Check your own domain for free with the [SPF and DMARC checker](/en/dmarc-spf-checker), or run the [passive domain diagnostic](/#diagnostico): its downloadable `.md` report now includes a payment-diversion checklist tailored to Microsoft 365 or Google Workspace.

## 3. How the fraud actually happens (and where each control cuts it)

| Step of the scheme | What the owner sees | Control that breaks it |
|---|---|---|
| 1. Attacker spoofs your domain or a supplier's, or takes over a real mailbox | An email "from" a known contact | DMARC `p=reject` + DKIM; MFA on every mailbox |
| 2. Hidden inbox rule forwards or hides replies | Nothing: the thread looks normal | Block automatic external forwarding; review rules monthly |
| 3. "We changed banks", with a new W-9 and a letter on letterhead | A believable PDF, often at year-end | **A W-9 has no bank fields.** A W-9 that arrives with new bank details is a red flag |
| 4. Payment goes out by wire or ACH | Routine approval | Callback rule + two approvals + 24-hour hold on first payment to a new account |
| 5. Money leaves the receiving account in hours | The real supplier asks where its payment is | Same-day recall request + ic3.gov complaint |

Nacha's rules call this **"False Pretenses"**: a payment induced by someone misrepresenting their identity, their authority to act for another person, or the ownership of the account to be credited. That is exactly BEC, vendor impersonation and payroll diversion.

## 4. The 2026 Nacha rules in plain English

- **Phase 1, March 20, 2026:** all originating banks (ODFIs) and businesses or processors that originated 6 million or more ACH entries in 2023 must have risk-based processes to identify entries that are unauthorized or authorized under False Pretenses.
- **Phase 2, June 19, 2026:** the volume threshold disappears. **Every non-consumer originator**, third-party sender and service provider must comply, and review the process at least yearly. Receiving banks must also monitor incoming credits.
- **Standard entry descriptions:** since March 20, 2026, payroll credits must carry `PAYROLL` and consumer e-commerce purchase debits `PURCHASE`, which helps banks spot anomalies.

For a 5–50 person business, a reasonable "risk-based process" fits on one page: who can add payees, how a bank change is verified, what limit needs two approvals, and what gets reviewed each month. Ask your bank which tools it offers you; most already sell them.

## 5. The one-page playbook (print it next to accounts payable)

1. **Callback rule, in writing.** Any new or changed bank account is confirmed by phone to a number from your records or the original contract, never the one in the email or PDF. Log who called and when.
2. **Two people, always.** One enters the payee, another approves. Same for any wire or ACH above your limit.
3. **Hold the first payment.** 24 hours on any first payment to a new account; small test credits are not verification.
4. **Bank tools.** Positive Pay for checks, ACH Positive Pay or ACH debit blocks on the operating account, and alerts on every outgoing wire.
5. **Verify the payee's tax ID.** If you file Forms 1099, the IRS TIN Matching program checks the name and TIN on a W-9 before you pay a new subcontractor.
6. **Lock the mailbox.** MFA for everyone, no automatic external forwarding, DMARC moving from `p=none` to `p=quarantine` and then `p=reject`.
7. **Rehearse the bad day.** Your bank's fraud line, your insurer's claims number and ic3.gov, on the same sheet. Cyber insurance applications commonly ask about these same controls.

## 6. If you use AI or WhatsApp with customers and suppliers

A bilingual assistant that answers suppliers on WhatsApp or email **must never accept or confirm a change of bank details**: that request always goes to a person with the callback rule. Keep the assistant's permissions read-only, do not let it store account numbers, and log every handoff. More in our [bilingual commercial AI page](/en/commercial-ai) and [defensive security services](/en/security).

## 7. Method and limits

- **Sample:** the same 604 member domains with MX records from the public ChamberMaster directories of FWHCC (TX) and SHCCNJ (NJ), excluding government and education. Chamber members who publish a website are not a random sample of all US Hispanic businesses.
- **What we did:** DNS-over-HTTPS queries only (MX, DKIM on the provider's default selector, `_mta-sts`), cross-checked with the SPF/DMARC readings of the same day. No contact with the businesses' servers.
- **What we publish:** aggregates only; domains with weaknesses are never named.
- **Not legal or banking advice.** Omona performs **defensive-only** reviews with written authorization from the system owner; it does not run penetration tests.

**Sources:** FBI IC3 *2025 Internet Crime Report* (April 2026); Nacha, *Risk Management Topics – Fraud Monitoring Phase 1 and Phase 2* and *Company Entry Descriptions*; IRS Form W-9 and TIN Matching program; Omona's own measurement of Nov 26, 2026.
