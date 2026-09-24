# TUKO Backend

Django/DRF backend for TUKO Market.

## Planned domains

- accounts — customer, vendor, rider and admin identities
- vendors — stores, verification, operating status and settlement preferences
- catalog — categories, products, prices and inventory
- orders — baskets, vendor fulfilments, substitutions and order state
- payments — M-PESA transactions, ledger entries and settlements
- delivery — rider jobs, pickups, delivery PINs and earnings
- notifications — WhatsApp and other transactional messaging

## Security rules

Never commit M-PESA, WhatsApp, database or Django secrets. Use environment variables and keep payment callbacks idempotent. Payment confirmation must come from verified provider callbacks rather than client state.
