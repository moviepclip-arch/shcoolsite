# 🚀 Setup Instructions - Cloud Data Sync

## समस्या क्या थी?
Mobile पर update करने पर laptop में नहीं दिख रहा था क्योंकि data सिर्फ **browser के localStorage** में save था, जो हर device का अलग है।

## समाधान
अब हमने एक **backend server** बनाया है जो सभी devices के data को एक जगह **cloud में** store करता है।

---

## ✅ Setup Steps (सिर्फ एक बार करना है)

### 1️⃣ Node.js Install करो
अगर Node.js नहीं है तो यहाँ से download करो:
https://nodejs.org/ (LTS version)

### 2️⃣ Terminal में server setup करो
```bash
cd c:\Users\DELL\Desktop\schoolsite
npm install
```

यह `express` और `cors` install करेगा।

### 3️⃣ Server को चलाओ
```bash
npm start
```

आप देखेंगे:
```
✅ School Website Server चल रहा है: http://localhost:3000
📱 सभी devices से access कर सकते हो!
```

---

## 🌐 अब आप कौन से devices से access कर सकते हो?

### Laptop पर:
- Website: `http://localhost:3000`
- Admin Panel: `http://localhost:3000/admin.html`

### Mobile (same WiFi पर):
- Website: `http://<LAPTOP_IP>:3000`  
  (अपने laptop का IP address ढूंढो)
  
**IP Address कैसे मिलेगा:**
```bash
ipconfig
```
Output में `IPv4 Address` ढूंढो, जैसे: `192.168.1.100`

Mobile में browser में यह डालो:
```
http://192.168.1.100:3000
```

---

## ✨ अब क्या होता है?

✅ Mobile पर logo update करो → Laptop में अपने आप दिख जाएगा  
✅ Laptop से admission form add करो → Mobile में दिख जाएगा  
✅ हर 5 सेकंड में automatically data refresh होता है  
✅ Internet का जरूरत नहीं है (सिर्फ same WiFi चाहिए)

---

## 📝 HTML Files में क्या बदलना है?

अभी `index.html` और दूसरी files में यह line है:
```html
<script src="script.js"></script>
```

इसे बदलो:
```html
<script src="script-sync.js"></script>
```

---

## 🔧 Data File

सभी data यहाँ save होता है:
```
c:\Users\DELL\Desktop\schoolsite\data.json
```

इसे backup रख सकते हो!

---

## ❌ अगर Server बंद हो जाए तो?

कोई tension नहीं! Data वैसे भी `localStorage` में backup है, तो site काम करती रहेगी।

---

## 🎉 Done!

अब तुम्हारी site सभी devices पर synchronized है! 🚀

