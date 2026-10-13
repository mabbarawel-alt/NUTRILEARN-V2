// ==========================================================================
// NUTRILEARN - ANNOUNCEMENT & BROADCAST MODULE
// Multi-Tiered Role Routing: Admin (Both Parent & BHW / BHW only)
// with Destination Barangay Selection (All Barangays vs Specific Barangays)
// BHW (Both Admin & Parent / Parent only), Parent (Read-only view)
// ==========================================================================

const AnnouncementsModule = {
  currentComposerRole: 'mho',
  activeParentCategoryFilter: 'ALL',
  activeBHWCategoryFilter: 'ALL',
  activeAdminCategoryFilter: 'ALL',
  activeAdminBarangayFilter: 'ALL',
  searchQueryParent: '',
  searchQueryBHW: '',
  searchQueryAdmin: '',

  init() {
    this.bindEvents();
    this.renderAllFeeds();
    this.renderDashboardWidgets();
  },

  bindEvents() {
    // Composer Form Submit
    const form = document.getElementById('announcement-composer-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handlePostSubmit(form);
      });
    }

    // Category Filter listeners
    const parentCatFilter = document.getElementById('parent-ann-category-filter');
    if (parentCatFilter) {
      parentCatFilter.addEventListener('change', (e) => {
        this.activeParentCategoryFilter = e.target.value;
        this.renderParentFeed();
      });
    }

    const bhwCatFilter = document.getElementById('bhw-ann-category-filter');
    if (bhwCatFilter) {
      bhwCatFilter.addEventListener('change', (e) => {
        this.activeBHWCategoryFilter = e.target.value;
        this.renderBHWFeed();
      });
    }

    const adminCatFilter = document.getElementById('admin-ann-category-filter');
    if (adminCatFilter) {
      adminCatFilter.addEventListener('change', (e) => {
        this.activeAdminCategoryFilter = e.target.value;
        this.renderAdminFeed();
      });
    }

    // Admin Barangay Filter listener
    const adminBrgyFilter = document.getElementById('admin-ann-barangay-filter');
    if (adminBrgyFilter) {
      adminBrgyFilter.addEventListener('change', (e) => {
        this.activeAdminBarangayFilter = e.target.value;
        this.renderAdminFeed();
      });
    }

    // Search listeners
    const parentSearch = document.getElementById('parent-ann-search-input');
    if (parentSearch) {
      parentSearch.addEventListener('input', (e) => {
        this.searchQueryParent = e.target.value.toLowerCase();
        this.renderParentFeed();
      });
    }

    const bhwSearch = document.getElementById('bhw-ann-search-input');
    if (bhwSearch) {
      bhwSearch.addEventListener('input', (e) => {
        this.searchQueryBHW = e.target.value.toLowerCase();
        this.renderBHWFeed();
      });
    }

    const adminSearch = document.getElementById('admin-ann-search-input');
    if (adminSearch) {
      adminSearch.addEventListener('input', (e) => {
        this.searchQueryAdmin = e.target.value.toLowerCase();
        this.renderAdminFeed();
      });
    }
  },

  // Open Composer Modal with Role-Specific Audience and Barangay Selectors or for Editing
  openComposer(role = null, editId = null) {
    if ((role === 'mho' || (!role && NutriApp.currentRole === 'mho')) && !editId) {
      this.showCreateView();
      return;
    }
    const activeRole = role || NutriApp.currentRole || 'mho';
    this.currentComposerRole = activeRole;

    const modalTitle = document.getElementById('ann-composer-modal-title');
    const modalSubtitle = document.getElementById('ann-composer-modal-subtitle');
    const audienceContainer = document.getElementById('ann-composer-audience-options');
    const authorBadge = document.getElementById('ann-composer-author-badge');
    const form = document.getElementById('announcement-composer-form');
    const submitBtn = document.getElementById('btn-submit-ann-composer');

    const currentUser = NutriStorage.getCurrentUser() || {};
    const authorName = currentUser.name || (activeRole === 'mho' ? 'Dr. Jose Lim' : 'Sister Teresa Lim, BNS');

    if (authorBadge) {
      authorBadge.textContent = `Posting as: ${authorName} (${activeRole === 'mho' ? 'Administrator' : 'Barangay Health Worker'})`;
    }

    if (activeRole === 'mho') {
      // Administrator Audience & Barangay Destination Routing
      if (modalTitle) modalTitle.textContent = editId ? '✏️ Edit Official Announcement' : '📢 Post Official Announcement';
      if (modalSubtitle) modalSubtitle.textContent = 'Municipal Health Office • Configure destination and event details';

      if (audienceContainer) {
        audienceContainer.innerHTML = `
          <!-- 1. Audience Selector -->
          <label class="form-label" style="font-weight: 700; color: var(--color-primary-900); display: block; margin-bottom: 0.5rem;">
            1. Select Target Recipient Group: <span style="color: #DC2626;">*</span>
          </label>
          <div class="audience-radio-grid">
            <label class="audience-radio-card active" onclick="AnnouncementsModule.selectRadioCard(this)">
              <input type="radio" name="annTargetAudience" value="both" checked style="accent-color: var(--color-primary-700);">
              <div class="audience-radio-content">
                <div class="audience-radio-title">📢 Both PARENT &amp; BHW</div>
                <div class="audience-radio-desc">Broadcasts to all registered Parents/Caregivers and BHWs in the selected barangays.</div>
              </div>
            </label>

            <label class="audience-radio-card" onclick="AnnouncementsModule.selectRadioCard(this)">
              <input type="radio" name="annTargetAudience" value="bhw" style="accent-color: var(--color-primary-700);">
              <div class="audience-radio-content">
                <div class="audience-radio-title">🔒 BHW Only (Internal Directive)</div>
                <div class="audience-radio-desc">Visible exclusively to Barangay Health Workers and BNS. Completely hidden from Parents.</div>
              </div>
            </label>
          </div>
        `;
      }
    } else if (activeRole === 'chw') {
      if (modalTitle) modalTitle.textContent = '📢 Post Barangay Health Announcement';
      if (modalSubtitle) modalSubtitle.textContent = 'Barangay Health Center • Select distribution destination before publishing';

      if (audienceContainer) {
        audienceContainer.innerHTML = `
          <label class="form-label" style="font-weight: 700; color: var(--color-primary-900); display: block; margin-bottom: 0.5rem;">
            1. Select Target Destination / Audience: <span style="color: #DC2626;">*</span>
          </label>
          <div class="audience-radio-grid">
            <label class="audience-radio-card active" onclick="AnnouncementsModule.selectRadioCard(this)">
              <input type="radio" name="annTargetAudience" value="admin_parent" checked style="accent-color: var(--color-primary-700);">
              <div class="audience-radio-content">
                <div class="audience-radio-title">🌐 Both ADMIN and PARENT</div>
                <div class="audience-radio-desc">Broadcasts to your community Parents and escalates directly to Municipal Health Office supervisors.</div>
              </div>
            </label>

            <label class="audience-radio-card" onclick="AnnouncementsModule.selectRadioCard(this)">
              <input type="radio" name="annTargetAudience" value="parent" style="accent-color: var(--color-primary-700);">
              <div class="audience-radio-content">
                <div class="audience-radio-title">👨‍👩‍👧 PARENT Only</div>
                <div class="audience-radio-desc">Community bulletin intended exclusively for local Parents and Caregivers in your barangay.</div>
              </div>
            </label>
          </div>
        `;
      }
    }

    // Populate for Editing or Reset for New
    if (form) {
      if (editId) {
        const posts = NutriStorage.getAnnouncements();
        const post = posts.find(p => String(p.id) === String(editId));
        if (post) {
          if (form.elements['annId']) form.elements['annId'].value = post.id;
          if (form.elements['annTitle']) form.elements['annTitle'].value = post.title || '';
          if (form.elements['annCategory']) form.elements['annCategory'].value = post.category || 'Seminar';
          if (form.elements['annTargetZones']) form.elements['annTargetZones'].value = post.targetZones || 'All Zones, Barangay Manguring';
          if (form.elements['annEventDate']) form.elements['annEventDate'].value = post.eventDate || '';
          if (form.elements['annRelayByDate']) form.elements['annRelayByDate'].value = post.relayByDate || '';
          if (form.elements['annEventTime']) form.elements['annEventTime'].value = post.eventTime || '';
          if (form.elements['annLocation']) form.elements['annLocation'].value = post.location || '';
          if (form.elements['annStatus']) form.elements['annStatus'].value = post.status || 'relayed';
          if (form.elements['annRelayedBy']) form.elements['annRelayedBy'].value = post.relayedBy || 'Nurse Ana Reyes';
          if (form.elements['annContent']) form.elements['annContent'].value = post.content || '';
          if (submitBtn) submitBtn.textContent = 'Save Changes →';
        }
      } else {
        form.reset();
        if (form.elements['annId']) form.elements['annId'].value = '';
        if (form.elements['annCategory']) form.elements['annCategory'].value = 'Seminar';
        if (form.elements['annTargetZones']) form.elements['annTargetZones'].value = 'All Zones, Barangay Manguring';
        if (form.elements['annRelayedBy']) form.elements['annRelayedBy'].value = 'Nurse Ana Reyes';
        if (form.elements['annStatus']) form.elements['annStatus'].value = 'relayed';
        if (submitBtn) submitBtn.textContent = 'Publish Announcement →';
      }
    }

    NutriApp.openModal('modal-announcement-composer');
  },

  openEditModal(id) {
    const posts = NutriStorage.getAnnouncements();
    const post = posts.find(p => String(p.id) === String(id));
    if (!post) return;

    this.showCreateView();

    const idField = document.getElementById('admin-page-form-id');
    const typeField = document.getElementById('admin-page-form-type');
    const zoneField = document.getElementById('admin-page-form-target-zone');
    const titleField = document.getElementById('admin-page-form-title');
    const detailsField = document.getElementById('admin-page-form-details');
    const dateField = document.getElementById('admin-page-form-date');
    const relayDateField = document.getElementById('admin-page-form-relay-date');
    const timeField = document.getElementById('admin-page-form-time');
    const venueField = document.getElementById('admin-page-form-venue');
    const submitBtn = document.getElementById('btn-admin-page-form-submit');

    if (idField) idField.value = post.id;
    if (typeField) typeField.value = post.category || 'Meeting';
    if (zoneField) zoneField.value = post.targetZones || 'All Zones, Barangay Manguring';
    if (titleField) titleField.value = post.title || '';
    if (detailsField) detailsField.value = post.content || '';
    if (dateField && post.rawDate) dateField.value = post.rawDate;
    if (relayDateField && post.rawRelayDate) relayDateField.value = post.rawRelayDate;
    if (timeField) timeField.value = post.eventTime || '';
    if (venueField) venueField.value = post.location || '';
    if (submitBtn) submitBtn.textContent = 'Update Announcement →';
  },

  // ==========================================================================
  // IN-PAGE ANNOUNCEMENT CREATION / EDITING VIEW (Screenshot Match)
  // ==========================================================================
  showCreateView() {
    const listView = document.getElementById('admin-ann-list-view');
    const createView = document.getElementById('admin-ann-create-view');
    const newBtn = document.getElementById('btn-admin-new-ann');
    const backBtn = document.getElementById('btn-admin-back-ann');
    const form = document.getElementById('admin-ann-create-form');
    const submitBtn = document.getElementById('btn-admin-page-form-submit');

    if (listView) listView.style.display = 'none';
    if (createView) createView.style.display = 'block';
    if (newBtn) newBtn.style.display = 'none';
    if (backBtn) backBtn.style.display = 'inline-flex';

    if (form) {
      form.reset();
      const idField = document.getElementById('admin-page-form-id');
      if (idField) idField.value = '';
      const typeField = document.getElementById('admin-page-form-type');
      if (typeField) typeField.value = 'Meeting';
      const zoneField = document.getElementById('admin-page-form-target-zone');
      if (zoneField) zoneField.value = 'All Zones, Barangay Manguring';
    }

    if (submitBtn) {
      submitBtn.textContent = 'Post to Health Workers →';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  showListView() {
    const listView = document.getElementById('admin-ann-list-view');
    const createView = document.getElementById('admin-ann-create-view');
    const newBtn = document.getElementById('btn-admin-new-ann');
    const backBtn = document.getElementById('btn-admin-back-ann');

    if (createView) createView.style.display = 'none';
    if (listView) listView.style.display = 'block';
    if (backBtn) backBtn.style.display = 'none';
    if (newBtn) newBtn.style.display = 'inline-flex';

    this.renderAdminFeed();
  },

  formatDisplayDate(dateStr) {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
      }
    } catch (e) {}
    return dateStr;
  },

  formatRelayDeadline(dateStr) {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
      }
    } catch (e) {}
    return dateStr;
  },

  handlePageFormSubmit(form) {
    const editId = form.elements['annId'] ? form.elements['annId'].value.trim() : '';
    const category = form.elements['annCategory'] ? form.elements['annCategory'].value : 'Meeting';
    const targetZones = form.elements['annTargetZones'] ? form.elements['annTargetZones'].value : 'All Zones, Barangay Manguring';
    const title = form.elements['annTitle'] ? form.elements['annTitle'].value.trim() : '';
    const content = form.elements['annContent'] ? form.elements['annContent'].value.trim() : '';
    const dateInput = form.elements['annDateInput'] ? form.elements['annDateInput'].value : '';
    const relayDateInput = form.elements['annRelayDateInput'] ? form.elements['annRelayDateInput'].value : '';
    const eventTime = form.elements['annEventTime'] ? form.elements['annEventTime'].value.trim() : '';
    const location = form.elements['annLocation'] ? form.elements['annLocation'].value.trim() : '';

    if (!title || !content) {
      NutriApp.showToast('Please provide both an announcement title and details.', 'warning');
      return;
    }

    const eventDate = this.formatDisplayDate(dateInput) || dateInput;
    const relayByDate = this.formatRelayDeadline(relayDateInput) || relayDateInput;

    const currentUser = NutriStorage.getCurrentUser() || {};
    const authorName = currentUser.name || 'Dr. Jose Lim';
    const authorDesignation = currentUser.designation || 'Municipal Health Officer';

    if (editId) {
      const existing = NutriStorage.getAnnouncements().find(p => String(p.id) === String(editId));
      const updatedPost = {
        ...(existing || {}),
        id: editId,
        title,
        content,
        category,
        targetZones,
        rawDate: dateInput,
        rawRelayDate: relayDateInput,
        eventDate: eventDate || existing?.eventDate,
        relayByDate: relayByDate || existing?.relayByDate,
        eventTime,
        location,
        barangay: targetZones.includes('Manguring') || targetZones.includes('Manguiring') ? 'Barangay Manguring' : 'All Barangays'
      };

      NutriStorage.updateAnnouncement(updatedPost);
      NutriApp.showToast('Announcement updated successfully!', 'success');
      this.showListView();
      this.renderDashboardWidgets();
      return;
    }

    // New Announcement
    const newPost = {
      id: 'ann-' + Date.now(),
      title,
      content,
      category,
      targetZones,
      targetBarangays: ['Barangay Manguring'],
      barangay: 'Barangay Manguring',
      rawDate: dateInput,
      rawRelayDate: relayDateInput,
      eventDate,
      relayByDate,
      eventTime,
      location,
      status: 'relayed',
      relayedBy: 'Nurse Ana Reyes',
      statusText: '✓ Relayed to Parents/Guardians by Nurse Ana Reyes',
      authorName,
      authorRole: 'mho',
      authorDesignation,
      targetAudience: 'both',
      priority: 'normal',
      createdAt: new Date().toISOString(),
      pinned: false
    };

    NutriStorage.addAnnouncement(newPost);
    NutriApp.showToast('📢 Official Announcement posted to Health Workers successfully!', 'success');
    this.showListView();
    this.renderDashboardWidgets();
  },


  toggleRelayStatus(id) {
    const posts = NutriStorage.getAnnouncements();
    const post = posts.find(p => String(p.id) === String(id));
    if (!post) return;

    if (post.status === 'relayed') {
      post.status = 'overdue';
      post.statusText = 'Relay overdue';
      NutriApp.showToast('Announcement marked as: Relay overdue', 'warning');
    } else {
      post.status = 'relayed';
      const staff = post.relayedBy || 'Nurse Ana Reyes';
      post.relayedBy = staff;
      post.statusText = `✓ Relayed to Parents/Guardians by ${staff}`;
      NutriApp.showToast(`Announcement marked as: Relayed by ${staff}`, 'success');
    }

    NutriStorage.updateAnnouncement(post);
    this.renderAllFeeds();
  },

  selectRadioCard(cardElem) {
    const parent = cardElem.parentElement;
    if (!parent) return;
    parent.querySelectorAll('.audience-radio-card').forEach(c => c.classList.remove('active'));
    cardElem.classList.add('active');
    const input = cardElem.querySelector('input[type="radio"]');
    if (input) input.checked = true;
  },

  // Button to Select All Barangays (Admin)
  selectAllBarangays() {
    const cards = document.querySelectorAll('.barangay-checkbox-card');
    cards.forEach(card => {
      card.classList.add('active');
      const cb = card.querySelector('input[type="checkbox"]');
      if (cb) cb.checked = true;
    });
    const btn = document.getElementById('btn-toggle-all-barangays');
    if (btn) {
      btn.classList.remove('btn-outline');
      btn.classList.add('btn-accent');
    }
    this.updateBarangaySummary();
  },

  // Button to Clear Barangay Checkboxes (Admin)
  clearAllBarangays() {
    const cards = document.querySelectorAll('.barangay-checkbox-card');
    cards.forEach(card => {
      card.classList.remove('active');
      const cb = card.querySelector('input[type="checkbox"]');
      if (cb) cb.checked = false;
    });
    const btn = document.getElementById('btn-toggle-all-barangays');
    if (btn) {
      btn.classList.remove('btn-accent');
      btn.classList.add('btn-outline');
    }
    this.updateBarangaySummary();
  },

  // Checkbox Change Handler (Admin)
  onBarangayCheckboxChange() {
    const cards = document.querySelectorAll('.barangay-checkbox-card');
    cards.forEach(card => {
      const cb = card.querySelector('input[type="checkbox"]');
      if (cb) {
        card.classList.toggle('active', cb.checked);
      }
    });
    this.updateBarangaySummary();
  },

  // Update Visual Summary Indicator
  updateBarangaySummary() {
    const checkedBoxes = document.querySelectorAll('input[name="annTargetBarangay"]:checked');
    const summaryElem = document.getElementById('ann-barangay-selection-summary');
    const btn = document.getElementById('btn-toggle-all-barangays');

    if (!summaryElem) return;

    const total = 4;
    const count = checkedBoxes.length;

    if (count === total) {
      summaryElem.style.color = '#166534';
      summaryElem.textContent = '📍 Target Destination: All 4 Barangays in Municipality (Everyone will receive this announcement)';
      if (btn) {
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-accent');
      }
    } else if (count > 0) {
      const selectedNames = Array.from(checkedBoxes).map(cb => cb.value.replace('Barangay ', 'Brgy. ')).join(', ');
      summaryElem.style.color = '#1D4ED8';
      summaryElem.textContent = `📍 Target Destination: Specific (${count} of ${total}): ${selectedNames}`;
      if (btn) {
        btn.classList.remove('btn-accent');
        btn.classList.add('btn-outline');
      }
    } else {
      summaryElem.style.color = '#DC2626';
      summaryElem.textContent = '⚠️ Please select at least one barangay (or click "All Barangays" above).';
      if (btn) {
        btn.classList.remove('btn-accent');
        btn.classList.add('btn-outline');
      }
    }
  },

  // Form submission
  handlePostSubmit(form) {
    const editId = form.elements['annId'] ? form.elements['annId'].value.trim() : '';
    const title = form.elements['annTitle'] ? form.elements['annTitle'].value.trim() : '';
    const content = form.elements['annContent'] ? form.elements['annContent'].value.trim() : '';
    const category = form.elements['annCategory'] ? form.elements['annCategory'].value : 'Seminar';
    const targetZones = form.elements['annTargetZones'] ? form.elements['annTargetZones'].value.trim() : 'All Zones, Barangay Manguring';
    const eventDate = form.elements['annEventDate'] ? form.elements['annEventDate'].value.trim() : '';
    const relayByDate = form.elements['annRelayByDate'] ? form.elements['annRelayByDate'].value.trim() : '';
    const eventTime = form.elements['annEventTime'] ? form.elements['annEventTime'].value.trim() : '';
    const location = form.elements['annLocation'] ? form.elements['annLocation'].value.trim() : '';
    const status = form.elements['annStatus'] ? form.elements['annStatus'].value : 'relayed';
    const relayedBy = form.elements['annRelayedBy'] ? form.elements['annRelayedBy'].value.trim() : 'Nurse Ana Reyes';

    const audienceInput = form.querySelector('input[name="annTargetAudience"]:checked');
    const targetAudience = audienceInput ? audienceInput.value : 'both';

    if (!title || !content) {
      NutriApp.showToast('Please provide both an announcement title and content.', 'warning');
      return;
    }

    let statusText = '';
    if (status === 'relayed') {
      statusText = `✓ Relayed to Parents/Guardians by ${relayedBy || 'Nurse Ana Reyes'}`;
    } else if (status === 'overdue') {
      statusText = 'Relay overdue';
    } else {
      statusText = '⏳ Relay pending';
    }

    const currentUser = NutriStorage.getCurrentUser() || {};
    const authorName = currentUser.name || (this.currentComposerRole === 'mho' ? 'Dr. Jose Lim' : 'Sister Teresa Lim, BNS');
    const authorDesignation = currentUser.designation || (this.currentComposerRole === 'mho' ? 'Municipal Health Officer' : 'Barangay Nutrition Scholar');

    if (editId) {
      const existing = NutriStorage.getAnnouncements().find(p => String(p.id) === String(editId));
      const updatedPost = {
        ...(existing || {}),
        id: editId,
        title,
        content,
        category,
        targetZones,
        eventDate,
        relayByDate,
        eventTime,
        location,
        status,
        relayedBy,
        statusText,
        barangay: targetZones.includes('Manguring') || targetZones.includes('Manguiring') ? 'Barangay Manguring' : 'All Barangays'
      };

      NutriStorage.updateAnnouncement(updatedPost);
      NutriApp.closeModal('modal-announcement-composer');
      NutriApp.showToast('Announcement updated successfully!', 'success');
      this.renderAllFeeds();
      this.renderDashboardWidgets();
      return;
    }

    // New Announcement
    const newPost = {
      id: 'ann-' + Date.now(),
      title,
      content,
      category,
      targetZones,
      targetBarangays: ['Barangay Manguring'],
      barangay: 'Barangay Manguring',
      eventDate,
      relayByDate,
      eventTime,
      location,
      status,
      relayedBy,
      statusText,
      authorName,
      authorRole: this.currentComposerRole,
      authorDesignation,
      targetAudience,
      priority: status === 'overdue' ? 'high' : 'normal',
      createdAt: new Date().toISOString(),
      pinned: false
    };

    NutriStorage.addAnnouncement(newPost);
    NutriApp.closeModal('modal-announcement-composer');
    NutriApp.showToast('📢 Official Announcement published successfully!', 'success');
    this.renderAllFeeds();
    this.renderDashboardWidgets();
  },

  deletePost(id) {
    if (confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
      NutriStorage.deleteAnnouncement(id);
      NutriApp.showToast('Announcement removed.', 'info');
      this.renderAllFeeds();
      this.renderDashboardWidgets();
    }
  },

  renderAllFeeds() {
    this.renderParentFeed();
    this.renderBHWFeed();
    this.renderAdminFeed();
  },

  // 1. Parent Feed (STRICTLY READ-ONLY, ONLY PARENT-ROUTED & RESIDENCE BARANGAY POSTS)
  renderParentFeed() {
    const container = document.getElementById('parent-announcements-container');
    if (!container) return;

    let posts = NutriStorage.getAnnouncementsForRole('parent');

    // Category filter
    if (this.activeParentCategoryFilter !== 'ALL') {
      posts = posts.filter(p => p.category === this.activeParentCategoryFilter);
    }

    // Search filter
    if (this.searchQueryParent) {
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(this.searchQueryParent) || 
        p.content.toLowerCase().includes(this.searchQueryParent) ||
        p.category.toLowerCase().includes(this.searchQueryParent) ||
        p.authorName.toLowerCase().includes(this.searchQueryParent) ||
        (p.barangay && p.barangay.toLowerCase().includes(this.searchQueryParent))
      );
    }

    if (posts.length === 0) {
      container.innerHTML = `
        <div class="announcement-empty-state">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📭</div>
          <h4 style="font-size: 1.1rem; color: var(--color-primary-900); margin-bottom: 0.25rem;">No Community Bulletins Found</h4>
          <p style="color: var(--text-muted); font-size: 0.88rem;">Check back later for feeding schedules, health center weigh-in dates, and nutrition advisories for your barangay.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = posts.map(post => this.buildCardHtml(post, 'parent')).join('');
  },

  // 2. BHW Feed (BHW-ROUTED POSTS + COMPOSER TRIGGER)
  renderBHWFeed() {
    const container = document.getElementById('bhw-announcements-container');
    if (!container) return;

    let posts = NutriStorage.getAnnouncementsForRole('chw');

    // Category filter
    if (this.activeBHWCategoryFilter !== 'ALL') {
      posts = posts.filter(p => p.category === this.activeBHWCategoryFilter);
    }

    // Search filter
    if (this.searchQueryBHW) {
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(this.searchQueryBHW) || 
        p.content.toLowerCase().includes(this.searchQueryBHW) ||
        p.category.toLowerCase().includes(this.searchQueryBHW) ||
        p.authorName.toLowerCase().includes(this.searchQueryBHW) ||
        (p.barangay && p.barangay.toLowerCase().includes(this.searchQueryBHW))
      );
    }

    if (posts.length === 0) {
      container.innerHTML = `
        <div class="announcement-empty-state">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📭</div>
          <h4 style="font-size: 1.1rem; color: var(--color-primary-900); margin-bottom: 0.25rem;">No BHW Bulletins Found</h4>
          <p style="color: var(--text-muted); font-size: 0.88rem;">Click "+ Post Announcement" above to send notices to Parents or the Municipal Health Office.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = posts.map(post => this.buildCardHtml(post, 'chw')).join('');
  },

  // 3. Admin Feed (Pixel-Perfect match to screenshot)
  renderAdminFeed() {
    const container = document.getElementById('admin-announcements-container');
    if (!container) return;

    let posts = NutriStorage.getAnnouncementsForRole('mho');
    if (!posts || posts.length === 0) {
      posts = NutriStorage.getAnnouncements();
    }

    if (posts.length === 0) {
      container.innerHTML = `
        <div class="announcement-empty-state" style="padding: 3rem 1rem; text-align: center; background: #FFFFFF; border-radius: 16px; border: 1px solid #EBE5DD;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📭</div>
          <h4 style="font-size: 1.15rem; color: #1F2937; margin-bottom: 0.35rem; font-weight: 700;">No Announcements Yet</h4>
          <p style="color: #6B7280; font-size: 0.9rem;">Click "+ New Announcement" above to post an official municipal notice.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = posts.map(post => this.buildAdminCardHtml(post)).join('');
  },

  buildAdminCardHtml(post) {
    const catLower = (post.category || '').toLowerCase();
    let iconClass = 'icon-default';
    let typeClass = 'type-default';
    let icon = '📢';

    if (catLower.includes('seminar')) {
      iconClass = 'icon-seminar';
      typeClass = 'type-seminar';
      icon = '🎓';
    } else if (catLower.includes('reminder') || catLower.includes('weigh')) {
      iconClass = 'icon-reminder';
      typeClass = 'type-reminder';
      icon = '🔔';
    } else if (catLower.includes('update') || catLower.includes('guideline') || catLower.includes('training')) {
      iconClass = 'icon-update';
      typeClass = 'type-update';
      icon = '📣';
    }

    const targetZones = post.targetZones || (post.targetBarangays && post.targetBarangays.length ? post.targetBarangays.join(', ') : 'All Zones, Barangay Manguring');

    // Status Badge Logic
    let statusBadgeHtml = '';
    const status = post.status || 'relayed';
    if (status === 'relayed') {
      const text = post.statusText || `✓ Relayed to Parents/Guardians by ${post.relayedBy || 'Nurse Ana Reyes'}`;
      statusBadgeHtml = `
        <button type="button" class="admin-ann-status-badge status-relayed" onclick="AnnouncementsModule.toggleRelayStatus('${post.id}')" title="Click to toggle status">
          ${text}
        </button>
      `;
    } else if (status === 'overdue') {
      const text = post.statusText || 'Relay overdue';
      statusBadgeHtml = `
        <button type="button" class="admin-ann-status-badge status-overdue" onclick="AnnouncementsModule.toggleRelayStatus('${post.id}')" title="Click to toggle status">
          ${text}
        </button>
      `;
    } else {
      statusBadgeHtml = `
        <button type="button" class="admin-ann-status-badge status-pending" onclick="AnnouncementsModule.toggleRelayStatus('${post.id}')" title="Click to toggle status">
          ⏳ Relay Pending
        </button>
      `;
    }

    return `
      <div class="admin-ann-card" id="ann-card-${post.id}">
        <div class="admin-ann-icon-box ${iconClass}">${icon}</div>
        <div class="admin-ann-body">
          <div class="admin-ann-top-row">
            <div class="admin-ann-title-wrap">
              <h3 class="admin-ann-card-title">${post.title}</h3>
              <span class="admin-ann-type-badge ${typeClass}">${post.category || 'General'}</span>
              <span class="admin-ann-zone-badge">${targetZones}</span>
            </div>
            <div class="admin-ann-actions">
              <button type="button" class="btn-ann-action" onclick="AnnouncementsModule.openEditModal('${post.id}')" title="Edit Announcement">✏️ Edit</button>
              <button type="button" class="btn-ann-action btn-ann-delete" onclick="AnnouncementsModule.deletePost('${post.id}')" title="Delete Announcement">🗑️</button>
            </div>
          </div>
          <p class="admin-ann-description">${post.content}</p>
          <div class="admin-ann-meta-row">
            ${post.eventDate ? `<span class="admin-ann-meta-item">🗓️ ${post.eventDate}</span>` : ''}
            ${post.relayByDate ? `<span class="admin-ann-meta-item admin-ann-relay-deadline">Relay by ${post.relayByDate}</span>` : ''}
            ${post.eventTime ? `<span class="admin-ann-meta-item">⏰ ${post.eventTime}</span>` : ''}
            ${post.location ? `<span class="admin-ann-meta-item">📍 ${post.location}</span>` : ''}
          </div>
          <hr class="admin-ann-divider">
          <div class="admin-ann-status-row">
            ${statusBadgeHtml}
          </div>
        </div>
      </div>
    `;
  },

  // Build Announcement Card HTML
  buildCardHtml(post, viewingRole) {
    const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    // Priority pill
    let priorityBadge = '';
    if (post.priority === 'urgent') {
      priorityBadge = '<span class="ann-priority-pill urgent">🚨 URGENT ACTION</span>';
    } else if (post.priority === 'high') {
      priorityBadge = '<span class="ann-priority-pill high">⚠️ IMPORTANT NOTICE</span>';
    } else {
      priorityBadge = '<span class="ann-priority-pill normal">ℹ️ GENERAL ADVISORY</span>';
    }

    // Target Audience Badge
    let audienceBadge = '';
    if (post.targetAudience === 'both') {
      audienceBadge = '<span class="ann-audience-badge badge-both">📢 Both Parent &amp; BHW</span>';
    } else if (post.targetAudience === 'bhw') {
      audienceBadge = '<span class="ann-audience-badge badge-bhw">🔒 BHW Only (Internal)</span>';
    } else if (post.targetAudience === 'admin_parent') {
      audienceBadge = '<span class="ann-audience-badge badge-admin-parent">🌐 Both Admin &amp; Parent</span>';
    } else if (post.targetAudience === 'parent') {
      audienceBadge = '<span class="ann-audience-badge badge-parent">👨‍👩‍👧 Parent Only</span>';
    }

    // Destination Barangay Badge
    let barangayBadge = '';
    const brgyText = post.barangay || (post.targetBarangays && post.targetBarangays.length >= 4 ? 'All Barangays' : post.targetBarangays?.join(', ')) || 'All Barangays';
    if (brgyText === 'All Barangays' || (post.targetBarangays && post.targetBarangays.length >= 4)) {
      barangayBadge = '<span class="ann-barangay-badge badge-all-barangays">🌐 All Barangays</span>';
    } else {
      barangayBadge = `<span class="ann-barangay-badge badge-specific-barangay">📍 ${brgyText}</span>`;
    }

    // Author Origin Badge
    const isMhoAuthor = post.authorRole === 'mho';
    const authorBadge = `
      <span class="ann-author-badge ${isMhoAuthor ? 'author-mho' : 'author-chw'}">
        ${isMhoAuthor ? '🏛️ Municipal Health Office' : '🩺 Barangay Health Worker'}
      </span>
    `;

    // Action buttons (Delete allowed for Admin or the authoring BHW, NEVER shown to Parents)
    let actionButtons = '';
    if (viewingRole === 'mho' || (viewingRole === 'chw' && post.authorRole === 'chw')) {
      actionButtons = `
        <button class="btn btn-sm btn-outline" style="color: #DC2626; border-color: #FCA5A5; font-size: 0.78rem; padding: 0.3rem 0.65rem;" onclick="AnnouncementsModule.deletePost('${post.id}')" title="Delete announcement">
          🗑️ Delete
        </button>
      `;
    }

    return `
      <div class="announcement-card ${post.pinned ? 'pinned-card' : ''}">
        <div class="ann-card-header">
          <div class="ann-badges-row">
            ${priorityBadge}
            <span class="ann-category-pill">${post.category}</span>
            ${authorBadge}
            ${audienceBadge}
            ${barangayBadge}
          </div>
          <div class="ann-card-actions">
            ${actionButtons}
          </div>
        </div>

        <h3 class="ann-card-title">${post.title}</h3>
        <p class="ann-card-content">${post.content}</p>

        <div class="ann-card-footer">
          <div class="ann-author-info">
            <span class="ann-author-avatar">${isMhoAuthor ? '🏛️' : '🩺'}</span>
            <div>
              <strong style="color: var(--text-primary); font-size: 0.85rem;">${post.authorName}</strong>
              <div style="color: var(--text-muted); font-size: 0.75rem;">${post.authorDesignation || ''} • ${post.barangay || ''}</div>
            </div>
          </div>
          <div class="ann-date-text">
            📅 ${formattedDate}
          </div>
        </div>
      </div>
    `;
  },

  // Dashboard Previews (Latest 2 announcements for each portal)
  renderDashboardWidgets() {
    this.renderDashboardWidgetForRole('parent', 'parent-dash-announcements-list');
    this.renderDashboardWidgetForRole('chw', 'bhw-dash-announcements-list');
    this.renderDashboardWidgetForRole('mho', 'admin-dash-announcements-list');
  },

  renderDashboardWidgetForRole(role, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const posts = NutriStorage.getAnnouncementsForRole(role).slice(0, 2);

    if (posts.length === 0) {
      container.innerHTML = `
        <div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
          No active bulletins for your barangay at this time.
        </div>
      `;
      return;
    }

    container.innerHTML = posts.map(p => {
      let badgeClass = 'badge-normal';
      if (p.priority === 'urgent') badgeClass = 'badge-stunted';
      else if (p.priority === 'high') badgeClass = 'badge-wasted';

      const brgyBadge = p.barangay === 'All Barangays' ? '🌐 All Barangays' : `📍 ${p.barangay}`;

      return `
        <div style="padding: 0.75rem; background: var(--bg-surface-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-light); margin-bottom: 0.6rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.3rem;">
            <strong style="font-size: 0.88rem; color: var(--text-primary); line-height: 1.3;">${p.title}</strong>
            <div style="display:flex; gap:0.3rem; align-items:center;">
              <span class="badge ${badgeClass}" style="font-size: 0.7rem; white-space: nowrap;">${p.category}</span>
              <span style="font-size: 0.68rem; background: #E2E8F0; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${brgyBadge}</span>
            </div>
          </div>
          <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4; margin-bottom: 0.4rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${p.content}
          </p>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.73rem; color: var(--text-muted);">
            <span>By: ${p.authorName}</span>
            <span>📅 ${new Date(p.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      `;
    }).join('');
  }
};

window.AnnouncementsModule = AnnouncementsModule;
