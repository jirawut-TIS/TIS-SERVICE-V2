# TIS Service — Printer PDF to Excel

## การแก้ไขล่าสุด (v5)
- ✅ เปลี่ยน model เป็น `claude-haiku` (ถูกลง 73% ~$0.70/148 หน้า)
- ✅ แก้ Export Excel ไม่ได้ (blob download)
- ✅ ลำดับ SN ตรงกับ PDF
- ✅ หน้าที่ไม่มีข้อมูลแสดง "ไม่ได้เก็บ" แทนการลบ
- ✅ Copy ข้อมูลในตารางได้
- ✅ แก้ A5 อ่านค่า 5x8 ผิด
- ✅ แสดงค่าใช้จ่ายแบบ real-time ขณะสแกน

## วิธี deploy

### Vercel (แนะนำ)
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

## โครงสร้างไฟล์
```
TIS-Service/
├── src/app/
│   ├── layout.jsx
│   ├── page.jsx                    (redirect → /tis-printer)
│   └── tis-printer/
│       ├── page.jsx
│       └── PrinterClient.jsx       (ไฟล์หลัก - แก้ไขแล้ว)
├── public/
│   └── favicon.ico
├── next.config.js
├── package.json
└── vercel.json
```

## API Key
- ใส่ Anthropic API Key ตอนกดปุ่ม "ประมวลผล" (ไม่ต้องใส่ตอน login)
- รับ Key ฟรีที่ https://console.anthropic.com
