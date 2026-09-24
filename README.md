# TUKO Market

**Your local market, without the market hassle.**

TUKO Market is a location-aware marketplace connecting customers with nearby grocery vendors and, later, local service providers. Customers build one basket, choose delivery or pickup, pay conveniently with M-PESA, and track fulfilment while vendors receive and prepare orders and riders handle last-mile delivery.

## MVP actors

- **Customer** — discover nearby vendors, build a basket, choose delivery/pickup, pay, track and rate orders.
- **Vendor** — manage a store, products, prices and stock; accept/reject orders; offer substitutions; configure M-PESA settlement.
- **Rider** — accept delivery jobs, collect one or more vendor packages, verify pickups/delivery and track earnings.
- **Admin** — verify vendors/riders, oversee orders/payments, delivery zones, commissions, disputes and platform analytics.

## Core order flow

1. Customer selects a location/market.
2. Customer shops nearby inventory or submits a shopping list.
3. TUKO builds the basket and records vendor fulfilment.
4. Customer chooses pickup or delivery.
5. Customer pays using M-PESA (cash can be enabled where appropriate).
6. Vendors accept and prepare their portions of the order.
7. A rider receives the delivery job and collects the packages.
8. Customer confirms delivery using a one-time delivery PIN.
9. Vendor and rider earnings become eligible for settlement.

## Payments

The payment domain is designed around a single customer checkout even when multiple vendors fulfil an order. The ledger records product totals, delivery fees, platform fees, vendor earnings and rider earnings separately.

Vendor settlement preferences can support:
- M-PESA Buy Goods Till
- M-PESA Paybill + account/reference
- M-PESA number where supported

M-PESA credentials and secrets must never be committed to this repository.

## WhatsApp

WhatsApp is a first-class channel, not a separate ordering system. Customer orders, vendor order notifications and rider updates will all use the same backend APIs as the web/PWA experience.

Planned flows include shopping-list ordering, order confirmation, vendor accept/unavailable actions, rider pickup notifications and delivery status updates.

## Smart Basket (post-core MVP)

TUKO will later optimize multi-vendor baskets by:
- closest fulfilment
- lowest practical basket cost
- vendor rating/quality
- fewer vendor stops
- stock availability
- delivery cost

## Technology

- Frontend: React + Tailwind CSS
- Backend: Django + Django REST Framework
- Database: PostgreSQL (production)
- Authentication: JWT
- Payments: M-PESA integration
- Messaging: WhatsApp integration
- Maps/location: provider to be selected behind a service abstraction

## Target architecture

```text
TUKO_Market/
├── backend/
│   ├── accounts/
│   ├── vendors/
│   ├── catalog/
│   ├── orders/
│   ├── payments/
│   ├── delivery/
│   └── notifications/
├── tuko-frontend/
└── README.md
```

## Development phases

1. Foundation: roles, authentication, data model and API structure
2. Marketplace: vendors, products, categories, inventory and nearby discovery
3. Ordering: basket, checkout, substitutions and order lifecycle
4. Vendor workspace
5. M-PESA checkout, ledger and settlements
6. Rider delivery and earnings
7. WhatsApp workflows
8. Smart Basket and multi-vendor optimization
9. Ratings, promotions, disputes and analytics

## Current status

Foundation work has started. The existing React skeleton is being retained while the product architecture is rebuilt around customer, vendor, rider and admin experiences.
