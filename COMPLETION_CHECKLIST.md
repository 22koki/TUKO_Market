# TUKO Market release checklist

Updated 2026-10-15. This is a development checklist, not a production launch sign-off.

## Implemented on the MVP-hardening branch
- [x] Django model migration files and CI migration drift check
- [x] Customer account registration API and signup screen
- [x] Customer catalog, cart and checkout integration
- [x] Vendor product inventory CRUD API and stock-management screen
- [x] Vendor privacy fix: public directory excludes settlement credentials
- [x] Stock reservation checks aggregate duplicate basket lines
- [x] M-PESA callback URL token requirement in live mode
- [x] Match live callback amount and phone to payment before updating status
- [x] Customer checkout polls API for actual payment status
- [x] Rider job acceptance, status updates and delivery PIN API/UI
- [x] GitHub Actions backend and frontend checks

## Blocking commercial release
- [ ] Replace the shared order state with independent vendor fulfilment state; a single vendor can currently advance a multi-vendor order
- [ ] Implement order cancellation, stock release, refunds, and payment timeout/reconciliation
- [ ] Verify live Safaricom payment authenticity independently of URL-token secrecy; confirm callback retries, duplicate receipts and failed STK queries
- [ ] Introduce proper vendor/rider onboarding and admin approval UX
- [ ] Add real payout ledger, settlement logic and reconciliation
- [ ] Implement pickup completion confirmation, rider assignment restrictions and customer support/disputes
- [ ] Replace the hard-coded delivery fee with zone-based quote logic
- [ ] Configure managed PostgreSQL and production settings, TLS, hosts, CORS, logging, backups and monitoring
- [ ] Configure real Daraja credentials and set MPESA_MOCK=False, MPESA_CALLBACK_TOKEN to a high-entropy secret, and MPESA_CALLBACK_URL to the matching tokenized endpoint
- [ ] Verify responsive UX, accessibility and payment data handling on real devices
- [ ] Complete end-to-end tests with real roles and sandbox transactions; merge only when CI passes and stakeholders approve

## Local development
Backend:
```bash
cd backend
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo_market
python manage.py runserver
```
Frontend:
```bash
cd tuko-frontend
npm ci
npm start
```
Note: Seeded demo products are development-only. Run tests with `python manage.py test` and `CI=true npm test -- --watch=false --runInBand`.

## Security
Do not expose real credentials or secret callback URLs in the frontend, logs, screenshots or GitHub history. The mock payment path is for local development only. Do not treat a mock successful STK initiation as a captured payment.
