// ==========================================================================
// NUTRILEARN - EXPORT & PERSISTENCE UTILITIES
// LocalStorage, CSV Generation, Formal Printable Summaries
// ==========================================================================

const NutriStorage = {
  // Key names
  CHILDREN_KEY: 'nutrilearn_children_v1',
  REPORTS_KEY: 'nutrilearn_reports_v1',
  MODULES_KEY: 'nutrilearn_modules_v1',
  USER_PROGRESS_KEY: 'nutrilearn_parent_progress_v1',
  USERS_KEY: 'nutrilearn_users_v1',
  CURRENT_USER_KEY: 'nutrilearn_current_user_v1',
  ANNOUNCEMENTS_KEY: 'nutrilearn_announcements_v1',
  GROUPS_KEY: 'nutrilearn_parent_groups_v1',
  PARENT_GROUPS_TRACKER_KEY: 'nutrilearn_parent_groups_tracker_v1',
  AUDIT_KEY: 'nutrilearn_audit_logs_v1',
  BARANGAYS_KEY: 'nutrilearn_barangays_v1',
  TRY_HOME_KEY: 'nutrilearn_try_home_submissions_v1',

  // Initialize storage with seed data if empty
  init() {
    // Only Barangay Manguiring remains in the system default settings
    const defaultBrgys = [
      { id: 'brgy-1', name: 'Barangay Manguiring', createdAt: '2026-08-01' }
    ];
    if (!localStorage.getItem(this.BARANGAYS_KEY)) {
      localStorage.setItem(this.BARANGAYS_KEY, JSON.stringify(defaultBrgys));
    }

    // Initialize children to Barangay Manguiring records only if not yet set
    if (!localStorage.getItem(this.CHILDREN_KEY)) {
      localStorage.setItem(this.CHILDREN_KEY, JSON.stringify(NUTRI_DATA.initialChildren));
    }

    // Reports to Barangay Manguiring if not yet set
    if (!localStorage.getItem(this.REPORTS_KEY)) {
      localStorage.setItem(this.REPORTS_KEY, JSON.stringify(NUTRI_DATA.initialReports));
    }

    // Learning modules
    if (!localStorage.getItem(this.MODULES_KEY)) {
      localStorage.setItem(this.MODULES_KEY, JSON.stringify(NUTRI_DATA.modules));
    }

    // Audit logs
    if (!localStorage.getItem(this.AUDIT_KEY)) {
      const initialLogs = [
        {
          id: 'log-seed-1',
          timestamp: '09/10/2026, 09:00 AM',
          category: 'Account Management',
          action: 'System Initialized',
          details: 'NutriLearn system initialized for Barangay Manguiring',
          performedBy: 'Municipal Health Office',
          userRole: 'mho'
        }
      ];
      localStorage.setItem(this.AUDIT_KEY, JSON.stringify(initialLogs));
    }

    // Parent Cohort Groups for Manguiring
    if (!localStorage.getItem(this.GROUPS_KEY)) {
      const initialGroups = [
        {
          id: 'grp-1',
          name: 'Barangay Manguiring - First 1,000 Days Cohort',
          barangay: 'Barangay Manguiring',
          targetCategory: 'Infant Feeding & Complementary Foods',
          facilitator: 'Community Health Worker, BNS',
          assignedModules: ['mod-1', 'mod-2', 'mod-3'],
          enrolledChildIds: ['ch-117', 'ch-118'],
          adviceNotes: 'Meet every 2nd Tuesday for anthropometric tracking and Pinggang Pinoy cooking demo.',
          createdAt: '2026-09-01'
        }
      ];
      localStorage.setItem(this.GROUPS_KEY, JSON.stringify(initialGroups));
    }

    // Announcements for Manguiring
    const currentAnn = localStorage.getItem(this.ANNOUNCEMENTS_KEY);
    if (!currentAnn || !currentAnn.includes('Community Nutrition Seminar')) {
      localStorage.setItem(this.ANNOUNCEMENTS_KEY, JSON.stringify(NUTRI_DATA.initialAnnouncements || []));
    }

    // Initialize registered users array with seed users if not already present or missing seed users
    const currentUsers = localStorage.getItem(this.USERS_KEY);
    if (!currentUsers || !currentUsers.includes('Nurse Ana Reyes')) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(NUTRI_DATA.initialUsers || []));
    }

    // Initialize "Try It at Home" self-reported practical submissions
    if (!localStorage.getItem(this.TRY_HOME_KEY)) {
      localStorage.setItem(this.TRY_HOME_KEY, JSON.stringify(NUTRI_DATA.initialTryHomeSubmissions || []));
    }

    // Initialize Parent/Guardian Groups Tracker (BHW Phase exact design specification)
    if (!localStorage.getItem(this.PARENT_GROUPS_TRACKER_KEY)) {
      localStorage.setItem(this.PARENT_GROUPS_TRACKER_KEY, JSON.stringify(NUTRI_DATA.initialParentGuardianGroups || []));
    }
  },

  // ==========================================================================
  // PARENT/GUARDIAN GROUPS TRACKER (BHW Phase Specification)
  // ==========================================================================
  getParentGroupsTracker() {
    try {
      const data = localStorage.getItem(this.PARENT_GROUPS_TRACKER_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return NUTRI_DATA.initialParentGuardianGroups || [];
    } catch (e) {
      console.error('Error reading parent groups tracker:', e);
      return NUTRI_DATA.initialParentGuardianGroups || [];
    }
  },

  saveParentGroupsTracker(records) {
    try {
      localStorage.setItem(this.PARENT_GROUPS_TRACKER_KEY, JSON.stringify(records));
      return true;
    } catch (e) {
      console.error('Error saving parent groups tracker:', e);
      return false;
    }
  },

  updateParentGroupItem(id, updates) {
    try {
      const records = this.getParentGroupsTracker();
      const idx = records.findIndex(r => r.id === id);
      if (idx !== -1) {
        records[idx] = { ...records[idx], ...updates };
        this.saveParentGroupsTracker(records);
        return records[idx];
      }
      return null;
    } catch (e) {
      console.error('Error updating parent group item:', e);
      return null;
    }
  },

  addParentGroupItem(item) {
    try {
      const records = this.getParentGroupsTracker();
      const newItem = {
        id: item.id || `pgg-${Date.now()}`,
        parentName: item.parentName || 'Parent Name',
        parentPhone: item.parentPhone || '',
        barangay: item.barangay || 'Barangay Manguring',
        zone: item.zone || 'Zone 1',
        childName: item.childName || 'Child',
        childAgeMonths: item.childAgeMonths || 12,
        status: item.status || 'Stable',
        actionsTried: item.actionsTried || 0,
        actionsTotal: item.actionsTotal || 5,
        progressPct: item.progressPct !== undefined ? item.progressPct : Math.round(((item.actionsTried || 0) / (item.actionsTotal || 5)) * 100),
        lastActive: item.lastActive || 'Today',
        lastActiveDate: new Date().toISOString().split('T')[0],
        actionsList: item.actionsList || [
          { title: 'Enriched Lugaw with Malunggay & Egg', tried: false, date: null },
          { title: 'Boiled safe drinking water & WASH protocol', tried: false, date: null },
          { title: 'Responsive positive feeding', tried: false, date: null },
          { title: 'Daily Animal Protein (Fish/Egg)', tried: false, date: null },
          { title: 'Affordable Kamote Puree', tried: false, date: null }
        ],
        notes: item.notes || ''
      };
      records.unshift(newItem);
      this.saveParentGroupsTracker(records);
      return newItem;
    } catch (e) {
      console.error('Error adding parent group item:', e);
      return null;
    }
  },

  // ==========================================================================
  // "TRY IT AT HOME" PRACTICAL FEEDING ACTION SUBMISSIONS
  // (Nabugoomu, 2015; Kuchenbecker et al., 2017)
  // ==========================================================================
  getTryHomeSubmissions(filterBarangay = null) {
    try {
      const data = localStorage.getItem(this.TRY_HOME_KEY);
      let subs = data ? JSON.parse(data) : (NUTRI_DATA.initialTryHomeSubmissions || []);
      if (filterBarangay && filterBarangay !== 'ALL') {
        subs = subs.filter(s => s.barangay === filterBarangay);
      }
      return subs;
    } catch (e) {
      console.error('Error fetching try home submissions:', e);
      return [];
    }
  },

  saveTryHomeSubmissions(submissions) {
    localStorage.setItem(this.TRY_HOME_KEY, JSON.stringify(submissions));
  },

  addTryHomeSubmission(submission) {
    const subs = this.getTryHomeSubmissions();
    submission.id = submission.id || ('sub-' + Date.now());
    submission.dateSubmitted = submission.dateSubmitted || new Date().toISOString().split('T')[0];
    submission.timeSubmitted = submission.timeSubmitted || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    submission.evaluationStatus = submission.evaluationStatus || 'Pending Review';
    subs.unshift(submission);
    this.saveTryHomeSubmissions(subs);

    this.logAudit(
      'Feeding Action Self-Reported',
      'Try It at Home Activity',
      `Parent ${submission.parentName || 'Parent'} submitted feeding practice: "${submission.actionTitle}" for child ${submission.childName || 'Child'} (${submission.barangay || 'Community'})`,
      { name: submission.parentName || 'Parent', role: 'parent' }
    );
    return submission;
  },

  evaluateTryHomeSubmission(submissionId, bhwFeedback, evaluationStatus = 'Evaluated', evaluatedBy = 'Barangay Health Worker') {
    const subs = this.getTryHomeSubmissions();
    const item = subs.find(s => s.id === submissionId);
    if (!item) return false;

    item.bhwFeedback = bhwFeedback;
    item.evaluationStatus = evaluationStatus;
    item.evaluatedBy = evaluatedBy;
    item.evaluatedAt = new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    this.saveTryHomeSubmissions(subs);

    this.logAudit(
      'Feeding Practice Evaluated',
      'Try It at Home Activity',
      `BHW evaluated submission "${item.actionTitle}" for ${item.childName}: "${bhwFeedback.substring(0, 50)}..."`,
      { name: evaluatedBy, role: 'chw' }
    );
    return item;
  },

  // ==========================================================================
  // AUDIT AND ADMINISTRATION DATA (Data Requirements #10)
  // Account changes, content updates, report generation, and administrative actions
  // ==========================================================================
  getAuditLogs() {
    try {
      const data = localStorage.getItem(this.AUDIT_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  logAudit(action, category, details, user) {
    try {
      const logs = this.getAuditLogs();
      const currentUser = typeof user === 'string'
        ? { name: user, role: 'user' }
        : (user || this.getCurrentUser() || { name: 'Administrator', role: 'mho' });
      
      const now = new Date();
      const datePart = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
      const timePart = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
      const fullTimestamp = `${datePart}, ${timePart}`;

      const newLog = {
        id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        timestamp: fullTimestamp,
        date: datePart,
        time: timePart,
        category: category || 'General Activity',
        action: action,
        details: details || '-',
        performedBy: currentUser.name || 'Administrator',
        userRole: (currentUser.role || 'mho').toLowerCase()
      };
      logs.unshift(newLog);
      if (logs.length > 500) logs.pop(); // Retain up to 500 comprehensive activity logs
      localStorage.setItem(this.AUDIT_KEY, JSON.stringify(logs));
      return newLog;
    } catch (e) {
      console.warn('Audit logging failed:', e);
    }
  },

  clearAuditLogs() {
    localStorage.setItem(this.AUDIT_KEY, JSON.stringify([]));
  },

  // ==========================================================================
  // BARANGAYS MASTER REGISTRY MANAGEMENT
  // ==========================================================================
  getBarangays() {
    try {
      const data = localStorage.getItem(this.BARANGAYS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If cached list contains the old 5 dummy barangays (San Jose, Santa Maria, etc.), reset to single official Barangay Manguiring
          const hasOldDummies = parsed.some(b => b && (b.name === 'Barangay San Jose' || b.name === 'Barangay Santa Maria' || b.name === 'Barangay San Isidro'));
          if (hasOldDummies) {
            const clean = [{ id: 'brgy-1', name: 'Barangay Manguiring', createdAt: '2026-08-01' }];
            localStorage.setItem(this.BARANGAYS_KEY, JSON.stringify(clean));
            return clean;
          }
          return parsed;
        }
      }
    } catch (e) {}
    const defaultBrgys = [
      { id: 'brgy-1', name: 'Barangay Manguiring', createdAt: '2026-08-01' }
    ];
    localStorage.setItem(this.BARANGAYS_KEY, JSON.stringify(defaultBrgys));
    return defaultBrgys;
  },

  getBarangayNames() {
    return this.getBarangays().map(b => b.name);
  },

  saveBarangays(list) {
    localStorage.setItem(this.BARANGAYS_KEY, JSON.stringify(list));
    this.populateAllBarangayDropdowns();
  },

  addBarangay(name, zones) {
    const trimmed = (name || '').trim();
    if (!trimmed) throw new Error('Pakiusap ilagay ang wastong pangalan ng Barangay.');

    const list = this.getBarangays();
    const exists = list.some(b => (b.name || '').toLowerCase() === trimmed.toLowerCase());
    if (exists) throw new Error(`Ang "${trimmed}" ay nakarehistro na sa sistema.`);

    const newBrgy = {
      id: 'brgy-' + Date.now(),
      name: trimmed,
      zones: zones ? zones.trim() : '',
      createdAt: new Date().toISOString().split('T')[0]
    };
    list.push(newBrgy);
    this.saveBarangays(list);

    this.logAudit(
      'Barangay Added',
      'Account Management',
      `Administrator registered new official barangay: "${trimmed}"${zones ? ` (${zones})` : ''}. Now available for Parent/BHW account creation and field monitoring.`,
      'Administrator'
    );

    // Sync to backend if api is available
    if (window.NutriApi && typeof window.NutriApi.saveBarangay === 'function') {
      window.NutriApi.saveBarangay(newBrgy).catch(e => console.warn(e));
    } else {
      fetch('/api/barangays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBrgy)
      }).catch(e => console.warn('Sync /api/barangays:', e));
    }

    return newBrgy;
  },

  updateBarangay(id, newName) {
    const trimmed = (newName || '').trim();
    if (!trimmed) throw new Error('Pakiusap ilagay ang bagong pangalan ng Barangay.');

    const list = this.getBarangays();
    const index = list.findIndex(b => String(b.id) === String(id));
    if (index === -1) throw new Error('Hindi natagpuan ang barangay sa database.');

    const oldName = list[index].name;

    // Duplicate check
    const duplicate = list.some((b, i) => i !== index && (b.name || '').toLowerCase() === trimmed.toLowerCase());
    if (duplicate) throw new Error(`Mayroon nang ibang Barangay na may pangalang "${trimmed}".`);

    list[index].name = trimmed;
    this.saveBarangays(list);

    // CASCADE RENAME: Update all children, users, reports, announcements
    if (oldName !== trimmed) {
      // 1. Children
      const children = this.getChildren();
      let childrenUpdated = false;
      children.forEach(c => {
        if ((c.barangay || '').trim() === oldName) {
          c.barangay = trimmed;
          childrenUpdated = true;
        }
      });
      if (childrenUpdated) this.saveChildren(children);

      // 2. Users
      const users = this.getUsers();
      let usersUpdated = false;
      users.forEach(u => {
        if ((u.barangay || '').trim() === oldName) {
          u.barangay = trimmed;
          usersUpdated = true;
        }
      });
      if (usersUpdated) localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

      // 3. Current User
      const currentUser = this.getCurrentUser();
      if (currentUser && (currentUser.barangay || '').trim() === oldName) {
        currentUser.barangay = trimmed;
        this.setCurrentUser(currentUser);
      }

      // 4. Reports
      const reports = this.getReports();
      let reportsUpdated = false;
      reports.forEach(r => {
        if ((r.barangay || '').trim() === oldName) {
          r.barangay = trimmed;
          reportsUpdated = true;
        }
      });
      if (reportsUpdated) this.saveReports(reports);

      // 5. Parent Groups
      try {
        const groups = JSON.parse(localStorage.getItem(this.GROUPS_KEY) || '[]');
        let groupsUpdated = false;
        groups.forEach(g => {
          if ((g.barangay || '').trim() === oldName) {
            g.barangay = trimmed;
            groupsUpdated = true;
          }
        });
        if (groupsUpdated) localStorage.setItem(this.GROUPS_KEY, JSON.stringify(groups));
      } catch (e) {}

      // 6. If Admin's active barangay was oldName, update it
      if (window.MHODashboard && window.MHODashboard.selectedBarangay === oldName) {
        window.MHODashboard.selectedBarangay = trimmed;
      }
    }

    this.logAudit(
      'Barangay Renamed',
      'Account Management',
      `Administrator renamed official barangay from "${oldName}" to "${trimmed}". All associated children, users, and reports were synchronized.`,
      'Administrator'
    );

    return list[index];
  },

  deleteBarangay(id) {
    let list = this.getBarangays();
    const target = list.find(b => String(b.id) === String(id));
    if (!target) throw new Error('Hindi natagpuan ang barangay.');

    if (list.length <= 1) {
      throw new Error('Hindi maaaring tanggalin ang huling natitirang Barangay.');
    }

    list = list.filter(b => String(b.id) !== String(id));
    this.saveBarangays(list);

    if (window.MHODashboard && window.MHODashboard.selectedBarangay === target.name) {
      window.MHODashboard.setSelectedBarangay('ALL');
    }

    this.logAudit(
      'Barangay Removed',
      'Account Management',
      `Administrator removed barangay "${target.name}" from active registry.`,
      'Administrator'
    );

    return true;
  },

  // Populate ALL Barangay dropdowns across the whole DOM
  populateAllBarangayDropdowns() {
    const barangays = this.getBarangays();
    const names = barangays.map(b => b.name);

    // 1. Select elements that include "ALL" option
    const filterSelectors = [
      '#admin-global-barangay-select',
      '#admin-records-barangay-filter',
      '#admin-ann-barangay-filter',
      '#mho-compliance-barangay-filter'
    ];

    filterSelectors.forEach(selector => {
      const el = document.querySelector(selector);
      if (!el) return;
      const currentVal = el.value || 'ALL';
      let html = '<option value="ALL">🌐 Lahat ng Barangay</option>';
      names.forEach(name => {
        html += `<option value="${name}">${name}</option>`;
      });
      el.innerHTML = html;
      if (currentVal === 'ALL' || names.includes(currentVal)) {
        el.value = currentVal;
      } else {
        el.value = 'ALL';
      }
    });

    // 2. Select elements that require a specific Barangay (Registration, Child data, Users, etc.)
    const specificSelectors = [
      '#reg-barangay-input',             // Main Signup Screen (Parent/BHW)
      '#reg-barangay-select',            // Secondary ID if used
      'select[name="regBarangay"]',      // Parent modal
      'select[name="regBhwBarangay"]',   // BHW modal
      'select[name="childBarangay"]',    // Child add modal
      'select[name="adminUserBarangay"]',// Admin user create modal
      'select[name="accBarangay"]',      // Account settings modal
      'select[name="groupBarangay"]',    // Parent groups modal
      '#report-barangay-select'          // Submit report modal
    ];

    specificSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        const currentVal = el.value;
        let html = '';
        names.forEach(name => {
          html += `<option value="${name}">${name}</option>`;
        });
        el.innerHTML = html;
        if (names.includes(currentVal)) {
          el.value = currentVal;
        } else if (names.length > 0) {
          el.value = names[0];
        }
      });
    });

    // 3. Update announcements composer checkbox grid if open or rendered
    if (window.AnnouncementsModule && typeof window.AnnouncementsModule.renderBarangayCheckboxes === 'function') {
      window.AnnouncementsModule.renderBarangayCheckboxes();
    }
  },

  // User Authentication & Management
  getCurrentUser() {
    try {
      const data = localStorage.getItem(this.CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.CURRENT_USER_KEY);
    }
  },

  getUsers() {
    try {
      const data = localStorage.getItem(this.USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  registerUser(userData) {
    const users = this.getUsers();
    userData.id = userData.id || ('usr-' + Date.now());
    userData.status = userData.status || 'Active';
    userData.registeredDate = userData.registeredDate || new Date().toISOString().split('T')[0];
    if (!userData.initials && userData.name) {
      userData.initials = this.calculateInitials(userData.name);
    }

    const existingIdx = users.findIndex(u => 
      u.id === userData.id || 
      (u.email && userData.email && u.email.toLowerCase() === userData.email.toLowerCase())
    );

    if (existingIdx !== -1) {
      users[existingIdx] = { ...users[existingIdx], ...userData };
    } else {
      users.push(userData);
    }

    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    this.setCurrentUser(userData);
    this.logAudit('User Account Created', 'Account Management', `Registered account for ${userData.name} (${userData.role ? userData.role.toUpperCase() : 'USER'})`);

    // Live sync to backend API if available
    if (window.NutriApi && typeof NutriApi.saveUser === 'function') {
      NutriApi.saveUser(userData);
    }

    return userData;
  },

  updateUser(updatedUser) {
    if (!updatedUser) return null;
    let users = this.getUsers();
    if (!updatedUser.id) {
      updatedUser.id = 'usr-' + Date.now();
    }
    if (updatedUser.name) {
      updatedUser.initials = this.calculateInitials(updatedUser.name);
    }
    const idx = users.findIndex(u => 
      u.id === updatedUser.id || 
      (u.email && updatedUser.email && u.email.toLowerCase() === updatedUser.email.toLowerCase())
    );
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updatedUser };
    } else {
      users.push(updatedUser);
    }
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    const savedUser = idx !== -1 ? users[idx] : updatedUser;
    this.setCurrentUser(savedUser);
    this.logAudit('User Account Updated', 'Account Management', `Updated profile/credentials for ${savedUser.name} (${savedUser.role})`);
    return savedUser;
  },

  deleteUser(userId) {
    let users = this.getUsers();
    const target = users.find(u => u.id === userId);
    users = users.filter(u => u.id !== userId);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    const current = this.getCurrentUser();
    if (current && current.id === userId) {
      this.setCurrentUser(null);
    }
    this.logAudit('User Account Deleted', 'Account Management', `Removed account ${target ? target.name : userId} from system`);
  },

  toggleUserStatus(userId) {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.status = user.status === 'Active' ? 'Inactive' : 'Active';
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      this.logAudit('Access Status Changed', 'Security & Access', `Account status for ${user.name} changed to ${user.status}`);
      return user.status;
    }
    return null;
  },

  // ==========================================================================
  // REAL-TIME USER ONLINE PRESENCE SYSTEM
  // ==========================================================================
  ONLINE_PRESENCE_KEY: 'nutrilearn_online_presence',

  getOnlinePresenceMap() {
    try {
      const data = localStorage.getItem(this.ONLINE_PRESENCE_KEY);
      if (data) return JSON.parse(data);
    } catch(e) {}
    // Initial active users in system
    const defaultOnline = {
      'usr-1': true, // Nurse Ana Reyes
      'usr-2': true  // Maria Santos
    };
    localStorage.setItem(this.ONLINE_PRESENCE_KEY, JSON.stringify(defaultOnline));
    return defaultOnline;
  },

  isUserOnline(userId) {
    if (!userId) return false;
    const current = this.getCurrentUser();
    if (current && (String(current.id) === String(userId) || current.email === userId)) {
      return true;
    }
    const map = this.getOnlinePresenceMap();
    return !!map[userId];
  },

  setUserOnlinePresence(userId, isOnline) {
    const map = this.getOnlinePresenceMap();
    map[userId] = !!isOnline;
    localStorage.setItem(this.ONLINE_PRESENCE_KEY, JSON.stringify(map));
  },

  touchHeartbeat() {
    const current = this.getCurrentUser();
    if (current && current.id) {
      this.setUserOnlinePresence(current.id, true);
    }
  },

  // Helper to format clean display name from user input
  formatDisplayName(input) {
    if (!input) return 'User';
    let str = input.trim();
    if (str.includes('@')) {
      str = str.split('@')[0].replace(/[._\-+]/g, ' ');
    }
    // Capitalize words
    return str.split(/\s+/).filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  },

  // Helper to calculate 2-letter initials (e.g. "Mark Anthony" -> "MA")
  calculateInitials(name) {
    if (!name) return 'U';
    const clean = name.replace(/^Dr\.\s*/i, '').trim();
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    if (parts.length === 1) {
      return parts[0].substring(0, Math.min(2, parts[0].length)).toUpperCase();
    }
    return 'U';
  },

  loginUser(emailOrName, password, role) {
    const users = this.getUsers();
    const rawInput = (emailOrName || '').trim();
    const isFil = window.NutriI18n && NutriI18n.currentLang === 'fil';

    if (!rawInput) {
      return {
        success: false,
        message: isFil ? 'Pakilagay ang email o username.' : 'Please enter your email or username.'
      };
    }

    const query = rawInput.toLowerCase();

    // 1. Strict verification: Check if an account was actually created/registered
    const matchedUser = users.find(u => 
      (u.email && u.email.toLowerCase() === query) ||
      (u.name && u.name.toLowerCase() === query)
    );

    // If the account does not exist in registered accounts, reject login
    if (!matchedUser) {
      return {
        success: false,
        message: isFil
          ? '⛔ Walang nahanap na account. Ang mga nakapag-create lamang ng account ang maaaring mag-log in. Pindutin ang "Register here" para gumawa ng account.'
          : '⛔ No account found. Only users who have created an account can sign in. Please click "Register here" to create an account.'
      };
    }

    // 2. Strict password validation
    if (matchedUser.password !== password) {
      return {
        success: false,
        message: isFil
          ? '🔑 Maling password. Pakisubukang muli.'
          : '🔑 Incorrect password. Please try again.'
      };
    }

    // 3. Status check: Ensure account is not suspended
    if (matchedUser.status === 'Suspended') {
      return {
        success: false,
        message: isFil
          ? '⛔ Account Suspended: Ang iyong access ay pansamantalang sinuspinde ng Administrator. Makipag-ugnayan sa Municipal Health Office.'
          : '⛔ Account Suspended: Your access has been temporarily restricted by the Administrator. Please contact the Municipal Health Office.'
      };
    }

    // 4. Role match validation against chosen portal
    if (role && matchedUser.role !== role && !(role === 'chw' && matchedUser.role === 'collector')) {
      const roleLabels = isFil ? {
        parent: 'Magulang / Tagapag-alaga (Parent)',
        chw: 'Manggagawa sa Kalusugan (BHW)',
        mho: 'Administrator (MHO)',
        collector: 'Tagakolekta ng Datos'
      } : {
        parent: 'Parent / Guardian',
        chw: 'Health Worker (BHW)',
        mho: 'Administrator',
        collector: 'Field Data Collector'
      };
      const assignedRole = roleLabels[matchedUser.role] || matchedUser.role;
      return {
        success: false,
        message: isFil
          ? `⚠️ Ang account na ito ay nakarehistro bilang "${assignedRole}". Pakipili ang tamang portal para makapag-log in.`
          : `⚠️ This account is registered as "${assignedRole}". Please select the correct portal to sign in.`
      };
    }

    // 5. Successful authentication
    if (!matchedUser.initials) {
      matchedUser.initials = this.calculateInitials(matchedUser.name);
    }
    this.setCurrentUser(matchedUser);
    this.logAudit(
      'User Login',
      'Security & Access',
      `User ${matchedUser.name} (${(matchedUser.role || '').toUpperCase()}) successfully logged in`,
      { name: matchedUser.name, role: matchedUser.role }
    );
    return { success: true, user: matchedUser };
  },

  // ==========================================================================
  // DYNAMIC NUTRITION MODULES & CONTENT MANAGEMENT (Req #11)
  // ==========================================================================
  getModules() {
    try {
      const parentData = localStorage.getItem('nutrilearn_parent_modules_data_v3');
      if (parentData) return JSON.parse(parentData);
      const data = localStorage.getItem(this.MODULES_KEY);
      return data ? JSON.parse(data) : (window.MHODashboard && typeof MHODashboard.getDefaultNutritionModules === 'function' ? MHODashboard.getDefaultNutritionModules() : NUTRI_DATA.modules);
    } catch (e) {
      return NUTRI_DATA.modules;
    }
  },

  saveModules(modules) {
    localStorage.setItem(this.MODULES_KEY, JSON.stringify(modules));
    localStorage.setItem('nutrilearn_parent_modules_data_v3', JSON.stringify(modules));
  },

  addModule(newModule) {
    const modules = this.getModules();
    newModule.id = newModule.id || ('mod-' + Date.now());
    newModule.number = newModule.number || `Module ${modules.length + 1}`;
    modules.push(newModule);
    this.saveModules(modules);
    this.logAudit('Module Created', 'Content & Curricula', `Created curriculum "${newModule.number}: ${newModule.title}"`);
    return newModule;
  },

  updateModule(updatedModule) {
    const modules = this.getModules();
    const idx = modules.findIndex(m => m.id === updatedModule.id);
    if (idx !== -1) {
      modules[idx] = { ...modules[idx], ...updatedModule };
      this.saveModules(modules);
      this.logAudit('Module Updated', 'Content & Curricula', `Updated curriculum "${updatedModule.number}: ${updatedModule.title}"`);
      return modules[idx];
    }
    return null;
  },

  deleteModule(moduleId) {
    let modules = this.getModules();
    const target = modules.find(m => m.id === moduleId);
    modules = modules.filter(m => m.id !== moduleId);
    this.saveModules(modules);
    this.logAudit('Module Deleted', 'Content & Curricula', `Deleted curriculum "${target ? target.title : moduleId}"`);
  },

  resetModules() {
    localStorage.setItem(this.MODULES_KEY, JSON.stringify(NUTRI_DATA.modules));
    this.logAudit('Curricula Reset', 'Content & Curricula', 'Restored default WHO & PPAN 5-module standard curricula');
    return NUTRI_DATA.modules;
  },

  // ==========================================================================
  // PARENT GROUPS & COHORT MANAGEMENT (Req #8)
  // ==========================================================================
  getGroups() {
    try {
      const data = localStorage.getItem(this.GROUPS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveGroups(groups) {
    localStorage.setItem(this.GROUPS_KEY, JSON.stringify(groups));
  },

  addGroup(group) {
    const groups = this.getGroups();
    group.id = group.id || ('grp-' + Date.now());
    group.createdAt = group.createdAt || new Date().toISOString().split('T')[0];
    group.enrolledChildIds = group.enrolledChildIds || [];
    group.assignedModules = group.assignedModules || ['mod-1', 'mod-3'];
    groups.unshift(group);
    this.saveGroups(groups);
    this.logAudit('Parent Group Created', 'Group & Instruction', `Organized "${group.name}" for ${group.barangay}`);
    return group;
  },

  updateGroup(updatedGroup) {
    const groups = this.getGroups();
    const idx = groups.findIndex(g => g.id === updatedGroup.id);
    if (idx !== -1) {
      groups[idx] = { ...groups[idx], ...updatedGroup };
      this.saveGroups(groups);
      this.logAudit('Parent Group Updated', 'Group & Instruction', `Updated cohort "${updatedGroup.name}" (${(updatedGroup.enrolledChildIds || []).length} children)`);
      return groups[idx];
    }
    return null;
  },

  deleteGroup(groupId) {
    let groups = this.getGroups();
    const target = groups.find(g => g.id === groupId);
    groups = groups.filter(g => g.id !== groupId);
    this.saveGroups(groups);
    this.logAudit('Parent Group Deleted', 'Group & Instruction', `Disbanded cohort "${target ? target.name : groupId}"`);
  },

  // Children Registry CRUD
  getChildren() {
    try {
      const data = localStorage.getItem(this.CHILDREN_KEY);
      return data ? JSON.parse(data) : NUTRI_DATA.initialChildren;
    } catch (e) {
      console.error('Failed to load children records', e);
      return NUTRI_DATA.initialChildren;
    }
  },

  saveChildren(children) {
    localStorage.setItem(this.CHILDREN_KEY, JSON.stringify(children));
  },

  addChild(child) {
    const children = this.getChildren();
    child.id = child.id || ('ch-' + Date.now());
    child.lastAssessed = child.lastAssessed || new Date().toISOString().split('T')[0];
    children.unshift(child);
    this.saveChildren(children);

    // Record audit trail
    this.logAudit(
      'Child Record Created',
      'Field Health Record',
      `Registered child ${child.name} (${child.ageMonths} mos, ${child.sex}, ${child.heightCm}cm, ${child.weightKg}kg, Status: ${child.status}) for ${child.parentName || 'Parent'} (${child.barangay || 'Community'})`,
      child.parentName ? { name: child.parentName, role: 'parent' } : null
    );

    // Live sync to FastAPI Backend (Render/Local)
    if (window.NutriApi && window.NutriApi.isAvailable) {
      window.NutriApi.saveChild(child).catch(e => console.warn('NutriApi save error:', e));
    }
    // Live sync to Supabase Cloud
    if (window.NutriDb && typeof window.NutriDb.saveChild === 'function' && window.NutriDb.isConfigured()) {
      window.NutriDb.saveChild(child).catch(e => console.warn('Supabase save error:', e));
    }
    if (window.ParentModule && typeof ParentModule.renderChildGrowth === 'function') {
      ParentModule.renderChildGrowth();
    }
    return child;
  },

  updateChild(updatedChild) {
    const children = this.getChildren();
    const index = children.findIndex(c => String(c.id) === String(updatedChild.id));
    if (index !== -1) {
      const prev = children[index];
      children[index] = { ...children[index], ...updatedChild, lastAssessed: new Date().toISOString().split('T')[0] };
      this.saveChildren(children);

      // Record audit trail
      this.logAudit(
        'Child Details / Growth Updated',
        'Field Health Record',
        `Updated growth measurements for ${children[index].name}: Height ${children[index].heightCm}cm, Weight ${children[index].weightKg}kg, Status: ${children[index].status}${children[index].muacMm ? `, MUAC ${children[index].muacMm}mm` : ''}`,
        'Barangay Health Worker'
      );

      // Live sync to FastAPI Backend
      if (window.NutriApi && window.NutriApi.isAvailable) {
        window.NutriApi.updateChild(children[index]).catch(e => console.warn('NutriApi update error:', e));
      }
      // Live sync to Supabase Cloud
      if (window.NutriDb && typeof window.NutriDb.updateChild === 'function' && window.NutriDb.isConfigured()) {
        window.NutriDb.updateChild(children[index]).catch(e => console.warn('Supabase update error:', e));
      }
      if (window.ParentModule && typeof ParentModule.renderChildGrowth === 'function') {
        ParentModule.renderChildGrowth();
      }
      return true;
    }
    return false;
  },

  deleteChild(childId) {
    let children = this.getChildren();
    const target = children.find(c => String(c.id) === String(childId));
    children = children.filter(c => String(c.id) !== String(childId));
    this.saveChildren(children);
    this.logAudit(
      'Child Record Removed',
      'Field Health Record',
      `Deleted child record ${target ? target.name : childId} from the health registry`,
      'Administrator'
    );
    // Live sync to FastAPI Backend
    if (window.NutriApi && window.NutriApi.isAvailable) {
      window.NutriApi.deleteChild(childId).catch(e => console.warn('NutriApi delete error:', e));
    }
    // Live sync to Supabase Cloud
    if (window.NutriDb && typeof window.NutriDb.deleteChild === 'function' && window.NutriDb.isConfigured()) {
      window.NutriDb.deleteChild(childId).catch(e => console.warn('Supabase delete error:', e));
    }
    return true;
  },

  // Submitted Reports
  getReports() {
    try {
      const data = localStorage.getItem(this.REPORTS_KEY);
      return data ? JSON.parse(data) : NUTRI_DATA.initialReports;
    } catch (e) {
      return NUTRI_DATA.initialReports;
    }
  },

  saveReports(reports) {
    localStorage.setItem(this.REPORTS_KEY, JSON.stringify(reports));
  },

  submitReport(report) {
    const reports = this.getReports();
    report.reportId = report.reportId || ('REP-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000));
    report.submittedDate = report.submittedDate || new Date().toISOString().split('T')[0];
    report.status = report.status || 'Pending Review';
    reports.unshift(report);
    this.saveReports(reports);

    this.logAudit('Report Submitted', 'Report & Endorsement', `Submitted report ${report.reportId} for ${report.barangay} (${report.totalChildren} assessed)`);

    // Live sync to FastAPI Backend
    if (window.NutriApi && window.NutriApi.isAvailable) {
      window.NutriApi.submitReport(report).catch(e => console.warn('NutriApi report submit error:', e));
    }
    // Live sync to Supabase Cloud
    if (window.NutriDb && typeof window.NutriDb.submitReport === 'function' && window.NutriDb.isConfigured()) {
      window.NutriDb.submitReport(report).catch(e => console.warn('Supabase report submit error:', e));
    }
    return report;
  },

  // Parent Progress
  getParentProgress() {
    try {
      const data = localStorage.getItem(this.USER_PROGRESS_KEY);
      return data ? JSON.parse(data) : { completedModules: [], quizScores: {} };
    } catch (e) {
      return { completedModules: [], quizScores: {} };
    }
  },

  saveParentProgress(progress) {
    localStorage.setItem(this.USER_PROGRESS_KEY, JSON.stringify(progress));
  },

  // Announcements CRUD & Role-Based Audience Filtering
  getAnnouncements() {
    try {
      const data = localStorage.getItem(this.ANNOUNCEMENTS_KEY);
      return data ? JSON.parse(data) : (NUTRI_DATA.initialAnnouncements || []);
    } catch (e) {
      return NUTRI_DATA.initialAnnouncements || [];
    }
  },

  saveAnnouncements(list) {
    localStorage.setItem(this.ANNOUNCEMENTS_KEY, JSON.stringify(list));
  },

  addAnnouncement(post) {
    const list = this.getAnnouncements();
    post.id = post.id || ('ann-' + Date.now());
    post.createdAt = post.createdAt || new Date().toISOString();
    list.unshift(post);
    this.saveAnnouncements(list);

    // Live sync to FastAPI Backend
    if (window.NutriApi && window.NutriApi.isAvailable) {
      window.NutriApi.createAnnouncement(post).catch(e => console.warn('NutriApi announcement submit error:', e));
    }
    // Live sync to Supabase Cloud
    if (window.NutriDb && typeof window.NutriDb.createAnnouncement === 'function' && window.NutriDb.isConfigured()) {
      window.NutriDb.createAnnouncement(post).catch(e => console.warn('Supabase announcement submit error:', e));
    }
    return post;
  },

  deleteAnnouncement(id) {
    let list = this.getAnnouncements();
    list = list.filter(a => String(a.id) !== String(id));
    this.saveAnnouncements(list);

    if (window.NutriApi && window.NutriApi.isAvailable) {
      window.NutriApi.deleteAnnouncement(id).catch(e => console.warn('NutriApi delete announcement error:', e));
    }
    return true;
  },

  updateAnnouncement(updatedPost) {
    let list = this.getAnnouncements();
    const idx = list.findIndex(a => String(a.id) === String(updatedPost.id));
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updatedPost };
      this.saveAnnouncements(list);
      if (window.NutriApi && window.NutriApi.isAvailable) {
        window.NutriApi.createAnnouncement(list[idx]).catch(e => console.warn('NutriApi announcement update error:', e));
      }
      return list[idx];
    }
    return null;
  },

  // Bidirectional Cloud Synchronization
  async syncWithSupabase() {
    if (!window.NutriDb || !window.NutriDb.isConfigured()) return;

    try {
      console.log('🔄 [NutriStorage] Checking live data from Supabase...');
      const [cloudChildren, cloudReports, cloudAnnouncements] = await Promise.all([
        window.NutriDb.getChildren(),
        window.NutriDb.getReports(),
        window.NutriDb.getAnnouncements()
      ]);

      let hasNewData = false;

      if (cloudChildren && cloudChildren.length > 0) {
        this.saveChildren(cloudChildren);
        hasNewData = true;
      }
      if (cloudReports && cloudReports.length > 0) {
        this.saveReports(cloudReports);
        hasNewData = true;
      }
      if (cloudAnnouncements && cloudAnnouncements.length > 0) {
        this.saveAnnouncements(cloudAnnouncements);
        hasNewData = true;
      }

      if (hasNewData) {
        if (window.CHWModule && typeof CHWModule.renderRegistryTable === 'function') {
          CHWModule.renderRegistryTable();
          CHWModule.updateStatsBar();
        }
        if (window.MHODashboard && typeof MHODashboard.init === 'function') {
          MHODashboard.init();
        }
        if (window.AnnouncementsModule && typeof AnnouncementsModule.renderAllFeeds === 'function') {
          AnnouncementsModule.renderAllFeeds();
          AnnouncementsModule.renderDashboardWidgets();
        }
        if (window.ParentModule && typeof ParentModule.renderChildGrowth === 'function') {
          ParentModule.renderChildGrowth();
        }
      }

      // Synchronize registered user accounts from backend API
      if (window.NutriApi && typeof window.NutriApi.getUsers === 'function') {
        try {
          const apiUsers = await window.NutriApi.getUsers();
          if (Array.isArray(apiUsers) && apiUsers.length > 0) {
            const localUsers = this.getUsers();
            let merged = [...localUsers];
            let addedCount = 0;
            apiUsers.forEach(au => {
              if (!merged.some(lu => (lu.id && lu.id === au.id) || (lu.email && au.email && lu.email.toLowerCase() === au.email.toLowerCase()))) {
                merged.push(au);
                addedCount++;
              }
            });
            if (addedCount > 0) {
              localStorage.setItem(this.USERS_KEY, JSON.stringify(merged));
            }
          }
        } catch (uErr) {
          console.warn('API users sync warning:', uErr);
        }
      }

      console.log('✅ [NutriStorage] Cloud data synchronized successfully!');
    } catch (err) {
      console.warn('⚠️ [NutriStorage] Cloud sync note:', err.message);
    }
  },

  // Strict Audience & Barangay Isolation Filter per Role
  getAnnouncementsForRole(role) {
    const all = this.getAnnouncements();
    const currentUser = this.getCurrentUser();
    const userBarangay = currentUser?.barangay || 'Barangay Manguiring';

    if (role === 'parent') {
      // PARENTS can ONLY view announcements routed to Parents:
      // - Audience: 'both', 'admin_parent', or 'parent' (STRICTLY HIDDEN: 'bhw')
      // - Destination Barangay: must be 'All Barangays' or include user's barangay
      return all.filter(a => {
        const isAudience = (
          a.targetAudience === 'both' || 
          a.targetAudience === 'admin_parent' || 
          a.targetAudience === 'parent'
        );
        if (!isAudience) return false;

        // Barangay Destination match
        if (!a.targetBarangays || a.barangay === 'All Barangays' || a.targetBarangays.includes('ALL') || a.targetBarangays.length === 0) {
          return true;
        }
        return a.targetBarangays.includes(userBarangay) || a.barangay === userBarangay;
      });
    } else if (role === 'chw') {
      // BHWs can view all announcements where BHW is in the audience:
      // - Admin post: 'both' or 'bhw' (internal directive)
      // - BHW post: 'admin_parent' or 'parent' (their own / peer posts)
      // - Destination Barangay: must be 'All Barangays' or include BHW's assigned barangay
      return all.filter(a => {
        const isAudience = (
          a.targetAudience === 'both' || 
          a.targetAudience === 'bhw' || 
          a.targetAudience === 'admin_parent' || 
          a.targetAudience === 'parent' ||
          a.authorRole === 'chw'
        );
        if (!isAudience) return false;

        // BHW author always sees their own posts
        if (a.authorRole === 'chw') return true;

        if (!a.targetBarangays || a.barangay === 'All Barangays' || a.targetBarangays.includes('ALL') || a.targetBarangays.length === 0) {
          return true;
        }
        return a.targetBarangays.includes(userBarangay) || a.barangay === userBarangay;
      });
    } else if (role === 'mho') {
      // ADMIN can view all official Admin broadcasts and BHW broadcasts routed to Admin across all barangays
      return all.filter(a => 
        a.authorRole === 'mho' || 
        a.targetAudience === 'both' || 
        a.targetAudience === 'admin_parent' ||
        a.targetAudience === 'bhw'
      );
    }
    return all;
  }
};

// Export Utilities (CSV, Print, Downloads)
const NutriExport = {
  // Export Children Registry to CSV
  exportChildrenCSV() {
    const children = NutriStorage.getChildren();
    if (!children.length) {
      alert('No child records available to export.');
      return;
    }

    const headers = [
      'ID', 'Child Name', 'Age (Months)', 'Sex', 'Parent Name', 
      'Barangay', 'Height (cm)', 'Weight (kg)', 'MUAC (mm)', 
      'Overall Status', 'Height-for-Age', 'Weight-for-Height', 
      'MUAC Status', 'Improved Status', 'Last Assessed Date'
    ];

    const rows = children.map(c => [
      `"${c.id}"`,
      `"${c.name}"`,
      c.ageMonths,
      `"${c.sex}"`,
      `"${c.parentName}"`,
      `"${c.barangay}"`,
      c.heightCm,
      c.weightKg,
      c.muacMm,
      `"${c.status}"`,
      `"${c.hfaStatus || 'N/A'}"`,
      `"${c.wfhStatus || 'N/A'}"`,
      `"${c.muacStatus || 'N/A'}"`,
      c.improved ? '"Yes (Recovered)"' : '"Under Monitoring"',
      `"${c.lastAssessed}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NutriLearn_Child_Registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Export MHO Reports to CSV
  exportReportsCSV() {
    const reports = NutriStorage.getReports();
    const headers = [
      'Report ID', 'Barangay', 'Submitted By', 'Date',
      'Total Children', 'Stunted', 'Wasted', 'Underweight',
      'Improved', 'Stunting Rate', 'Status'
    ];

    const rows = reports.map(r => [
      `"${r.reportId}"`,
      `"${r.barangay}"`,
      `"${r.chwName}"`,
      `"${r.submittedDate}"`,
      r.totalChildren,
      r.stuntedCount,
      r.wastedCount,
      r.underweightCount,
      r.improvedCount,
      `"${r.stuntingRate}"`,
      `"${r.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NutriLearn_MHO_Reports_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Export Audit Logs to CSV (Data Requirements #10)
  exportAuditLogsCSV() {
    const logs = NutriStorage.getAuditLogs();
    if (!logs.length) {
      alert('No audit log entries available to export.');
      return;
    }

    const headers = ['Log ID', 'Timestamp', 'Category', 'Action Performed', 'Details / Scope', 'Performed By', 'User Role'];
    const rows = logs.map(l => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.category}"`,
      `"${l.action}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`,
      `"${l.performedBy}"`,
      `"${l.userRole}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NutriLearn_Audit_Log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Trigger browser print for official health reports
  printOfficialSummary() {
    window.print();
  }
};
