# 🎯 Quick Start Guide - Data Sync को चलाने के लिए

## समस्या थी:
- Mobile पर update करने पर Laptop में नहीं आ रहा था
- Laptop से update करने पर Mobile में नहीं आ रहा था

## Solution Ready है! ✅

---

## 🚀 तुरंत शुरू करो (सिर्फ 3 steps)

### Step 1: PowerShell खोलो
`Windows + R` → `powershell` → Enter

### Step 2: ये commands चलाओ
```powershell
cd c:\Users\DELL\Desktop\schoolsite
npm install
npm start
```

**अगर npm install में error आए:**
https://nodejs.org/ से Node.js download करो

### Step 3: Browser में खोलो
- **Laptop:** `http://localhost:3000`
- **Mobile (same WiFi पर):** `http://192.168.x.x:3000` (अपना IP डालो)

---

## 📱 Mobile पर IP Address कैसे मिलेगा?

Terminal में यह चलाओ:
```powershell
ipconfig
```

Output में `IPv4 Address: 192.168....` ढूंढो

फिर Mobile के browser में यह डालो:
```
http://192.168.x.x:3000
```

---

## ✨ अब काम करने लगा!

- ✅ Mobile पर logo change करो → Laptop पर auto update होगा
- ✅ Laptop पर admission form add करो → Mobile पर दिख जाएगा  
- ✅ हर 5 सेकंड में data sync होता है
- ✅ Internet की जरूरत नहीं (सिर्फ same WiFi चाहिए)

---

## 📝 HTML Files Update करना है!

अभी ये files में यह line है:
```html
<script src="script.js"></script>
```

**इसे बदलो:**
```html
<script src="script-sync.js"></script>
```

**यह change करो:**
- `index.html`
- `admin.html`
- `dashboard.html`
- `test_about.html`

---

## 🛠️ Troubleshooting

**Q: Mobile से connect नहीं हो रहा है?**
- Check करो कि दोनों same WiFi पर हो
- Firewall off करो या port 3000 allow करो
- IP address सही enter किया है?

**Q: Server बंद हो गया?**
- फिर से `npm start` चलाओ

**Q: Data delete हो गया?**
- `data.json` file में backup रहता है

---

## 📂 Files का मतलब

| File | काम |
|------|------|
| `server.js` | Backend server (data store करता है) |
| `package.json` | Dependencies बताता है |
| `script-sync.js` | Updated script जो cloud sync करता है |
| `data.json` | सभी data यहाँ save होता है |

---

## 🎉 Ready?

Server चला दो और enjoy करो! 🚀

अगर कोई problem हो तो पूछना! 💬
