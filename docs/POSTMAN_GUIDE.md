# Postman Test Guide

## 📥 Import Collection

1. Postmanda **Import** tugmasini bosing
2. `postman_collection.json` faylini tanlang
3. Collection import qilinadi

## 🧪 Test Qilish Tartibi

### 1. Server Holatini Tekshirish

#### ✅ GET / (Root)
- **URL:** `http://localhost:3000/`
- **Expected:** `"Landing page backend is running"`
- **Status:** 200 OK

#### ✅ GET /health (Health Check)
- **URL:** `http://localhost:3000/health`
- **Expected:** Server uptime va status
- **Status:** 200 OK

#### ⚠️ GET /health/db (Database Health)
- **URL:** `http://localhost:3000/health/db`
- **Expected:** Database ulanishi bo'lsa 200, bo'lmasa 500
- **Note:** Hozir database ulangan emas

---

### 2. Contact Endpoints (Database kerak)

> [!WARNING]
> Quyidagi endpoint'lar database ulanishini talab qiladi. Agar database ulanmagan bo'lsa, 500 error qaytaradi.

#### POST /api/contact (Yangi API)
- **URL:** `http://localhost:3000/api/contact`
- **Method:** POST
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "message": "This is a test message from Postman"
}
```
- **Expected Response (201):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "message": "This is a test message from Postman",
    "created_at": "2026-01-08T06:53:17.000Z"
  }
}
```

#### POST /contact (Legacy API)
- **URL:** `http://localhost:3000/contact`
- Same as above, backward compatibility

---

### 3. Validation Tests

#### ❌ Missing Fields
- **Body:**
```json
{
  "name": "Test User",
  "email": "test@example.com"
}
```
- **Expected (400):**
```json
{
  "status": "fail",
  "message": "Message is required"
}
```

#### ❌ Invalid Email
- **Body:**
```json
{
  "name": "Test User",
  "email": "invalid-email",
  "message": "This should fail"
}
```
- **Expected (400):**
```json
{
  "status": "fail",
  "message": "Email must be a valid email address"
}
```

#### ❌ Short Message
- **Body:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "message": "Hi"
}
```
- **Expected (400):**
```json
{
  "status": "fail",
  "message": "Message must be at least 10 characters long"
}
```

---

## 🔧 Database Ulanishini Tuzatish

Agar database endpoint'larini test qilmoqchi bo'lsangiz:

### 1. PostgreSQL ishga tushiring
```powershell
# Windows Services orqali
Start-Service postgresql-x64-14
```

### 2. Database yarating
pgAdmin yoki psql orqali:
```sql
CREATE DATABASE landingdb;
```

### 3. Parolni to'g'rilang
`.env` faylida:
```env
DB_PASSWORD=sizning_haqiqiy_parolingiz
```

### 4. Table yarating
```bash
npm run setup-db
```

### 5. Serverni restart qiling
```bash
npm start
```

---

## 📊 Hozirgi Holat

### ✅ Ishlayotgan Endpoint'lar (Database kerak emas)
- GET /
- GET /health

### ⚠️ Database Kerak Bo'lgan Endpoint'lar
- GET /health/db
- POST /api/contact
- POST /contact
- GET /api/contact/:id
- GET /api/contacts

---

## 💡 Maslahatlar

1. **Environment Variables** - Postmanda environment yarating:
   - `base_url` = `http://localhost:3000`
   - Keyin URL'larda `{{base_url}}/api/contact` deb yozing

2. **Tests Tab** - Har bir request uchun test yozing:
   ```javascript
   pm.test("Status code is 200", function () {
       pm.response.to.have.status(200);
   });
   ```

3. **Save Responses** - Response'larni save qilib, documentation uchun ishlatishingiz mumkin

4. **Rate Limiting** - 15 daqiqada 100 ta request limit bor, oshirsangiz 429 error qaytaradi

---

## 🎯 Quick Test Checklist

- [ ] GET / - Server running
- [ ] GET /health - Health check
- [ ] POST /api/contact - Valid data (database kerak)
- [ ] POST /api/contact - Missing fields (validation)
- [ ] POST /api/contact - Invalid email (validation)
- [ ] GET /nonexistent - 404 handling

Omad! 🚀
