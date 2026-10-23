// ==========================================================================
// NUTRILEARN - MAIN APPLICATION CONTROLLER
// State Management, Role Navigation, Modals, PWA & APK Downloads
// ==========================================================================

const NutriApp = {
  currentRole: 'parent',
  currentAuthRole: 'parent',
  currentAuthMode: 'signin',
  portalAction: 'signin',
  deferredInstallPrompt: null,

  init() {
    console.log('🌱 Initializing NutriLearn App...');
    NutriStorage.init();
    if (window.NutriI18n) {
      NutriI18n.init();
    }

    this.registerServiceWorker();
    this.bindGlobalEvents();
    this.updateUserHeaderBadge();
    this.initSubNavScroll();
    this.checkUrlParams();

    // Initialize modules
    ParentModule.init();
    CHWModule.init();
    MHODashboard.init();
    if (window.AnnouncementsModule) {
      AnnouncementsModule.init();
    }
    if (typeof InactivityManager !== 'undefined') {
      InactivityManager.init();
    }

    // Sync cloud database with local storage if configured
    if (typeof NutriStorage.syncWithSupabase === 'function') {
      NutriStorage.syncWithSupabase();
    }

    // Check if user is already authenticated to restore session or show gateway
    const currentUser = (typeof NutriStorage !== 'undefined' && typeof NutriStorage.getCurrentUser === 'function')
      ? NutriStorage.getCurrentUser()
      : null;

    if (currentUser && currentUser.role) {
      this.restoreUserSession(currentUser);
    } else {
      this.showStartupScreen();
    }
  },

  // Restore logged-in user session and specific phase/sub-tab upon page load or F5 refresh
  restoreUserSession(currentUser) {
    document.documentElement.classList.add('user-logged-in');
    const normRole = (currentUser.role === 'collector') ? 'chw' : currentUser.role;
    document.documentElement.classList.add('role-' + normRole);
    this.hideStartupScreen();

    // 1. Identify target sub-tab from URL hash or persisted storage
    let targetTab = null;
    if (window.location.hash) {
      const hash = window.location.hash.replace(/^#/, '').trim();
      if (hash) targetTab = hash;
    }
    if (!targetTab) {
      targetTab = sessionStorage.getItem('nutrilearn_active_tab') || localStorage.getItem('nutrilearn_active_tab');
    }

    // 2. Switch to active role and restore sub-tab
    const role = currentUser.role || 'parent';
    this.switchRole(role, targetTab);

    // 3. Update profile badges in header / taskbar
    this.updateUserHeaderBadge();

    // 4. Update mobile bottom navigation
    if (window.NutriMobile) {
      NutriMobile.updateRoleBottomNav(role);
      if (targetTab) {
        NutriMobile.updateActiveBottomTab(role === 'collector' ? 'bhw' : role, targetTab);
      }
    }

    // 5. Inactivity timer reset
    if (typeof InactivityManager !== 'undefined') {
      InactivityManager.resetTimer();
    }
  },

  // Show Startup Authentication Gateway
  showStartupScreen() {
    const startupScreen = document.getElementById('startup-auth-screen');
    const workspace = document.getElementById('app-workspace');
    if (startupScreen) {
      startupScreen.style.display = 'flex';
      document.body.style.overflow = 'auto';
    }
    if (workspace) {
      workspace.style.display = 'none';
    }
    document.documentElement.classList.remove('user-logged-in');

    // Restore unauthenticated gateway screen if user refreshed during login/register
    const savedAuthScreen = sessionStorage.getItem('nutrilearn_auth_screen');
    const savedAuthRole = sessionStorage.getItem('nutrilearn_auth_role');
    if (savedAuthRole) {
      this.currentAuthRole = savedAuthRole;
    }
    if (savedAuthScreen === 'screen-role-signup') {
      this.goToRoleSelectSignUp();
    } else if (savedAuthScreen === 'screen-auth-signin') {
      this.proceedToSignInCredentials(true);
    } else if (savedAuthScreen === 'screen-auth-details') {
      this.proceedToSignUpDetails();
    } else if (savedAuthScreen === 'screen-auth-forgot') {
      this.switchAuthScreen('screen-auth-forgot');
    } else {
      this.goToRoleSelectSignIn();
    }
  },

  // Hide Startup Authentication Gateway
  hideStartupScreen() {
    const startupScreen = document.getElementById('startup-auth-screen');
    const workspace = document.getElementById('app-workspace');
    if (startupScreen) {
      startupScreen.style.display = 'none';
      document.body.style.overflow = '';
    }
    if (workspace) {
      workspace.style.display = 'block';
    }
    document.documentElement.classList.add('user-logged-in');
  },

  // Quick toggle to pause/resume ambient video (no-op since video removed)
  toggleBgVideo() {
    return;
  },

  // Switch between screens in the Auth Gateway
  switchAuthScreen(screenId) {
    try {
      sessionStorage.setItem('nutrilearn_auth_screen', screenId);
    } catch (e) {}
    ['screen-role-signin', 'screen-role-signup', 'screen-auth-details', 'screen-auth-signin', 'screen-auth-forgot'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = (id === screenId) ? 'block' : 'none';
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // Toggle password visibility (Show/Hide Password)
  togglePasswordVisibility(inputId, btnEl) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';

    const eyeOpenSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    const eyeSlashSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

    if (btnEl) {
      btnEl.innerHTML = isPassword ? eyeSlashSvg : eyeOpenSvg;
      const isFil = !window.NutriI18n || NutriI18n.currentLang === 'fil';
      const label = isPassword ? (isFil ? 'Itago ang password' : 'Hide password') : (isFil ? 'Ipakita ang password' : 'Show password');
      btnEl.title = label;
      btnEl.setAttribute('aria-label', label);
    }
  },

  // Forgot Password flow state & methods
  forgotPasswordState: {
    matchedUser: null,
    generatedCode: null,
    currentStage: 1
  },

  goToForgotPassword(event) {
    if (event && event.preventDefault) event.preventDefault();
    this.switchAuthScreen('screen-auth-forgot');
    this.resetForgotFlowStage(1);

    // If user already typed an email on the sign-in form, pre-fill it!
    const signinEmail = document.getElementById('input-signin-email');
    const forgotEmail = document.getElementById('input-forgot-email');
    if (signinEmail && forgotEmail && signinEmail.value.trim()) {
      forgotEmail.value = signinEmail.value.trim();
    }
    if (forgotEmail) {
      setTimeout(() => forgotEmail.focus(), 100);
    }
  },

  resetForgotFlowStage(stage) {
    this.forgotPasswordState.currentStage = stage;
    const stage1 = document.getElementById('forgot-stage-1');
    const stage2 = document.getElementById('forgot-stage-2');
    const stage3 = document.getElementById('forgot-stage-3');

    if (stage1) stage1.style.display = stage === 1 ? 'block' : 'none';
    if (stage2) stage2.style.display = stage === 2 ? 'block' : 'none';
    if (stage3) stage3.style.display = stage === 3 ? 'block' : 'none';

    // Update step indicator pills
    for (let i = 1; i <= 3; i++) {
      const pill = document.getElementById(`forgot-step-pill-${i}`);
      if (pill) {
        pill.classList.remove('active', 'completed');
        if (i === stage) {
          pill.classList.add('active');
        } else if (i < stage) {
          pill.classList.add('completed');
        }
      }
    }
  },

  handleForgotStep1(event) {
    if (event) event.preventDefault();
    const isFil = !window.NutriI18n || NutriI18n.currentLang === 'fil';
    const emailInput = document.getElementById('input-forgot-email');
    const query = (emailInput?.value || '').trim().toLowerCase();

    if (!query) {
      this.showToast(isFil ? 'Pakilagay ang iyong email o username.' : 'Please enter your email or username.', 'warning');
      return;
    }

    const users = NutriStorage.getUsers();
    const user = users.find(u => 
      (u.email && u.email.toLowerCase() === query) ||
      (u.name && u.name.toLowerCase() === query)
    );

    if (!user) {
      this.showToast(
        isFil 
          ? '⛔ Hindi nahanap ang account gamit ang email o username na ito. Pakisuri ang spelling o magparehistro.'
          : '⛔ No account found with this email or username. Please check your spelling or register.',
        'warning'
      );
      return;
    }

    // Account found!
    this.forgotPasswordState.matchedUser = user;
    if (user.role) {
      this.currentAuthRole = user.role;
    }
    
    // Generate secure 6-digit verification code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.forgotPasswordState.generatedCode = otp;

    // Populate stage 2 information
    const nameEl = document.getElementById('forgot-found-name');
    const metaEl = document.getElementById('forgot-found-meta');
    const codeDisplay = document.getElementById('forgot-generated-code-display');
    const codeInput = document.getElementById('input-forgot-code');

    if (nameEl) nameEl.textContent = user.name || 'User';
    if (metaEl) {
      const roleMap = {
        parent: isFil ? 'Magulang / Tagapag-alaga' : 'Parent / Guardian',
        chw: isFil ? 'Health Worker (BHW)' : 'Health Worker (BHW)',
        mho: isFil ? 'Administrator (MHO)' : 'Administrator'
      };
      metaEl.textContent = `${user.barangay || 'Barangay Manguiring'} • ${roleMap[user.role] || user.role}`;
    }
    if (codeDisplay) codeDisplay.textContent = otp;
    if (codeInput) codeInput.value = '';

    this.resetForgotFlowStage(2);
    this.showToast(
      isFil
        ? `✅ Nahanap ang account ni ${user.name}! Nabuo ang iyong 6-digit verification code.`
        : `✅ Account found for ${user.name}! 6-digit verification code generated.`,
      'success'
    );

    if (codeInput) {
      setTimeout(() => codeInput.focus(), 150);
    }
  },

  autoFillResetCode() {
    const codeInput = document.getElementById('input-forgot-code');
    if (codeInput && this.forgotPasswordState.generatedCode) {
      codeInput.value = this.forgotPasswordState.generatedCode;
      const isFil = !window.NutriI18n || NutriI18n.currentLang === 'fil';
      this.showToast(isFil ? 'Nailagay na ang verification code.' : 'Verification code applied.', 'info');
      codeInput.focus();
    }
  },

  handleForgotStep2(event) {
    if (event) event.preventDefault();
    const isFil = !window.NutriI18n || NutriI18n.currentLang === 'fil';
    const codeInput = document.getElementById('input-forgot-code');
    const entered = (codeInput?.value || '').trim();

    if (!entered) {
      this.showToast(isFil ? 'Pakilagay ang 6-digit code.' : 'Please enter the 6-digit code.', 'warning');
      return;
    }

    if (entered !== this.forgotPasswordState.generatedCode) {
      this.showToast(
        isFil 
          ? '🔑 Maling verification code. Pakisubukang muli o i-click ang Gamitin ang Code.'
          : '🔑 Incorrect verification code. Please check and try again.',
        'warning'
      );
      return;
    }

    // Code verified! Proceed to Step 3
    this.resetForgotFlowStage(3);
    const newPassInput = document.getElementById('input-forgot-new-pass');
    const confirmPassInput = document.getElementById('input-forgot-confirm-pass');
    if (newPassInput) newPassInput.value = '';
    if (confirmPassInput) confirmPassInput.value = '';
    if (newPassInput) {
      setTimeout(() => newPassInput.focus(), 150);
    }

    this.showToast(
      isFil 
        ? '✅ Na-verify ang code! Ilagay ngayon ang iyong bagong password.' 
        : '✅ Code verified! Please enter your new password.', 
      'success'
    );
  },

  handleForgotStep3(event) {
    if (event) event.preventDefault();
    const isFil = !window.NutriI18n || NutriI18n.currentLang === 'fil';
    const newPassInput = document.getElementById('input-forgot-new-pass');
    const confirmPassInput = document.getElementById('input-forgot-confirm-pass');

    const newPass = (newPassInput?.value || '').trim();
    const confirmPass = (confirmPassInput?.value || '').trim();

    if (!newPass || newPass.length < 6) {
      this.showToast(
        isFil ? 'Ang password ay dapat may hindi bababa sa 6 na karakter.' : 'Password must be at least 6 characters.',
        'warning'
      );
      return;
    }

    if (newPass !== confirmPass) {
      this.showToast(
        isFil ? 'Hindi magkatugma ang dalawang password.' : 'Passwords do not match.',
        'warning'
      );
      return;
    }

    const user = this.forgotPasswordState.matchedUser;
    if (!user) {
      this.showToast(
        isFil ? 'May error sa sesyon. Pakisubukang muli.' : 'Session error. Please start again.',
        'warning'
      );
      this.resetForgotFlowStage(1);
      return;
    }

    // Update user's password in NutriStorage
    user.password = newPass;
    NutriStorage.updateUser(user);

    // Also update current user in storage if matching
    const cur = NutriStorage.getCurrentUser();
    if (cur && (cur.id === user.id || cur.email === user.email)) {
      cur.password = newPass;
      NutriStorage.setCurrentUser(cur);
    }

    // Log security audit trail
    NutriStorage.logAudit(
      'Password Reset Completed',
      'Security & Access',
      `User ${user.name} (${user.email}) successfully reset account password via verification flow.`,
      user.name
    );

    // If live API sync is available
    if (window.NutriApi && typeof NutriApi.saveUser === 'function') {
      NutriApi.saveUser(user);
    }

    // Switch back to sign in screen and pre-fill credentials
    this.proceedToSignInCredentials(true);
    const signinEmail = document.getElementById('input-signin-email');
    const signinPass = document.getElementById('input-signin-password');
    if (signinEmail) signinEmail.value = user.email || user.name;
    if (signinPass) signinPass.value = newPass;

    this.showToast(
      isFil
        ? `🎉 Matagumpay na nabago ang password ni ${user.name}! Maaari ka nang mag-sign in gamit ang bagong password.`
        : `🎉 Password successfully updated for ${user.name}! You can now sign in with your new password.`,
      'success'
    );
  },

  // Screen 1: Select role to continue (Sign In Flow)
  goToRoleSelectSignIn() {
    this.portalAction = 'signin';
    this.switchAuthScreen('screen-role-signin');
    this.updateRoleCardSelection('signin', this.currentAuthRole || 'parent');
  },

  // Screen 2: Create account - Who are you registering as? (Sign Up Flow)
  goToRoleSelectSignUp() {
    this.portalAction = 'signup';
    this.switchAuthScreen('screen-role-signup');
    this.updateRoleCardSelection('signup', this.currentAuthRole || 'parent');
  },

  // User clicks a role card on Screen 1 or Screen 2
  selectRole(role, context) {
    this.currentAuthRole = role;
    try {
      sessionStorage.setItem('nutrilearn_auth_role', role);
    } catch (e) {}
    this.updateRoleCardSelection(context || 'signin', role);
  },

  updateRoleCardSelection(context, role) {
    const screenId = context === 'signup' ? 'screen-role-signup' : 'screen-role-signin';
    const container = document.getElementById(screenId);
    if (!container) return;

    const cards = container.querySelectorAll('.portal-choice-card');
    cards.forEach(card => {
      const cardRole = card.getAttribute('data-role');
      card.classList.toggle('selected', cardRole === role);
    });
  },

  // Screen 1 Continue clicked -> Proceed to Screen 4 (Sign In Credentials)
  proceedToSignInCredentials(preserveCredentials = false) {
    if (preserveCredentials && typeof preserveCredentials === 'object' && preserveCredentials.preventDefault) {
      preserveCredentials.preventDefault();
      preserveCredentials = false;
    }
    const role = this.currentAuthRole || 'parent';
    this.switchAuthScreen('screen-auth-signin');

    const roleNames = {
      parent: { en: 'Parent / Guardian', fil: 'Magulang / Tagapag-alaga', icon: '👩‍👧' },
      chw: { en: 'Health Worker', fil: 'Manggagawa sa Kalusugan (BHW)', icon: '🩺' },
      mho: { en: 'Administrator', fil: 'Administrator (MHO)', icon: '📊' }
    };
    const info = roleNames[role] || roleNames.parent;
    const isFil = !window.NutriI18n || NutriI18n.currentLang === 'fil';

    const badgeIcon = document.getElementById('signin-badge-icon');
    const badgeTitle = document.getElementById('signin-badge-title');
    const badgeSub = document.getElementById('signin-badge-sub');
    const emailInput = document.getElementById('input-signin-email');
    const passInput = document.getElementById('input-signin-password');

    if (badgeIcon) badgeIcon.textContent = info.icon;
    if (badgeTitle) badgeTitle.textContent = isFil ? info.fil : info.en;
    if (badgeSub) badgeSub.textContent = isFil ? 'Pumapasok bilang' : 'Signing in as';

    if (!preserveCredentials) {
      if (emailInput) emailInput.value = '';
      if (passInput) passInput.value = '';
    }
  },

  // Screen 2 Continue clicked -> Proceed to Screen 3 (Your Details Registration Form)
  proceedToSignUpDetails() {
    const role = this.currentAuthRole || 'parent';
    this.switchAuthScreen('screen-auth-details');

    if (window.NutriStorage && typeof NutriStorage.populateAllBarangayDropdowns === 'function') {
      NutriStorage.populateAllBarangayDropdowns();
    }

    const isFil = !window.NutriI18n || NutriI18n.currentLang === 'fil';
    const childSection = document.getElementById('reg-child-section');
    if (childSection) {
      childSection.style.display = (role === 'parent') ? 'block' : 'none';
    }

    const btnSubmit = document.getElementById('btn-details-submit');
    if (btnSubmit) {
      if (role === 'parent') {
        btnSubmit.textContent = isFil ? 'Kumpletuhin ang Pagrehistro ng Magulang at Bata →' : 'Complete Parent & Child Registration →';
      } else {
        btnSubmit.textContent = isFil ? 'Kumpletuhin ang Pagrehistro →' : 'Create Account →';
      }
    }
  },

  // Submit Sign In (Screen 4 & Modal)
  submitSignIn(event) {
    if (event) event.preventDefault();
    const screenForm = document.getElementById('form-auth-signin');
    const modalForm = document.getElementById('auth-signin-form');

    let email = '';
    let password = '';

    if (screenForm && screenForm.elements['signinEmail']) {
      email = (screenForm.elements['signinEmail'].value || '').trim();
      password = screenForm.elements['signinPassword'] ? screenForm.elements['signinPassword'].value : '';
    } else if (modalForm && modalForm.elements['loginUsername']) {
      email = (modalForm.elements['loginUsername'].value || '').trim();
      password = modalForm.elements['loginPassword'] ? modalForm.elements['loginPassword'].value : '';
    }

    if (!email || !password) {
      const isFil = !window.NutriI18n || NutriI18n.currentLang === 'fil';
      this.showToast(isFil ? 'Pakilagay ang email at password.' : 'Please enter your email and password.', 'warning');
      return;
    }

    const result = NutriStorage.loginUser(email, password, this.currentAuthRole || 'parent');
    if (result.success) {
      this.hideStartupScreen();
      this.closeModal('modal-auth');
      this.switchRole(result.user.role);
      this.updateUserHeaderBadge();
      if (window.ParentModule && typeof ParentModule.renderChildGrowth === 'function') {
        ParentModule.renderChildGrowth();
      }
      if (typeof InactivityManager !== 'undefined') {
        InactivityManager.resetTimer();
      }
      const isFil = !window.NutriI18n || NutriI18n.currentLang === 'fil';
      const welcome = isFil
        ? `👋 Maligayang pagdating, ${result.user.name}! Naka-log in na.`
        : `👋 Welcome, ${result.user.name}! Portal unlocked.`;
      this.showToast(welcome, 'success');
    } else {
      this.showToast(result.message, 'warning');
    }
  },

  // 1-Click Login for Prototype Verification (Chapter 2.2 Default Test Authentication Accounts)
  quickLoginTestAccount(role) {
    const defaultAccounts = {
      parent: { email: 'maria.santos@nutrilearn.ph', pass: 'Password123!' },
      chw: { email: 'ana.reyes@nutrilearn.ph', pass: 'Password123!' },
      mho: { email: 'mho@nutrilearn.ph', pass: 'Password123!' }
    };
    const acc = defaultAccounts[role] || defaultAccounts.parent;
    this.currentAuthRole = role;
    this.proceedToSignInCredentials(true);
    const emailInput = document.getElementById('input-signin-email');
    const passInput = document.getElementById('input-signin-password');
    if (emailInput) emailInput.value = acc.email;
    if (passInput) passInput.value = acc.pass;
    this.submitSignIn();
  },

  // Submit Registration (Screen 3)
  submitRegistration(event) {
    if (event) event.preventDefault();
    const form = document.getElementById('form-auth-details');
    if (!form) return;

    try {
      const isFil = !window.NutriI18n || NutriI18n.currentLang === 'fil';
      const name = (form.elements['regFullName']?.value || '').trim();
      const barangay = (form.elements['regBarangayAddress']?.value || '').trim() || 'Barangay Manguiring';
      const email = (form.elements['regEmailAddress']?.value || '').trim();
      const password = form.elements['regPassword']?.value || '';
      const confirmPassword = form.elements['regConfirmPassword']?.value || '';

      if (!name || !email || !password) {
        this.showToast(isFil ? 'Pakilagay ang kumpletong impormasyon (Pangalan, Email/Username, at Password).' : 'Please fill in all required fields.', 'warning');
        return;
      }

      if (password.length < 6) {
        this.showToast(isFil ? 'Ang password ay dapat may hindi bababa sa 6 na karakter.' : 'Password must be at least 6 characters.', 'warning');
        return;
      }

      if (password !== confirmPassword) {
        this.showToast(isFil ? 'Hindi magkatugma ang mga password.' : 'Passwords do not match.', 'warning');
        return;
      }

      // Verify that the email or username is not already registered
      const existingUsers = NutriStorage.getUsers();
      if (existingUsers.some(u => (u.email && u.email.toLowerCase() === email.toLowerCase()) || (u.name && u.name.toLowerCase() === name.toLowerCase()))) {
        this.showToast(
          isFil 
            ? 'Mayroon nang account gamit ang email o pangalang ito. Pakigamit ang Sign In.' 
            : 'An account with this email/username is already registered. Please proceed to Sign In.', 
          'warning'
        );
        return;
      }

      const role = this.currentAuthRole || 'parent';
      const isParent = role === 'parent';
      const userId = 'usr-' + Date.now();
      let childId = null;

      let childName = '';
      let childAge = 18;
      let childGender = 'Male';
      let childHeight = 75.0;
      let childWeight = 9.5;
      let statusInfo = { overallStatus: 'Normal', hfaStatus: 'Normal', wfaStatus: 'Normal', wfhStatus: 'Normal', muacStatus: 'Normal' };

      if (isParent) {
        childName = (form.elements['regChildName']?.value || '').trim();
        const rawAge = parseInt(form.elements['regChildAge']?.value, 10);
        childAge = !isNaN(rawAge) ? rawAge : 18;
        childGender = form.elements['regChildGender']?.value || 'Male';
        const rawHeight = parseFloat(form.elements['regChildHeight']?.value);
        childHeight = !isNaN(rawHeight) ? rawHeight : 75.0;
        const rawWeight = parseFloat(form.elements['regChildWeight']?.value);
        childWeight = !isNaN(rawWeight) ? rawWeight : 9.5;

        // If child name is provided, enroll child record in BHW and Admin registries
        if (childName) {
          childId = 'ch-' + Date.now();

          // Calculate WHO Anthropometric Classification
          if (window.CHWModule && typeof CHWModule.calculateNutritionalStatus === 'function') {
            statusInfo = CHWModule.calculateNutritionalStatus(childAge, childGender, childHeight, childWeight, 125);
          } else {
            if (childHeight < 74.0 && childAge >= 12) statusInfo.overallStatus = 'Stunted';
            else if (childWeight < 8.2 && childAge >= 12) statusInfo.overallStatus = 'Underweight';
            else statusInfo.overallStatus = 'Normal';
          }

          // Register Child Record in NutriStorage (Automatically live-synced to BHW & Admin)
          const childData = {
            id: childId,
            parentId: userId,
            name: childName,
            ageMonths: childAge,
            sex: childGender,
            parentName: name,
            parentPhone: email,
            parentEmail: email,
            barangay: barangay,
            heightCm: childHeight,
            weightKg: childWeight,
            muacMm: 125,
            status: statusInfo.overallStatus,
            hfaStatus: statusInfo.hfaStatus || 'Normal',
            wfhStatus: statusInfo.wfhStatus || 'Normal',
            wfaStatus: statusInfo.wfaStatus || 'Normal',
            muacStatus: statusInfo.muacStatus || 'Normal',
            improved: false,
            lastAssessed: new Date().toISOString().split('T')[0],
            assignedModules: ['mod-1', 'mod-2', 'mod-3', 'mod-4'],
            completedModules: [],
            quizScore: 0,
            notes: `Bagong rehistro kan magulang na si ${name}. Initial record: ${childHeight}cm, ${childWeight}kg.`
          };
          NutriStorage.addChild(childData);
          try {
            localStorage.setItem('nutrilearn_selected_child_id', childId);
          } catch (e) {}

          // Enroll in Dietary Adherence records so Administrator can monitor meal compliance
          try {
            const adherenceKey = 'nutrilearn_diet_adherence_records_v3';
            const existingAdherence = JSON.parse(localStorage.getItem(adherenceKey) || '[]');
            existingAdherence.unshift({
              id: 'meal-rec-' + Date.now(),
              childName: childName,
              childAgeMonths: childAge,
              parentName: name,
              barangay: barangay,
              assignedFoods: ['Malunggay', 'Monggo', 'Itlog', 'Karot'],
              complianceScore: 100,
              status: 'Good Adherence',
              mealsLoggedThisWeek: 1,
              lastMealLogged: 'Bagong Rehistro (Enrolled)',
              notes: 'Kagigibo pa sanang account kan magulang.'
            });
            localStorage.setItem(adherenceKey, JSON.stringify(existingAdherence));
          } catch (err) {
            console.warn('Dietary adherence sync warning:', err);
          }
        }
      }

      const userData = {
        id: userId,
        name,
        email,
        password,
        barangay,
        role: role,
        status: 'Active',
        registeredDate: new Date().toISOString().split('T')[0]
      };

      if (isParent) {
        if (childId) {
          userData.childId = childId;
          userData.childName = childName;
          userData.childAge = childAge;
          userData.childGender = childGender;
          userData.childHeight = childHeight;
          userData.childWeight = childWeight;
          userData.nutritionalStatus = statusInfo.overallStatus;
        }
      } else if (role === 'chw') {
        userData.bhwId = 'BHW-' + Math.floor(1000 + Math.random() * 9000);
      } else if (role === 'mho') {
        userData.department = 'Municipal Health Office';
        userData.designation = 'Nutrition Officer';
      }

      const newUser = NutriStorage.registerUser(userData);

      // Audit Log History with exact Date & Time
      const auditRoleName = (role || 'parent').toUpperCase();
      const auditDetails = (isParent && childId)
        ? `Parent account registered: ${name} (${email}, ${barangay}) kaiba an aki na si ${childName} (${childAge} mos, ${childGender}, ${childHeight}cm, ${childWeight}kg, Status: ${statusInfo.overallStatus}). Naka-sync sa BHW at Admin records.`
        : `Account registered: ${name} (${email}, Papel: ${auditRoleName}, Lugar: ${barangay}).`;

      try {
        NutriStorage.logAudit(
          (isParent && childId) ? 'Parent & Child Account Registered' : 'New User Account Registered',
          'Account Management',
          auditDetails,
          { name, role: role }
        );
      } catch (e) {
        console.warn('Audit logging warning:', e);
      }

      // Live update BHW and Admin views if active
      try {
        if (window.CHWModule) {
          if (typeof CHWModule.renderRegistryTable === 'function') CHWModule.renderRegistryTable();
          if (typeof CHWModule.updateStatsBar === 'function') CHWModule.updateStatsBar();
        }
        if (window.MHODashboard) {
          if (typeof MHODashboard.renderAdminRecords === 'function') MHODashboard.renderAdminRecords();
          if (typeof MHODashboard.renderUsersTable === 'function') MHODashboard.renderUsersTable();
          if (typeof MHODashboard.renderAuditLogsTable === 'function') MHODashboard.renderAuditLogsTable();
          if (typeof MHODashboard.renderKPIs === 'function') MHODashboard.renderKPIs();
        }
        if (window.ParentModule && typeof ParentModule.renderChildGrowth === 'function') {
          ParentModule.renderChildGrowth();
        }
      } catch (e) {
        console.warn('View update warning:', e);
      }

      this.hideStartupScreen();
      this.switchRole(newUser.role);
      this.updateUserHeaderBadge();

      const msg = isFil
        ? (childId 
            ? `🎉 Matagumpay na nakarehistro si ${newUser.name}! Naka-sync na ang mga detalye ng bata sa talaan ng BHW at Admin.`
            : `🎉 Matagumpay na nakarehistro si ${newUser.name}! Naka-log in na sa portal.`)
        : `🎉 Welcome ${newUser.name}! Your account has been registered successfully.`;
      this.showToast(msg, 'success');
    } catch (err) {
      console.error('Registration error:', err);
      this.showToast('May naganap na error sa pagrehistro. Pakisubukang muli.', 'warning');
    }
  },

  // Backward compatibility aliases
  setStartupPhase(phase) {
    if (phase === 1 || phase === 'role-select') {
      this.goToRoleSelectSignIn();
    } else if (phase === 2 || phase === 'signin') {
      this.proceedToSignInCredentials();
    } else if (phase === 3 || phase === 'signup') {
      this.proceedToSignUpDetails();
    }
  },
  proceedWithSelectedRole() {
    this.proceedToSignInCredentials();
  },
  proceedToRegister() {
    this.goToRoleSelectSignUp();
  },
  selectStartupRoleCard(role) {
    this.selectRole(role, 'signin');
  },
  setPortalAction(action) {
    if (action === 'signup') this.goToRoleSelectSignUp();
    else this.goToRoleSelectSignIn();
  },
  selectSignupRole(role) {
    this.selectRole(role, 'signup');
  },
  updateSignupRolePills() {},
  submitStartupSignIn(e) {
    this.submitSignIn(e);
  },
  submitStartupSignUp(e) {
    this.submitRegistration(e);
  },

  // Hide Startup Authentication Gateway (Shows app workspace after successful login)
  hideStartupScreen() {
    const startupScreen = document.getElementById('startup-auth-screen');
    const workspace = document.getElementById('app-workspace');
    if (startupScreen) {
      startupScreen.style.display = 'none';
      document.body.style.overflow = '';
    }
    if (workspace) {
      workspace.style.display = 'block';
    }
    document.documentElement.classList.add('user-logged-in');
  },

  // Update Startup Form Banner and Fields based on chosen portal
  updateStartupFormDisplay(mode = 'signin') {
    const isFil = !window.NutriI18n || NutriI18n.currentLang === 'fil';
    
    const titles = isFil ? {
      parent: 'Magulang / Tagapag-alaga',
      chw: 'Manggagawa sa Kalusugan (BHW/BNS)',
      collector: 'Tagakolekta ng Datos sa Larangan',
      mho: 'Administrator (MHO)'
    } : {
      parent: 'Parent / Guardian',
      chw: 'Health Worker (BHW/BNS)',
      collector: 'Field Data Collector',
      mho: 'Administrator'
    };

    const signinTitle = document.getElementById('startup-signin-role-title');
    const signupTitle = document.getElementById('startup-signup-role-title');
    const emailInput = document.getElementById('startup-login-username');
    const submitBtn = document.getElementById('btn-startup-submit-signin');

    if (signinTitle) signinTitle.textContent = titles[this.currentAuthRole] || (isFil ? 'Portal ng Gumagamit' : 'User Portal');
    if (signupTitle) signupTitle.textContent = titles[this.currentAuthRole] || (isFil ? 'Portal ng Gumagamit' : 'User Portal');
    if (emailInput) emailInput.value = '';
    if (submitBtn) submitBtn.textContent = isFil ? 'Mag-sign In' : 'Sign In';

    // Show/hide role specific registration fields in sign-up phase
    const parentFields = document.getElementById('startup-signup-parent');
    const bhwFields = document.getElementById('startup-signup-bhw');
    const collectorFields = document.getElementById('startup-signup-collector');
    const mhoFields = document.getElementById('startup-signup-mho');

    if (parentFields) parentFields.style.display = this.currentAuthRole === 'parent' ? 'block' : 'none';
    if (bhwFields) bhwFields.style.display = this.currentAuthRole === 'chw' ? 'block' : 'none';
    if (collectorFields) collectorFields.style.display = this.currentAuthRole === 'collector' ? 'block' : 'none';
    if (mhoFields) mhoFields.style.display = this.currentAuthRole === 'mho' ? 'block' : 'none';

    // Synchronize role chooser pills in registration form
    this.updateSignupRolePills(this.currentAuthRole);
  },

  // Submit Startup Sign In (delegates to canonical submitSignIn)
  submitStartupSignIn(event) {
    this.submitSignIn(event);
  },

  // Submit Startup Sign Up (delegates to canonical submitRegistration)
  submitStartupSignUp(event) {
    this.submitRegistration(event);
  },


  logout() {
    NutriStorage.setCurrentUser(null);
    try {
      sessionStorage.removeItem('nutrilearn_active_tab');
      sessionStorage.removeItem('nutrilearn_active_role');
      sessionStorage.removeItem('nutrilearn_active_module');
      localStorage.removeItem('nutrilearn_active_tab');
      localStorage.removeItem('nutrilearn_active_role');
      localStorage.removeItem('nutrilearn_active_module');
      sessionStorage.removeItem('nutrilearn_auth_screen');
      sessionStorage.removeItem('nutrilearn_auth_role');
      document.documentElement.classList.remove('user-logged-in', 'role-parent', 'role-chw', 'role-mho');
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } catch (e) {}

    document.body.classList.remove('role-mho', 'role-parent', 'role-chw');
    const adminTopTaskbar = document.getElementById('admin-top-taskbar');
    const parentTopTaskbar = document.getElementById('parent-top-taskbar');
    const bhwTopTaskbar = document.getElementById('bhw-top-taskbar');
    const standardHeader = document.getElementById('standard-header-container');
    if (adminTopTaskbar) adminTopTaskbar.style.display = 'none';
    if (parentTopTaskbar) parentTopTaskbar.style.display = 'none';
    if (bhwTopTaskbar) bhwTopTaskbar.style.display = 'none';
    if (standardHeader) standardHeader.style.display = 'flex';
    this.updateUserHeaderBadge();

    // Hide all view sections & mobile bottom navigation
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.sub-nav').forEach(nav => nav.style.display = 'none');
    const mobileBottomNav = document.getElementById('mobile-bottom-nav');
    if (mobileBottomNav) mobileBottomNav.style.display = 'none';

    this.showStartupScreen();
    this.showToast('You have signed out. Please choose your portal and sign in to continue.', 'info');
  },

  // Service Worker Registration for PWA & Offline Access
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      // In local development, unregister any stale service workers and clear cache
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        navigator.serviceWorker.getRegistrations().then((regs) => {
          for (let reg of regs) {
            reg.unregister();
            console.log('🔄 [Dev Mode] Unregistered Service Worker to ensure fresh view');
          }
        });
        if ('caches' in window) {
          caches.keys().then((names) => {
            for (let name of names) caches.delete(name);
          });
        }
        return;
      }

      if (window.location.protocol.startsWith('http')) {
        navigator.serviceWorker.register('./sw.js?v=2.7')
          .then((reg) => {
            reg.update();
            console.log('✓ Service Worker Registered successfully:', reg.scope);
          })
          .catch((err) => console.warn('Service Worker registration note:', err.message));
      }
    }
  },

  // Check URL parameters for direct role access (?role=chw or ?role=mho)
  checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    if (roleParam && ['parent', 'chw', 'mho'].includes(roleParam)) {
      this.currentRole = roleParam;
    }
  },

  // Bind Global Navigation & Modal Events
  bindGlobalEvents() {
    // Sub-nav links for parent view
    document.querySelectorAll('.parent-sub-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.dataset.tab;
        this.switchParentSubTab(tab);
      });
    });

    // Sub-nav links for CHW view
    document.querySelectorAll('.chw-sub-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.dataset.tab;
        this.switchCHWSubTab(tab);
      });
    });

    // Sub-nav links for MHO view
    document.querySelectorAll('.mho-sub-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.dataset.tab;
        this.switchMHOSubTab(tab);
      });
    });

    // Modal backdrop click to close
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });

    // Escape key closes open modal & restores scroll
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-backdrop.open, .modal-backdrop.active');
        if (activeModal) {
          this.closeModal(activeModal.id);
        }
      }
    });

    // PWA Install prompt capture
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      const installBtn = document.getElementById('btn-pwa-install');
      if (installBtn) installBtn.style.display = 'inline-flex';
    });
  },

  // Switch Stakeholder Role & Isolate Features
  switchRole(role, targetSubTab = null) {
    this.currentRole = role;

    // Persist active role
    try {
      sessionStorage.setItem('nutrilearn_active_role', role);
      localStorage.setItem('nutrilearn_active_role', role);
      document.documentElement.classList.remove('role-parent', 'role-chw', 'role-mho');
      document.documentElement.classList.add('role-' + (role === 'collector' ? 'chw' : role));
    } catch (e) {}

    // Toggle Main View Sections: Show ONLY the active portal
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    // Data Collector shares CHW tools with field data collector permissions
    const viewTargetId = role === 'collector' ? 'view-chw' : `view-${role}`;
    const activeSection = document.getElementById(viewTargetId);
    if (activeSection) {
      activeSection.classList.add('active');
    }

    // Toggle Sub-Navigation Bars: Show ONLY the active portal sub-nav
    const parentSubNav = document.getElementById('parent-sub-nav');
    const chwSubNav = document.getElementById('chw-sub-nav');
    const mhoSubNav = document.getElementById('mho-sub-nav');

    // Toggle Clean Admin Top Taskbar vs Clean Parent Top Taskbar vs Clean BHW Top Taskbar vs Standard Header
    const adminTopTaskbar = document.getElementById('admin-top-taskbar');
    const parentTopTaskbar = document.getElementById('parent-top-taskbar');
    const bhwTopTaskbar = document.getElementById('bhw-top-taskbar');
    const standardHeader = document.getElementById('standard-header-container');

    document.body.classList.remove('role-mho', 'role-parent', 'role-chw');

    if (role === 'mho') {
      document.body.classList.add('role-mho');
      if (adminTopTaskbar) adminTopTaskbar.style.display = 'flex';
      if (parentTopTaskbar) parentTopTaskbar.style.display = 'none';
      if (bhwTopTaskbar) bhwTopTaskbar.style.display = 'none';
      if (standardHeader) standardHeader.style.display = 'none';
      if (mhoSubNav) mhoSubNav.style.display = 'none'; // Clean taskbar handles tabs
    } else if (role === 'parent') {
      document.body.classList.add('role-parent');
      if (parentTopTaskbar) parentTopTaskbar.style.display = 'flex';
      if (adminTopTaskbar) adminTopTaskbar.style.display = 'none';
      if (bhwTopTaskbar) bhwTopTaskbar.style.display = 'none';
      if (standardHeader) standardHeader.style.display = 'none';
      if (parentSubNav) parentSubNav.style.display = 'none'; // Clean pill tabs in parentTopTaskbar
    } else if (role === 'chw' || role === 'collector') {
      document.body.classList.add('role-chw');
      if (bhwTopTaskbar) bhwTopTaskbar.style.display = 'flex';
      if (adminTopTaskbar) adminTopTaskbar.style.display = 'none';
      if (parentTopTaskbar) parentTopTaskbar.style.display = 'none';
      if (standardHeader) standardHeader.style.display = 'none';
      if (chwSubNav) chwSubNav.style.display = 'none'; // Clean pill tabs in bhwTopTaskbar
    } else {
      if (parentTopTaskbar) parentTopTaskbar.style.display = 'none';
      if (adminTopTaskbar) adminTopTaskbar.style.display = 'none';
      if (bhwTopTaskbar) bhwTopTaskbar.style.display = 'none';
      if (standardHeader) standardHeader.style.display = 'flex';
    }

    this.updateUserHeaderBadge();

    // Update Mobile Bottom Nav for active role
    if (window.NutriMobile) {
      NutriMobile.updateRoleBottomNav(role);
    }

    if (parentSubNav) parentSubNav.style.display = 'none';
    if (chwSubNav) chwSubNav.style.display = 'none';
    if (mhoSubNav) mhoSubNav.style.display = 'none';

    // Update Header Active Portal Pill
    const pillIcon = document.getElementById('active-portal-icon');
    const pillTitle = document.getElementById('active-portal-title');
    const pillTag = document.getElementById('active-portal-tag');

    const portalMeta = {
      parent: { icon: '👨‍👩‍👧', title: 'Parent Portal', tag: 'Family Care' },
      chw: { icon: '🩺', title: 'BHW Tools', tag: 'Field Operations' },
      collector: { icon: '📋', title: 'Data Collector Tools', tag: 'Field Survey & Registry' },
      mho: { icon: '🏛️', title: 'MHO Executive Console', tag: 'Administration' }
    };

    if (pillIcon) pillIcon.textContent = portalMeta[role]?.icon || '🌱';
    if (pillTitle) pillTitle.textContent = portalMeta[role]?.title || 'NutriLearn';
    if (pillTag) pillTag.textContent = portalMeta[role]?.tag || 'Community Health';

    // Initialize or Refresh views with proper sub-tab restoration
    if (role === 'chw' || role === 'collector') {
      CHWModule.renderRegistryTable();
      CHWModule.updateStatsBar();
      CHWModule.renderBHWDashboard();
      const validCHWTabs = ['dashboard', 'groups', 'evaluations', 'announcements', 'registry'];
      const defaultCHWTab = role === 'collector' ? 'registry' : 'dashboard';
      let chwTab = targetSubTab;
      if (!chwTab || !validCHWTabs.includes(chwTab)) {
        chwTab = sessionStorage.getItem('nutrilearn_active_tab') || defaultCHWTab;
      }
      this.switchCHWSubTab(validCHWTabs.includes(chwTab) ? chwTab : defaultCHWTab);
    } else if (role === 'mho') {
      MHODashboard.init();
      const validMHOTabs = ['overview', 'records', 'barangays', 'content', 'users', 'audit', 'announcements'];
      let mhoTab = (targetSubTab === 'dashboard') ? 'overview' : targetSubTab;
      if (!mhoTab || !validMHOTabs.includes(mhoTab)) {
        mhoTab = sessionStorage.getItem('nutrilearn_active_tab') || 'overview';
      }
      this.switchMHOSubTab(validMHOTabs.includes(mhoTab) ? mhoTab : 'overview');
    } else if (role === 'parent') {
      ParentModule.renderModuleCards();
      ParentModule.renderHomeActionsChecklist();
      ParentModule.updateProgressHeader();
      ParentModule.renderChildGrowth();
      const validParentTabs = ['learning', 'meal-planner', 'try-at-home', 'growth-tracker'];
      let parentTab = targetSubTab;
      if (parentTab === 'dashboard') parentTab = 'learning';
      if (!parentTab || !validParentTabs.includes(parentTab)) {
        parentTab = sessionStorage.getItem('nutrilearn_active_tab') || 'learning';
      }
      ParentModule.switchTab(validParentTabs.includes(parentTab) ? parentTab : 'learning');

      const savedModule = sessionStorage.getItem('nutrilearn_active_module') || localStorage.getItem('nutrilearn_active_module');
      if (parentTab === 'learning' && savedModule && typeof ParentModule.openModuleDrawer === 'function') {
        ParentModule.openModuleDrawer(savedModule);
      }
    }

    if (window.AnnouncementsModule) {
      AnnouncementsModule.renderAllFeeds();
      AnnouncementsModule.renderDashboardWidgets();
    }

    // Synchronize role bottom navigation bar on mobile
    if (window.NutriMobile) {
      NutriMobile.updateRoleBottomNav(role);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // Scroll Sub-Nav Bar with Arrow buttons
  scrollSubNav(btn, delta) {
    if (!btn) return;
    const wrapper = btn.closest('.sub-nav-wrapper');
    if (!wrapper) return;
    const container = wrapper.querySelector('.sub-nav-container');
    if (container) {
      container.scrollBy({ left: delta, behavior: 'smooth' });
    }
  },

  // Initialize mouse wheel and drag-to-scroll for horizontal sub-navs on Windows desktop
  initSubNavScroll() {
    const containers = document.querySelectorAll('.sub-nav-container');
    containers.forEach(container => {
      // 1. Mouse wheel horizontal scrolling (translates deltaY to scrollLeft)
      container.addEventListener('wheel', (e) => {
        if (container.scrollWidth > container.clientWidth) {
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            container.scrollLeft += (e.deltaY * 1.3);
          }
        }
      }, { passive: false });

      // 2. Mouse drag-to-scroll on Windows PC / Desktop
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;
      let hasDragged = false;

      container.addEventListener('mousedown', (e) => {
        isDown = true;
        hasDragged = false;
        container.classList.add('is-dragging');
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
      });

      window.addEventListener('mouseup', () => {
        if (isDown) {
          isDown = false;
          container.classList.remove('is-dragging');
        }
      });

      container.addEventListener('mouseleave', () => {
        if (isDown) {
          isDown = false;
          container.classList.remove('is-dragging');
        }
      });

      container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX);
        if (Math.abs(walk) > 5) {
          hasDragged = true;
        }
        container.scrollLeft = scrollLeft - walk;
      });

      // Prevent accidental tab click when dragging
      container.addEventListener('click', (e) => {
        if (hasDragged) {
          e.preventDefault();
          e.stopPropagation();
          hasDragged = false;
        }
      }, true);
    });
  },

  // Switch Sub-tabs in Parent View
  switchParentSubTab(tabName) {
    document.querySelectorAll('.parent-sub-link').forEach(link => {
      const isActive = link.dataset.tab === tabName;
      link.classList.toggle('active', isActive);
      if (isActive && typeof link.scrollIntoView === 'function') {
        link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    document.querySelectorAll('.parent-tab-pane').forEach(pane => {
      pane.style.display = pane.dataset.tab === tabName ? 'block' : 'none';
    });
  },

  // Switch Sub-tabs in CHW / Data Collector View
  switchCHWSubTab(tabName) {
    if (!tabName) tabName = 'dashboard';
    try {
      sessionStorage.setItem('nutrilearn_active_tab', tabName);
      localStorage.setItem('nutrilearn_active_tab', tabName);
      history.replaceState(null, '', '#' + tabName);
    } catch (e) {}

    // Update Clean BHW Top Taskbar pill tabs
    document.querySelectorAll('.bhw-pill-btn').forEach(btn => {
      const isActive = btn.dataset.tab === tabName;
      btn.classList.toggle('active', isActive);
    });

    document.querySelectorAll('.chw-sub-link').forEach(link => {
      const isActive = link.dataset.tab === tabName;
      link.classList.toggle('active', isActive);
      if (isActive && typeof link.scrollIntoView === 'function') {
        link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    document.querySelectorAll('.chw-tab-pane').forEach(pane => {
      pane.style.display = pane.dataset.tab === tabName ? 'block' : 'none';
    });

    if (tabName === 'dashboard' && window.CHWModule) {
      CHWModule.renderBHWDashboard();
    } else if (tabName === 'groups' && window.CHWModule) {
      CHWModule.renderParentGuardianGroupsTable();
      CHWModule.renderGroups();
    } else if (tabName === 'evaluations' && window.CHWModule) {
      CHWModule.renderTryHomeEvaluationsTable();
    } else if (tabName === 'registry' && window.CHWModule) {
      CHWModule.renderRegistryTable();
      CHWModule.updateStatsBar();
    }
  },

  // Switch Sub-tabs in MHO View
  switchMHOSubTab(tabName) {
    const targetTab = (tabName === 'dashboard') ? 'overview' : (tabName || 'overview');
    try {
      sessionStorage.setItem('nutrilearn_active_tab', targetTab);
      localStorage.setItem('nutrilearn_active_tab', targetTab);
      history.replaceState(null, '', '#' + targetTab);
    } catch (e) {}

    // Update Clean Admin Top Taskbar pills
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      const isActive = btn.dataset.tab === targetTab || (targetTab === 'overview' && btn.dataset.tab === 'overview');
      btn.classList.toggle('active', isActive);
    });

    document.querySelectorAll('.mho-sub-link').forEach(link => {
      const isActive = link.dataset.tab === targetTab;
      link.classList.toggle('active', isActive);
      if (isActive && typeof link.scrollIntoView === 'function') {
        link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    document.querySelectorAll('.mho-tab-pane').forEach(pane => {
      pane.style.display = (pane.dataset.tab === targetTab) ? 'block' : 'none';
    });

    if (targetTab === 'records' && window.MHODashboard) {
      if (typeof MHODashboard.updateBarangayBanner === 'function') {
        MHODashboard.updateBarangayBanner();
      }
      MHODashboard.renderAdminRecords();
    } else if (targetTab === 'barangays' && window.MHODashboard) {
      MHODashboard.renderBarangaysManager();
    } else if (targetTab === 'content' && window.MHODashboard) {
      MHODashboard.renderContentManagerModules();
    } else if (targetTab === 'users' && window.MHODashboard) {
      MHODashboard.renderUsersTable();
    } else if (targetTab === 'audit' && window.MHODashboard) {
      MHODashboard.renderAuditLogsTable();
    } else if (targetTab === 'announcements' && window.AnnouncementsModule) {
      if (typeof AnnouncementsModule.showListView === 'function') {
        AnnouncementsModule.showListView();
      } else {
        AnnouncementsModule.renderAdminFeed();
      }
    } else if (targetTab === 'overview' && window.MHODashboard) {
      if (typeof MHODashboard.updateOverviewHeader === 'function') {
        MHODashboard.updateOverviewHeader();
      }
      MHODashboard.renderKPIs();
    }
  },

  // Navigate back to the Main Dashboard of the current role
  navigateToMainDashboard() {
    // If startup auth screen is active, go back to main role selection screen
    const startupScreen = document.getElementById('startup-auth-screen');
    if (startupScreen && startupScreen.style.display !== 'none') {
      this.goToRoleSelectSignIn();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Role-specific main dashboard navigation
    const role = this.currentRole || 'parent';
    if (role === 'parent') {
      ParentModule.switchTab('learning');
    } else if (role === 'chw') {
      this.switchCHWSubTab('dashboard');
    } else if (role === 'collector') {
      this.switchCHWSubTab('registry');
    } else if (role === 'mho') {
      this.switchMHOSubTab('overview');
    }

    // Close any opened modals
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.classList.remove('active');
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // Update Header User Profile Badge across both Standard Header and Clean Admin Taskbar
  updateUserHeaderBadge() {
    const user = NutriStorage.getCurrentUser();
    
    // 1. Clean Admin Top Taskbar elements
    const adminName = document.getElementById('admin-user-display-name');
    const adminOffice = document.getElementById('admin-user-display-office');
    const adminAvatar = document.getElementById('admin-user-display-avatar');

    // 2. Standard Header elements
    const avatar = document.getElementById('header-user-avatar');
    const nameElem = document.getElementById('header-user-name');
    const roleElem = document.getElementById('header-user-role');

    const roleNames = {
      parent: 'Parent',
      chw: 'Health Worker',
      collector: 'Data Collector',
      mho: 'Administrator'
    };

    if (user) {
      const displayName = user.name || 'Mark Anthony';
      const userInitials = user.initials || NutriStorage.calculateInitials(displayName);
      const userDept = user.department || 'Barangay Manguiring Health Office, Calabanga';
      const roleText = roleNames[user.role] || user.role;

      // Update Clean Admin Top Taskbar
      if (adminName) adminName.textContent = displayName;
      if (adminOffice) adminOffice.textContent = userDept;
      if (adminAvatar) adminAvatar.textContent = userInitials;

      // Update Clean Parent Top Taskbar
      const parentName = document.getElementById('parent-top-user-name');
      const parentLoc = document.getElementById('parent-top-user-loc');
      const parentAvatar = document.getElementById('parent-top-user-avatar');
      if (parentName) parentName.textContent = displayName;
      if (parentLoc) parentLoc.textContent = user.barangay ? `${user.barangay}, Calabanga` : 'Zone 1, Barangay Manguiring, Calabanga';
      if (parentAvatar) parentAvatar.textContent = userInitials;

      // Update Clean BHW Top Taskbar
      const bhwName = document.getElementById('bhw-top-user-name');
      const bhwLoc = document.getElementById('bhw-top-user-loc');
      const bhwAvatar = document.getElementById('bhw-top-user-avatar');
      if (bhwName) bhwName.textContent = displayName || 'Nurse Ana Reyes';
      if (bhwLoc) bhwLoc.textContent = user.department || (user.barangay ? `${user.barangay}, Calabanga` : 'Manguiring Health Center, Zone 2, Calabanga');
      if (bhwAvatar) bhwAvatar.textContent = userInitials || 'AR';

      // Update Standard Header
      if (avatar) avatar.textContent = userInitials;
      if (nameElem) nameElem.textContent = displayName;
      if (roleElem) roleElem.textContent = roleText;
    } else {
      // Default state when viewing Admin, BHW or unauthenticated
      if (adminName) adminName.textContent = 'Mark Anthony';
      if (adminOffice) adminOffice.textContent = 'Barangay Manguiring Health Office, Calabanga';
      if (adminAvatar) adminAvatar.textContent = 'MA';

      const bhwName = document.getElementById('bhw-top-user-name');
      const bhwLoc = document.getElementById('bhw-top-user-loc');
      const bhwAvatar = document.getElementById('bhw-top-user-avatar');
      if (bhwName) bhwName.textContent = 'Nurse Ana Reyes';
      if (bhwLoc) bhwLoc.textContent = 'Manguiring Health Center, Zone 2, Calabanga';
      if (bhwAvatar) bhwAvatar.textContent = 'AR';

      if (avatar) avatar.textContent = 'MA';
      if (nameElem) nameElem.textContent = 'Sign In';
      if (roleElem) roleElem.textContent = 'Select Role';
    }
  },

  // Account Settings / Profile Self-Management (Req #1)
  openAccountSettingsModal() {
    let user = NutriStorage.getCurrentUser();
    if (!user) {
      user = {
        id: 'usr-admin-mho',
        name: 'Mark Anthony',
        email: 'markanthony@calabanga.gov.ph',
        password: '',
        role: this.currentRole || 'mho',
        department: 'Barangay Manguiring Health Office, Calabanga',
        designation: 'Administrator',
        initials: 'MA',
        barangay: 'Barangay Manguiring, Calabanga',
        status: 'Active'
      };
      NutriStorage.setCurrentUser(user);
    }
    const nameInput = document.getElementById('acc-settings-name');
    const emailInput = document.getElementById('acc-settings-email');
    const passInput = document.getElementById('acc-settings-pass');
    const roleBadge = document.getElementById('acc-settings-role-badge');
    const barangayInput = document.getElementById('acc-settings-barangay');

    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';
    if (passInput) passInput.value = user.password || '';
    if (roleBadge) roleBadge.textContent = (user.role || 'User').toUpperCase();
    if (barangayInput) barangayInput.value = user.barangay || 'Barangay Manguiring, Calabanga';

    this.openModal('modal-account-settings');
  },

  handleSaveAccountSettings(form) {
    let user = NutriStorage.getCurrentUser();
    if (!user) {
      user = {
        id: 'usr-admin-mho',
        role: this.currentRole || 'mho',
        department: 'Barangay Manguiring Health Office, Calabanga',
        designation: 'Administrator',
        status: 'Active'
      };
    }

    const name = form.elements['accName'].value.trim();
    const email = form.elements['accEmail'].value.trim();
    const pass = form.elements['accPass'].value;
    const barangay = form.elements['accBarangay'] ? form.elements['accBarangay'].value : (user.barangay || 'Barangay Manguiring, Calabanga');

    // Validation (Req #14)
    if (!name || !email || !pass) {
      this.showToast('Name, email, and password cannot be empty.', 'warning');
      return;
    }

    user.name = name;
    user.email = email;
    user.password = pass;
    user.barangay = barangay;
    user.initials = NutriStorage.calculateInitials(name);

    const saved = NutriStorage.updateUser(user);
    this.updateUserHeaderBadge();
    this.closeModal('modal-account-settings');
    this.showToast(`✅ Profile updated! Logged in as ${saved ? saved.name : name}`, 'success');
  },

  // Authentication: Open Modal (Phase 1: role-choice, or Phase 2: form)
  openAuthModal(phase = 'role-choice', role = null) {
    if (role) {
      this.currentAuthRole = role;
    }
    this.setAuthPhase(phase);
    this.openModal('modal-auth');
  },

  // Set Auth Phase: 'role-choice' or 'form'
  setAuthPhase(phase) {
    const choiceSection = document.getElementById('auth-phase-role-choice');
    const formSection = document.getElementById('auth-phase-form');
    
    if (phase === 'role-choice') {
      if (choiceSection) choiceSection.style.display = 'block';
      if (formSection) formSection.style.display = 'none';
      const titleElem = document.getElementById('auth-modal-title');
      if (titleElem) titleElem.textContent = 'Choose Your User Portal';
    } else {
      if (choiceSection) choiceSection.style.display = 'none';
      if (formSection) formSection.style.display = 'block';
      const titleElem = document.getElementById('auth-modal-title');
      if (titleElem) titleElem.textContent = 'Sign In / Sign Up';
      this.updateAuthFormDisplay();
    }
  },

  // Step 1: User picks one of 3 roles (Parent, BHW, Administrator)
  selectAuthRole(role) {
    this.currentAuthRole = role;
    this.setAuthPhase('form');
  },

  // Step 2: Switch between Sign In and Sign Up tabs
  switchAuthMode(mode) {
    this.currentAuthMode = mode;
    
    const signinTabBtn = document.getElementById('tab-btn-signin');
    const signupTabBtn = document.getElementById('tab-btn-signup');
    const signinForm = document.getElementById('auth-signin-form');
    const signupForm = document.getElementById('auth-signup-form');

    if (signinTabBtn) signinTabBtn.classList.toggle('active', mode === 'signin');
    if (signupTabBtn) signupTabBtn.classList.toggle('active', mode === 'signup');
    if (signinForm) signinForm.style.display = mode === 'signin' ? 'block' : 'none';
    if (signupForm) signupForm.style.display = mode === 'signup' ? 'block' : 'none';
  },

  // Update Auth Form UI based on chosen role
  updateAuthFormDisplay() {
    const roleTitles = {
      parent: 'Parent Portal',
      chw: 'BHW Portal',
      mho: 'Administrator Portal'
    };

    const roleTag = document.getElementById('auth-current-role-tag');
    const roleIcon = document.getElementById('auth-current-role-icon');
    if (roleTag) roleTag.textContent = roleTitles[this.currentAuthRole] || 'Portal';
    if (roleIcon) roleIcon.textContent = '';

    // Show/hide role specific signup fields
    const parentFields = document.getElementById('signup-fields-parent');
    const bhwFields = document.getElementById('signup-fields-bhw');
    const mhoFields = document.getElementById('signup-fields-mho');

    if (parentFields) parentFields.style.display = this.currentAuthRole === 'parent' ? 'block' : 'none';
    if (bhwFields) bhwFields.style.display = this.currentAuthRole === 'chw' ? 'block' : 'none';
    if (mhoFields) mhoFields.style.display = this.currentAuthRole === 'mho' ? 'block' : 'none';

    // Default to signin mode
    this.switchAuthMode('signin');
  },

  // Handle Sign Up registration
  submitSignUp(event) {
    if (event) event.preventDefault();
    const form = document.getElementById('auth-signup-form');
    if (!form) return;

    const name = form.elements['regName'].value.trim();
    const email = form.elements['regEmail'].value.trim();
    const password = form.elements['regPassword'].value;

    if (!name || !email || !password) {
      this.showToast('Please fill in all required fields.', 'warning');
      return;
    }

    const existingUsers = NutriStorage.getUsers();
    if (existingUsers.some(u => u.email && u.email.toLowerCase() === email.toLowerCase())) {
      this.showToast('Mayroon nang account gamit ang email na ito. Pakigamit ang Sign In.', 'warning');
      return;
    }

    const userData = {
      name,
      email,
      password,
      role: this.currentAuthRole
    };

    if (this.currentAuthRole === 'parent') {
      userData.childName = form.elements['regChildName']?.value.trim() || '';
      userData.childAge = parseInt(form.elements['regChildAge']?.value || '12', 10);
      userData.barangay = form.elements['regBarangay']?.value || 'Barangay Manguiring';
    } else if (this.currentAuthRole === 'chw') {
      userData.bhwId = form.elements['regBhwId']?.value.trim() || 'BHW-' + Math.floor(1000 + Math.random() * 9000);
      userData.barangay = form.elements['regBhwBarangay']?.value || 'Barangay Manguiring';
    } else if (this.currentAuthRole === 'mho') {
      userData.department = form.elements['regMhoDept']?.value.trim() || 'Municipal Health Office';
      userData.designation = form.elements['regMhoDesignation']?.value.trim() || 'Health Officer';
    }

    const newUser = NutriStorage.registerUser(userData);
    this.closeModal('modal-auth');
    this.switchRole(newUser.role);
    this.updateUserHeaderBadge();
    this.showToast(`🎉 Registration successful! Welcome to NutriLearn, ${newUser.name}.`, 'success');
  },



  // Switch Sub-tabs in Parent View
  switchParentSubTab(tabName) {
    document.querySelectorAll('.parent-sub-link').forEach(link => {
      link.classList.toggle('active', link.dataset.tab === tabName);
    });

    document.querySelectorAll('.parent-tab-pane').forEach(pane => {
      pane.style.display = pane.dataset.tab === tabName ? 'block' : 'none';
    });
  },


  // Modal Open / Close Handlers
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'flex';
      modal.classList.add('open');
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
    const anyOpen = document.querySelectorAll('.modal-backdrop.open');
    if (!anyOpen || anyOpen.length === 0) {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  },

  // Toast Notification System
  showToast(message, type = 'info') {
    let container = document.getElementById('nutri-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'nutri-toast-container';
      container.style.cssText = `
        position: fixed;
        bottom: 1.5rem;
        right: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        z-index: 9999;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bg = type === 'success' ? '#065F46' : type === 'warning' ? '#92400E' : '#0E3D26';
    toast.style.cssText = `
      background: ${bg};
      color: #FFFFFF;
      padding: 0.85rem 1.25rem;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 500;
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      pointer-events: auto;
      animation: fadeIn 0.2s ease-out;
      border: 1px solid rgba(255,255,255,0.2);
    `;
    toast.innerHTML = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 3800);
  },

  // Trigger PWA Installation
  promptPWAInstall() {
    if (this.deferredInstallPrompt) {
      this.deferredInstallPrompt.prompt();
      this.deferredInstallPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          this.showToast('NutriLearn added to your home screen/desktop!', 'success');
        }
        this.deferredInstallPrompt = null;
      });
    } else {
      this.openModal('modal-download-app');
    }
  },

  // Trigger Android APK Download
  downloadAndroidAPK() {
    const link = document.createElement('a');
    link.href = './NutriLearn.apk';
    link.download = 'NutriLearn.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast('📥 Downloading NutriLearn.apk for Android...', 'success');
  },

  // Trigger Windows App Launcher Download
  downloadWindowsApp() {
    const link = document.createElement('a');
    link.href = './NutriLearn-Windows.bat';
    link.download = 'NutriLearn-Windows.bat';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast('📥 Downloading NutriLearn-Windows.bat desktop launcher...', 'success');
  },

  // Language Switcher Handlers
  setLanguage(lang) {
    if (window.NutriI18n) NutriI18n.setLanguage(lang);
  },

  toggleLanguage() {
    if (window.NutriI18n) NutriI18n.toggleLanguage();
  }
};

// ==============================================================================
// INACTIVITY SESSION TIMEOUT MANAGER (Thesis Chapter 2.2 Security & Privacy)
// Automatically times out user session after 30 minutes of inactivity to protect family privacy
// ==============================================================================
const InactivityManager = {
  TIMEOUT_MS: 30 * 60 * 1000, // 30 minutes (1,800,000 ms)
  WARNING_MS: 28 * 60 * 1000, // Warning at 28 minutes
  COUNTDOWN_SEC: 120, // 2-minute countdown (120 seconds)
  timer: null,
  countdownInterval: null,
  isWarningShowing: false,
  remainingSeconds: 120,

  init() {
    this.bindActivityListeners();
    this.resetTimer();
  },

  bindActivityListeners() {
    const reset = () => {
      // Don't reset if warning modal is already waiting for user choice
      if (!this.isWarningShowing) {
        this.resetTimer();
      }
    };

    ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'].forEach(evt => {
      window.addEventListener(evt, reset, { passive: true });
    });
  },

  resetTimer() {
    if (this.timer) clearTimeout(this.timer);
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    this.isWarningShowing = false;
    this.remainingSeconds = this.COUNTDOWN_SEC;

    // Only run inactivity timer if a user is actively logged in
    const currentUser = window.NutriStorage ? NutriStorage.getCurrentUser() : null;
    const startupScreen = document.getElementById('startup-auth-screen');
    const isAppActive = startupScreen && startupScreen.style.display === 'none';

    if (currentUser && isAppActive) {
      this.timer = setTimeout(() => {
        this.showWarning();
      }, this.WARNING_MS);
    }
  },

  showWarning() {
    const currentUser = window.NutriStorage ? NutriStorage.getCurrentUser() : null;
    if (!currentUser) return;

    this.isWarningShowing = true;
    this.remainingSeconds = this.COUNTDOWN_SEC;
    const modal = document.getElementById('modal-inactivity-warning');
    const countdownEl = document.getElementById('inactivity-countdown');
    if (countdownEl) countdownEl.textContent = this.remainingSeconds;
    if (modal) modal.style.display = 'flex';

    if (this.countdownInterval) clearInterval(this.countdownInterval);
    this.countdownInterval = setInterval(() => {
      this.remainingSeconds--;
      if (countdownEl) countdownEl.textContent = this.remainingSeconds;

      if (this.remainingSeconds <= 0) {
        clearInterval(this.countdownInterval);
        this.performLogout('timeout');
      }
    }, 1000);
  },

  stayLoggedIn() {
    const modal = document.getElementById('modal-inactivity-warning');
    if (modal) modal.style.display = 'none';
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    this.isWarningShowing = false;
    this.resetTimer();
    if (window.NutriApp) {
      NutriApp.showToast('✅ Na-extend ang iyong sesyon. Salamat!', 'success');
    }
  },

  performLogout(reason = 'timeout') {
    const modal = document.getElementById('modal-inactivity-warning');
    if (modal) modal.style.display = 'none';
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    this.isWarningShowing = false;

    const user = window.NutriStorage ? NutriStorage.getCurrentUser() : null;
    if (user && window.NutriStorage) {
      NutriStorage.logAudit(
        'Session Timed Out (Inactivity)',
        'Security & Access',
        `User ${user.name} automatically logged out after 30 minutes of inactivity to protect family privacy (Chapter 2.2).`,
        user.name
      );
    }

    if (window.NutriApp) {
      NutriApp.logout();
      if (reason === 'timeout') {
        const isFil = !window.NutriI18n || NutriI18n.currentLang === 'fil';
        const msg = isFil
          ? '🔒 Kusang nag-log out ang sesyon dahil sa 30 minuto ng walang aktibidad upang maprotektahan ang pribadong datos ng pamilya.'
          : '🔒 Session timed out after 30 minutes of inactivity to protect family privacy.';
        NutriApp.showToast(msg, 'warning');
      }
    }
  },

  // Instant trigger helper for prototype evaluation and defense demonstrations
  testTriggerWarning() {
    this.showWarning();
  }
};

window.InactivityManager = InactivityManager;

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  NutriApp.init();
});


// Global window fallback for Forgot Password navigation
window.goToForgotPassword = function(event) {
  if (event && event.preventDefault) event.preventDefault();
  if (window.NutriApp) window.NutriApp.goToForgotPassword(event);
};
