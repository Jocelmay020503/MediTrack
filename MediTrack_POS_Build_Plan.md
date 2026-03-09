# 💊 MediTrack POS — Medicine Store App: Staged Build Plan

---

## 🚀 STAGE 1 — MVP (Minimum Viable Product)
> Goal: Masubukan ng seller agad. Simple, fast, functional.
> Timeline: Week 1–2

### Features:
- [ ] **Login Page** — single role (Seller only), username & password
- [ ] **Medicine List** — show name, price, stock, expiry date
- [ ] **Expiry Warning** — color-coded alert:
  - 🔴 Expires in 3 days or less — CRITICAL
  - 🟠 Expires in 4–7 days — WARNING
  - 🟢 Safe — no alert
- [ ] **Low Stock Alert** — turns RED if stock ≤ 10 pcs
- [ ] **Basic Search** — search medicine by name
- [ ] **Print List Button** — print all medicines as reference guide

---

## 🔼 STAGE 2 — MMP (Minimum Marketable Product)
> Goal: Ready to show to store owner. Usable for daily operations.
> Timeline: Week 3–4

### Features:
- [ ] **Prescription Badge** — flag medicines that require reseta
  - Shows reminder: *"🧾 Reseta required before selling"*
- [ ] **Medicine Details Page** — click a medicine to see:
  - Full instructions (e.g. *"Take every 4 hours"*, *"Take with meals"*)
  - Dosage, category, supplier
  - Expiry & stock status
- [ ] **Seller Cart / Transaction Flow**
  - Add multiple medicines to cart
  - Set quantity per item
  - Shows total per item and grand total
  - Auto-warns if item in cart is near expiry or low stock

---

## 🏆 STAGE 3 — v1.0 (Full Release)
> Goal: Full production-ready system for the store.
> Timeline: Week 5–6

### Features:
- [ ] **Admin vs Seller Roles**
  - Seller: view, search, cart, print
  - Admin: everything + edit/add/remove medicines
- [ ] **Edit Medicine Details** — Admin can update price, stock, expiry, instructions
- [ ] **Add / Remove Medicine** — Admin manages the full inventory
- [ ] **Dashboard with Stats**
  - Total medicines
  - Low stock count
  - Expiring soon count
  - Welcome message with user name & role
- [ ] **Notes per Medicine** — Admin can add special notes visible to sellers

---

## 🗂️ MEDICINE DATA FIELDS (per item)

| Field | Example |
|---|---|
| Name | Amoxicillin 500mg |
| Category | Antibiotic |
| Price | ₱12.50 |
| Stock | 45 pcs |
| Expiry Date | 2026-03-14 |
| Requires Prescription | Yes |
| Instructions | Take every 8 hrs with meals |
| Supplier | PharmaCo |
| Dosage | 500mg |
| Notes | Store in cool dry place |

---

## 👤 ROLES & PERMISSIONS

| Feature | Seller | Admin |
|---|---|---|
| Login | ✅ | ✅ |
| Search & view medicines | ✅ | ✅ |
| View medicine details | ✅ | ✅ |
| Add to cart / process sale | ✅ | ✅ |
| Print guide | ✅ | ✅ |
| Edit medicine details | ❌ | ✅ |
| Add / remove medicine | ❌ | ✅ |
| Update stock | ❌ | ✅ |
| View dashboard stats | ❌ | ✅ |

---

## 📌 FULL FEATURE SUMMARY BY STAGE

| # | Feature | Stage |
|---|---|---|
| 1 | Login (Seller) | MVP |
| 2 | Medicine list with price, stock, expiry | MVP |
| 3 | Color-coded expiry warnings | MVP |
| 4 | Red stock alert (≤10 pcs) | MVP |
| 5 | Search by name | MVP |
| 6 | Print all medicines | MVP |
| 7 | Prescription / reseta badge | MMP |
| 8 | Medicine details & instructions | MMP |
| 9 | Seller cart & transaction flow | MMP |
| 10 | Admin vs Seller roles | v1.0 |
| 11 | Edit / Add / Remove medicine (Admin) | v1.0 |
| 12 | Dashboard with stats | v1.0 |
| 13 | Notes per medicine | v1.0 |

---

> 💡 **Tip:** Build and test each stage with the actual seller before moving to the next.
> Feedback from real use = better product.
