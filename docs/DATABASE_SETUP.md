# PostgreSQL Database Setup Guide

## 🎯 Maqsad
Landing backend uchun PostgreSQL databaseni sozlash va contact jadvalini yaratish.

## 📋 Bosqichlar

### 1. PostgreSQL O'rnatilganligini Tekshirish

#### Windows Services orqali:
```powershell
Get-Service -Name "*postgres*"
```

**Natija:**
- Agar service topilsa: PostgreSQL o'rnatilgan ✅
- Agar topilmasa: PostgreSQL o'rnatish kerak ❌

---

### 2. PostgreSQL O'rnatish (Agar kerak bo'lsa)

#### Download:
1. [PostgreSQL rasmiy saytiga](https://www.postgresql.org/download/windows/) o'ting
2. Windows installer yuklab oling
3. O'rnatish jarayonida:
   - **Port:** 5432 (default)
   - **Superuser password:** Yodda qoladigan parol kiriting (masalan: `postgres123`)
   - **Locale:** Default

---

### 3. PostgreSQL Ishga Tushirish

#### Service ishlamayotgan bo'lsa:
```powershell
# Service nomini topish
Get-Service -Name "*postgres*"

# Ishga tushirish (service nomini almashtiring)
Start-Service postgresql-x64-14
```

---

### 4. Database Yaratish

#### Variant 1: pgAdmin orqali (Oson)
1. pgAdmin dasturini oching
2. PostgreSQL serverga ulanish (parol: o'rnatishda kiritgan parol)
3. Databases → Right click → Create → Database
4. **Database name:** `landingdb`
5. **Save** tugmasini bosing

#### Variant 2: psql orqali (Terminal)
```bash
# PostgreSQL ga ulanish
psql -U postgres

# Database yaratish
CREATE DATABASE landingdb;

# Chiqish
\q
```

#### Variant 3: SQL fayl orqali
```bash
psql -U postgres -c "CREATE DATABASE landingdb;"
```

---

### 5. .env Faylini Sozlash

`.env` faylida PostgreSQL parolini to'g'rilang:

```env
PORT=3000
DB_USER=postgres
DB_PASSWORD=sizning_postgresql_parolingiz
DB_HOST=localhost
DB_NAME=landingdb
DB_PORT=5432
```

> [!IMPORTANT]
> `DB_PASSWORD` ni o'rnatishda kiritgan parol bilan almashtiring!

---

### 6. Contact Jadvalini Yaratish

#### Variant 1: Node.js script orqali (Tavsiya etiladi)
```bash
npm run setup-db
```

**Kutilayotgan natija:**
```
✓ Contacts table created successfully
✓ Email index created successfully
✓ Created_at index created successfully
✅ Database setup completed successfully!
```

#### Variant 2: SQL fayl orqali
```bash
# Agar psql PATH da bo'lsa
psql -U postgres -d landingdb -f setup.sql
```

#### Variant 3: pgAdmin orqali
1. pgAdmin'da `landingdb` ni oching
2. Query Tool'ni oching (Tools → Query Tool)
3. `setup.sql` faylini oching yoki quyidagi SQL'ni nusxalang:

```sql
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
```

4. Execute tugmasini bosing (F5)

---

### 7. Serverni Restart Qilish

```bash
# Ctrl+C bilan to'xtating
# Keyin qayta ishga tushiring
npm start
```

**Kutilayotgan natija:**
```
✓ Database connection established
🚀 Server is running on http://localhost:3000
```

---

### 8. Testlash

#### Postman yoki curl orqali:
```bash
# Contact yaratish
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message to verify database connection"
  }'
```

**Kutilayotgan javob:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message to verify database connection",
    "created_at": "2026-01-08T07:00:52.000Z"
  }
}
```

---

## 🐛 Muammolarni Hal Qilish

### Muammo 1: "password authentication failed"
**Sabab:** `.env` dagi parol noto'g'ri

**Yechim:**
1. PostgreSQL o'rnatishda qanday parol kiritganingizni eslang
2. `.env` faylida `DB_PASSWORD` ni shu parol bilan almashtiring

### Muammo 2: "database does not exist"
**Sabab:** `landingdb` database yaratilmagan

**Yechim:**
```bash
psql -U postgres -c "CREATE DATABASE landingdb;"
```

### Muammo 3: "connection refused"
**Sabab:** PostgreSQL service ishlamayapti

**Yechim:**
```powershell
Start-Service postgresql-x64-14
```

### Muammo 4: "psql: command not found"
**Sabab:** psql PATH da emas

**Yechim:**
- pgAdmin ishlatish (osonroq)
- Yoki PostgreSQL bin papkasini PATH ga qo'shish:
  - `C:\Program Files\PostgreSQL\14\bin`

---

## ✅ Tekshirish Ro'yxati

- [ ] PostgreSQL o'rnatilgan
- [ ] PostgreSQL service ishlayapti
- [ ] `landingdb` database yaratilgan
- [ ] `.env` faylida to'g'ri parol
- [ ] `contacts` jadvali yaratilgan
- [ ] Server database bilan ulanadi
- [ ] POST /api/contact ishlaydi

---

## 💡 Keyingi Qadamlar

Database sozlangandan keyin:
1. Postman collection'ni import qiling
2. Barcha endpoint'larni test qiling
3. Production uchun deploy qiling

Omad! 🚀
