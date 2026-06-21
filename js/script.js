/**
 * Scholarship Portal - Main JavaScript
 * Handles data management, UI interactions, Excel export
 */

// ===================== DATA MANAGEMENT =====================

let applications = [];
let currentTheme = localStorage.getItem('theme') || 'light';

// Load data from localStorage on startup
function loadData() {
    const stored = localStorage.getItem('scholarshipApplications');
    if (stored) {
        try {
            applications = JSON.parse(stored);
        } catch (e) {
            console.error('Error loading data:', e);
            applications = [];
        }
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('scholarshipApplications', JSON.stringify(applications));
}

// ===================== INITIALIZATION =====================

document.addEventListener('DOMContentLoaded', function() {
    loadData();
    applyTheme(currentTheme);
    updateStats();
    renderTable();

    // Modal close on overlay click
    const modalOverlay = document.getElementById('detailModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });
});

// ===================== THEME MANAGEMENT =====================

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.getElementById('themeIcon');
    const text = document.getElementById('themeText');

    if (icon && text) {
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            text.textContent = 'Light Mode';
        } else {
            icon.className = 'fas fa-moon';
            text.textContent = 'Dark Mode';
        }
    }
}

// ===================== SECTION NAVIGATION =====================

function showSection(section) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

    const sectionEl = document.getElementById(section + 'Section');
    const tabEl = document.getElementById('tab-' + section);

    if (sectionEl) sectionEl.classList.add('active');
    if (tabEl) tabEl.classList.add('active');

    const statsSection = document.getElementById('statsSection');
    if (statsSection) {
        if (section === 'admin') {
            statsSection.style.display = 'block';
            updateStats();
            renderTable();
        } else {
            statsSection.style.display = 'none';
        }
    }
}

// ===================== FORM SUBMISSION =====================

function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const application = {
        id: 'SCH' + String(Date.now()).slice(-6),
        name: formData.get('name'),
        email: formData.get('email'),
        mobile: formData.get('mobile'),
        course: formData.get('course'),
        income: parseFloat(formData.get('income')),
        scholarshipType: formData.get('scholarshipType'),
        address: formData.get('address') || '',
        status: 'Pending',
        appliedOn: new Date().toLocaleString('en-IN', { 
            day: '2-digit', month: 'short', year: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
        })
    };

    applications.unshift(application);
    saveData();

    showToast('Application submitted successfully! Your ID: ' + application.id, 'success');
    e.target.reset();
}

// ===================== TABLE RENDERING =====================

function renderTable(data) {
    if (!data) data = applications;

    const tbody = document.getElementById('applicationsTableBody');
    const emptyState = document.getElementById('emptyState');

    if (!tbody) return;

    if (data.length === 0) {
        tbody.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    tbody.innerHTML = data.map(app => `
        <tr>
            <td><strong>${app.id}</strong></td>
            <td>${escapeHtml(app.name)}</td>
            <td>${escapeHtml(app.email)}</td>
            <td>${escapeHtml(app.course)}</td>
            <td>${escapeHtml(app.scholarshipType)}</td>
            <td>₹${app.income.toLocaleString('en-IN')}</td>
            <td>${app.appliedOn}</td>
            <td>${getStatusBadge(app.status)}</td>
            <td>
                <div class="action-btns">
                    <button class="btn-action btn-approve" onclick="updateStatus('${app.id}', 'Approved')" title="Approve">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn-action btn-reject" onclick="updateStatus('${app.id}', 'Rejected')" title="Reject">
                        <i class="fas fa-times"></i>
                    </button>
                    <button class="btn-action" style="background: rgba(26, 54, 93, 0.1); color: var(--primary);" onclick="viewDetails('${app.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteApplication('${app.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===================== STATUS BADGE =====================

function getStatusBadge(status) {
    const classes = {
        'Pending': 'status-pending',
        'Approved': 'status-approved',
        'Rejected': 'status-rejected'
    };
    const icons = {
        'Pending': 'fa-clock',
        'Approved': 'fa-check',
        'Rejected': 'fa-times'
    };
    return `<span class="status-badge ${classes[status] || 'status-pending'}"><i class="fas ${icons[status] || 'fa-clock'}"></i> ${status}</span>`;
}

// ===================== STATUS UPDATE =====================

function updateStatus(id, status) {
    const app = applications.find(a => a.id === id);
    if (app) {
        app.status = status;
        saveData();
        updateStats();
        renderTable();

        const toastType = status === 'Approved' ? 'success' : 'warning';
        showToast(`Application ${id} has been ${status.toLowerCase()}!`, toastType);
    }
}

// ===================== DELETE APPLICATION =====================

function deleteApplication(id) {
    if (confirm('Are you sure you want to delete this application?')) {
        applications = applications.filter(a => a.id !== id);
        saveData();
        updateStats();
        renderTable();
        showToast('Application deleted successfully!', 'success');
    }
}

// ===================== VIEW DETAILS MODAL =====================

function viewDetails(id) {
    const app = applications.find(a => a.id === id);
    if (!app) return;

    const modalBody = document.getElementById('modalBody');
    if (!modalBody) return;

    modalBody.innerHTML = `
        <div class="detail-row">
            <span class="detail-label">Application ID</span>
            <span class="detail-value">${app.id}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Full Name</span>
            <span class="detail-value">${escapeHtml(app.name)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Email</span>
            <span class="detail-value">${escapeHtml(app.email)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Mobile</span>
            <span class="detail-value">${escapeHtml(app.mobile)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Course</span>
            <span class="detail-value">${escapeHtml(app.course)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Scholarship Type</span>
            <span class="detail-value">${escapeHtml(app.scholarshipType)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Annual Income</span>
            <span class="detail-value">₹${app.income.toLocaleString('en-IN')}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Address</span>
            <span class="detail-value">${escapeHtml(app.address) || 'Not provided'}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Applied On</span>
            <span class="detail-value">${app.appliedOn}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Status</span>
            <span class="detail-value">${getStatusBadge(app.status)}</span>
        </div>
        <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem; justify-content: flex-end;">
            <button class="btn btn-success btn-sm" onclick="updateStatus('${app.id}', 'Approved'); closeModal();">
                <i class="fas fa-check"></i> Approve
            </button>
            <button class="btn btn-danger btn-sm" onclick="updateStatus('${app.id}', 'Rejected'); closeModal();">
                <i class="fas fa-times"></i> Reject
            </button>
        </div>
    `;

    const modal = document.getElementById('detailModal');
    if (modal) modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('detailModal');
    if (modal) modal.classList.remove('active');
}

// ===================== FILTER & SEARCH =====================

function filterApplications() {
    const searchInput = document.getElementById('searchInput');
    const filterStatus = document.getElementById('filterStatus');

    const search = searchInput ? searchInput.value.toLowerCase() : '';
    const status = filterStatus ? filterStatus.value : '';

    let filtered = applications.filter(app => {
        const matchesSearch = !search || 
            app.name.toLowerCase().includes(search) ||
            app.email.toLowerCase().includes(search) ||
            app.course.toLowerCase().includes(search) ||
            app.scholarshipType.toLowerCase().includes(search) ||
            app.id.toLowerCase().includes(search);

        const matchesStatus = !status || app.status === status;

        return matchesSearch && matchesStatus;
    });

    renderTable(filtered);
}

// ===================== STATISTICS =====================

function updateStats() {
    const totalEl = document.getElementById('totalCount');
    const pendingEl = document.getElementById('pendingCount');
    const approvedEl = document.getElementById('approvedCount');
    const rejectedEl = document.getElementById('rejectedCount');

    if (totalEl) totalEl.textContent = applications.length;
    if (pendingEl) pendingEl.textContent = applications.filter(a => a.status === 'Pending').length;
    if (approvedEl) approvedEl.textContent = applications.filter(a => a.status === 'Approved').length;
    if (rejectedEl) rejectedEl.textContent = applications.filter(a => a.status === 'Rejected').length;
}

// ===================== EXCEL EXPORT =====================

function exportToExcel() {
    if (applications.length === 0) {
        showToast('No data to export!', 'error');
        return;
    }

    // Check if XLSX library is loaded
    if (typeof XLSX === 'undefined') {
        showToast('Excel library not loaded. Please check your internet connection.', 'error');
        return;
    }

    const exportData = applications.map(app => ({
        'Application ID': app.id,
        'Student Name': app.name,
        'Email': app.email,
        'Mobile': app.mobile,
        'Course': app.course,
        'Scholarship Type': app.scholarshipType,
        'Annual Income (₹)': app.income,
        'Address': app.address,
        'Status': app.status,
        'Applied On': app.appliedOn
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Scholarship Applications');

    // Auto-adjust column widths
    const colWidths = [
        { wch: 12 }, { wch: 20 }, { wch: 25 }, { wch: 15 }, 
        { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 30 }, 
        { wch: 12 }, { wch: 20 }
    ];
    ws['!cols'] = colWidths;

    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `Scholarship_Applications_${dateStr}.xlsx`);
    showToast('Data exported to Excel successfully!', 'success');
}

// ===================== SAMPLE DATA =====================

function loadSampleData() {
    if (applications.length > 0 && !confirm('This will add sample data to existing records. Continue?')) {
        return;
    }

    const sampleData = [
        { 
            id: 'SCH1001', 
            name: 'Rahul Sharma', 
            email: 'rahul.sharma@email.com', 
            mobile: '+91 98765 43210', 
            course: 'B.Tech', 
            income: 180000, 
            scholarshipType: 'Merit Scholarship', 
            address: '12 MG Road, Hyderabad, Telangana', 
            status: 'Approved', 
            appliedOn: '15 Jun 2026, 10:30 AM' 
        },
        { 
            id: 'SCH1002', 
            name: 'Priya Patel', 
            email: 'priya.patel@email.com', 
            mobile: '+91 98765 43211', 
            course: 'B.Sc', 
            income: 120000, 
            scholarshipType: 'Need-Based Scholarship', 
            address: '45 Park Street, Mumbai, Maharashtra', 
            status: 'Pending', 
            appliedOn: '16 Jun 2026, 02:15 PM' 
        },
        { 
            id: 'SCH1003', 
            name: 'Amit Kumar', 
            email: 'amit.kumar@email.com', 
            mobile: '+91 98765 43212', 
            course: 'MBA', 
            income: 250000, 
            scholarshipType: 'Sports Scholarship', 
            address: '78 Green Valley, Bangalore, Karnataka', 
            status: 'Rejected', 
            appliedOn: '14 Jun 2026, 09:45 AM' 
        },
        { 
            id: 'SCH1004', 
            name: 'Sneha Reddy', 
            email: 'sneha.reddy@email.com', 
            mobile: '+91 98765 43213', 
            course: 'M.Tech', 
            income: 95000, 
            scholarshipType: 'Minority Scholarship', 
            address: '23 Lake View, Chennai, Tamil Nadu', 
            status: 'Pending', 
            appliedOn: '17 Jun 2026, 11:20 AM' 
        },
        { 
            id: 'SCH1005', 
            name: 'Vikram Singh', 
            email: 'vikram.singh@email.com', 
            mobile: '+91 98765 43214', 
            course: 'B.Com', 
            income: 200000, 
            scholarshipType: 'Merit Scholarship', 
            address: '56 Royal Enclave, Delhi, NCR', 
            status: 'Approved', 
            appliedOn: '13 Jun 2026, 03:00 PM' 
        },
        { 
            id: 'SCH1006', 
            name: 'Ananya Gupta', 
            email: 'ananya.gupta@email.com', 
            mobile: '+91 98765 43215', 
            course: 'MCA', 
            income: 150000, 
            scholarshipType: 'Research Scholarship', 
            address: '89 Tech Park, Pune, Maharashtra', 
            status: 'Pending', 
            appliedOn: '18 Jun 2026, 08:30 AM' 
        }
    ];

    applications = [...sampleData, ...applications];
    saveData();
    updateStats();
    renderTable();
    showToast('Sample data loaded successfully!', 'success');
}

// ===================== CLEAR ALL DATA =====================

function clearAllData() {
    if (confirm('Are you sure you want to delete ALL applications? This cannot be undone!')) {
        applications = [];
        localStorage.removeItem('scholarshipApplications');
        updateStats();
        renderTable();
        showToast('All data cleared successfully!', 'success');
    }
}

// ===================== TOAST NOTIFICATIONS =====================

function showToast(message, type) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type || 'success'}`;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle'
    };

    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.success}"></i>
        <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.4s ease forwards';
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 400);
    }, 4000);
}

// ===================== UTILITY FUNCTIONS =====================

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for global access
window.toggleTheme = toggleTheme;
window.showSection = showSection;
window.handleSubmit = handleSubmit;
window.updateStatus = updateStatus;
window.deleteApplication = deleteApplication;
window.viewDetails = viewDetails;
window.closeModal = closeModal;
window.filterApplications = filterApplications;
window.exportToExcel = exportToExcel;
window.loadSampleData = loadSampleData;
window.clearAllData = clearAllData;
