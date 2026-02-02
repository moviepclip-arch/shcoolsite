// ==========================================
// UPDATED SCRIPT WITH CLOUD SYNC
// ==========================================
// यह सभी devices के data को server से sync करता है

const API_URL = 'http://localhost:3000/api';

// ===== FETCH ALL DATA FROM SERVER =====
async function loadAllData() {
    try {
        const response = await fetch(`${API_URL}/data`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Data fetch करने में error:', error);
        return null;
    }
}

// ===== SAVE LOGO =====
async function saveLogo() {
    let logoUrl = document.getElementById("logo-url").value.trim();
    
    if(!logoUrl) {
        alert("❌ Logo URL paste करें!");
        return;
    }
    
    try {
        new URL(logoUrl);
    } catch(e) {
        alert("❌ सही URL paste करें!");
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/logo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ logo: logoUrl })
        });
        
        const result = await response.json();
        alert(result.message);
        loadLogo();
    } catch (error) {
        console.error('Logo save में error:', error);
        alert('❌ Server error! अभी local save करेंगे');
        localStorage.setItem('site_logo', logoUrl);
        loadLogo();
    }
}

// ===== SAVE HERO SETTINGS =====
async function saveHeroSettings() {
    let bgUrl = document.getElementById("bg-url").value.trim();
    let heading = document.getElementById("hero-heading").value.trim();
    let subheading = document.getElementById("hero-subheading").value.trim();
    
    if(!bgUrl || !heading || !subheading) {
        alert("❌ सभी fields भरें!");
        return;
    }
    
    try {
        new URL(bgUrl);
    } catch(e) {
        alert("❌ Background URL सही नहीं है!");
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/hero`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bgUrl, heading, subheading })
        });
        
        const result = await response.json();
        alert(result.message);
        loadHeroSettings();
    } catch (error) {
        console.error('Hero save में error:', error);
        alert('❌ Server error! अभी local save करेंगे');
        localStorage.setItem('site_hero', JSON.stringify({ bgUrl, heading, subheading }));
        loadHeroSettings();
    }
}

// ===== LOAD LOGO =====
async function loadLogo() {
    let data = await loadAllData();
    let logoUrl = data?.logo || localStorage.getItem('site_logo');
    let logoImg = document.getElementById("logo-img");
    let logoPreview = document.getElementById("logo-preview");
    
    if(logoUrl && logoImg) {
        logoImg.src = logoUrl;
        logoImg.onerror = function() {
            this.src = "";
            if(logoPreview) logoPreview.innerHTML = "<p style='color:red;'>❌ Image load नहीं हो सकी</p>";
        };
        logoImg.onload = function() {
            if(logoPreview) logoPreview.innerHTML = "<img src='" + logoUrl + "' style='max-width:100px; max-height:100px; border-radius:50%;'>";
        };
    }
}

// ===== LOAD HERO SETTINGS =====
async function loadHeroSettings() {
    let data = await loadAllData();
    let heroData = data?.hero || JSON.parse(localStorage.getItem('site_hero'));
    let heroSection = document.getElementById("home");
    let heroHeading = document.getElementById("hero-heading");
    let heroSubheading = document.getElementById("hero-subheading");
    
    if(heroData) {
        if(heroHeading) heroHeading.innerText = heroData.heading;
        if(heroSubheading) heroSubheading.innerText = heroData.subheading;
        
        if(heroSection) {
            heroSection.style.backgroundImage = "linear-gradient(rgba(0,51,102,0.8), rgba(0,51,102,0.8)), url('" + heroData.bgUrl + "')";
            heroSection.style.backgroundSize = "cover";
            heroSection.style.backgroundPosition = "center";
        }
    }
}

// ===== ADD ADMISSION (SERVER SYNC) =====
async function submitAdmissionForm(e) {
    e.preventDefault();
    
    let name = document.getElementById("adm-name").value.trim();
    let dob = document.getElementById("adm-dob").value;
    let admClass = document.getElementById("adm-class").value;
    let parent = document.getElementById("adm-parent").value.trim();
    let phone = document.getElementById("adm-phone").value.trim();
    let email = document.getElementById("adm-email").value.trim();
    let school = document.getElementById("adm-school").value.trim();
    
    if(!name || !dob || !admClass || !parent || !phone || !email) {
        alert("❌ सभी required fields भरें!");
        return;
    }
    
    if(phone.length < 10) {
        alert("❌ सही phone number दें!");
        return;
    }
    
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) {
        alert("❌ सही email address दें!");
        return;
    }
    
    const admissionData = {
        name,
        dob,
        class: admClass,
        parent,
        phone,
        email,
        previousSchool: school
    };
    
    try {
        const response = await fetch(`${API_URL}/admissions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(admissionData)
        });
        
        const result = await response.json();
        
        let messageDiv = document.getElementById("adm-message");
        messageDiv.style.display = "block";
        messageDiv.style.background = "#d4edda";
        messageDiv.style.color = "#155724";
        messageDiv.style.border = "1px solid #c3e6cb";
        messageDiv.innerText = "✅ Admission Form भेज दी गई! हम जल्द आपसे संपर्क करेंगे।";
        
        document.querySelector("form").reset();
        
        setTimeout(() => {
            closeAdmissionForm();
        }, 2000);
        
        loadAdminAdmissions();
    } catch (error) {
        console.error('Admission submit में error:', error);
        alert('❌ Server error! अभी local save करेंगे');
        
        // Fallback to localStorage
        let admissions = JSON.parse(localStorage.getItem('site_admissions')) || [];
        admissions.push({
            name, dob, class: admClass, parent, phone, email,
            previousSchool: school,
            submittedDate: new Date().toLocaleString('hi-IN'),
            status: 'Pending'
        });
        localStorage.setItem('site_admissions', JSON.stringify(admissions));
    }
}

// ===== LOAD ADMIN ADMISSIONS =====
async function loadAdminAdmissions() {
    try {
        const response = await fetch(`${API_URL}/admissions`);
        const admissions = await response.json();
        displayAdmissions(admissions);
    } catch (error) {
        console.error('Admissions load में error:', error);
        let admissions = JSON.parse(localStorage.getItem('site_admissions')) || [];
        displayAdmissions(admissions);
    }
}

function displayAdmissions(admissions) {
    let container = document.getElementById("admin-admissions-view");
    
    if(!container) return;
    
    let totalAdm = admissions.length;
    let pendingAdm = admissions.filter(a => a.status === 'Pending').length;
    let approvedAdm = admissions.filter(a => a.status === 'Approved').length;
    
    document.getElementById("total-adm").innerText = totalAdm;
    document.getElementById("pending-adm").innerText = pendingAdm;
    document.getElementById("approved-adm").innerText = approvedAdm;
    
    if(admissions.length === 0) {
        container.innerHTML = "<p style='color:gray;'>कोई भी admission application नहीं है।</p>";
        return;
    }
    
    let html = "<table style='width:100%; border-collapse:collapse;'>";
    html += "<thead><tr style='background:#002b5b; color:white;'><th style='padding:10px; text-align:left;'>Name</th><th style='padding:10px; text-align:left;'>Class</th><th style='padding:10px; text-align:left;'>Parent</th><th style='padding:10px; text-align:left;'>Phone</th><th style='padding:10px; text-align:center;'>Status</th><th style='padding:10px; text-align:center;'>Action</th></tr></thead>";
    html += "<tbody>";
    
    admissions.forEach((adm, index) => {
        let statusColor = adm.status === 'Approved' ? '#28a745' : '#ffc107';
        let statusText = adm.status === 'Approved' ? 'Approved' : 'Pending';
        
        html += `<tr style='border-bottom:1px solid #ddd;'>
            <td style='padding:10px;'>${adm.name}</td>
            <td style='padding:10px;'>Class ${adm.class}</td>
            <td style='padding:10px;'>${adm.parent}</td>
            <td style='padding:10px;'>${adm.phone}</td>
            <td style='padding:10px; text-align:center;'>
                <span style='background:${statusColor}; color:white; padding:5px 10px; border-radius:3px; font-weight:bold;'>${statusText}</span>
            </td>
            <td style='padding:10px; text-align:center;'>
                <button onclick="viewAdmissionDetails(${index})" style='background:#007bff; color:white; border:none; cursor:pointer; padding:5px 10px; border-radius:3px; margin-right:5px;'>View</button>
                <button onclick="toggleAdmissionStatus(${index})" style='background:${adm.status === 'Pending' ? '#28a745' : '#ffc107'}; color:white; border:none; cursor:pointer; padding:5px 10px; border-radius:3px; margin-right:5px;'>${adm.status === 'Pending' ? 'Approve' : 'Pending'}</button>
                <button onclick="deleteAdmission(${index})" style='background:red; color:white; border:none; cursor:pointer; padding:5px 10px; border-radius:3px;'>Delete</button>
            </td>
        </tr>`;
    });
    
    html += "</tbody></table>";
    container.innerHTML = html;
}

function viewAdmissionDetails(index) {
    let admissions = JSON.parse(localStorage.getItem('site_admissions')) || [];
    let adm = admissions[index];
    
    let details = `Student Name: ${adm.name}\nDate of Birth: ${adm.dob}\nClass: ${adm.class}\nParent Name: ${adm.parent}\nPhone: ${adm.phone}\nEmail: ${adm.email}\nPrevious School: ${adm.previousSchool || 'N/A'}\nSubmitted: ${adm.submittedDate}\nStatus: ${adm.status}`;
    
    alert(details);
}

async function toggleAdmissionStatus(index) {
    try {
        const response = await fetch(`${API_URL}/admissions/${index}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Approved' })
        });
        
        const result = await response.json();
        alert(result.message);
        loadAdminAdmissions();
    } catch (error) {
        console.error('Status update में error:', error);
        alert('❌ Update failed');
    }
}

function deleteAdmission(index) {
    if(confirm("यह application delete करना है?")) {
        let admissions = JSON.parse(localStorage.getItem('site_admissions')) || [];
        admissions.splice(index, 1);
        localStorage.setItem('site_admissions', JSON.stringify(admissions));
        alert("✅ Application Deleted!");
        loadAdminAdmissions();
    }
}

// ===== AUTO SYNC - हर 5 सेकंड में data refresh करो =====
setInterval(() => {
    console.log("🔄 Auto-syncing data...");
    
    if(document.getElementById("gallery-grid")) {
        loadPublicGallery();
        loadPublicNotice();
        loadPublicResults();
        loadPublicBooks();
        loadPublicAboutInfo();
        loadLogo();
        loadHeroSettings();
    }
    
    if(document.getElementById("admin-admissions-view")) {
        loadAdminAdmissions();
    }
}, 5000);

// ===== REMAINING FUNCTIONS (from original script.js) =====
function openAdmissionForm() {
    let modal = document.getElementById("admission-modal");
    if(modal) {
        modal.style.display = "block";
    }
}

function closeAdmissionForm() {
    let modal = document.getElementById("admission-modal");
    if(modal) {
        modal.style.display = "none";
    }
}

window.onclick = function(event) {
    let modal = document.getElementById("admission-modal");
    if(event.target === modal) {
        modal.style.display = "none";
    }
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active-tab");
    }
    tablinks = document.getElementsByClassName("sidebar")[0].getElementsByTagName("button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).classList.add("active-tab");
    evt.currentTarget.classList.add("active");
}

// Student Results
function uploadResult() {
    let name = document.getElementById("std-name").value.trim();
    let roll = document.getElementById("std-roll").value.trim();
    let stdClass = document.getElementById("std-class").value;
    let year = document.getElementById("std-year").value;
    let examType = document.getElementById("std-exam").value;
    let marks = document.getElementById("std-marks").value.trim();

    if (!name || !roll || !stdClass || !year || !examType || !marks) {
        alert("❌ सभी fields भरें!");
        return;
    }

    let students = JSON.parse(localStorage.getItem('site_students')) || [];
    students.push({ 
        name, 
        roll, 
        class: stdClass, 
        year,
        examType,
        marks,
        addedDate: new Date().toLocaleString('hi-IN')
    });
    localStorage.setItem('site_students', JSON.stringify(students));
    
    alert("✅ Student Result Upload हुआ!");
    document.getElementById("std-name").value = "";
    document.getElementById("std-roll").value = "";
    document.getElementById("std-year").value = "";
    document.getElementById("std-exam").value = "";
    document.getElementById("std-marks").value = "";
    
    loadPublicResults();
}

function loadPublicResults() {
    let students = JSON.parse(localStorage.getItem('site_students')) || [];
    let container = document.getElementById("result-output");
    
    if(container) {
        if(students.length === 0) {
            container.innerHTML = "<p style='color:gray;'>कोई भी Result अभी add नहीं हुआ है।</p>";
        } else {
            container.innerHTML = "<h4>📊 Latest Results:</h4>";
            students.forEach((student, index) => {
                let html = `
                    <div style="border: 1px solid #ccc; padding: 10px; margin: 8px 0; border-radius: 5px; background: #f9f9f9;">
                        <strong>${student.name}</strong> | Roll: ${student.roll} | Class: ${student.class} | Year: ${student.year} | Exam: ${student.examType} | Marks: <span style="color: green; font-weight: bold;">${student.marks}</span>
                    </div>
                `;
                container.innerHTML += html;
            });
        }
    }
}

// Notices
function addNotice() {
    let notice = document.getElementById("new-notice").value.trim();
    if (!notice) {
        alert("❌ कोई notice लिखें!");
        return;
    }

    let notices = JSON.parse(localStorage.getItem('site_notices')) || [];
    notices.push({
        text: notice,
        date: new Date().toLocaleString('hi-IN')
    });
    localStorage.setItem('site_notices', JSON.stringify(notices));
    
    alert("✅ Notice Published!");
    document.getElementById("new-notice").value = "";
    
    loadPublicNotice();
}

function loadPublicNotice() {
    let notices = JSON.parse(localStorage.getItem('site_notices')) || [];
    let marquee = document.getElementById("notice-marquee");
    
    if(marquee) {
        if(notices.length === 0) {
            marquee.innerText = "📢 कोई नई announcement नहीं है।";
        } else {
            let latestNotice = notices[notices.length - 1].text;
            marquee.innerText = "📢 " + latestNotice;
        }
    }
}

// Gallery
function addPhoto() {
    let url = document.getElementById("img-url").value.trim();
    if (!url) {
        alert("❌ Image URL paste करें!");
        return;
    }

    try {
        new URL(url);
    } catch(e) {
        alert("❌ सही URL पास्ट करें!");
        return;
    }

    let gallery = JSON.parse(localStorage.getItem('site_gallery')) || [];
    gallery.push({ 
        url, 
        addedDate: new Date().toLocaleString('hi-IN')
    });
    localStorage.setItem('site_gallery', JSON.stringify(gallery));
    
    alert("✅ Photo Add हुआ!");
    document.getElementById("img-url").value = "";
    
    loadPublicGallery();
}

function loadAdminGallery() {
    let gallery = JSON.parse(localStorage.getItem('site_gallery')) || [];
    let container = document.getElementById("admin-gallery-view");
    
    if(container) {
        if(gallery.length === 0) {
            container.innerHTML = "<p style='color:gray;'>कोई भी photo अभी add नहीं हुआ है।</p>";
        } else {
            container.innerHTML = "";
            gallery.forEach((item, index) => {
                let div = document.createElement("div");
                div.style = "display: inline-block; margin: 10px; text-align: center; border: 1px solid #ddd; padding: 10px; border-radius: 5px;";
                div.innerHTML = `
                    <img src="${item.url}" width="120px" height="100px" style="object-fit:cover; border-radius:5px; display:block; margin-bottom:5px;">
                    <button onclick="deletePhoto(${index})" style="background:red; color:white; border:none; cursor:pointer; padding:5px 10px; border-radius:3px;">Delete</button>
                `;
                container.appendChild(div);
            });
        }
    }
}

function deletePhoto(index) {
    if(confirm("यह photo delete करना है?")) {
        let gallery = JSON.parse(localStorage.getItem('site_gallery')) || [];
        gallery.splice(index, 1);
        localStorage.setItem('site_gallery', JSON.stringify(gallery));
        
        alert("✅ Photo Deleted!");
        loadAdminGallery();
        loadPublicGallery();
    }
}

function loadPublicGallery() {
    let gallery = JSON.parse(localStorage.getItem('site_gallery')) || [];
    let container = document.getElementById("gallery-grid");
    
    if(container) {
        if(gallery.length === 0) {
            container.innerHTML = "<p style='color:gray;'>कोई भी photo अभी add नहीं हुआ है।</p>";
        } else {
            container.innerHTML = "";
            gallery.forEach(item => {
                let div = document.createElement("div");
                div.style = "flex-shrink: 0;";
                let img = document.createElement("img");
                img.src = item.url;
                img.style = "height: 200px; width: 280px; object-fit: cover; border-radius: 10px; border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.2);";
                img.onerror = function() { this.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%23999'%3EImage Error%3C/text%3E%3C/svg%3E"; };
                div.appendChild(img);
                container.appendChild(div);
            });
        }
    }
}

// Teachers
function addTeacher() {
    let nameInput = document.querySelector('input[placeholder="Teacher Name"]');
    let subjectInput = document.querySelector('input[placeholder="Subject"]');
    
    if(!nameInput || !subjectInput) {
        console.log("❌ Input fields नहीं मिले");
        return;
    }
    
    let name = nameInput.value.trim();
    let subject = subjectInput.value.trim();
    
    if (!name || !subject) {
        alert("❌ सभी fields भरें!");
        return;
    }
    
    let teachers = JSON.parse(localStorage.getItem('site_teachers')) || [];
    teachers.push({ 
        name, 
        subject,
        addedDate: new Date().toLocaleString('hi-IN')
    });
    localStorage.setItem('site_teachers', JSON.stringify(teachers));
    
    alert("✅ Teacher Add हुआ!");
    nameInput.value = "";
    subjectInput.value = "";
    
    loadAdminTeachers();
}

function loadAdminTeachers() {
    let teachers = JSON.parse(localStorage.getItem('site_teachers')) || [];
    let container = document.getElementById("admin-teachers-view");
    
    if(container) {
        if(teachers.length === 0) {
            container.innerHTML = "<p style='color:gray;'>कोई भी teacher अभी add नहीं हुआ है।</p>";
        } else {
            container.innerHTML = "";
            teachers.forEach((teacher, index) => {
                let div = document.createElement("div");
                div.style = "border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 5px; background: #f9f9f9;";
                div.innerHTML = `
                    <strong>${teacher.name}</strong> - ${teacher.subject}
                    <button onclick="deleteTeacher(${index})" style="float: right; background: red; color: white; border: none; cursor: pointer; padding: 3px 8px; border-radius: 3px;">Delete</button>
                `;
                container.appendChild(div);
            });
        }
    }
}

function deleteTeacher(index) {
    if(confirm("यह teacher delete करना है?")) {
        let teachers = JSON.parse(localStorage.getItem('site_teachers')) || [];
        teachers.splice(index, 1);
        localStorage.setItem('site_teachers', JSON.stringify(teachers));
        alert("✅ Teacher Deleted!");
        loadAdminTeachers();
    }
}

// Books
function addBook() {
    let bookClass = document.getElementById("book-class").value.trim();
    let subject = document.getElementById("book-subject").value.trim();
    let bookName = document.getElementById("book-name").value.trim();
    let price = document.getElementById("book-price").value.trim();
    
    if(!bookClass || !subject || !bookName || !price) {
        alert("❌ सभी fields भरें!");
        return;
    }
    
    if(isNaN(price) || price <= 0) {
        alert("❌ Price सही डालें!");
        return;
    }
    
    let allBooks = JSON.parse(localStorage.getItem('site_books')) || {};
    if(!allBooks[bookClass]) {
        allBooks[bookClass] = [];
    }
    
    allBooks[bookClass].push({
        subject,
        name: bookName,
        price: parseInt(price),
        addedDate: new Date().toLocaleString('hi-IN')
    });
    
    localStorage.setItem('site_books', JSON.stringify(allBooks));
    
    alert("✅ Book Add हुई!");
    document.getElementById("book-class").value = "";
    document.getElementById("book-subject").value = "";
    document.getElementById("book-name").value = "";
    document.getElementById("book-price").value = "";
    
    loadBooksForClass();
    loadPublicBooks();
}

function loadBooksForClass() {
    let selectedClass = document.getElementById("manage-class-select").value;
    let container = document.getElementById("admin-books-view");
    
    if(!selectedClass) {
        container.innerHTML = "<p style='color:gray;'>Class select करें</p>";
        return;
    }
    
    let allBooks = JSON.parse(localStorage.getItem('site_books')) || {};
    let classBooks = allBooks[selectedClass] || [];
    
    if(classBooks.length === 0) {
        container.innerHTML = "<p style='color:gray;'>इस class की कोई भी book नहीं है।</p>";
    } else {
        let html = "<table style='width:100%; border-collapse: collapse;'>";
        html += "<thead><tr style='background: #002b5b; color: white;'><th style='padding: 10px; text-align: left;'>Subject</th><th style='padding: 10px; text-align: left;'>Book Name</th><th style='padding: 10px; text-align: center;'>Price (₹)</th><th style='padding: 10px; text-align: center;'>Action</th></tr></thead>";
        html += "<tbody>";
        
        classBooks.forEach((book, index) => {
            html += `<tr style='border-bottom: 1px solid #ddd;'>
                <td style='padding: 10px;'>${book.subject}</td>
                <td style='padding: 10px;'>${book.name}</td>
                <td style='padding: 10px; text-align: center;'>₹ ${book.price}</td>
                <td style='padding: 10px; text-align: center;'>
                    <button onclick="deleteBook('${selectedClass}', ${index})" style='background: red; color: white; border: none; cursor: pointer; padding: 5px 10px; border-radius: 3px;'>Delete</button>
                </td>
            </tr>`;
        });
        
        let totalPrice = classBooks.reduce((sum, book) => sum + book.price, 0);
        html += `<tr style='background: #f0f0f0; font-weight: bold;'><td colspan='2' style='padding: 10px; text-align: right;'>Total Price:</td><td style='padding: 10px; text-align: center;'>₹ ${totalPrice}</td><td></td></tr>`;
        html += "</tbody></table>";
        
        container.innerHTML = html;
    }
}

function deleteBook(bookClass, index) {
    if(confirm("यह book delete करना है?")) {
        let allBooks = JSON.parse(localStorage.getItem('site_books')) || {};
        if(allBooks[bookClass]) {
            allBooks[bookClass].splice(index, 1);
            localStorage.setItem('site_books', JSON.stringify(allBooks));
            
            alert("✅ Book Deleted!");
            loadBooksForClass();
            loadPublicBooks();
        }
    }
}

function showBooks() {
    let selectedClass = document.getElementById("class-select").value;
    let bookTable = document.getElementById("book-table");
    let bookBody = document.getElementById("book-body");
    
    if(!selectedClass) {
        if(bookTable) bookTable.style.display = "none";
        return;
    }
    
    let allBooks = JSON.parse(localStorage.getItem('site_books')) || {};
    let classBooks = allBooks[selectedClass] || [];
    
    if(!bookTable || !bookBody) return;
    
    if(classBooks.length === 0) {
        bookTable.style.display = "none";
        return;
    }
    
    bookBody.innerHTML = "";
    let total = 0;
    
    classBooks.forEach(book => {
        let row = `
            <tr style='border-bottom: 1px solid #ddd;'>
                <td style='padding: 10px;'>${book.subject}</td>
                <td style='padding: 10px;'>${book.name}</td>
                <td style='padding: 10px;'>₹ ${book.price}</td>
            </tr>
        `;
        bookBody.innerHTML += row;
        total += book.price;
    });
    
    document.getElementById("total-price").innerText = "₹ " + total;
    bookTable.style.display = "table";
}

function loadPublicBooks() {
    showBooks();
}

// About Section
function saveContactInfo() {
    let phone = document.getElementById("about-phone-input").value.trim();
    let email = document.getElementById("about-email-input").value.trim();
    let hours = document.getElementById("about-hours-input").value.trim();
    
    if(!phone || !email || !hours) {
        alert("❌ सभी fields भरें!");
        return;
    }
    
    let aboutData = JSON.parse(localStorage.getItem('site_about')) || {};
    aboutData.phone = phone;
    aboutData.email = email;
    aboutData.hours = hours;
    
    localStorage.setItem('site_about', JSON.stringify(aboutData));
    alert("✅ Contact Information Update हुई!");
    loadPublicAboutInfo();
}

function saveLocationInfo() {
    let address = document.getElementById("about-address-input").value.trim();
    let principal = document.getElementById("about-principal-input").value.trim();
    let year = document.getElementById("about-year-input").value.trim();
    
    if(!address || !principal || !year) {
        alert("❌ सभी fields भरें!");
        return;
    }
    
    let aboutData = JSON.parse(localStorage.getItem('site_about')) || {};
    aboutData.address = address;
    aboutData.principal = principal;
    aboutData.year = year;
    
    localStorage.setItem('site_about', JSON.stringify(aboutData));
    alert("✅ Location Information Update हुई!");
    loadPublicAboutInfo();
}

function saveSocialMedia() {
    let facebook = document.getElementById("about-facebook-input").value.trim();
    let twitter = document.getElementById("about-twitter-input").value.trim();
    let instagram = document.getElementById("about-instagram-input").value.trim();
    let youtube = document.getElementById("about-youtube-input").value.trim();
    
    let aboutData = JSON.parse(localStorage.getItem('site_about')) || {};
    aboutData.facebook = facebook;
    aboutData.twitter = twitter;
    aboutData.instagram = instagram;
    aboutData.youtube = youtube;
    
    localStorage.setItem('site_about', JSON.stringify(aboutData));
    alert("✅ Social Media Links Update हुए!");
    loadPublicAboutInfo();
}

function saveMissionInfo() {
    let mission = document.getElementById("about-mission-input").value.trim();
    
    if(!mission) {
        alert("❌ Mission Statement लिखें!");
        return;
    }
    
    let aboutData = JSON.parse(localStorage.getItem('site_about')) || {};
    aboutData.mission = mission;
    
    localStorage.setItem('site_about', JSON.stringify(aboutData));
    alert("✅ Mission Statement Update हुई!");
    loadPublicAboutInfo();
}

function saveMapInfo() {
    let mapUrl = document.getElementById("about-map-input").value.trim();
    
    if(!mapUrl) {
        alert("❌ Map URL paste करें!");
        return;
    }
    
    let aboutData = JSON.parse(localStorage.getItem('site_about')) || {};
    aboutData.mapUrl = mapUrl;
    
    localStorage.setItem('site_about', JSON.stringify(aboutData));
    alert("✅ Map Information Update हुई!");
    loadPublicAboutInfo();
}

function loadAboutInfo() {
    let aboutData = JSON.parse(localStorage.getItem('site_about')) || {};
    
    document.getElementById("about-phone-input").value = aboutData.phone || "";
    document.getElementById("about-email-input").value = aboutData.email || "";
    document.getElementById("about-hours-input").value = aboutData.hours || "";
    
    document.getElementById("about-address-input").value = aboutData.address || "";
    document.getElementById("about-principal-input").value = aboutData.principal || "";
    document.getElementById("about-year-input").value = aboutData.year || "";
    
    document.getElementById("about-facebook-input").value = aboutData.facebook || "";
    document.getElementById("about-twitter-input").value = aboutData.twitter || "";
    document.getElementById("about-instagram-input").value = aboutData.instagram || "";
    document.getElementById("about-youtube-input").value = aboutData.youtube || "";
    
    document.getElementById("about-mission-input").value = aboutData.mission || "";
    
    document.getElementById("about-map-input").value = aboutData.mapUrl || "";
}

function loadPublicAboutInfo() {
    let aboutData = JSON.parse(localStorage.getItem('site_about')) || {};
    
    let phoneEl = document.getElementById("about-phone");
    let emailEl = document.getElementById("about-email");
    let hoursEl = document.getElementById("about-hours");
    
    if(phoneEl) phoneEl.innerText = aboutData.phone || "+91-9876543210";
    if(emailEl) emailEl.innerText = aboutData.email || "info@adarshschool.com";
    if(hoursEl) hoursEl.innerText = aboutData.hours || "Mon-Fri: 8:00 AM - 3:00 PM";
    
    let addressEl = document.getElementById("about-address");
    let principalEl = document.getElementById("about-principal");
    let yearEl = document.getElementById("about-year");
    
    if(addressEl) addressEl.innerText = aboutData.address || "123 Education Street, City, State 123456";
    if(principalEl) principalEl.innerText = aboutData.principal || "Mr. Rajesh Kumar";
    if(yearEl) yearEl.innerText = aboutData.year || "1995";
    
    let fbLink = document.getElementById("social-facebook");
    let twitterLink = document.getElementById("social-twitter");
    let instagramLink = document.getElementById("social-instagram");
    let youtubeLink = document.getElementById("social-youtube");
    
    if(fbLink) fbLink.href = aboutData.facebook || "https://facebook.com";
    if(twitterLink) twitterLink.href = aboutData.twitter || "https://twitter.com";
    if(instagramLink) instagramLink.href = aboutData.instagram || "https://instagram.com";
    if(youtubeLink) youtubeLink.href = aboutData.youtube || "https://youtube.com";
    
    let missionEl = document.getElementById("about-mission");
    if(missionEl) missionEl.innerText = aboutData.mission || "To provide quality education...";
    
    let mapEl = document.getElementById("map-iframe");
    if(mapEl && aboutData.mapUrl) {
        mapEl.src = aboutData.mapUrl;
    }
}

// Admin Login
function login(e) {
    e.preventDefault();
    
    let username = document.getElementById("user").value.trim();
    let password = document.getElementById("pass").value.trim();
    
    if(username === "admin" && password === "1234") {
        alert("✅ Login Successful! Admin Panel खुल रहा है...");
        window.location.href = "dashboard.html";
    } else {
        alert("❌ Wrong Username or Password!\n\nCorrect Credentials:\nUsername: admin\nPassword: 1234");
    }
}

// Page Load
window.addEventListener('DOMContentLoaded', function() {
    console.log("🔄 Page Loading with Cloud Sync...");
    
    if(document.getElementById("tab-students")) {
        console.log("✅ Admin Dashboard Loaded");
        loadAdminGallery();
        loadAdminTeachers();
        loadAdminAdmissions();
        loadAboutInfo();
    }
    
    if(document.getElementById("gallery-grid")) {
        console.log("✅ Public Website Loaded");
        loadPublicGallery();
        loadPublicNotice();
        loadPublicResults();
        loadPublicBooks();
        loadPublicAboutInfo();
        loadLogo();
        loadHeroSettings();
    }
});

function showDemo(id) {
    let element = document.getElementById(id);
    if(element) {
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
    }
}
