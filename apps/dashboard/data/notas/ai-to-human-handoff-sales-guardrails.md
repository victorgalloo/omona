---
title: "AI-to-human handoff: warm transfer + guardrails"
description: "Warm handoff from an AI sales agent to a human without invented prices: data on 558 US Hispanic business sites, a price guard in code and a handoff packet."
date: 2026-11-28
updated: 2026-11-28
tags: warm handoff, warm transfer, chatbot human handoff, ai agent guardrails, ai lead qualification, ai sales assistant, hispanic small business
image: /blog/ai-to-human-handoff-sales-guardrails/fuente-de-precio-camaras-hispanas.svg
imageAlt: Of 558 US Hispanic chamber member homepages, 83.3% have no public price source and 16.8% ask for a custom quote
lang: en
alternate: traspaso-ia-a-vendedor-humano-candados-precios
---

# AI-to-human handoff for sales: a warm transfer that never invents a price

**Short answer:** a good AI sales assistant is judged by two moments, not by how chatty it is: **the price it is allowed to say** and **the moment it hands the customer to a person**. Both belong in code, not in the prompt. The assistant may quote only what is in a versioned price sheet; any amount that is not there blocks the message and triggers a **warm handoff**: the salesperson receives the conversation with a one-paragraph summary, and the customer never has to repeat anything. Our own measurement shows why this matters for US small businesses: of **558 homepages of US Hispanic chamber members**, **83.3% publish no price source at all** (no sales price, no pricing page). An assistant connected to those sites has nothing public to quote from. Without a price sheet it either refuses to answer or makes one up.

![Where would an AI agent get the price? 558 US Hispanic chamber member homepages](/blog/ai-to-human-handoff-sales-guardrails/fuente-de-precio-camaras-hispanas.svg)

## 1. Original data: where would an AI agent get the price?

On November 28, 2026 we re-read the public homepages of the active member sites in two public ChamberMaster directories, the **Fort Worth Hispanic Chamber of Commerce (TX)** and the **Statewide Hispanic Chamber of Commerce of New Jersey**, the same sample as our [bilingual answering service study](/blog/bilingual-answering-service-ai-small-business). One passive GET per homepage, visible text only (scripts removed), no forms submitted, no chats opened, 0 `.edu`, 0 government listings. We counted the 558 homepages with at least 30 visible words. The run took 31 seconds and used 0 LLM tokens.

| Signal on the public homepage (`n = 558`) | Sites | Share | What it means for an AI assistant |
|---|---:|---:|---|
| Sales price in visible text (e.g. "from $79", "$55/mo") | 55 | 9.9% | There is *some* public price to anchor on |
| Link to a pricing, plans, packages or menu page | 51 | 9.1% | A price list exists one click away |
| **No public price source** (neither of the above) | 465 | **83.3%** | The assistant must get prices from a sheet you give it |
| Asks for a custom quote ("free estimate", "get a quote", "cotización") | 94 | 16.8% | A person sets the price: that is the handoff point |
| Custom quote **and** no public price | 82 | 14.7% | Every price question must go to a human |
| Promises a person ("talk to a human", "speak with an expert", "asesor") | 10 | 1.8% | Almost nobody says when a human takes over |
| Promises a response time ("we respond within 24 hours") | 5 | 0.9% | The lead does not know when they will hear back |

By sector (sectors with 15+ sites):

| Sector | Sites | No public price | Custom quote | Quote without public price |
|---|---:|---:|---:|---:|
| Construction & contractors | 71 | 90.1% | 38.0% | 33.8% |
| Finance & insurance | 82 | 78.0% | 25.6% | 22.0% |
| Legal | 18 | 88.9% | 22.2% | 16.7% |
| Health care | 29 | 79.3% | 13.8% | 13.8% |
| Restaurants, food & beverage | 25 | 48.0% | 12.0% | 4.0% |
| Retail | 20 | 55.0% | 5.0% | 5.0% |

And the cross that matters most: of the **64 sites that already run a chat, SMS or WhatsApp channel**, **75.0% have no public price source**. The channel is there; the source of truth is not.

How to read it: prices painted later by JavaScript are not visible to a single GET, and a price may live in a PDF or a quote tool. These numbers are a **floor**. Large amounts that describe results ("$5M recovered", "$130 million restoration") are excluded; only amounts next to sales words ("from", "only", "per month", "/mo", "desde") count.

## 2. Why an invented price is the business's problem, not the bot's

In *Moffatt v. Air Canada* ([2024 BCCRT 149](https://decisions.civilresolutionbc.ca/crt/crtd/en/item/525448/index.do), February 14, 2024), the airline's website chatbot told a customer he could request a bereavement fare after travel. That was not the airline's policy. The British Columbia Civil Resolution Tribunal ordered Air Canada to pay **CA$812.02** and rejected the argument that the chatbot was responsible for its own words: *"It should be obvious to Air Canada that it is responsible for all the information on its website. It makes no difference whether the information comes from a static page or a chatbot."*

For a contractor or a tax office the same logic applies to a discount, a warranty, a service area or a delivery date. The customer will hold you to what your assistant typed.

Speed still matters. In *The Short Life of Online Sales Leads* ([Harvard Business Review, 2011](https://hbr.org/2011/03/the-short-life-of-online-sales-leads)), 2,241 US companies took **42 hours on average** to answer a web lead, and those that answered within an hour were **nearly 7 times as likely to qualify it**. The design goal is both: reply in seconds, and stop at exactly the right moment.

## 3. Warm handoff vs. cold transfer vs. no handoff

| | No handoff | Cold transfer | Warm handoff (what we design) |
|---|---|---|---|
| What the human receives | Nothing; the bot keeps talking | A raw transcript or "call this number" | One block: who, channel, language, need, what was answered, open question, next step |
| Customer repeats themselves | n/a | Yes | No |
| Who decides the price | The model (risk) | The human, without context | The human, with the price sheet version and the exact question |
| Language | Whatever the model chose | Often English-only | Same language the customer used, Spanish or English |
| When it fires | Never | When the bot fails | On rules written in code (below) |

A **warm transfer** in a call center means the agent stays on the line and introduces the caller to the next person. In text channels the equivalent is the handoff packet: the human starts the conversation already knowing what happened.

## 4. Guardrails in code: a price guard you can run

The model writes the sentence; code decides whether it can be sent. This is a minimal, runnable version of the check that sits between the model and WhatsApp, SMS or web chat:

```python
import re

PRICE_SHEET = {  # versioned, the only source of prices the assistant may quote
    "version": "2026-11-28",
    "items": {"water heater install": 1450, "service call": 89},
}
HANDOFF_WORDS = re.compile(r"\b(human|person|agent|manager|persona|asesor|emergency|emergencia|lawyer|abogado)\b", re.I)
MONEY = re.compile(r"\$\s?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)")


def check_reply(customer_msg: str, draft: str) -> dict:
    """Runs in code AFTER the model writes and BEFORE anything is sent."""
    if HANDOFF_WORDS.search(customer_msg):
        return {"send": False, "handoff": "customer asked for a person or it is urgent"}
    allowed = {float(p) for p in PRICE_SHEET["items"].values()}
    quoted = {float(m.replace(",", "")) for m in MONEY.findall(draft)}
    unknown = quoted - allowed
    if unknown:
        return {"send": False, "handoff": f"price not in sheet {PRICE_SHEET['version']}: {sorted(unknown)}"}
    return {"send": True, "handoff": None}
```

Output on three real-looking turns:

| Customer | Model draft | Guard result |
|---|---|---|
| "how much to install a water heater?" | "Installation is $1,450, parts included." | `send: True` |
| "can you do it cheaper?" | "Sure, I can do it for $1,200 today." | `send: False` · price not in sheet 2026-11-28: `[1200.0]` |
| "quiero hablar con una persona" | "Claro, el servicio cuesta $89." | `send: False` · customer asked for a person |

The second row is the whole point: the model was being helpful and invented a discount. The guard blocks it and opens a handoff instead. A production version adds the same check for dates, service areas and warranty terms, and logs every block so you can see which questions your price sheet is missing.

## 5. Handoff rules: when the assistant must stop

Write these as code, not as polite suggestions in a prompt:

1. **The customer asks for a person**, in either language ("human", "persona", "asesor", "manager").
2. **A price, discount, date or term is not in the sheet.** The assistant says a person will confirm it and hands off.
3. **Custom quote businesses.** If your site says "free estimate" (38.0% of construction sites in our sample), the assistant qualifies and books the visit; the human sets the price.
4. **Emergency, complaint or legal words.** Leaks, injuries, "abogado", chargebacks: stop and hand off immediately.
5. **Two turns without progress.** If the assistant cannot move the conversation to the next state, a person takes over.

Example of the handoff packet the salesperson receives (fictional customer):

```text
Lead: Maria R. · WhatsApp · Spanish · first contact 10:42
Need: water heater replacement, 50 gal, Fort Worth 76107
Answered: service call $89 (sheet 2026-11-28), availability this week
Open question: asked for a discount on install -> blocked, needs your price
Next step: call or text back today; she prefers text after 5 pm
```

## 6. The same pattern in open source

The rule "only one level talks to a human, with one clear question" is not specific to sales. In our open-source template [bedrock-agent-hierarchy](https://github.com/victorgalloo/bedrock-agent-hierarchy) (Apache-2.0, Amazon Bedrock), `agent_hierarchy/escalation.py` enforces it in code: a sub-agent can only escalate to its manager, only the orchestrator may reach a human, the topic must be one of a closed list (`money`, `legal`, `external_commitment`, `public_post`, `access`, `speak_for_someone`), and a human escalation is rejected unless it is exactly one question ending in `?` with what happens on yes and on no. A sales assistant is the same shape: money questions are never answered by the agent that talks to the customer.

## 7. Seven-day plan

- [ ] **Day 1:** write the price sheet the assistant may quote, in Spanish and English, with a version date.
- [ ] **Day 2:** list your handoff rules (the five above) and who receives each one.
- [ ] **Day 3:** define the handoff packet fields your salespeople actually read.
- [ ] **Day 4:** put the price guard between the model and every channel; log every block.
- [ ] **Day 5:** add a visible line on your site: "A person replies within X minutes in business hours" (only 0.9% of homepages promise a time).
- [ ] **Day 6:** measure your own homepage with our free [speed-to-lead checker](/en/speed-to-lead-checker).
- [ ] **Day 7:** test 10 conversations that try to get a discount, in Spanish, English and Spanglish, before going live.

## FAQ

**What is a warm handoff from a chatbot to a human?** The assistant stops, and a person continues the same conversation with a summary of who the customer is, what they need and what was already answered. The customer does not repeat anything.

**How do you stop an AI sales agent from inventing prices?** Do not rely on the prompt. Check every outgoing message in code against a versioned price sheet, and block any amount that is not in it. A blocked message becomes a handoff, not an error.

**Do I need to publish prices on my website first?** No. 83.3% of the homepages we measured publish none. The assistant needs a private price sheet; the website can keep asking for a quote.

More on the commercial side of [Omona's Commercial AI practice](/en/commercial-ai). Spanish version: [Traspaso de IA a vendedor humano sin inventar precios](/blog/traspaso-ia-a-vendedor-humano-candados-precios).
