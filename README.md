# 🎓 Scholarship Portal

A professional, classic scholarship management system with admin dashboard, application tracking, and Excel export functionality.

---

## 📁 Project Structure

```
scholarship_portal/
├── index.html              # Main HTML file (Entry point)
├── css/
│   └── styles.css          # All styles and themes
├── js/
│   └── script.js           # All JavaScript functionality
├── data/
│   └── database.json       # Database schema and configuration
└── README.md               # This file
```

---

## 🚀 How to Run

### Method 1: Direct Open (Simple)
1. Extract the ZIP file
2. Double-click `index.html`
3. The portal will open in your default browser

### Method 2: Local Server (Recommended)
Using Python:
```bash
cd scholarship_portal
python -m http.server 8000
```
Then open: `http://localhost:8000`

Using Node.js (http-server):
```bash
npm install -g http-server
cd scholarship_portal
http-server -p 8000
```

Using VS Code:
- Install "Live Server" extension
- Right-click on `index.html` → "Open with Live Server"

---

## ✨ Features

### 📝 Student Features
- **Apply for Scholarships** - Fill application form with all details
- **View Available Scholarships** - Merit, Need-Based, Sports, Minority, Research
- **Application Tracking** - Track status via Admin Dashboard

### 🛡️ Admin Features
- **Statistics Dashboard** - Total, Pending, Approved, Rejected counts
- **Applications Table** - View all applications with details
- **Status Management** - Approve, Reject, or keep Pending
- **Search & Filter** - Filter by name, email, course, or status
- **View Details** - Full application details in modal popup
- **Export to Excel** - Download all data as `.xlsx` file
- **Sample Data** - Load demo data for testing
- **Clear Data** - Delete all records

### 🎨 Design Features
- **Professional Classic UI** - Navy Blue & Gold theme
- **Dark/Light Mode** - Toggle between themes
- **Responsive Design** - Works on mobile, tablet, desktop
- **Toast Notifications** - Success/error messages
- **Smooth Animations** - Fade, slide, hover effects

---

## 💾 Database

### Storage Method
- **Primary**: Browser LocalStorage (persists across sessions)
- **Secondary**: `data/database.json` (schema reference)

### Data Structure
```json
{
  "id": "SCH123456",
  "name": "Student Name",
  "email": "student@email.com",
  "mobile": "+91 98765 43210",
  "course": "B.Tech",
  "income": 250000,
  "scholarshipType": "Merit Scholarship",
  "address": "Full Address",
  "status": "Pending",
  "appliedOn": "21 Jun 2026, 10:30 AM"
}
```

### Status Types
- `Pending` - Under review
- `Approved` - Scholarship granted
- `Rejected` - Application declined

---

## 📊 Excel Export

### How to Export
1. Go to **Admin** tab
2. Click **Export to Excel** button
3. File will download as: `Scholarship_Applications_YYYY-MM-DD.xlsx`

### Exported Columns
- Application ID
- Student Name
- Email
- Mobile
- Course
- Scholarship Type
- Annual Income (₹)
- Address
- Status
- Applied On

---

## 🌓 Theme Toggle

Click the **Dark Mode** / **Light Mode** button in the header to switch themes. Your preference is saved in LocalStorage.

---

## 🧪 Sample Data

Click **Load Sample Data** in Admin Dashboard to add 6 demo applications for testing.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| HTML5 | Structure |
| CSS3 | Styling & Animations |
| JavaScript (ES6+) | Logic & Interactivity |
| LocalStorage | Data Persistence |
| SheetJS (xlsx) | Excel Export |
| Font Awesome | Icons |
| Google Fonts | Typography |

---

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Opera 67+

---

## 🔒 Security Notes

- This is a frontend-only application
- Data is stored in browser LocalStorage
- For production use, implement backend API with proper authentication
- Add server-side validation for production

---

## 📞 Support

For issues or questions:
1. Check browser console for errors (F12 → Console)
2. Ensure internet connection for CDN resources
3. Clear browser cache if styles don't load

---

**© 2026 Scholarship Portal** | Empowering Future Leaders
