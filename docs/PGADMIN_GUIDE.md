# pgAdmin orqali Ma'lumotlarni Ko'rish Qo'llanmasi

pgAdmin 4 dasturi orqali database ichidagi ma'lumotlarni ko'rishning juda oson yo'li:

## 1. Database'ga Kirish

1. **pgAdmin 4** dasturini oching.
2. Chap tomondagi menyudan **Servers** -> **PostgreSQL...** ni oching.
3. Parol so'rasa, PostgreSQL parolingizni kiriting (`d1402526`).
4. **Databases** papkasini oching.
5. **landingdb** ni topib, uni oching.

## 2. Jadvalni (Table) Topish

1. **landingdb** ichidan **Schemas** -> **public** -> **Tables** ni oching.
2. **contacts** jadvalini ko'rasiz.

## 3. Ma'lumotlarni Ko'rish (View Data)

**1-usul (Eng osoni):**
1. **contacts** jadvali ustida sichqonchaning o'ng tugmasini bosing.
2. **View/Edit Data** menyusiga boring.
3. **All Rows** ni tanlang.
   - O'ng tomonda jadval va barcha ma'lumotlar ochiladi.

**2-usul (Query Tool orqali):**
1. **landingdb** ustida o'ng tugmani bosing va **Query Tool** ni tanlang.
2. Quyidagi kodni yozing:
   ```sql
   SELECT * FROM contacts ORDER BY id DESC;
   ```
3. Yuqoridagi "Play" (uchburchak) tugmasini bosing yoki **F5** ni bosing.

## 💡 Maslahat

Agar yangi qo'shilgan ma'lumot ko'rinmasa, **Execute/Refresh** tugmasini (F5) bosib yangilab yuboring.
