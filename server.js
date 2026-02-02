// ==========================================
// SCHOOL WEBSITE BACKEND SERVER
// ==========================================
// यह सभी devices के data को sync करता है

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Initialize data file अगर exist नहीं करती
function initializeData() {
    if (!fs.existsSync(DATA_FILE)) {
        const defaultData = {
            logo: '',
            hero: {
                bgUrl: 'https://source.unsplash.com/1200x400/?school',
                heading: 'Welcome to Adarsh Public School',
                subheading: 'Nurturing Minds, Building Future.'
            },
            notices: [],
            gallery: [],
            books: [],
            admissions: [],
            contact: {
                phone: '+91-9876543210',
                email: 'info@adarshschool.com'
            }
        };
        fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
    }
}

// Initialize करो startup पर
initializeData();

// ===== GET DATA =====
app.get('/api/data', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Data पढ़ने में error' });
    }
});

// ===== SAVE LOGO =====
app.post('/api/logo', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        data.logo = req.body.logo;
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        res.json({ success: true, message: '✅ Logo save हुआ' });
    } catch (err) {
        res.status(500).json({ error: 'Logo save करने में error' });
    }
});

// ===== SAVE HERO SETTINGS =====
app.post('/api/hero', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        data.hero = req.body;
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        res.json({ success: true, message: '✅ Hero section save हुआ' });
    } catch (err) {
        res.status(500).json({ error: 'Hero save करने में error' });
    }
});

// ===== SAVE NOTICES =====
app.post('/api/notices', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        data.notices = req.body.notices;
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        res.json({ success: true, message: '✅ Notices save हुए' });
    } catch (err) {
        res.status(500).json({ error: 'Notices save करने में error' });
    }
});

// ===== ADD ADMISSION =====
app.post('/api/admissions', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        req.body.submittedDate = new Date().toLocaleString('hi-IN');
        req.body.status = 'Pending';
        data.admissions.push(req.body);
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        res.json({ success: true, message: '✅ Admission form submit हुआ' });
    } catch (err) {
        res.status(500).json({ error: 'Admission save करने में error' });
    }
});

// ===== GET ADMISSIONS =====
app.get('/api/admissions', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        res.json(data.admissions);
    } catch (err) {
        res.status(500).json({ error: 'Admissions पढ़ने में error' });
    }
});

// ===== UPDATE ADMISSION STATUS =====
app.put('/api/admissions/:index', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        const index = parseInt(req.params.index);
        if (data.admissions[index]) {
            data.admissions[index].status = req.body.status;
            fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
            res.json({ success: true, message: '✅ Status update हुआ' });
        } else {
            res.status(404).json({ error: 'Admission नहीं मिली' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Status update करने में error' });
    }
});

// ===== CONTACT INFO =====
app.post('/api/contact', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        data.contact = req.body;
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        res.json({ success: true, message: '✅ Contact info save हुआ' });
    } catch (err) {
        res.status(500).json({ error: 'Contact save करने में error' });
    }
});

// ===== BOOKS =====
app.post('/api/books', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        data.books = req.body.books;
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        res.json({ success: true, message: '✅ Books save हुई' });
    } catch (err) {
        res.status(500).json({ error: 'Books save करने में error' });
    }
});

// ===== GALLERY =====
app.post('/api/gallery', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        data.gallery = req.body.gallery;
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        res.json({ success: true, message: '✅ Gallery update हुई' });
    } catch (err) {
        res.status(500).json({ error: 'Gallery save करने में error' });
    }
});

// Server start करो
app.listen(PORT, () => {
    console.log(`✅ School Website Server चल रहा है: http://localhost:${PORT}`);
    console.log(`📱 सभी devices से access कर सकते हो!`);
});
