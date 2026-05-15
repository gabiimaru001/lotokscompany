/**
 * LOTOKS — Global Application Logic (Overhaul Edition)
 */

// ── State Management ──────────────────────────────
const State = {
    user: JSON.parse(localStorage.getItem('lotoks_user')) || null,
    lang: localStorage.getItem('lotoks_lang') || 'en',
    notifications: 5,
    country: 'NG' // Default for demo
};

// ── Navigation Logic ──────────────────────────────
function initNavigation() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    // Desktop Sidebar
    document.querySelectorAll('.sidebar-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
            link.style.borderLeft = '4px solid #C9A44B'; // Gold border as requested
        }
    });

    // Mobile Bottom Tab Bar
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
        if (item.getAttribute('href') === currentPath) {
            item.classList.add('active');
        }
    });

    // Admin Drawer
    const menuBtn = document.getElementById('adminMenuBtn');
    const drawer = document.getElementById('adminDrawer');
    const overlay = document.getElementById('drawerOverlay');

    if (menuBtn && drawer) {
        menuBtn.addEventListener('click', () => {
            drawer.classList.add('open');
            overlay.classList.add('active');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            drawer.classList.remove('open');
            overlay.classList.remove('active');
        });
    }
}

// ── 3D Hero Logic ─────────────────────────────────
function initHero3D() {
    const container = document.querySelector('.hero-3d');
    const video = document.querySelector('.hero-video-container');
    
    if (container && video) {
        container.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            video.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });
        
        container.addEventListener('mouseleave', () => {
            video.style.transform = `rotateY(0deg) rotateX(0deg)`;
        });
    }
}

// ── OTP & Auth Fixes ──────────────────────────────
function initOTP() {
    const inputs = document.querySelectorAll('.otp-input');
    if (!inputs.length) return;

    inputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            const val = e.target.value;
            if (val && !/^\d$/.test(val)) {
                e.target.value = '';
                return;
            }
            if (val.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                inputs[index - 1].focus();
            }
            if (e.key === 'ArrowLeft' && index > 0) {
                inputs[index - 1].focus();
            }
            if (e.key === 'ArrowRight' && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
            if (e.key === 'Enter') {
                verifyOtp();
            }
        });

        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const data = e.clipboardData.getData('text');
            if (data.length >= 6 && /^\d+$/.test(data)) {
                for (let i = 0; i < 6; i++) {
                    if (inputs[i]) inputs[i].value = data[i];
                }
                inputs[5].focus();
            }
        });
    });

    // Global paste support for 6-digit codes
    document.addEventListener('paste', (e) => {
        const data = e.clipboardData.getData('text');
        if (data.length === 6 && /^\d+$/.test(data) && document.activeElement.classList.contains('otp-input')) {
            inputs.forEach((input, i) => input.value = data[i]);
            inputs[5].focus();
        }
    });
}

// ── Localization ──────────────────────────────────
const TRANSLATIONS = {
    en: { hero_title: "Your global sponsorship journey starts here.", start_app: "Start Application" },
    fr: { hero_title: "Votre voyage de parrainage mondial commence ici.", start_app: "Commencer la demande" },
    ar: { hero_title: "رحلتك العالمية للرعاية تبدأ من هنا.", start_app: "بدء التقديم" }
};

function switchLang(lang) {
    State.lang = lang;
    localStorage.setItem('lotoks_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Dynamic Update (Simple mapping for demo)
    document.querySelectorAll('[data-t]').forEach(el => {
        const key = el.getAttribute('data-t');
        if (TRANSLATIONS[lang][key]) el.innerText = TRANSLATIONS[lang][key];
    });

    Utils.showToast(`Language changed to ${lang.toUpperCase()}`);
}

// ── Notification Logic ────────────────────────────
function initNotifications() {
    const bell = document.getElementById('notifBell');
    const badge = document.getElementById('notifBadge');
    
    if (badge) {
        badge.innerText = State.notifications;
        badge.classList.add('bounce-in');
    }

    if (bell) {
        bell.addEventListener('click', () => {
            // Show dropdown or navigate
            Utils.showToast("Opening notification center...");
        });
    }
}

// ── Wizard Logic Fixes ────────────────────────────
function updateApplyWizard() {
    const jobSelected = document.querySelector('input[value="job"]').checked;
    const jobList = document.getElementById('revealedJobs');
    if (jobList) jobList.classList.toggle('d-none', !jobSelected);
}

// ── Init All ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHero3D();
    initOTP();
    initNotifications();
    
    // Page Transitions
    document.body.classList.add('fade-up');
});

// ── Global Utils Override ─────────────────────────
const EnhancedUtils = {
    ...Utils,
    shake: (el) => {
        el.classList.add('shake');
        setTimeout(() => el.classList.remove('shake'), 500);
    },
    triggerDownload: (filename) => {
        Utils.showToast(`Downloading ${filename}...`);
        // Mock download logic
    }
};
window.Utils = EnhancedUtils;
