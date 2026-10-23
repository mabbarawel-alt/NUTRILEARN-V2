/**
 * NutriLearn - Mobile UI/UX Enhancements Module (mobileUX.js)
 * Provides touch-friendly steppers, live WHO Z-Score estimation,
 * and synchronized bottom navigation for mobile & PWA users.
 * 
 * Note: Keeps all database models, Supabase sync, and API clients 100% intact.
 */

const NutriMobile = {
  init() {
    this.bindFormEvents();
    this.syncWithAppNavigation();
  },

  // Adjust numeric input by delta with proper decimal formatting
  stepInput(elementId, delta) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    let currentVal = parseFloat(el.value);
    if (isNaN(currentVal)) {
      currentVal = 0;
    }
    
    // Determine precision based on step (e.g. 0.1 vs 1)
    const isDecimal = delta % 1 !== 0 || (el.step && el.step.includes('.'));
    let newVal = currentVal + delta;
    
    if (el.min && newVal < parseFloat(el.min)) {
      newVal = parseFloat(el.min);
    }
    if (el.max && newVal > parseFloat(el.max)) {
      newVal = parseFloat(el.max);
    }
    
    el.value = isDecimal ? newVal.toFixed(1) : Math.round(newVal);
    
    // Trigger input & change events for validation and live calculations
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  },

  // Real-time Live WHO status calculation for Add Child modal
  calcLiveZScore() {
    const heightEl = document.getElementById('add-child-height');
    const weightEl = document.getElementById('add-child-weight');
    const muacEl = document.getElementById('add-child-muac');
    const ageEl = document.querySelector('#modal-add-child input[name="childAge"]');
    const previewPill = document.getElementById('add-child-live-preview');
    const dot = document.getElementById('live-who-dot');
    const text = document.getElementById('live-who-text');
    const muacBadge = document.getElementById('live-muac-badge');

    if (!heightEl || !weightEl || !previewPill || !text) return;

    const height = parseFloat(heightEl.value) || 0;
    const weight = parseFloat(weightEl.value) || 0;
    const muac = parseFloat(muacEl?.value) || 0;
    const age = parseInt(ageEl?.value) || 12;

    if (height <= 0 || weight <= 0) return;

    // Approximate WHO median standards for quick UI preview
    // Expected height approx: 75cm at 12m, 85cm at 24m, 95cm at 36m
    const expectedHeight = 50 + (age * 1.3);
    const expectedWeight = 3.5 + (age * 0.4);

    let status = 'Normal Growth';
    let statusColor = '#10B981'; // Green
    let statusBg = '#ECFDF5';

    if (height < expectedHeight * 0.88) {
      status = 'Stunted (Low Height for Age)';
      statusColor = '#EF4444'; // Red
      statusBg = '#FEF2F2';
    } else if (weight < expectedWeight * 0.85) {
      status = 'Underweight / Wasted (Low Weight)';
      statusColor = '#F59E0B'; // Amber
      statusBg = '#FFFBEB';
    }

    if (dot) dot.style.background = statusColor;
    if (previewPill) {
      previewPill.style.background = statusBg;
      previewPill.style.borderColor = statusColor + '55';
    }
    text.textContent = `Tantiya (WHO): ${status}`;

    // Live MUAC classification
    if (muacBadge && muac > 0) {
      if (muac < 115) {
        muacBadge.textContent = `MUAC ${muac}mm: Pula (Kritikal/MAM)`;
        muacBadge.className = 'badge badge-stunted';
      } else if (muac < 125) {
        muacBadge.textContent = `MUAC ${muac}mm: Dilaw (At Risk)`;
        muacBadge.className = 'badge badge-underweight';
      } else {
        muacBadge.textContent = `MUAC ${muac}mm: Berde (Sapat)`;
        muacBadge.className = 'badge badge-normal';
      }
    }
  },

  // Attach live event listeners to input elements
  bindFormEvents() {
    ['add-child-height', 'add-child-weight', 'add-child-muac'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => this.calcLiveZScore());
      }
    });

    const ageInput = document.querySelector('#modal-add-child input[name="childAge"]');
    if (ageInput) {
      ageInput.addEventListener('input', () => this.calcLiveZScore());
    }
  },

  // Sync Mobile Bottom Navigation with Desktop Tabs
  syncWithAppNavigation() {
    // Intercept or hook into tab switches to keep bottom nav active states synchronized
    const originalSwitchCHW = window.NutriApp?.switchCHWSubTab;
    if (originalSwitchCHW) {
      window.NutriApp.switchCHWSubTab = (tabName) => {
        originalSwitchCHW.call(window.NutriApp, tabName);
        NutriMobile.updateActiveBottomTab('bhw', tabName);
      };
    }

    const originalSwitchMHO = window.NutriApp?.switchMHOSubTab;
    if (originalSwitchMHO) {
      window.NutriApp.switchMHOSubTab = (tabName) => {
        originalSwitchMHO.call(window.NutriApp, tabName);
        NutriMobile.updateActiveBottomTab('mho', tabName);
      };
    }

    const originalSwitchParent = window.ParentModule?.switchTab;
    if (originalSwitchParent) {
      window.ParentModule.switchTab = (tabId) => {
        originalSwitchParent.call(window.ParentModule, tabId);
        NutriMobile.updateActiveBottomTab('parent', tabId);
      };
    }
  },

  // Update active state in bottom nav
  updateActiveBottomTab(role, tabId) {
    const bottomNav = document.getElementById('mobile-bottom-nav');
    if (!bottomNav) return;

    const navGroup = document.getElementById(`mobile-nav-${role}`);
    if (!navGroup) return;

    navGroup.querySelectorAll('.mobile-nav-item').forEach(btn => {
      const match = btn.dataset.tab === tabId || (tabId === 'overview' && btn.dataset.tab === 'overview');
      btn.classList.toggle('active', match);
    });
  },

  init() {
    this.bindFormEvents();
    this.syncWithAppNavigation();

    // Check if user is already logged in and initialize mobile bottom nav
    const currentUser = window.NutriStorage ? NutriStorage.getCurrentUser() : null;
    if (currentUser && currentUser.role) {
      this.updateRoleBottomNav(currentUser.role);
    }
  },

  // Show corresponding role items in bottom navigation
  updateRoleBottomNav(role) {
    const bottomNav = document.getElementById('mobile-bottom-nav');
    if (!bottomNav) return;

    // Normalize collector to bhw
    const targetRole = (role === 'collector') ? 'bhw' : (role || 'parent');

    // Hide all role groups
    document.querySelectorAll('.mobile-nav-role-group').forEach(group => {
      group.style.setProperty('display', 'none', 'important');
    });

    const activeGroup = document.getElementById(`mobile-nav-${targetRole}`);
    if (activeGroup) {
      activeGroup.style.setProperty('display', 'flex', 'important');
      bottomNav.style.setProperty('display', 'flex', 'important');
    }
  // Auto-calculate age in months from Date of Birth (Thesis UC-01 & Persona 3 data integrity)
  onBirthDateChange(birthDateStr, context = 'add') {
    if (!birthDateStr) return;
    const birth = new Date(birthDateStr);
    const today = new Date();
    if (birth > today) {
      if (window.NutriApp) NutriApp.showToast('⚠️ Hindi maaaring sa hinaharap ang petsa ng kapanganakan.', 'warning');
      return;
    }
    let months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    if (today.getDate() < birth.getDate()) {
      months--;
    }
    months = Math.max(0, Math.min(72, months));

    if (context === 'add') {
      const ageInput = document.getElementById('add-child-age') || document.querySelector('#modal-add-child input[name="childAge"]');
      if (ageInput) {
        ageInput.value = months;
        this.calcLiveZScore();
      }
    } else if (context === 'edit') {
      const ageInput = document.getElementById('edit-child-age');
      if (ageInput) ageInput.value = months;
    } else if (context === 'admin') {
      const ageInput = document.getElementById('admin-edit-child-age');
      if (ageInput) ageInput.value = months;
    }
  }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  NutriMobile.init();
});
