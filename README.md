# TIS Service — Printer PDF to Excel

## วิธี deploy บน Cloudflare Pages / Vercel / GitHub Pages

### Cloudflare Pages (แนะนำ)
```bash
npm install
npm run build
# อัปโหลดโฟลเดอร์ .next ขึ้น Cloudflare Pages
```

### Vercel
```bash
git init && git add . && git commit -m "init"
git remote add origin https://github.com/USERNAME/TIS-Service.git
git push -u origin main
# Import repo เข้า vercel.com
```

### รันบนเครื่อง
```bash
npm install && npm run dev
# เปิด http://localhost:3000/tis-printer
```

## API Key
ผู้ใช้แต่ละคนใส่ Anthropic API Key ของตัวเองตอน Login
รับ Key ฟรีที่ https://console.anthropic.com
