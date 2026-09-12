// ==========================================================================
// NUTRILEARN - INTERNATIONALIZATION (i18n) MODULE
// Dual Language Support: Filipino (Tagalog) & English
// ==========================================================================

const NutriI18n = {
  LANG_KEY: 'nutrilearn_lang_v1',
  currentLang: 'fil', // Default to Filipino as requested for community accessibility

  init() {
    // Load saved language preference or default to Filipino
    const saved = localStorage.getItem(this.LANG_KEY);
    if (saved && (saved === 'fil' || saved === 'en')) {
      this.currentLang = saved;
    } else {
      this.currentLang = 'fil';
    }
    this.applyLanguage(this.currentLang);
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

    // 1. Update Language Selector Button States
    const btnFil = document.getElementById('btn-lang-fil');
    const btnEn = document.getElementById('btn-lang-en');
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

    // Header Language Toggle Button
    const headerLangLabel = document.getElementById('header-lang-label');
    if (headerLangLabel) {
      headerLangLabel.textContent = lang === 'fil' ? '🇵🇭 Filipino' : '🇺🇸 English';
    }

    // 2. Translate Startup Screen Cards
    const cardParentTitle = document.querySelector('[data-role="parent"] .portal-card-title');
    const cardParentDesc = document.querySelector('[data-role="parent"] .portal-card-desc');
    if (cardParentTitle) cardParentTitle.textContent = t.card_parent_title;
    if (cardParentDesc) cardParentDesc.textContent = t.card_parent_desc;

    const cardChwTitle = document.querySelector('[data-role="chw"] .portal-card-title');
    const cardChwDesc = document.querySelector('[data-role="chw"] .portal-card-desc');
    if (cardChwTitle) cardChwTitle.textContent = t.card_chw_title;
    if (cardChwDesc) cardChwDesc.textContent = t.card_chw_desc;

    const cardColTitle = document.querySelector('[data-role="collector"] .portal-card-title');
    const cardColDesc = document.querySelector('[data-role="collector"] .portal-card-desc');
    if (cardColTitle) cardColTitle.textContent = t.card_col_title;
    if (cardColDesc) cardColDesc.textContent = t.card_col_desc;

    const cardMhoTitle = document.querySelector('[data-role="mho"] .portal-card-title');
    const cardMhoDesc = document.querySelector('[data-role="mho"] .portal-card-desc');
    if (cardMhoTitle) cardMhoTitle.textContent = t.card_mho_title;
    if (cardMhoDesc) cardMhoDesc.textContent = t.card_mho_desc;

    // Continue Button
    const continueBtn = document.getElementById('btn-portal-continue');
    if (continueBtn && window.NutriApp) {
      const action = NutriApp.portalAction || 'signin';
      continueBtn.textContent = action === 'signup' ? t.btn_continue_signup : t.btn_continue_signin;
    }

    // Register / Signin Footer Link
    const footerLink = document.getElementById('portal-footer-link');
    if (footerLink && window.NutriApp) {
      const action = NutriApp.portalAction || 'signin';
      if (action === 'signin') {
        footerLink.innerHTML = `${t.footer_no_account_text} <a href="javascript:void(0)" onclick="NutriApp.setPortalAction('signup')">${t.footer_register_link}</a>`;
      } else {
        footerLink.innerHTML = `${t.footer_have_account_text} <a href="javascript:void(0)" onclick="NutriApp.setPortalAction('signin')">${t.footer_signin_link}</a>`;
      }
    }

    const regPrompt = document.getElementById('portal-footer-register-link');
    if (regPrompt) {
      regPrompt.innerHTML = `${t.footer_no_account_text} <a href="javascript:void(0)" onclick="NutriApp.setStartupPhase('signup')">${t.footer_register_link}</a>`;
    }

    const langTitleLbl = document.getElementById('lbl-language-title');
    if (langTitleLbl) {
      langTitleLbl.textContent = t.lbl_select_language;
    }

    // Sign in screen elements
    const signinHeading = document.getElementById('startup-signin-heading');
    if (signinHeading) signinHeading.textContent = t.signin_heading;

    const signupHeading = document.getElementById('startup-signup-heading');
    if (signupHeading) signupHeading.textContent = t.signup_heading;

    const btnSubmitSignin = document.getElementById('btn-startup-submit-signin');
    if (btnSubmitSignin) btnSubmitSignin.textContent = t.btn_signin;

    const btnSubmitSignup = document.getElementById('btn-startup-submit-signup');
    if (btnSubmitSignup) btnSubmitSignup.textContent = t.btn_create_account;

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

    // App Header Sign Out
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

    // Refresh dynamic demo login button
    if (window.NutriApp && typeof NutriApp.updateStartupFormDisplay === 'function') {
      NutriApp.updateStartupFormDisplay(NutriApp.currentAuthMode || 'signin');
    }
  },

  translations: {
    fil: {
      lbl_select_language: 'Piliin ang Wika / Select Language:',
      card_parent_title: 'Magulang / Tagapag-alaga',
      card_parent_desc: 'Makakuha ng mga aralin sa nutrisyon, mga plano sa pagkain, at subaybayan ang paglaki ng iyong anak.',
      card_chw_title: 'Manggagawa sa Kalusugan (BHW)',
      card_chw_desc: 'Pamahalaan ang mga parent group, mag-post ng mga anunsyo, at magsumite ng child records.',
      card_col_title: 'Tagakolekta ng Datos sa Larangan',
      card_col_desc: 'Mangalap ng datos sa nutrisyon, magrehistro ng bata, at magpatunay ng paglaki.',
      card_mho_title: 'Administrator (MHO)',
      card_mho_desc: 'Tingnan ang mga tala ng field, analytics, at pamahalaan ang nilalaman ng programa.',
      btn_continue_signin: 'Magpatuloy sa Pag-sign In',
      btn_continue_signup: 'Magpatuloy sa Pagrehistro',
      footer_no_account_text: 'Wala kang account?',
      footer_register_link: 'Magparehistro dito',
      footer_have_account_text: 'May account ka na?',
      footer_signin_link: 'Mag-sign in dito',
      signin_heading: 'Mag-sign In',
      signup_heading: 'Gumawa ng Account',
      btn_signin: 'Mag-sign In',
      btn_create_account: 'Gumawa ng Account',
      btn_signout: 'Mag-sign Out',
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
      lbl_select_language: 'Select Language / Piliin ang Wika:',
      card_parent_title: 'Parent / Guardian',
      card_parent_desc: 'Access nutrition lessons, meal plans, and track your child\'s growth.',
      card_chw_title: 'Health Worker (BHW/BNS)',
      card_chw_desc: 'Manage parent groups, post announcements, and submit child records.',
      card_col_title: 'Field Data Collector',
      card_col_desc: 'Collect anthropometric field surveys, register children, and verify growth.',
      card_mho_title: 'Administrator (MHO)',
      card_mho_desc: 'Manage user accounts, update nutrition content, and review analytics.',
      btn_continue_signin: 'Continue to Sign In',
      btn_continue_signup: 'Continue to Sign Up',
      footer_no_account_text: 'Don\'t have an account?',
      footer_register_link: 'Register here',
      footer_have_account_text: 'Already have an account?',
      footer_signin_link: 'Sign in here',
      signin_heading: 'Sign In',
      signup_heading: 'Create Account',
      btn_signin: 'Sign In',
      btn_create_account: 'Create Account',
      btn_signout: 'Sign Out',
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
