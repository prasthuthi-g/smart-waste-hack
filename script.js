// Global variables
let currentUser = null;
let currentUserType = 'resident';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const area = localStorage.getItem('area');

    if (token && role) {
        currentUserType = role;
        redirectToDashboard();
    }

    // Initialize forms
    initializeAuthForms();
    initializeDashboard();
});

// Navigation functions
function goToLogin() {
    window.location = "login.html";
}

function redirectToDashboard() {
    if (currentUserType === 'resident') {
        window.location = "resident.html";
    } else {
        window.location = "worker.html";
    }
}

// Authentication functions
function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabs = document.querySelectorAll('.tab-btn');
    const title = document.getElementById('authTitle');
    const subtitle = document.getElementById('authSubtitle');

    tabs.forEach(t => t.classList.remove('active'));

    if (tab === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        document.querySelector('[onclick="switchTab(\'login\')"]').classList.add('active');
        title.textContent = 'Welcome Back';
        subtitle.textContent = 'Sign in to your account';
    } else {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        document.querySelector('[onclick="switchTab(\'register\')"]').classList.add('active');
        title.textContent = 'Create Account';
        subtitle.textContent = 'Join our waste management community';
    }
}

function setUserType(type) {
    currentUserType = type;
    const typeBtns = document.querySelectorAll('.type-btn');
    typeBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-type="${type}"]`).classList.add('active');

    // Show/hide area field for residents
    const areaGroup = document.getElementById('areaGroup');
    if (type === 'resident') {
        areaGroup.style.display = 'block';
    } else {
        areaGroup.style.display = 'none';
    }
}

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showMessage("Please fill in all fields.", "error");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: email, password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('area', data.area);
            showMessage("Login successful! Redirecting...", "success");
            setTimeout(() => redirectToDashboard(), 1000);
        } else {
            showMessage(data.error, "error");
        }
    } catch (error) {
        showMessage("Login failed. Please try again.", "error");
    }
}

async function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const area = document.getElementById('registerArea').value;

    if (!name || !email || !password) {
        showMessage("Please fill in all required fields.", "error");
        return;
    }

    if (currentUserType === 'resident' && !area) {
        showMessage("Please select your residential area.", "error");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: email, password, role: currentUserType, area: currentUserType === 'resident' ? area : null })
        });
        const data = await response.json();
        if (response.ok) {
            showMessage("Account created successfully!", "success");
            switchTab('login');
            document.getElementById('loginEmail').value = email;
        } else {
            showMessage(data.error, "error");
        }
    } catch (error) {
        showMessage("Registration failed. Please try again.", "error");
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('area');
    window.location = "index.html";
}

// Dashboard functions
async function initializeDashboard() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || !role) return;

    currentUserType = role;

    // Update user info in header
    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
        userInfo.innerHTML = `<i class="fas fa-user"></i> ${role}`;
    }

    if (role === 'resident') {
        loadResidentDashboard();
    } else {
        loadWorkerDashboard();
    }
}

function loadResidentDashboard() {
    const area = localStorage.getItem('area');
    // Load user details - for now, just area
    const userDetails = document.getElementById('userDetails');
    if (userDetails) {
        userDetails.innerHTML = `
            <div class="user-detail">
                <strong>Area:</strong> ${area}
            </div>
        `;
    }

    // Load schedules
    fetch(`http://localhost:3000/schedules/${encodeURIComponent(area)}`)
        .then(response => response.json())
        .then(schedules => {
            const scheduleBox = document.getElementById('scheduleBox');
            if (schedules.length > 0) {
                scheduleBox.innerHTML = schedules.map(s => `
                    <div class="schedule-info">
                        <div class="schedule-time">
                            <i class="fas fa-clock"></i>
                            <span>${s.date} at ${s.time}</span>
                        </div>
                        <div class="schedule-area">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${s.area}</span>
                        </div>
                        <p class="schedule-note">${s.message}</p>
                    </div>
                `).join('');
            } else {
                scheduleBox.innerHTML = '<p>No schedules available for your area.</p>';
            }
        })
        .catch(error => {
            console.error('Error loading schedules:', error);
            const scheduleBox = document.getElementById('scheduleBox');
            scheduleBox.innerHTML = '<p>Error loading schedules.</p>';
        });
}

function loadWorkerDashboard() {
    // Load all schedules
    fetch('http://localhost:3000/schedules')
        .then(response => response.json())
        .then(schedules => {
            const schedulesList = document.getElementById('schedulesList');
            if (schedules.length > 0) {
                schedulesList.innerHTML = schedules.map(s => `
                    <div class="schedule-item">
                        <div class="schedule-header">
                            <span class="area-name">${s.area}</span>
                            <span class="schedule-time">${s.date} at ${s.time}</span>
                        </div>
                        <div class="residents-count">${s.message}</div>
                    </div>
                `).join('');
            } else {
                schedulesList.innerHTML = '<p>No schedules created yet.</p>';
            }
        })
        .catch(error => {
            console.error('Error loading schedules:', error);
            const schedulesList = document.getElementById('schedulesList');
            schedulesList.innerHTML = '<p>Error loading schedules.</p>';
        });

    // For simplicity, no notifications for now
    const notificationsList = document.getElementById('notificationsList');
    notificationsList.innerHTML = '<p>No new notifications.</p>';
}

async function handleSchedulePickup(event) {
    event.preventDefault();

    const area = document.getElementById('areaSelect').value;
    const date = document.getElementById('pickupDate').value;
    const time = document.getElementById('pickupTime').value;
    const message = document.getElementById('pickupMessage').value;
    const token = localStorage.getItem('token');

    if (!area || !date || !time || !message) {
        showMessage("Please fill in all fields.", "error");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/schedule', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ area, date, time, message, token })
        });
        const data = await response.json();
        if (response.ok) {
            showMessage("Pickup scheduled successfully!", "success");
            loadWorkerDashboard();
            event.target.reset();
        } else {
            showMessage(data.error, "error");
        }
    } catch (error) {
        showMessage("Scheduling failed. Please try again.", "error");
    }
}

// Form initialization
function initializeAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const scheduleForm = document.getElementById('scheduleForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    if (scheduleForm) {
        scheduleForm.addEventListener('submit', handleSchedulePickup);
    }
}

// Utility functions
function showMessage(message, type = "info") {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i> ${message}`;

    // Add to page
    const container = document.querySelector('.container') || document.querySelector('.auth-container') || document.body;
    container.insertBefore(messageEl, container.firstChild);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 5000);
}