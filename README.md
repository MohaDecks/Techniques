# Farsamo

Two separate apps:

- Customer PWA → `apps/customer` → http://localhost:1010
- Admin Portal → `apps/admin` → http://localhost:2020

They share marketplace data through MongoDB database `techni` and keep a copy in `data/store.json`.

## Install

```bash
npm install
```

## Run separately

Customer app:

```bash
npm run customer
```

Admin portal (terminal kale):

```bash
npm run admin
```

Ama:

```bash
cd apps/customer && npm run dev
cd apps/admin && npm run dev
```

## Demo

Customer: `912345678` / `farsamo123`  
Admin: `admin@farsamo.et` / `admin123`
