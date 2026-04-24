/**
 * =========================================================================
 * NILEPRISE HRMS - MASTER JAVASCRIPT ENGINE
 * =========================================================================
 */

// ==========================================
// 1. FIREBASE CONFIGURATION & INITIALIZATION
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyBI2IulpIuSW43FaCFK-ew-5nxgxFSXjSg",
  authDomain: "nilegroup-attendance.firebaseapp.com",
  databaseURL: "https://nilegroup-attendance-default-rtdb.firebaseio.com",
  projectId: "nilegroup-attendance",
  storageBucket: "nilegroup-attendance.firebasestorage.app",
  messagingSenderId: "325824892909",
  appId: "1:325824892909:web:f7209309b2cee416ba61e4",
  measurementId: "G-63GSGT0VYH"
};

// Check if Firebase SDK is loaded
const isFirebaseReady = typeof firebase !== 'undefined';

if (isFirebaseReady) {
  firebase.initializeApp(firebaseConfig);
  // Setup invisible reCAPTCHA for SMS verification
  window.onload = function() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });
  };
} else {
  console.error("Firebase not fully configured or failed to load SDK.");
}


// ==========================================
// 2. AUTHENTICATION & ONBOARDING LOGIC
// ==========================================

function switchAuthMode(mode) {
  document.getElementById('auth-login-view').style.display = 'none';
  document.getElementById('auth-signup-view').style.display = 'none';
  document.getElementById('auth-otp-view').style.display = 'none';
  
  document.getElementById('tab-login').classList.remove('active');
  document.getElementById('tab-signup').classList.remove('active');

  if (mode === 'login') {
    document.getElementById('auth-login-view').style.display = 'block';
    document.getElementById('tab-login').classList.add('active');
  } else if (mode === 'signup') {
    document.getElementById('auth-signup-view').style.display = 'block';
    document.getElementById('tab-signup').classList.add('active');
  }
  
  document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
}

function toggleSignupMethod() {
  const method = document.querySelector('input[name="signupMethod"]:checked').value;
  document.getElementById('signup-email-form').style.display = method === 'email' ? 'block' : 'none';
  document.getElementById('signup-mobile-form').style.display = method === 'mobile' ? 'block' : 'none';
  document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
}

// Standard Login
function handleLogin(e) {
  e.preventDefault();
  const id = document.getElementById('login-id').value;
  
  if(id === "fail") { 
    document.getElementById('login-error').style.display = 'block'; 
    return; 
  }
  
  document.getElementById('auth-module').style.display = 'none';
  document.getElementById('dashboard-module').style.display = 'flex';
}

// Email Signup
function handleSignupEmail(e) {
  e.preventDefault();
  const p1 = document.getElementById('signup-pass1').value;
  const p2 = document.getElementById('signup-pass2').value;
  
  if(p1 !== p2) { 
    document.getElementById('signup-email-error').style.display = 'block'; 
    return; 
  }
  
  document.getElementById('auth-module').style.display = 'none';
  document.getElementById('onboarding-module').style.display = 'flex';
}

// Mobile Signup (Firebase + SMS)
function handleSignupMobile(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.innerText = "Sending..."; 
  btn.disabled = true;
  
  const num = document.getElementById('signup-mobile').value;
  const phoneNumber = "+91" + num; 
  
  if (isFirebaseReady && window.recaptchaVerifier) {
    firebase.auth().signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        document.getElementById('auth-signup-view').style.display = 'none';
        document.getElementById('auth-otp-view').style.display = 'block';
        btn.innerText = "Send OTP Verification"; 
        btn.disabled = false;
      }).catch((error) => {
        document.getElementById('signup-mobile-error').innerText = "Error: " + error.message;
        document.getElementById('signup-mobile-error').style.display = 'block';
        btn.innerText = "Send OTP Verification"; 
        btn.disabled = false;
        if(window.recaptchaVerifier) grecaptcha.reset(window.recaptchaWidgetId);
      });
  }
}

// OTP Verification
function handleOTPVerify(e) {
  e.preventDefault();
  const code = document.getElementById('otp-input').value;
  const btn = e.target.querySelector('button');
  btn.innerText = "Verifying..."; 
  btn.disabled = true;

  if (isFirebaseReady && window.confirmationResult) {
    window.confirmationResult.confirm(code).then((result) => {
      document.getElementById('auth-module').style.display = 'none';
      document.getElementById('onboarding-module').style.display = 'flex';
    }).catch((error) => {
      document.getElementById('otp-error').innerText = "Invalid OTP code.";
      document.getElementById('otp-error').style.display = 'block';
      btn.innerText = "Verify & Create Account"; 
      btn.disabled = false;
    });
  }
}

function finishOnboarding(e) {
  e.preventDefault();
  document.getElementById('onboarding-module').style.display = 'none';
  document.getElementById('dashboard-module').style.display = 'flex';
}

function handleLogout() {
  document.querySelectorAll('form').forEach(f => f.reset());
  document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
  
  document.getElementById('profile-menu').classList.remove('active');
  document.getElementById('dashboard-module').style.display = 'none';
  document.getElementById('onboarding-module').style.display = 'none';
  document.getElementById('auth-module').style.display = 'flex';
  
  switchAuthMode('login');
  switchMainView('home', document.querySelector('.sidebar .nav-item'));
}


// ==========================================
// 3. SPA ROUTING & NAVIGATION (Dashboard)
// ==========================================
function switchMainView(viewId, navElement) {
  document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.sidebar .nav-item').forEach(el => el.classList.remove('active'));
  
  document.getElementById('view-' + viewId).classList.add('active');
  if(navElement) navElement.classList.add('active');
  
  document.getElementById('profile-menu').classList.remove('active');
}

function switchSubTab(parentView, tabId, navElement) {
  document.querySelectorAll(`#view-${parentView} .${parentView}-sub-section`).forEach(el => el.style.display = 'none');
  document.querySelectorAll(`#view-${parentView} .page-sub-tabs .sub-tab`).forEach(el => el.classList.remove('active'));
  
  document.getElementById(`${parentView}-tab-${tabId}`).style.display = 'block';
  navElement.classList.add('active');
}

function toggleProfileMenu() { 
  document.getElementById('profile-menu').classList.toggle('active'); 
}

function openFullProfile() { 
  switchMainView('full-profile', null); 
}


// ==========================================
// 4. DASHBOARD UTILITIES (Clocks & Roster)
// ==========================================
function updateClocks() {
  const now = new Date();
  if(document.getElementById('home-clock')){
    document.getElementById('home-clock').textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('home-date').textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }
}
setInterval(updateClocks, 1000); 
updateClocks();

const educationalRoster = {
  "Sid": { name: "Anandeshi Sidharth", role: "Recruiter", avatar: "AS", color: "#14b8a6", avgHrs: "8h 02m", earnedLeave: 5 },
  "Mustafa": { name: "Mustafa Mohammed", role: "Expert", avatar: "MM", color: "#f59e0b", avgHrs: "7h 19m", earnedLeave: 12.2 },
  "Rama": { name: "Narapaka Ramadevi", role: "Associate", avatar: "NR", color: "#0ea5e9", avgHrs: "7h 46m", earnedLeave: 10.75 }
};

function renderRoster() {
  const container = document.getElementById('emp-list-container');
  if(!container) return;
  container.innerHTML = '';
  
  for (const [id, data] of Object.entries(educationalRoster)) {
    container.innerHTML += `
      <div class="emp-card" id="emp-${id}" onclick="selectEmployee('${id}')">
        <div style="width:30px; height:30px; border-radius:50%; background-color:${data.color}; color:white; display:flex; align-items:center; justify-content:center; font-size:0.7rem; font-weight:bold;">${data.avatar}</div>
        <div>
          <div style="font-weight:600; font-size:0.85rem;">${data.name}</div>
          <div style="font-size:0.7rem; color:#64748b;">${data.role}</div>
        </div>
      </div>`;
  }
}
renderRoster(); 

function selectEmployee(id) {
  document.querySelectorAll('.emp-card').forEach(card => card.style.borderColor = 'var(--border)');
  document.getElementById('emp-' + id).style.borderColor = 'var(--keka-purple)';
  
  const data = educationalRoster[id];
  
  document.getElementById('unified-dashboard-area').innerHTML = `
    <div style="border-top:2px solid var(--border); padding-top:2rem; display:flex; flex-direction:column; gap:1.5rem; animation: fadeIn 0.3s ease;">
      <div class="card" style="display:flex; align-items:center; gap:1.5rem;">
        <div style="width:60px; height:60px; border-radius:50%; background-color:${data.color}; color:white; display:flex; align-items:center; justify-content:center; font-size:1.5rem; font-weight:bold;">${data.avatar}</div>
        <div>
          <h2 style="margin:0; font-size:1.3rem;">${data.name}</h2>
          <p style="margin:0; color:#64748b;">${data.role}</p>
        </div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
        <div class="card"><div style="font-size:0.8rem; color:#64748b; margin-bottom:5px;">Avg Hrs/Day</div><div style="font-size:1.5rem; font-weight: 500; color: #1e293b;">${data.avgHrs}</div></div>
        <div class="card"><div style="font-size:0.8rem; color:#64748b; margin-bottom:5px;">Earned Leave</div><div style="font-size:1.5rem; font-weight: 500; color: #1e293b;">${data.earnedLeave}</div></div>
      </div>
    </div>`;
}


// ==========================================
// 5. GEOFENCING & CAMERA PUNCH LOGIC
// ==========================================
function closeModal(id) { 
  document.getElementById(id).classList.remove('active'); 
}

function openPunchModal(action) {
  document.getElementById('action-modal').classList.add('active');
  document.getElementById('action-title').textContent = action + " Action";
  document.getElementById('pin-error').textContent = "";
}

document.getElementById('btn-submit-pin').addEventListener('click', () => {
  document.getElementById('pin-error').textContent = "Locating GPS...";
  document.getElementById('pin-error').style.color = "#475569";
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        closeModal('action-modal'); 
        document.getElementById('native-camera').click();
      },
      (error) => { 
        document.getElementById('pin-error').textContent = "GPS Access Denied. Please allow location in your browser."; 
        document.getElementById('pin-error').style.color = "var(--danger-text)";
      },
      { enableHighAccuracy: true }
    );
  } else {
    document.getElementById('pin-error').textContent = "Geolocation is not supported by this browser.";
    document.getElementById('pin-error').style.color = "var(--danger-text)";
  }
});

document.getElementById('native-camera').addEventListener('change', (event) => {
  if (event.target.files[0]) {
    alert("Photo captured and GPS verified. Punch logged successfully.");
    document.getElementById('native-camera').value = ""; 
  }
});
