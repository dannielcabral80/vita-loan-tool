# Vita'-Loan-Tool 🍕

A bilingual (Spanish/English) interest-free loan calculator and payment tracker, built with Claude.

## Why it exists

At my family's pizza restaurant in the Dominican Republic, I noticed our employees weren't getting ahead despite steady jobs. The reason: informal lenders were taking most of their salary through extremely high interest rates. I proposed an interest-free loan program repaid through fixed salary deductions, combined with basic financial literacy training. Three of our four employees used it to repair their homes and break free from informal debt.

This tool supports that program.

## What it does

- Calculates fixed weekly or biweekly payments and the estimated payoff date
- Tracks each payment with a visual progress "pizza" — every payment completes a slice
- Handles partial final payments automatically
- Shows rotating personal finance tips (ES/EN)
- Saves progress on the device

## How it was built

Built in React with Claude (Anthropic), as a real tool for a real program. The progress pizza is an SVG generated with trigonometry; state persists via a key-value storage API.

— Danniel Cabral
