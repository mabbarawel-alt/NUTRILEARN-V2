// ==========================================================================
// NUTRILEARN - INTERNATIONALIZATION (i18n) MODULE
// Comprehensive Dual Language Support: Filipino (Tagalog) & English
// Ensures 100% pure consistency in every phase without mixed languages
// ==========================================================================

const NutriI18n = {
  LANG_KEY: 'nutrilearn_lang_v1',
  currentLang: 'fil', // Default to Filipino

  init() {
    const saved = localStorage.getItem(this.LANG_KEY);
    if (saved && (saved === 'fil' || saved === 'en')) {
      this.currentLang = saved;
    } else {
      this.currentLang = 'fil';
    }
    this.applyLanguage(this.currentLang);
  },

  isFil() {
    return this.currentLang === 'fil';
  },

  setLanguage(lang) {
    if (lang !== 'fil' && lang !== 'en') return;
    this.currentLang = lang;
    localStorage.setItem(this.LANG_KEY, lang);
    this.applyLanguage(lang);
    if (window.NutriApp && typeof NutriApp.showToast === 'function') {
      const msg = lang === 'fil' ? '🇵🇭 Wika pinalitan sa Filipino.' : '🇺🇸 Language switched to English.';
      NutriApp.showToast(msg, 'info');
    }
  },

  toggleLanguage() {
    const nextLang = this.currentLang === 'fil' ? 'en' : 'fil';
    this.setLanguage(nextLang);
  },

  get(key) {
    const dict = this.translations[this.currentLang] || this.translations['fil'];
    return dict[key] || this.translations['en']?.[key] || key;
  },

  applyLanguage(lang) {
    const t = this.translations[lang] || this.translations['fil'];

    // 1. Synchronize all language selector pill states across all phases
    const syncPillButtons = (btnFil, btnEn) => {
      if (btnFil && btnEn) {
        if (lang === 'fil') {
          btnFil.style.background = '#0E3D26';
          btnFil.style.color = '#FFFFFF';
          btnFil.style.fontWeight = '700';
          btnEn.style.background = 'transparent';
          btnEn.style.color = '#475569';
          btnEn.style.fontWeight = '600';
        } else {
          btnEn.style.background = '#0E3D26';
          btnEn.style.color = '#FFFFFF';
          btnEn.style.fontWeight = '700';
          btnFil.style.background = 'transparent';
          btnFil.style.color = '#475569';
          btnFil.style.fontWeight = '600';
        }
      }
    };

    // Login screen language pills
    syncPillButtons(document.getElementById('btn-lang-fil'), document.getElementById('btn-lang-en'));
    syncPillButtons(document.getElementById('btn-lang-top-fil'), document.getElementById('btn-lang-top-en'));

    // Top taskbar language selector pills in all roles
    document.querySelectorAll('.taskbar-lang-pill').forEach(pill => {
      const bFil = pill.querySelector('.btn-lang-pill-fil');
      const bEn = pill.querySelector('.btn-lang-pill-en');
      syncPillButtons(bFil, bEn);
    });

    // Header Language Toggle Button label
    const headerLangLabel = document.getElementById('header-lang-label');
    if (headerLangLabel) {
      headerLangLabel.textContent = lang === 'fil' ? '🇵🇭 Filipino' : '🇺🇸 English';
    }

    const topLangTitle = document.getElementById('lbl-top-lang-title');
    if (topLangTitle) {
      topLangTitle.textContent = lang === 'fil' ? '🌐 Wika:' : '🌐 Language:';
    }

    // 2. Startup Screen 1: Select Role for Sign In
    const signinMainTitle = document.getElementById('lbl-signin-main-title');
    if (signinMainTitle) signinMainTitle.textContent = t.signin_heading;

    const signinRoleSelectTitle = document.getElementById('lbl-signin-role-select-title');
    if (signinRoleSelectTitle) signinRoleSelectTitle.textContent = t.signin_role_select_title;

    const cardSigninParentTitle = document.getElementById('card-signin-parent-title');
    const cardSigninParentDesc = document.getElementById('card-signin-parent-desc');
    if (cardSigninParentTitle) cardSigninParentTitle.textContent = t.card_parent_title;
    if (cardSigninParentDesc) cardSigninParentDesc.textContent = t.card_parent_desc;

    const cardSigninChwTitle = document.getElementById('card-signin-chw-title');
    const cardSigninChwDesc = document.getElementById('card-signin-chw-desc');
    if (cardSigninChwTitle) cardSigninChwTitle.textContent = t.card_chw_title;
    if (cardSigninChwDesc) cardSigninChwDesc.textContent = t.card_chw_desc;

    const cardSigninMhoTitle = document.getElementById('card-signin-mho-title');
    const cardSigninMhoDesc = document.getElementById('card-signin-mho-desc');
    if (cardSigninMhoTitle) cardSigninMhoTitle.textContent = t.card_mho_title;
    if (cardSigninMhoDesc) cardSigninMhoDesc.textContent = t.card_mho_desc;

    const btnSigninContinue = document.getElementById('btn-signin-role-continue');
    if (btnSigninContinue) btnSigninContinue.textContent = t.btn_continue;

    const footerPromptSignin = document.getElementById('footer-prompt-signin');
    if (footerPromptSignin) {
      footerPromptSignin.innerHTML = `${t.footer_no_account_text} <button type="button" onclick="NutriApp.goToRoleSelectSignUp()" id="link-goto-register" style="background: transparent; border: none; padding: 0; color: #0D766E; font-weight: 600; cursor: pointer; text-decoration: underline;">${t.footer_register_link}</button>`;
    }

    // 3. Startup Screen 2: Create Account - Who are you registering as?
    const signupTitle = document.getElementById('lbl-signup-title');
    const signupSubtitle = document.getElementById('lbl-signup-subtitle');
    if (signupTitle) signupTitle.textContent = t.signup_heading;
    if (signupSubtitle) signupSubtitle.textContent = t.signup_role_subtitle;

    const cardSignupParentTitle = document.getElementById('card-signup-parent-title');
    const cardSignupParentDesc = document.getElementById('card-signup-parent-desc');
    if (cardSignupParentTitle) cardSignupParentTitle.textContent = t.card_parent_title;
    if (cardSignupParentDesc) cardSignupParentDesc.textContent = t.card_signup_parent_desc;

    const cardSignupChwTitle = document.getElementById('card-signup-chw-title');
    const cardSignupChwDesc = document.getElementById('card-signup-chw-desc');
    if (cardSignupChwTitle) cardSignupChwTitle.textContent = t.card_chw_title;
    if (cardSignupChwDesc) cardSignupChwDesc.textContent = t.card_signup_chw_desc;

    const cardSignupMhoTitle = document.getElementById('card-signup-mho-title');
    const cardSignupMhoDesc = document.getElementById('card-signup-mho-desc');
    if (cardSignupMhoTitle) cardSignupMhoTitle.textContent = t.card_mho_title;
    if (cardSignupMhoDesc) cardSignupMhoDesc.textContent = t.card_signup_mho_desc;

    const btnSignupContinue = document.getElementById('btn-signup-role-continue');
    if (btnSignupContinue) btnSignupContinue.textContent = t.btn_continue;

    const footerPromptSignup = document.getElementById('footer-prompt-signup');
    if (footerPromptSignup) {
      footerPromptSignup.innerHTML = `${t.footer_have_account_text} <button type="button" onclick="NutriApp.goToRoleSelectSignIn()" id="link-goto-signin" style="background: transparent; border: none; padding: 0; color: #0D766E; font-weight: 600; cursor: pointer; text-decoration: underline;">${t.footer_signin_link}</button>`;
    }

    // 4. Startup Screen 3: Your Details (Registration Form)
    const detailsTitle = document.getElementById('lbl-details-title');
    const detailsSubtitle = document.getElementById('lbl-details-subtitle');
    if (detailsTitle) detailsTitle.textContent = t.details_title;
    if (detailsSubtitle) detailsSubtitle.textContent = t.details_subtitle;

    const btnBackSignup = document.getElementById('btn-back-to-signup-roles');
    if (btnBackSignup) btnBackSignup.textContent = t.btn_back;

    const lblRegName = document.getElementById('lbl-reg-fullname');
    if (lblRegName) lblRegName.textContent = t.lbl_reg_fullname;
    const inputRegName = document.getElementById('reg-fullname-input');
    if (inputRegName) inputRegName.placeholder = t.placeholder_fullname;

    const lblRegBrgy = document.getElementById('lbl-reg-barangay');
    if (lblRegBrgy) lblRegBrgy.textContent = t.lbl_reg_barangay;
    const tipRegBrgy = document.getElementById('tip-reg-barangay');
    if (tipRegBrgy) tipRegBrgy.textContent = t.tip_reg_barangay;

    const lblRegEmail = document.getElementById('lbl-reg-email');
    if (lblRegEmail) lblRegEmail.textContent = t.lbl_reg_email;
    const inputRegEmail = document.getElementById('reg-email-input');
    if (inputRegEmail) inputRegEmail.placeholder = t.placeholder_email;

    const lblRegPass = document.getElementById('lbl-reg-password');
    if (lblRegPass) lblRegPass.textContent = t.lbl_reg_password;
    const inputRegPass = document.getElementById('reg-password-input');
    if (inputRegPass) inputRegPass.placeholder = t.placeholder_password;

    const lblRegConfirm = document.getElementById('lbl-reg-confirm-password');
    if (lblRegConfirm) lblRegConfirm.textContent = t.lbl_reg_confirm_password;
    const inputRegConfirm = document.getElementById('reg-confirm-password-input');
    if (inputRegConfirm) inputRegConfirm.placeholder = t.placeholder_confirm_password;

    // Screen 3 Child Details (Registration)
    const lblChildTitle = document.getElementById('lbl-reg-child-title');
    if (lblChildTitle) lblChildTitle.textContent = t.lbl_child_title;
    const lblChildDesc = document.getElementById('lbl-reg-child-desc');
    if (lblChildDesc) lblChildDesc.textContent = t.lbl_child_desc;

    const lblChildName = document.getElementById('lbl-reg-child-name');
    if (lblChildName) lblChildName.textContent = t.lbl_child_name;
    const inputChildName = document.getElementById('reg-child-name-input');
    if (inputChildName) inputChildName.placeholder = t.placeholder_child_name;

    const lblChildAge = document.getElementById('lbl-reg-child-age');
    if (lblChildAge) lblChildAge.textContent = t.lbl_child_age;
    const inputChildAge = document.getElementById('reg-child-age-input');
    if (inputChildAge) inputChildAge.placeholder = t.placeholder_child_age;

    const lblChildGender = document.getElementById('lbl-reg-child-gender');
    if (lblChildGender) lblChildGender.textContent = t.lbl_child_gender;
    const optGenderMale = document.getElementById('opt-gender-male');
    if (optGenderMale) optGenderMale.textContent = t.gender_male;
    const optGenderFemale = document.getElementById('opt-gender-female');
    if (optGenderFemale) optGenderFemale.textContent = t.gender_female;

    const lblChildHeight = document.getElementById('lbl-reg-child-height');
    if (lblChildHeight) lblChildHeight.textContent = t.lbl_child_height;
    const inputChildHeight = document.getElementById('reg-child-height-input');
    if (inputChildHeight) inputChildHeight.placeholder = t.placeholder_child_height;

    const lblChildWeight = document.getElementById('lbl-reg-child-weight');
    if (lblChildWeight) lblChildWeight.textContent = t.lbl_child_weight;
    const inputChildWeight = document.getElementById('reg-child-weight-input');
    if (inputChildWeight) inputChildWeight.placeholder = t.placeholder_child_weight;

    const btnDetailsSubmit = document.getElementById('btn-details-submit');
    if (btnDetailsSubmit) {
      const isParent = !window.NutriApp || NutriApp.currentAuthRole === 'parent';
      btnDetailsSubmit.textContent = isParent ? t.btn_complete_parent_reg : t.btn_create_account;
    }

    const footerPromptDetails = document.getElementById('footer-prompt-details');
    if (footerPromptDetails) {
      footerPromptDetails.innerHTML = `${t.footer_have_account_text} <button type="button" onclick="NutriApp.goToRoleSelectSignIn()" style="background: transparent; border: none; padding: 0; color: #0D766E; font-weight: 600; cursor: pointer; text-decoration: underline;">${t.footer_signin_link}</button>`;
    }

    // 5. Startup Screen 4: Sign In Credentials
    const btnBackSigninRoles = document.getElementById('btn-back-to-signin-roles');
    if (btnBackSigninRoles) btnBackSigninRoles.textContent = t.btn_back;

    const signinTitle = document.getElementById('lbl-signin-title');
    const signinSubtitle = document.getElementById('lbl-signin-subtitle');
    if (signinTitle) signinTitle.textContent = t.signin_heading;
    if (signinSubtitle) signinSubtitle.textContent = t.signin_subtitle;

    const signinBadgeSub = document.getElementById('signin-badge-sub');
    if (signinBadgeSub) signinBadgeSub.textContent = t.signin_badge_sub;

    const signinBadgeTitle = document.getElementById('signin-badge-title');
    if (signinBadgeTitle && window.NutriApp) {
      const role = NutriApp.currentAuthRole || 'parent';
      const roleMap = { parent: t.card_parent_title, chw: t.card_chw_title, mho: t.card_mho_title };
      signinBadgeTitle.textContent = roleMap[role] || t.card_parent_title;
    }

    const lblSigninEmail = document.getElementById('lbl-signin-email');
    if (lblSigninEmail) lblSigninEmail.textContent = t.lbl_signin_email;
    const inputSigninEmail = document.getElementById('input-signin-email');
    if (inputSigninEmail) inputSigninEmail.placeholder = t.placeholder_signin_email;

    const lblSigninPassword = document.getElementById('lbl-signin-password');
    if (lblSigninPassword) lblSigninPassword.textContent = t.lbl_signin_password;

    const linkForgot = document.getElementById('link-forgot-password');
    if (linkForgot) linkForgot.textContent = t.link_forgot_password;

    const btnSigninSubmit = document.getElementById('btn-signin-submit');
    if (btnSigninSubmit) btnSigninSubmit.textContent = t.btn_signin;

    const footerPromptSigninCreds = document.getElementById('footer-prompt-signin-creds');
    if (footerPromptSigninCreds) {
      footerPromptSigninCreds.innerHTML = `${t.footer_no_account_text} <button type="button" onclick="NutriApp.proceedToSignUpDetails()" style="background: transparent; border: none; padding: 0; color: #0D766E; font-weight: 600; cursor: pointer; text-decoration: underline;">${t.footer_register_link}</button>`;
    }

    // 6. Startup Screen 5: Forgot Password
    const btnBackForgot = document.getElementById('btn-back-to-signin');
    if (btnBackForgot) btnBackForgot.textContent = t.btn_back_signin;

    const lblForgotTitle = document.getElementById('lbl-forgot-title');
    if (lblForgotTitle) lblForgotTitle.textContent = t.forgot_title;
    const lblForgotSubtitle = document.getElementById('lbl-forgot-subtitle');
    if (lblForgotSubtitle) lblForgotSubtitle.textContent = t.forgot_subtitle;

    const lblForgotBadgeTitle = document.getElementById('lbl-forgot-badge-title');
    if (lblForgotBadgeTitle) lblForgotBadgeTitle.textContent = t.forgot_badge_title;
    const lblForgotBadgeSub = document.getElementById('lbl-forgot-badge-sub');
    if (lblForgotBadgeSub) lblForgotBadgeSub.textContent = t.forgot_badge_sub;

    const stepPill1 = document.getElementById('forgot-step-pill-1');
    if (stepPill1) stepPill1.textContent = t.forgot_step1;
    const stepPill2 = document.getElementById('forgot-step-pill-2');
    if (stepPill2) stepPill2.textContent = t.forgot_step2;
    const stepPill3 = document.getElementById('forgot-step-pill-3');
    if (stepPill3) stepPill3.textContent = t.forgot_step3;

    const lblForgotEmail = document.getElementById('lbl-forgot-email');
    if (lblForgotEmail) lblForgotEmail.textContent = t.forgot_lbl_email;
    const inputForgotEmail = document.getElementById('input-forgot-email');
    if (inputForgotEmail) inputForgotEmail.placeholder = t.forgot_ph_email;
    const tipForgotEmail = document.getElementById('tip-forgot-email');
    if (tipForgotEmail) tipForgotEmail.textContent = t.forgot_tip_email;
    const btnForgotSearch = document.getElementById('btn-forgot-search');
    if (btnForgotSearch) btnForgotSearch.textContent = t.forgot_btn_search;

    const lblForgotOtpTitle = document.getElementById('lbl-forgot-otp-title');
    if (lblForgotOtpTitle) lblForgotOtpTitle.textContent = t.forgot_otp_title;
    const tipForgotOtp = document.getElementById('tip-forgot-otp');
    if (tipForgotOtp) tipForgotOtp.textContent = t.forgot_otp_tip;
    const btnForgotAutofill = document.getElementById('btn-forgot-autofill');
    if (btnForgotAutofill) btnForgotAutofill.textContent = t.forgot_btn_autofill;

    const lblForgotCode = document.getElementById('lbl-forgot-code');
    if (lblForgotCode) lblForgotCode.textContent = t.forgot_lbl_code;
    const inputForgotCode = document.getElementById('input-forgot-code');
    if (inputForgotCode) inputForgotCode.placeholder = t.forgot_ph_code;
    const btnForgotBackStep1 = document.getElementById('btn-forgot-back-step1');
    if (btnForgotBackStep1) btnForgotBackStep1.textContent = t.btn_back;
    const btnForgotVerify = document.getElementById('btn-forgot-verify-code');
    if (btnForgotVerify) btnForgotVerify.textContent = t.forgot_btn_verify;

    const lblForgotNewPass = document.getElementById('lbl-forgot-new-pass');
    if (lblForgotNewPass) lblForgotNewPass.textContent = t.forgot_lbl_new_pass;
    const inputForgotNewPass = document.getElementById('input-forgot-new-pass');
    if (inputForgotNewPass) inputForgotNewPass.placeholder = t.forgot_ph_new_pass;

    const lblForgotConfirmPass = document.getElementById('lbl-forgot-confirm-pass');
    if (lblForgotConfirmPass) lblForgotConfirmPass.textContent = t.forgot_lbl_confirm_pass;
    const inputForgotConfirmPass = document.getElementById('input-forgot-confirm-pass');
    if (inputForgotConfirmPass) inputForgotConfirmPass.placeholder = t.forgot_ph_confirm_pass;

    const btnForgotSavePass = document.getElementById('btn-forgot-save-pass');
    if (btnForgotSavePass) btnForgotSavePass.textContent = t.forgot_btn_save;

    const footerPromptForgot = document.getElementById('footer-prompt-forgot');
    if (footerPromptForgot) {
      footerPromptForgot.innerHTML = `${t.forgot_footer_text} <button type="button" onclick="NutriApp.proceedToSignInCredentials(event)" style="background: transparent; border: none; padding: 0; color: #0D766E; font-weight: 600; cursor: pointer; text-decoration: underline;">${t.footer_signin_link}</button>`;
    }

    // 7. Clean Top Taskbars (Parent, BHW, Administrator)
    // Parent Taskbar Tabs
    const parentTabs = document.querySelectorAll('.parent-pill-btn');
    parentTabs.forEach(btn => {
      const tab = btn.dataset.tab;
      if (tab === 'learning') btn.innerHTML = `<span class="parent-pill-icon">📖</span> ${t.parent_tab_learning}`;
      if (tab === 'meal-planner') btn.innerHTML = `<span class="parent-pill-icon">🍲</span> ${t.parent_tab_meal}`;
      if (tab === 'try-at-home') btn.innerHTML = `<span class="parent-pill-icon">✓</span> ${t.parent_tab_try}`;
      if (tab === 'growth-tracker') btn.innerHTML = `<span class="parent-pill-icon">📈</span> ${t.parent_tab_growth}`;
    });

    // BHW Taskbar Tabs
    const bhwTabs = document.querySelectorAll('.bhw-pill-btn');
    bhwTabs.forEach(btn => {
      const tab = btn.dataset.tab;
      if (tab === 'dashboard') btn.innerHTML = `<span class="bhw-pill-icon">📊</span> <span>${t.bhw_tab_dashboard}</span>`;
      if (tab === 'groups') btn.innerHTML = `<span class="bhw-pill-icon">👥</span> <span>${t.bhw_tab_groups}</span>`;
      if (tab === 'announcements') btn.innerHTML = `<span class="bhw-pill-icon">📢</span> <span>${t.bhw_tab_announcements}</span>`;
      if (tab === 'registry') btn.innerHTML = `<span class="bhw-pill-icon">📋</span> <span>${t.bhw_tab_records}</span>`;
    });

    // Admin Taskbar Tabs
    const adminTabs = document.querySelectorAll('.admin-tab-btn');
    adminTabs.forEach(btn => {
      const tab = btn.dataset.tab;
      if (tab === 'overview') btn.innerHTML = `<span class="admin-tab-icon">📖</span> <span class="admin-tab-label">${t.admin_tab_overview}</span>`;
      if (tab === 'records') btn.innerHTML = `<span class="admin-tab-icon">📋</span> <span class="admin-tab-label">${t.admin_tab_records}</span>`;
      if (tab === 'barangays') btn.innerHTML = `<span class="admin-tab-icon">🏛️</span> <span class="admin-tab-label">${t.admin_tab_barangays}</span>`;
      if (tab === 'announcements') btn.innerHTML = `<span class="admin-tab-icon">📢</span> <span class="admin-tab-label">${t.admin_tab_announcements}</span>`;
      if (tab === 'users') btn.innerHTML = `<span class="admin-tab-icon">👥</span> <span class="admin-tab-label">${t.admin_tab_users}</span>`;
      if (tab === 'content') btn.innerHTML = `<span class="admin-tab-icon">📝</span> <span class="admin-tab-label">${t.admin_tab_content}</span>`;
      if (tab === 'audit') btn.innerHTML = `<span class="admin-tab-icon">🛡️</span> <span class="admin-tab-label">${t.admin_tab_audit}</span>`;
    });

    // Sign out buttons across all taskbars
    document.querySelectorAll('.btn-clean-signout').forEach(btn => {
      btn.textContent = t.btn_signout;
    });

    // Admin all barangays option label
    const adminBrgySelect = document.getElementById('admin-global-barangay-select');
    if (adminBrgySelect) {
      const allOpt = adminBrgySelect.querySelector('option[value="ALL"]');
      if (allOpt) allOpt.textContent = t.admin_all_brgy;
    }

    // 8. Standard Header Container
    const brandSub = document.querySelector('.brand-subtitle');
    if (brandSub) brandSub.textContent = t.header_subtitle;

    const btnSignout = document.querySelector('.btn-signout');
    if (btnSignout) {
      btnSignout.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        ${t.btn_signout}
      `;
    }

    // Sub-navigation Links
    document.querySelectorAll('.parent-sub-link').forEach(link => {
      const tab = link.dataset.tab;
      if (t.nav_parent[tab]) link.textContent = t.nav_parent[tab];
    });

    document.querySelectorAll('.chw-sub-link').forEach(link => {
      const tab = link.dataset.tab;
      if (t.nav_chw[tab]) link.textContent = t.nav_chw[tab];
    });

    document.querySelectorAll('.mho-sub-link').forEach(link => {
      const tab = link.dataset.tab;
      if (t.nav_mho[tab]) link.textContent = t.nav_mho[tab];
    });

    // Synchronize Header Active Portal Pill
    if (window.NutriApp && typeof NutriApp.updateUserHeaderBadge === 'function') {
      NutriApp.updateUserHeaderBadge();
    }

    // Refresh dynamic demo login button / form display
    if (window.NutriApp && typeof NutriApp.updateStartupFormDisplay === 'function') {
      NutriApp.updateStartupFormDisplay(NutriApp.currentAuthMode || 'signin');
    }

    // 9. Re-render dynamic components in the active portal to match the chosen language
    if (window.ParentModule) {
      if (typeof ParentModule.renderModuleCards === 'function') ParentModule.renderModuleCards();
      if (typeof ParentModule.renderHomeActionsChecklist === 'function') ParentModule.renderHomeActionsChecklist();
      if (typeof ParentModule.renderRecipes === 'function') ParentModule.renderRecipes();
      if (typeof ParentModule.renderChildGrowth === 'function') ParentModule.renderChildGrowth();
    }
  },

  translations: {
    fil: {
      lbl_select_language: 'Piliin ang Wika:',
      signin_role_select_title: 'Piliin ang iyong role para magpatuloy',
      card_parent_title: 'Magulang / Tagapag-alaga',
      card_parent_desc: 'Makakuha ng mga aralin sa nutrisyon, mga plano sa pagkain, at subaybayan ang paglaki ng iyong anak.',
      card_chw_title: 'Manggagawa sa Kalusugan (BHW)',
      card_chw_desc: 'Pamahalaan ang mga parent group, mag-post ng mga anunsyo, at magsumite ng child records.',
      card_col_title: 'Tagakolekta ng Datos sa Larangan',
      card_col_desc: 'Mangalap ng datos sa nutrisyon, magrehistro ng bata, at magpatunay ng paglaki.',
      card_mho_title: 'Administrator (MHO)',
      card_mho_desc: 'Tingnan ang mga tala ng field, analytics, at pamahalaan ang nilalaman ng programa.',
      btn_continue: 'Magpatuloy',
      btn_continue_signin: 'Magpatuloy sa Pag-sign In',
      btn_continue_signup: 'Magpatuloy sa Pagrehistro',
      footer_no_account_text: 'Wala kang account?',
      footer_register_link: 'Magparehistro dito',
      footer_have_account_text: 'May account ka na?',
      footer_signin_link: 'Mag-sign in dito',
      signin_heading: 'Mag-sign In',
      signin_subtitle: 'Ilagay ang iyong credentials para ma-access ang NutriLearn',
      signin_badge_sub: 'Pumapasok bilang',
      lbl_signin_email: 'Email address o Username',
      placeholder_signin_email: 'Hal. maria@example.com o mariasantos',
      lbl_signin_password: 'Password',
      link_forgot_password: 'Nakalimutan ang password?',
      forgot_title: 'Nakalimutan ang Password',
      forgot_subtitle: 'Sundin ang simpleng hakbang upang ligtas na mai-reset ang iyong password.',
      btn_back_signin: '← Bumalik sa Sign In',
      forgot_badge_title: 'Seguridad ng Account',
      forgot_badge_sub: 'Pagbawi at Pag-reset ng Password',
      forgot_step1: '1. Hanapin ang Account',
      forgot_step2: '2. Kumpirmahin ang Code',
      forgot_step3: '3. Bagong Password',
      forgot_lbl_email: 'Email Address o Username ng Account *',
      forgot_ph_email: 'Halimbawa: maria@example.com o Maria Santos',
      forgot_tip_email: '💡 Ilagay ang email o buong pangalan na ginamit noong nagparehistro ng account.',
      forgot_btn_search: 'Hanapin ang Account →',
      forgot_otp_title: '🔑 6-Digit Verification Code sa Seguridad:',
      forgot_otp_tip: 'Ipinadala sa iyong account / nabuo para sa pagpapatunay.',
      forgot_btn_autofill: '📋 Gamitin ang Code na Ito',
      forgot_lbl_code: 'Ilagay ang 6-Digit Code *',
      forgot_ph_code: 'Halimbawa: 482910',
      forgot_btn_verify: 'Kumpirmahin ang Code →',
      forgot_lbl_new_pass: 'Bagong Password *',
      forgot_ph_new_pass: 'Hindi bababa sa 6 na karakter',
      forgot_lbl_confirm_pass: 'Kumpirmahin ang Bagong Password *',
      forgot_ph_confirm_pass: 'Ulitin ang bagong password',
      forgot_btn_save: '✓ I-save ang Bagong Password & Mag-sign In',
      forgot_footer_text: 'Naaalala mo na ba ang iyong password?',
      signup_heading: 'Gumawa ng Account',
      signup_role_subtitle: 'Sino ang nais mong irehistro?',
      card_signup_parent_desc: 'Subaybayan ang nutrisyon ng bata at i-access ang learning modules.',
      card_signup_chw_desc: 'Subaybayan ang mga pamilya, itala ang datos ng bata, at ipamahagi ang anunsyo.',
      card_signup_mho_desc: 'Pamahalaan ang datos ng programa, mga gumagamit, at anunsyo sa kalusugan.',
      details_title: 'Iyong mga detalye',
      details_subtitle: 'Gumawa ng iyong NutriLearn account',
      btn_back: '← Bumalik',
      lbl_reg_fullname: 'Buong Pangalan *',
      placeholder_fullname: 'Hal. Maria Santos',
      lbl_reg_barangay: 'Barangay *',
      tip_reg_barangay: '🏛️ Tanging ang mga opisyal na Barangay na inirehistro ng Administrator ang magagamit sa sistema.',
      lbl_reg_email: 'Email Address o Username *',
      placeholder_email: 'Hal. maria@example.com o mariasantos',
      lbl_reg_password: 'Password *',
      placeholder_password: 'Hindi bababa sa 6 na karakter',
      lbl_reg_confirm_password: 'Kumpirmahin ang Password *',
      placeholder_confirm_password: 'Ulitin ang password',
      lbl_child_title: 'Impormasyon ng Bata (Opsyonal)',
      lbl_child_desc: 'Maaaring punan ngayon o idagdag sa dashboard. Naka-sync sa BHW & Admin.',
      lbl_child_name: 'Buong Pangalan ng Bata (Opsyonal)',
      placeholder_child_name: 'Halimbawa: Ethan Kyle Santos',
      lbl_child_age: 'Edad sa Buwan',
      placeholder_child_age: 'Hal. 18',
      lbl_child_gender: 'Kasarian',
      gender_male: 'Lalaki',
      gender_female: 'Babae',
      lbl_child_height: 'Tangkad / Taas (cm)',
      placeholder_child_height: 'Hal. 76.5 cm',
      lbl_child_weight: 'Timbang (kg)',
      placeholder_child_weight: 'Hal. 9.4 kg',
      btn_signin: 'Mag-sign In',
      btn_create_account: 'Gumawa ng Account →',
      btn_complete_parent_reg: 'Kumpletuhin ang Pagrehistro →',
      btn_signout: 'Mag-sign Out',
      header_subtitle: 'Kalusugan at Nutrisyon ng Bata',
      tag_family_care: 'Pangangalaga sa Pamilya',
      tag_field_ops: 'Operasyon sa Larangan',
      tag_admin: 'Pangangasiwa',
      parent_tab_learning: 'Aking Aralin',
      parent_tab_meal: 'Plano ng Pagkain',
      parent_tab_try: 'Subukan sa Bahay',
      parent_tab_growth: 'Talaan ng Timbang',
      bhw_tab_dashboard: 'Dashboard',
      bhw_tab_groups: 'Mga Grupo ng Magulang',
      bhw_tab_announcements: 'Mga Anunsyo',
      bhw_tab_records: 'Talaan ng mga Bata',
      admin_tab_overview: 'Pangkalahatang-ideya',
      admin_tab_records: 'Talaan ng Field',
      admin_tab_barangays: 'Mga Barangay',
      admin_tab_announcements: 'Mga Anunsyo',
      admin_tab_users: 'Mga Gumagamit',
      admin_tab_content: 'Nilalaman',
      admin_tab_audit: 'Talaan at Kasaysayan',
      admin_all_brgy: '🌐 Lahat ng Barangay',
      nav_parent: {
        'dashboard': '📊 Dashboard ng Magulang',
        'announcements': '📢 Mga Anunsyo sa Komunidad',
        'learning': '📚 Mga Aralin sa Nutrisyon at Pagsusulit',
        'meal-planner': '🍲 Pinggang Pinoy Plano ng Pagkain',
        'growth-tracker': '📈 Talaan ng Paglaki ng Aking Anak'
      },
      nav_chw: {
        'dashboard': '📊 BHW Dashboard',
        'announcements': '📢 Mga Pabatid at Direktiba',
        'registry': '📋 Talaan ng Malnutrisyon',
        'groups': '👥 Mga Grupo ng Magulang at Aralin',
        'calculator': '📐 WHO Sukat at MUAC Calculator',
        'reporting': '📤 Magsumite ng Ulat sa MHO'
      },
      nav_mho: {
        'dashboard': '📊 Executive Dashboard',
        'announcements': '📢 Opisyal na mga Anunsyo',
        'kpis': '🎯 10% Stunting Target at KPIs',
        'hotspots': '🗺️ Mga Hotspot na Barangay',
        'reports': '📥 Suriin at Aprubahan ang mga Ulat',
        'guidelines': '📜 Mga Patakaran ng WHO at PPAN',
        'content': '📝 Pamahalaan ang mga Aralin',
        'users': '👥 Pamahalaan ang mga Gumagamit',
        'audit': '🛡️ Audit at Talaan ng Aksyon'
      }
    },
    en: {
      lbl_select_language: 'Select Language:',
      signin_role_select_title: 'Select your role to continue',
      card_parent_title: 'Parent / Guardian',
      card_parent_desc: 'Access nutrition lessons, meal plans, and track your child\'s growth.',
      card_chw_title: 'Health Worker',
      card_chw_desc: 'Manage parent groups, post announcements, and submit child records.',
      card_col_title: 'Field Data Collector',
      card_col_desc: 'Collect anthropometric field surveys, register children, and verify growth.',
      card_mho_title: 'Administrator',
      card_mho_desc: 'View field records, analytics, and manage program content.',
      btn_continue: 'Continue',
      btn_continue_signin: 'Continue to Sign In',
      btn_continue_signup: 'Continue to Sign Up',
      footer_no_account_text: 'Don\'t have an account?',
      footer_register_link: 'Register here',
      footer_have_account_text: 'Already have an account?',
      footer_signin_link: 'Sign in',
      signin_heading: 'Sign In',
      signin_subtitle: 'Enter your credentials to access NutriLearn',
      signin_badge_sub: 'Signing in as',
      lbl_signin_email: 'Email address or Username',
      placeholder_signin_email: 'e.g. maria@example.com or mariasantos',
      lbl_signin_password: 'Password',
      link_forgot_password: 'Forgot password?',
      forgot_title: 'Forgot Password',
      forgot_subtitle: 'Follow the steps below to securely reset your NutriLearn account password.',
      btn_back_signin: '← Back to Sign In',
      forgot_badge_title: 'Account Security',
      forgot_badge_sub: 'Password Recovery & Reset',
      forgot_step1: '1. Find Account',
      forgot_step2: '2. Confirm Code',
      forgot_step3: '3. New Password',
      forgot_lbl_email: 'Account Email Address or Username *',
      forgot_ph_email: 'e.g. maria@example.com or Maria Santos',
      forgot_tip_email: '💡 Enter the email or full name used when registering the account.',
      forgot_btn_search: 'Find Account →',
      forgot_otp_title: '🔑 6-Digit Security Verification Code:',
      forgot_otp_tip: 'Sent to your account / generated for verification.',
      forgot_btn_autofill: '📋 Use This Code',
      forgot_lbl_code: 'Enter 6-Digit Code *',
      forgot_ph_code: 'e.g. 482910',
      forgot_btn_verify: 'Confirm Code →',
      forgot_lbl_new_pass: 'New Password *',
      forgot_ph_new_pass: 'At least 6 characters',
      forgot_lbl_confirm_pass: 'Confirm New Password *',
      forgot_ph_confirm_pass: 'Repeat new password',
      forgot_btn_save: '✓ Save New Password & Sign In',
      forgot_footer_text: 'Remember your password?',
      signup_heading: 'Create Account',
      signup_role_subtitle: 'Who are you registering as?',
      card_signup_parent_desc: 'Track your child\'s nutrition and access learning modules.',
      card_signup_chw_desc: 'Monitor families, record child data, and relay announcements.',
      card_signup_mho_desc: 'Oversee program data, users, and post health announcements.',
      details_title: 'Your details',
      details_subtitle: 'Create your NutriLearn account',
      btn_back: '← Back',
      lbl_reg_fullname: 'Full Name *',
      placeholder_fullname: 'e.g. Maria Santos',
      lbl_reg_barangay: 'Barangay *',
      tip_reg_barangay: '🏛️ Only official Barangays registered by the Administrator are available in the system.',
      lbl_reg_email: 'Email Address or Username *',
      placeholder_email: 'e.g. maria@example.com or mariasantos',
      lbl_reg_password: 'Password *',
      placeholder_password: 'At least 6 characters',
      lbl_reg_confirm_password: 'Confirm Password *',
      placeholder_confirm_password: 'Repeat password',
      lbl_child_title: 'Child\'s Information (Optional)',
      lbl_child_desc: 'You can fill this in now or add it in the dashboard. Synced to BHW & Admin.',
      lbl_child_name: 'Child\'s Full Name (Optional)',
      placeholder_child_name: 'e.g. Ethan Kyle Santos',
      lbl_child_age: 'Age in Months',
      placeholder_child_age: 'e.g. 18',
      lbl_child_gender: 'Gender',
      gender_male: 'Male',
      gender_female: 'Female',
      lbl_child_height: 'Height (cm)',
      placeholder_child_height: 'e.g. 76.5 cm',
      lbl_child_weight: 'Weight (kg)',
      placeholder_child_weight: 'e.g. 9.4 kg',
      btn_signin: 'Sign In',
      btn_create_account: 'Create Account →',
      btn_complete_parent_reg: 'Complete Registration →',
      btn_signout: 'Sign Out',
      header_subtitle: 'Child Health & Nutrition',
      tag_family_care: 'Family Care',
      tag_field_ops: 'Field Operations',
      tag_admin: 'Administration',
      parent_tab_learning: 'My Learning',
      parent_tab_meal: 'Meal Planner',
      parent_tab_try: 'Try It at Home',
      parent_tab_growth: 'Weight Tracker',
      bhw_tab_dashboard: 'Dashboard',
      bhw_tab_groups: 'Parent Groups',
      bhw_tab_announcements: 'Announcements',
      bhw_tab_records: 'Child Records',
      admin_tab_overview: 'Overview',
      admin_tab_records: 'Field Records',
      admin_tab_barangays: 'Barangays',
      admin_tab_announcements: 'Announcements',
      admin_tab_users: 'Users',
      admin_tab_content: 'Content',
      admin_tab_audit: 'Logs & History',
      admin_all_brgy: '🌐 All Barangays',
      nav_parent: {
        'dashboard': '📊 Parent Dashboard',
        'announcements': '📢 Community Bulletins',
        'learning': '📚 Learning Modules & Quizzes',
        'meal-planner': '🍲 Pinggang Pinoy Meal Planner',
        'growth-tracker': '📈 My Child Growth Record'
      },
      nav_chw: {
        'dashboard': '📊 BHW Dashboard',
        'announcements': '📢 Bulletins & Advisories',
        'registry': '📋 Malnutrition Registry',
        'groups': '👥 Parent Groups & Lessons',
        'calculator': '📐 WHO Growth & MUAC Calculator',
        'reporting': '📤 Submit Reports to MHO'
      },
      nav_mho: {
        'dashboard': '📊 Executive Dashboard',
        'announcements': '📢 Official Announcements',
        'kpis': '🎯 10% Stunting Target & KPIs',
        'hotspots': '🗺️ Barangay Hotspots & Burden',
        'reports': '📥 Review & Endorse BHW Reports',
        'guidelines': '📜 WHO & SDG Nutrition Guidelines',
        'content': '📝 Content Manager',
        'users': '👥 User Accounts & Access',
        'audit': '🛡️ Audit & Admin Logs'
      }
    }
  }
};
