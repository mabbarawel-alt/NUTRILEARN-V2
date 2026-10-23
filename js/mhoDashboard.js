// ==========================================================================
// NUTRILEARN - MUNICIPAL HEALTH OFFICE (MHO) & HIGHER-UPS DASHBOARD
// Stunting Analytics, 10% Reduction KPI, Barangay Trends, Report Endorsement
// ==========================================================================

const MHODashboard = {
  selectedBarangay: 'ALL',

  init() {
    if (window.NutriStorage && typeof NutriStorage.populateAllBarangayDropdowns === 'function') {
      NutriStorage.populateAllBarangayDropdowns();
    }
    this.setSelectedBarangay(this.selectedBarangay || 'ALL');
    this.renderKPIs();
    this.renderBarangayBreakdown();
    this.renderIncomingReports();
    this.renderNutritionGuidelines();
    this.initContentManager();
    this.initDietaryCompliance();
    this.initUserManager();
    this.initAuditManager();
    this.renderBarangaysManager();
  },

  // Set the Active Barangay for Administrator phase
  setSelectedBarangay(barangay) {
    this.selectedBarangay = barangay || 'ALL';

    const globalSelect = document.getElementById('admin-global-barangay-select');
    if (globalSelect && globalSelect.value !== this.selectedBarangay) {
      globalSelect.value = this.selectedBarangay;
    }

    const recordsFilter = document.getElementById('admin-records-barangay-filter');
    if (recordsFilter && recordsFilter.value !== this.selectedBarangay) {
      recordsFilter.value = this.selectedBarangay;
    }

    this.updateBarangayBanner();
    this.updateOverviewHeader();
    this.renderAdminRecords();
    this.renderKPIs();
  },

  handleGlobalBarangayChange(val) {
    this.setSelectedBarangay(val);
  },

  handleRecordsBarangayFilter(val) {
    this.setSelectedBarangay(val);
  },

  updateBarangayBanner() {
    const banner = document.getElementById('admin-records-brgy-banner');
    if (!banner) return;
    if (this.selectedBarangay === 'ALL') {
      banner.className = 'admin-brgy-info-banner all';
      banner.style.border = '1.5px solid #E2E8F0';
      banner.style.background = '#F8FAFC';
      banner.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <span style="font-size: 1.25rem;">🌐</span>
            <div>
              <strong style="color: #0F172A; font-size: 0.9rem;">Lahat ng Barangay (Buong Munisipalidad)</strong>
              <div style="font-size: 0.8rem; color: #64748B;">
                Ipinapakita ang talaan mula sa lahat ng mga barangay. Pumili ng partikular na Barangay upang i-filter at i-update lamang ang mga talaan nito.
              </div>
            </div>
          </div>
          <span class="badge" style="background: #F1F5F9; color: #475569; font-weight: 600; font-size: 0.78rem; padding: 4px 10px; border-radius: 6px; border: 1px solid #CBD5E1;">
            Municipality View
          </span>
        </div>
      `;
    } else {
      banner.className = 'admin-brgy-info-banner active';
      banner.style.border = '1.5px solid #A7F3D0';
      banner.style.background = '#ECFDF5';
      banner.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <span style="font-size: 1.25rem;">📍</span>
            <div>
              <strong style="color: #065F46; font-size: 0.92rem;">Aktibong Barangay: <span style="text-decoration: underline;">${this.selectedBarangay}</span></strong>
              <div style="font-size: 0.8rem; color: #047857;">
                🔒 Tanging mga talaan lamang ng <strong>${this.selectedBarangay}</strong> ang ipinapakita at maaari mong i-update.
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="badge" style="background: #10B981; color: #ffffff; font-weight: 700; font-size: 0.78rem; padding: 5px 12px; border-radius: 9999px;">
              ✓ Naka-lock sa ${this.selectedBarangay}
            </span>
            <button type="button" class="btn btn-outline btn-sm" style="font-size: 0.75rem; padding: 3px 8px; background: #fff;" onclick="MHODashboard.setSelectedBarangay('ALL')" title="Ipakita muli ang lahat ng barangay">
              I-reset sa Lahat
            </button>
          </div>
        </div>
      `;
    }
  },

  updateOverviewHeader() {
    const titleEl = document.getElementById('admin-overview-page-title');
    if (titleEl) {
      if (this.selectedBarangay === 'ALL') {
        titleEl.textContent = 'Program Overview — Lahat ng Barangay';
      } else {
        titleEl.textContent = `Program Overview — ${this.selectedBarangay}`;
      }
    }
    const subEl = document.getElementById('admin-overview-page-sub');
    if (subEl) {
      if (this.selectedBarangay === 'ALL') {
        subEl.textContent = 'Calabanga, Camarines Sur · Talaan para sa Buong Munisipalidad';
      } else {
        subEl.textContent = `Calabanga, Camarines Sur · Talaan para sa ${this.selectedBarangay}`;
      }
    }
  },

  // Calculate and Render Executive KPIs & 10% Stunting Target
  renderKPIs() {
    let children = NutriStorage.getChildren();
    if (this.selectedBarangay && this.selectedBarangay !== 'ALL') {
      children = children.filter(c => (c.barangay || '').trim() === this.selectedBarangay);
    }

    const total = children.length;
    const stunted = children.filter(c => c.status === 'Stunted' && !c.improved).length;
    const wasted = children.filter(c => c.status === 'Wasted' && !c.improved).length;
    const underweight = children.filter(c => c.status === 'Underweight' && !c.improved).length;
    const improved = children.filter(c => c.improved === true).length;
    const normal = children.filter(c => c.status === 'Normal' && !c.improved).length;

    const currentStuntingRate = total > 0 ? ((stunted / total) * 100).toFixed(1) : '0.0';

    // 10% Stunting Reduction Progress Calculation
    const baselineRate = 22.0;
    const targetReduction = 10.0;
    const actualReduction = (baselineRate - parseFloat(currentStuntingRate)).toFixed(1);
    const reductionProgressPct = Math.min(100, Math.max(0, Math.round((parseFloat(actualReduction) / targetReduction) * 100)));

    // Element bindings
    const elTotal = document.getElementById('mho-kpi-total');
    const elStuntingRate = document.getElementById('mho-kpi-stunting-rate');
    const elTargetProgress = document.getElementById('mho-kpi-target-progress');
    const elTargetBar = document.getElementById('mho-kpi-target-bar');
    const elImproved = document.getElementById('mho-kpi-improved');
    const elWasted = document.getElementById('mho-kpi-wasted');

    const targetProgressHtml = `<span style="font-size: 1.25rem; font-weight: 800;">${actualReduction}% pts</span> <span style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted);">/ 10% Goal (${reductionProgressPct}%)</span>`;

    if (elTotal) elTotal.textContent = total;
    if (elStuntingRate) elStuntingRate.textContent = `${currentStuntingRate}%`;
    if (elTargetProgress) elTargetProgress.innerHTML = targetProgressHtml;
    if (elTargetBar) elTargetBar.style.width = `${reductionProgressPct}%`;
    if (elImproved) elImproved.textContent = improved;
    if (elWasted) elWasted.textContent = wasted;

    // Synchronize Executive Dashboard overview cards
    const elDashTotal = document.getElementById('admin-dash-kpi-total');
    const elDashStuntingRate = document.getElementById('admin-dash-kpi-stunting-rate');
    const elDashTargetProgress = document.getElementById('admin-dash-kpi-target-progress');
    const elDashTargetBar = document.getElementById('admin-dash-kpi-target-bar');
    const elDashImproved = document.getElementById('admin-dash-kpi-improved');

    if (elDashTotal) elDashTotal.textContent = total;
    if (elDashStuntingRate) elDashStuntingRate.textContent = `${currentStuntingRate}%`;
    if (elDashTargetProgress) elDashTargetProgress.innerHTML = targetProgressHtml;
    if (elDashTargetBar) elDashTargetBar.style.width = `${reductionProgressPct}%`;
    if (elDashImproved) elDashImproved.textContent = improved;

    // Synchronize Clean Overview 4 KPI Cards
    const elFamEnrolled = document.getElementById('kpi-families-enrolled');
    const elCritCases = document.getElementById('kpi-critical-cases');
    const elStuntRate = document.getElementById('kpi-stunting-rate');
    const elHealthWorkers = document.getElementById('kpi-health-workers');

    const criticalCount = children.filter(c => c.status === 'Critical' || (c.muacMm && c.muacMm < 115) || c.status === 'Wasted').length;

    if (elFamEnrolled) elFamEnrolled.textContent = total > 0 ? String(total * 4) : '0';
    if (elCritCases) elCritCases.textContent = String(criticalCount);
    if (elStuntRate) elStuntRate.textContent = `${currentStuntingRate}%`;
    if (elHealthWorkers) {
      elHealthWorkers.textContent = (this.selectedBarangay && this.selectedBarangay !== 'ALL') ? '3' : '15';
    }

    // Mini Chart Distribution Bars
    const barStunted = document.getElementById('dist-bar-stunted');
    const barWasted = document.getElementById('dist-bar-wasted');
    const barUnderweight = document.getElementById('dist-bar-underweight');
    const barNormal = document.getElementById('dist-bar-normal');
    const barImproved = document.getElementById('dist-bar-improved');

    if (total > 0) {
      if (barStunted) barStunted.style.width = `${(stunted / total) * 100}%`;
      if (barWasted) barWasted.style.width = `${(wasted / total) * 100}%`;
      if (barUnderweight) barUnderweight.style.width = `${(underweight / total) * 100}%`;
      if (barNormal) barNormal.style.width = `${(normal / total) * 100}%`;
      if (barImproved) barImproved.style.width = `${(improved / total) * 100}%`;
    }
  },

  // Render Barangay Distribution Table
  renderBarangayBreakdown() {
    const tbody = document.getElementById('mho-barangay-tbody');
    if (!tbody) return;

    const children = NutriStorage.getChildren();
    const barangays = (typeof NutriStorage !== 'undefined' && NutriStorage.getBarangayNames) ? NutriStorage.getBarangayNames() : ['Barangay Manguiring'];

    tbody.innerHTML = barangays.map(b => {
      const bChildren = children.filter(c => c.barangay === b);
      const bTotal = bChildren.length;
      const bStunted = bChildren.filter(c => c.status === 'Stunted' && !c.improved).length;
      const bImproved = bChildren.filter(c => c.improved === true).length;
      const rate = bTotal > 0 ? ((bStunted / bTotal) * 100).toFixed(1) : '0.0';

      let priorityBadge = '<span class="badge badge-normal">Low Risk</span>';
      if (parseFloat(rate) >= 20) {
        priorityBadge = '<span class="badge badge-stunted">High Priority Hotspot</span>';
      } else if (parseFloat(rate) >= 10) {
        priorityBadge = '<span class="badge badge-underweight">Moderate Priority</span>';
      }

      return `
        <tr>
          <td>
            <strong style="color: var(--color-primary-900);">${b}</strong>
          </td>
          <td>${bTotal}</td>
          <td>
            <span style="font-weight: 700; color: #DC2626;">${bStunted}</span>
          </td>
          <td>
            <span style="font-weight: 700; color: #16A34A;">${bImproved}</span>
          </td>
          <td>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <div style="flex:1; height:6px; background:#E2E8F0; border-radius:4px; overflow:hidden;">
                <div style="width:${rate}%; height:100%; background:#EF4444;"></div>
              </div>
              <span style="font-weight:600; font-size:0.82rem;">${rate}%</span>
            </div>
          </td>
          <td>${priorityBadge}</td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="MHODashboard.filterToCHWBarangay('${b}')">
              View CHW Data
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  // Render Incoming Official Reports from CHWs
  renderIncomingReports() {
    const tbody = document.getElementById('mho-reports-tbody');
    if (!tbody) return;

    const reports = NutriStorage.getReports();

    if (reports.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">
            No submitted community reports yet.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = reports.map(r => `
      <tr>
        <td>
          <span style="font-family: monospace; font-weight: 700; color: var(--color-primary-800);">${r.reportId}</span>
        </td>
        <td>
          <div style="font-weight: 600;">${r.barangay}</div>
          <div style="font-size: 0.76rem; color: var(--text-muted);">By: ${r.chwName}</div>
        </td>
        <td>${r.submittedDate}</td>
        <td>
          <div style="font-size: 0.85rem;">
            <strong>${r.totalChildren}</strong> Children (${r.stuntedCount} Stunted, ${r.improvedCount} Recovered)
          </div>
        </td>
        <td>
          <span style="font-weight: 700; color: #DC2626;">${r.stuntingRate}</span>
          <span style="font-size:0.75rem; color:#16A34A; display:block;">${r.stuntingReductionAchieved || '-'}</span>
        </td>
        <td>
          <span class="badge ${r.status === 'Verified & Approved' ? 'badge-improved' : 'badge-underweight'}">
            ${r.status}
          </span>
        </td>
        <td>
          <div class="table-actions">
            ${r.status === 'Pending Review'
        ? `<button class="btn btn-accent btn-sm" onclick="MHODashboard.endorseReport('${r.reportId}')">Approve</button>`
        : `<button class="btn btn-outline btn-sm" onclick="NutriExport.printOfficialSummary()">Print</button>`
      }
          </div>
        </td>
      </tr>
    `).join('');
  },

  // Approve / Endorse an incoming CHW Report
  endorseReport(reportId) {
    const reports = NutriStorage.getReports();
    const report = reports.find(r => r.reportId === reportId);
    if (!report) return;

    report.status = 'Verified & Approved';
    NutriStorage.saveReports(reports);
    NutriStorage.logAudit('Report Endorsed', 'Report & Endorsement', `Officially approved census report ${reportId} for ${report.barangay}`);
    this.renderIncomingReports();
    NutriApp.showToast(`Report ${reportId} officially verified and approved by Municipal Health Office.`, 'success');
  },

  // Cross-filter: Switch view to records filtered to this barangay
  filterToCHWBarangay(barangay) {
    this.setSelectedBarangay(barangay);
    if (window.NutriApp) {
      NutriApp.switchMHOSubTab('records');
    }
  },

  // Render WHO & SDG Guidelines Manager
  renderNutritionGuidelines() {
    const container = document.getElementById('mho-guidelines-container');
    if (!container) return;

    const guidelines = [
      {
        title: 'WHO 2025/2030 Global Nutrition Targets: 10% Stunting Reduction',
        source: 'World Health Organization & UNICEF (2025)',
        status: 'Active Community Benchmark',
        summary: 'Targeted parent education and localized complementary food interventions have been shown to reduce stunting prevalence by 10% to 15% across pilot communities within 12 months.'
      },
      {
        title: 'Philippine Plan of Action for Nutrition (PPAN): Pinggang Pinoy',
        source: 'Food and Nutrition Research Institute (FNRI-DOST)',
        status: 'Mandatory Food Standard',
        summary: 'Promotes backyard bio-intensive gardens (Malunggay, Kalabasa, Camote) to overcome micronutrient poverty at zero or minimal family expenditure.'
      },
      {
        title: 'Executive Order 51 (Philippine Milk Code) & RA 10028',
        source: 'Department of Health (DOH)',
        status: 'Statutory Health Policy',
        summary: 'Mandates exclusive breastfeeding support for infants 0 to 6 months without infant formula marketing or unnecessary water supplementation.'
      }
    ];

    container.innerHTML = guidelines.map(g => `
      <div style="background:#FFFFFF; border:1px solid var(--border-light); border-radius:var(--radius-md); padding:1rem 1.25rem; margin-bottom:0.75rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem; flex-wrap:wrap; gap:0.5rem;">
          <strong style="color:var(--color-primary-900); font-size:0.95rem;">${g.title}</strong>
          <span class="badge badge-normal">${g.status}</span>
        </div>
        <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:0.45rem;">Authority: ${g.source}</div>
        <p style="font-size:0.86rem; color:var(--text-secondary); line-height:1.5;">${g.summary}</p>
      </div>
    `).join('');
  },

  // ==========================================================================
  // NUTRITION CONTENT MANAGEMENT & DIETARY COMPLIANCE (Admin Supervision)
  // ==========================================================================
  activeContentSubTab: 'modules',

  initContentManager() {
    this.renderContentManagerModules();
  },

  switchContentSubTab(tabName) {
    this.activeContentSubTab = tabName;
    const btnModules = document.getElementById('btn-subtab-modules');
    const btnCompliance = document.getElementById('btn-subtab-compliance');
    const paneModules = document.getElementById('pane-content-modules');
    const paneCompliance = document.getElementById('pane-content-compliance');

    if (btnModules) btnModules.classList.toggle('active', tabName === 'modules');
    if (btnCompliance) btnCompliance.classList.toggle('active', tabName === 'compliance');

    if (paneModules) paneModules.style.display = (tabName === 'modules') ? 'block' : 'none';
    if (paneCompliance) paneCompliance.style.display = (tabName === 'compliance') ? 'block' : 'none';

    if (tabName === 'modules') {
      this.renderContentManagerModules();
    } else if (tabName === 'compliance') {
      this.renderDietaryCompliance();
    }
  },

  // Active filter for Content Management
  currentContentFilter: 'all',

  // 5 Seed Evidence-Based Nutrition Modules (Exact match to Administrator Content Management design)
  getDefaultNutritionModules() {
    return [
      {
        id: 'mod-malnutrition',
        number: 'Module 1',
        title: 'Understanding Child Malnutrition',
        version: 'v2.1',
        lessonsCount: 5,
        lastUpdated: 'Aug 15, 2026',
        status: 'published',
        duration: '15 mins',
        summary: 'Comprehensive guide to stunting, wasting, underweight, and micronutrient deficiencies according to WHO 2026 child growth benchmarks.',
        recommendedFoods: 'Malunggay, Nilagang Itlog, Monggo, Kalabasa, Dilaw na Camote',
        feedingGuide: 'Pakainin nang madalas gamit ang siksik-sustansyang pagkain. Isama ang berde at dilaw na gulay sa bawat pinggan.',
        lessons: [
          { title: 'Stunting vs Wasting: Understanding Growth Failure', icon: '📏', content: 'Stunting reflects chronic malnutrition affecting height-for-age, while wasting reflects acute recent weight loss.', completed: false },
          { title: 'The First 1,000 Days Window', icon: '⏳', content: 'Nutrition from conception to a child’s second birthday permanently shapes brain architecture and physical stature.', completed: false },
          { title: 'Critical Micronutrient Deficiencies', icon: '🔬', content: 'Recognizing vitamin A, iron deficiency anemia, and zinc deficiency signs in community health checks.', completed: false },
          { title: 'Growth Chart Interpretation', icon: '📈', content: 'How to plot and read WHO Z-score growth curves correctly to prevent faltering early.', completed: false },
          { title: 'Catch-up Growth Intervention Protocols', icon: '🌱', content: 'Immediate actionable steps when a child begins crossing downward percentile thresholds.', completed: false }
        ]
      },
      {
        id: 'mod-feeding',
        number: 'Module 2',
        title: 'Complementary Feeding for Infants',
        version: 'v1.8',
        lessonsCount: 6,
        lastUpdated: 'Jul 30, 2026',
        status: 'published',
        duration: '20 mins',
        summary: 'Step-by-step guidance on introducing solid foods at 6 months while continuing breastfeeding, focusing on consistency and meal frequency.',
        recommendedFoods: 'Lugaw na may Manok at Malunggay, Minasang Papaya, Nilagang Dilaw ng Itlog, Mashed Avocado',
        feedingGuide: 'Magsimula sa malambot at madulas na lugaw sa edad na 6 buwan. Dagdagan ang lapot at dalas habang lumalaki ang sanggol.',
        lessons: [
          { title: 'When to Start: The 6-Month Mark', icon: '🍼', content: 'Why introducing foods before 6 months increases infection risk and delays proper gut maturation.', completed: false },
          { title: 'Texture Progression from Puree to Solids', icon: '🥣', content: 'Moving safely from smooth purees to practical mashed family foods without choking hazards.', completed: false },
          { title: 'Meal Frequency & Portions by Age Band', icon: '⏰', content: '2-3 meals daily at 6-8 months, transitioning to 3-4 meals plus nutritious snacks at 9-23 months.', completed: false },
          { title: 'Energy Density: Fortifying Lugaw', icon: '⚡', content: 'Transforming plain water lugaw into nutrient-dense porridge with egg yolk, crushed seeds, and greens.', completed: false },
          { title: 'Safe Water & Meal Preparation Hygiene', icon: '🧼', content: 'Handwashing and sanitary food storage techniques to prevent diarrheal disease.', completed: false },
          { title: 'Responsive Cue Recognition', icon: '👶', content: 'Reading baby’s natural cues for hunger and fullness without coercive feeding.', completed: false }
        ]
      },
      {
        id: 'mod-meals',
        number: 'Module 3',
        title: 'Affordable Nutrient-Dense Meals',
        version: 'v2.0',
        lessonsCount: 8,
        lastUpdated: 'Aug 10, 2026',
        status: 'published',
        duration: '25 mins',
        summary: 'Cook balanced, budget-friendly Filipino meals using accessible barangay ingredients aligned with FNRI Pinggang Pinoy guidelines.',
        recommendedFoods: 'Ginisang Monggo na may Malunggay, Tortang Talong na may Giniling, Sinabawang Isda, Kamote Cue na Walang Asukal',
        feedingGuide: 'Sundin ang Pinggang Pinoy: kalahating plato ng gulay at prutas, sang-kapat na protina, at sang-kapat na kanin o pampalakas.',
        lessons: [
          { title: 'Pinggang Pinoy Food Group Proportions', icon: '🍽️', content: 'Mastering Go, Grow, and Glow balance tailored for growing toddlers and nursing mothers.', completed: false },
          { title: 'Malunggay: The Miracle Local Superfood', icon: '🌿', content: 'High calcium, iron, and vitamin A content in fresh backyard moringa leaves.', completed: false },
          { title: 'Monggo & Legumes as Complete Proteins', icon: '🍲', content: 'Combining legumes with rice to deliver high-quality amino acids at minimal household expense.', completed: false },
          { title: 'One Egg a Day: Proven Stunting Prevention', icon: '🥚', content: 'Clinical evidence on how 1 egg daily provides choline, DHA, and bioavailable protein for linear growth.', completed: false },
          { title: 'Nutrient-Dense Local Root Crops', icon: '🍠', content: 'Yellow camote and gabi as vitamin-rich carbohydrate sources superior to refined white flour.', completed: false },
          { title: 'Budget Smart Marketing & Ingredient Sourcing', icon: '🛒', content: 'How to stretch PHP 150-200 to feed a family of four nutrient-dense whole foods.', completed: false },
          { title: 'Cooking Methods that Preserve Vitamins', icon: '🍳', content: 'Steaming and quick simmering techniques that prevent heat-sensitive micronutrient breakdown.', completed: false },
          { title: 'Batch Meal Prep for Busy Caregivers', icon: '🍱', content: 'Time-saving storage and reheating strategies for community health workers and working parents.', completed: false }
        ]
      },
      {
        id: 'mod-habits',
        number: 'Module 4',
        title: 'Responsive Feeding Behaviors',
        version: 'v1.2',
        lessonsCount: 4,
        lastUpdated: 'Aug 20, 2026',
        status: 'draft',
        duration: '15 mins',
        summary: 'Develop positive mealtime routines, handle picky eating with patience, and avoid screen distractions to nurture lifelong healthy relationships with food.',
        recommendedFoods: 'Finger Foods: Steamed Carrot Sticks, Soft Banana Slices, Boiled Egg Wedges, Avocado Cubes',
        feedingGuide: 'Huwag pilitin ang bata kung busog na. Kumain nang sabay-sabay bilang pamilya nang walang TV o cellphone sa hapag-kainan.',
        lessons: [
          { title: 'Responsive Feeding: Talking & Encouragement', icon: '🗣️', content: 'Feed slowly and patiently with encouragement, never force-feeding. Maintain eye contact and smile.', completed: false },
          { title: 'Handling Picky Eating with Patience', icon: '🥦', content: 'A child may need to see, touch, and smell a new vegetable 10 to 15 times before accepting it.', completed: false },
          { title: 'Creating a Screen-Free Mealtime Routine', icon: '📱', content: 'Eating in front of screens disconnects children from internal fullness cues and slows chewing.', completed: false },
          { title: 'Self-Feeding & Fine Motor Skill Development', icon: '👶', content: 'Offer safe finger foods to build hand-eye coordination and healthy eating confidence.', completed: false }
        ]
      },
      {
        id: 'mod-stunting-2026',
        number: 'Module 5',
        title: 'WHO Updated Stunting Guidelines 2026',
        version: 'v1.0',
        lessonsCount: 3,
        lastUpdated: 'Aug 24, 2026',
        status: 'review',
        duration: '20 mins',
        summary: 'Comprehensive overview of the latest 2026 World Health Organization standards on community-level child stunting surveillance and intervention.',
        recommendedFoods: 'Lipid-based Nutrient Supplements (LNS), Micronutrient Powder (MNP), Iron-fortified complementary foods',
        feedingGuide: 'I-monitor ang length-for-age buwan-buwan. Agad na i-refer sa Rural Health Unit ang mga batang may severe linear faltering.',
        lessons: [
          { title: '2026 Revised Anthropometric Screening Criteria', icon: '📋', content: 'Precision cutoff points for length-for-age Z-scores and community height-board calibration requirements.', completed: false },
          { title: 'Small-Quantity Lipid-Based Supplements (SQ-LNS)', icon: '💊', content: 'Evidence-backed supplementation protocols for infants aged 6-23 months at high stunting risk.', completed: false },
          { title: 'BHW Community Action & Rapid Referral Pathways', icon: '🏥', content: 'Standardized triage workflows connecting barangay health stations to Municipal Health Offices.', completed: false }
        ]
      }
    ];
  },

  getNutritionModules() {
    try {
      const data = localStorage.getItem('nutrilearn_content_modules_v5');
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length >= 5) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading content modules data:', e);
    }
    const defaults = this.getDefaultNutritionModules();
    this.saveNutritionModules(defaults);
    return defaults;
  },

  saveNutritionModules(modules) {
    localStorage.setItem('nutrilearn_content_modules_v5', JSON.stringify(modules));
    localStorage.setItem('nutrilearn_parent_modules_data_v3', JSON.stringify(modules));
    if (window.ParentModule) {
      ParentModule.nutritionModules = modules;
      if (typeof ParentModule.renderModuleCards === 'function') {
        ParentModule.renderModuleCards();
      }
    }
    if (window.NutriStorage && typeof NutriStorage.saveModules === 'function') {
      NutriStorage.saveModules(modules);
    }
  },

  filterContentModules(filter) {
    this.currentContentFilter = filter;
    document.querySelectorAll('.admin-content-pill-btn').forEach(btn => {
      const f = btn.getAttribute('data-filter');
      btn.classList.toggle('active', f === filter);
    });
    this.renderContentManagerModules();
  },

  // Render Module Management Cards matching the screenshot
  renderContentManagerModules() {
    const container = document.getElementById('admin-content-modules-list') || document.getElementById('mho-content-modules-list');
    if (!container) return;

    let modules = this.getNutritionModules();
    const filter = (this.currentContentFilter || 'all').toLowerCase();

    if (filter !== 'all') {
      modules = modules.filter(m => (m.status || 'draft').toLowerCase() === filter);
    }

    if (modules.length === 0) {
      container.innerHTML = `
        <div style="background:#FFFFFF; border:1px dashed #D5CFC3; border-radius:12px; padding:2.5rem; text-align:center; color:#6B7280;">
          <p style="font-size:1.05rem; font-weight:600; color:#374151; margin-bottom:0.4rem;">No modules found under "${this.currentContentFilter}" status.</p>
          <p style="font-size:0.86rem; margin:0 0 1.25rem;">You can add a new module or switch to "All" to review existing content.</p>
          <button type="button" class="btn-admin-new-module" onclick="MHODashboard.openAddModuleModal()">+ New Module</button>
        </div>
      `;
      return;
    }

    container.innerHTML = modules.map(m => {
      const lessonsCount = m.lessons ? m.lessons.length : (m.lessonsCount || 4);
      const status = (m.status || 'draft').toLowerCase();
      const statusTitle = status.charAt(0).toUpperCase() + status.slice(1);
      const showPublishBtn = (status === 'draft' || status === 'review');

      return `
        <div class="admin-module-card-item" id="module-card-${m.id}">
          <div class="admin-module-left">
            <div class="admin-module-title-row">
              <h3 class="admin-module-title">${m.title}</h3>
              <span class="admin-module-version">${m.version || 'v1.0'}</span>
            </div>
            <div class="admin-module-meta">
              ${lessonsCount} lessons · Last updated: ${m.lastUpdated || 'Aug 24, 2026'}
            </div>
          </div>

          <div class="admin-module-actions">
            <span class="admin-module-status-badge">${statusTitle}</span>
            <button type="button" class="btn-module-preview" onclick="MHODashboard.openPreviewModuleModal('${m.id}')" title="Preview module curriculum and syllabus">
              Preview
            </button>
            <button type="button" class="btn-module-edit" onclick="MHODashboard.openEditModuleModal('${m.id}')" title="Edit module details">
              Edit
            </button>
            ${showPublishBtn ? `
              <button type="button" class="btn-module-publish" onclick="MHODashboard.publishModule('${m.id}')" title="Publish this module for all users">
                Publish
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  },

  // Open Add Module Modal
  openAddModuleModal() {
    const titleInput = document.getElementById('admin-add-mod-title');
    const versionInput = document.getElementById('admin-add-mod-version');
    const statusSelect = document.getElementById('admin-add-mod-status');
    const durationInput = document.getElementById('admin-add-mod-duration');
    const summaryInput = document.getElementById('admin-add-mod-summary');
    const foodsInput = document.getElementById('admin-add-mod-foods');
    const guideInput = document.getElementById('admin-add-mod-feeding-guide');
    const lessonsInput = document.getElementById('admin-add-mod-lessons');

    if (titleInput) titleInput.value = '';
    if (versionInput) versionInput.value = 'v1.0';
    if (statusSelect) statusSelect.value = 'draft';
    if (durationInput) durationInput.value = '15 mins';
    if (summaryInput) summaryInput.value = '';
    if (foodsInput) foodsInput.value = 'Malunggay, Nilagang Itlog, Monggo, Kalabasa';
    if (guideInput) guideInput.value = 'Pakainin 3 beses sa isang araw kasama ang 2 masustansyang meryenda. Ihalo ang sariwang gulay sa sabaw.';
    if (lessonsInput) {
      lessonsInput.value = 'Foundational Concepts | 📖 | Introduction to evidence-based dietary recommendations.\nPractical Meal Preparation | 🍲 | Cooking nutritious, locally available affordable ingredients.\nGrowth Monitoring & Health Habits | 📏 | Regular measurement and positive feeding interaction.';
    }

    NutriApp.openModal('modal-admin-add-module');
  },

  submitNewModuleWithStatus(forcedStatus) {
    const statusSelect = document.getElementById('admin-add-mod-status');
    if (statusSelect) statusSelect.value = forcedStatus;
    const form = document.querySelector('#modal-admin-add-module form');
    if (form) {
      if (form.checkValidity()) {
        this.handleSaveNewModule(form);
      } else {
        form.reportValidity();
      }
    }
  },

  handleSaveNewModule(form) {
    const title = (document.getElementById('admin-add-mod-title')?.value || '').trim();
    const version = (document.getElementById('admin-add-mod-version')?.value || 'v1.0').trim();
    const status = (document.getElementById('admin-add-mod-status')?.value || 'draft').toLowerCase();
    const duration = (document.getElementById('admin-add-mod-duration')?.value || '15 mins').trim();
    const summary = (document.getElementById('admin-add-mod-summary')?.value || '').trim();
    const foods = (document.getElementById('admin-add-mod-foods')?.value || '').trim();
    const feedingGuide = (document.getElementById('admin-add-mod-feeding-guide')?.value || '').trim();
    const lessonsText = (document.getElementById('admin-add-mod-lessons')?.value || '').trim();

    if (!title || !summary) {
      NutriApp.showToast('Punan ang module title at summary bago i-save.', 'warning');
      return;
    }

    // Parse lessons
    const lessons = lessonsText.split('\n').filter(Boolean).map(line => {
      const parts = line.split('|');
      return {
        title: (parts[0] || 'Lesson Topic').trim(),
        icon: (parts[1] || '📖').trim(),
        content: (parts[2] || parts[0] || '').trim(),
        completed: false
      };
    });

    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

    const modules = this.getNutritionModules();
    const newModule = {
      id: 'mod-' + Date.now(),
      number: `Module ${modules.length + 1}`,
      title,
      version: version.startsWith('v') ? version : 'v' + version,
      lessonsCount: lessons.length || 4,
      lastUpdated: formattedDate,
      status,
      duration,
      summary,
      recommendedFoods: foods || 'Malunggay, Nilagang Itlog, Monggo',
      feedingGuide,
      lessons: lessons.length > 0 ? lessons : [
        { title: 'Core Nutrition Concepts', icon: '📖', content: summary, completed: false }
      ]
    };

    modules.push(newModule);
    this.saveNutritionModules(modules);

    if (window.NutriStorage && typeof NutriStorage.logAudit === 'function') {
      NutriStorage.logAudit('New Module Created', 'Content Management', `Administrator created "${title}" (${version}) with status: ${status}`);
    }

    NutriApp.closeModal('modal-admin-add-module');
    this.renderContentManagerModules();
    NutriApp.showToast(`🎉 Module "${title}" has been saved as ${status.toUpperCase()}!`, 'success');
  },

  openEditModuleModal(moduleId) {
    const modules = this.getNutritionModules();
    const mod = modules.find(m => m.id === moduleId);
    if (!mod) {
      NutriApp.showToast('Module not found.', 'error');
      return;
    }

    document.getElementById('admin-edit-mod-id').value = mod.id;
    document.getElementById('admin-edit-mod-header-title').textContent = `✏️ Edit: ${mod.title}`;
    document.getElementById('admin-edit-mod-title').value = mod.title || '';
    document.getElementById('admin-edit-mod-version').value = mod.version || 'v1.0';
    document.getElementById('admin-edit-mod-status').value = (mod.status || 'draft').toLowerCase();
    document.getElementById('admin-edit-mod-duration').value = mod.duration || '15 mins';
    document.getElementById('admin-edit-mod-summary').value = mod.summary || '';
    document.getElementById('admin-edit-mod-foods').value = mod.recommendedFoods || '';
    document.getElementById('admin-edit-mod-feeding-guide').value = mod.feedingGuide || '';

    const lessons = mod.lessons || [];
    const lessonsText = lessons.map(l => `${l.title} | ${l.icon || '📖'} | ${l.content}`).join('\n');
    document.getElementById('admin-edit-mod-lessons').value = lessonsText;

    const publishShortcut = document.getElementById('btn-edit-mod-publish-shortcut');
    if (publishShortcut) {
      publishShortcut.style.display = (mod.status !== 'published') ? 'inline-block' : 'none';
    }

    NutriApp.openModal('modal-admin-edit-module');
  },

  handleSaveEditModule(form) {
    const id = document.getElementById('admin-edit-mod-id')?.value;
    const title = (document.getElementById('admin-edit-mod-title')?.value || '').trim();
    const version = (document.getElementById('admin-edit-mod-version')?.value || 'v1.0').trim();
    const status = (document.getElementById('admin-edit-mod-status')?.value || 'draft').toLowerCase();
    const duration = (document.getElementById('admin-edit-mod-duration')?.value || '15 mins').trim();
    const summary = (document.getElementById('admin-edit-mod-summary')?.value || '').trim();
    const foods = (document.getElementById('admin-edit-mod-foods')?.value || '').trim();
    const feedingGuide = (document.getElementById('admin-edit-mod-feeding-guide')?.value || '').trim();
    const lessonsText = (document.getElementById('admin-edit-mod-lessons')?.value || '').trim();

    if (!title || !summary) {
      NutriApp.showToast('Punan ang module title at summary bago i-save.', 'warning');
      return;
    }

    const lessons = lessonsText.split('\n').filter(Boolean).map(line => {
      const parts = line.split('|');
      return {
        title: (parts[0] || 'Lesson Topic').trim(),
        icon: (parts[1] || '📖').trim(),
        content: (parts[2] || parts[0] || '').trim(),
        completed: false
      };
    });

    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

    const modules = this.getNutritionModules();
    const idx = modules.findIndex(m => m.id === id);
    if (idx !== -1) {
      modules[idx] = {
        ...modules[idx],
        title,
        version: version.startsWith('v') ? version : 'v' + version,
        status,
        duration,
        summary,
        recommendedFoods: foods,
        feedingGuide,
        lastUpdated: formattedDate,
        lessons: lessons.length > 0 ? lessons : modules[idx].lessons,
        lessonsCount: lessons.length > 0 ? lessons.length : modules[idx].lessonsCount
      };

      this.saveNutritionModules(modules);
      if (window.NutriStorage && typeof NutriStorage.logAudit === 'function') {
        NutriStorage.logAudit('Module Updated', 'Content Management', `Administrator updated "${title}" (${version}) - Status: ${status}`);
      }

      NutriApp.closeModal('modal-admin-edit-module');
      this.renderContentManagerModules();
      NutriApp.showToast(`✅ Module "${title}" has been updated successfully!`, 'success');
    }
  },

  publishFromEditModal() {
    const statusSelect = document.getElementById('admin-edit-mod-status');
    if (statusSelect) statusSelect.value = 'published';
    const form = document.querySelector('#modal-admin-edit-module form');
    if (form) this.handleSaveEditModule(form);
  },

  // 1-Click Publish from card or preview modal
  publishModule(moduleId) {
    const modules = this.getNutritionModules();
    const mod = modules.find(m => m.id === moduleId);
    if (!mod) return;

    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

    mod.status = 'published';
    mod.lastUpdated = formattedDate;

    this.saveNutritionModules(modules);
    if (window.NutriStorage && typeof NutriStorage.logAudit === 'function') {
      NutriStorage.logAudit('Module Published', 'Content Management', `Administrator published "${mod.title}" (${mod.version}) to all health workers and parents`);
    }

    this.renderContentManagerModules();
    NutriApp.showToast(`🎉 "${mod.title}" is now published and live!`, 'success');
  },

  // Open Preview Module Modal
  openPreviewModuleModal(moduleId) {
    const modules = this.getNutritionModules();
    const mod = modules.find(m => m.id === moduleId);
    if (!mod) {
      NutriApp.showToast('Module not found.', 'error');
      return;
    }

    const titleEl = document.getElementById('admin-prev-mod-title');
    const versionEl = document.getElementById('admin-prev-mod-version');
    const statusTag = document.getElementById('admin-prev-mod-status-tag');
    const metaEl = document.getElementById('admin-prev-mod-meta');
    const summaryEl = document.getElementById('admin-prev-mod-summary');
    const foodsEl = document.getElementById('admin-prev-mod-foods-section');
    const lessonsCountEl = document.getElementById('admin-prev-mod-lessons-count');
    const lessonsContainer = document.getElementById('admin-prev-mod-lessons-container');
    const actionsEl = document.getElementById('admin-prev-mod-actions');

    if (titleEl) titleEl.textContent = mod.title;
    if (versionEl) versionEl.textContent = mod.version || 'v1.0';

    const status = (mod.status || 'draft').toLowerCase();
    if (statusTag) {
      statusTag.textContent = status.charAt(0).toUpperCase() + status.slice(1);
      if (status === 'published') {
        statusTag.style.background = '#DCFCE7';
        statusTag.style.color = '#166534';
      } else if (status === 'review') {
        statusTag.style.background = '#DBEAFE';
        statusTag.style.color = '#1E40AF';
      } else {
        statusTag.style.background = '#FEF3C7';
        statusTag.style.color = '#92400E';
      }
    }

    const lessons = mod.lessons || [];
    const count = lessons.length || mod.lessonsCount || 4;
    if (metaEl) metaEl.textContent = `${count} lessons · Last updated: ${mod.lastUpdated || 'Aug 24, 2026'}`;
    if (summaryEl) summaryEl.textContent = mod.summary || 'Essential evidence-based nutritional guidelines for child stunting reduction.';
    if (lessonsCountEl) lessonsCountEl.textContent = count;

    if (foodsEl) {
      const foodsList = (mod.recommendedFoods || 'Malunggay, Nilagang Itlog, Monggo')
        .split(',')
        .map(f => `<span style="display:inline-block; background:#EFE9DF; color:#2D3748; padding:3px 9px; border-radius:9999px; font-weight:600; font-size:0.78rem; margin:2px 4px 2px 0;">🌱 ${f.trim()}</span>`)
        .join('');

      foodsEl.innerHTML = `
        <div style="margin-top:0.5rem;">
          <strong style="color:#166534;">Recommended Foods:</strong><br>
          <div style="margin-top:4px;">${foodsList}</div>
        </div>
        ${mod.feedingGuide ? `
          <div style="margin-top:0.6rem; font-style:italic; color:#4B5563;">
            🥣 <strong>Feeding Guidelines:</strong> ${mod.feedingGuide}
          </div>
        ` : ''}
      `;
    }

    if (lessonsContainer) {
      lessonsContainer.innerHTML = lessons.map((l, idx) => `
        <div class="preview-lesson-item">
          <div class="preview-lesson-title">
            <span>${l.icon || '📖'}</span>
            <span>Lesson ${idx + 1}: ${l.title}</span>
          </div>
          <div class="preview-lesson-desc">${l.content || 'Comprehensive curriculum topic detail.'}</div>
        </div>
      `).join('');
    }

    if (actionsEl) {
      actionsEl.innerHTML = `
        <button type="button" class="btn btn-outline" onclick="NutriApp.closeModal('modal-admin-preview-module'); MHODashboard.openEditModuleModal('${mod.id}');">
          ✏️ Edit Details
        </button>
        ${(status !== 'published') ? `
          <button type="button" class="btn btn-primary" style="background:#2D6A4F; border:none; font-weight:600;" onclick="MHODashboard.publishModule('${mod.id}'); NutriApp.closeModal('modal-admin-preview-module');">
            🚀 Publish This Module
          </button>
        ` : ''}
      `;
    }

    NutriApp.openModal('modal-admin-preview-module');
  },

  handleDeleteCurrentModule() {
    const id = document.getElementById('admin-edit-mod-id')?.value;
    if (!id) return;
    if (confirm('Sigurado ka bang nais mong burahin ang nutrition module na ito?')) {
      let modules = this.getNutritionModules();
      modules = modules.filter(m => m.id !== id);
      this.saveNutritionModules(modules);
      NutriApp.closeModal('modal-admin-edit-module');
      this.renderContentManagerModules();
      if (window.NutriStorage && typeof NutriStorage.logAudit === 'function') {
        NutriStorage.logAudit('Module Deleted', 'Content Management', `Deleted module ID: ${id}`);
      }
      NutriApp.showToast('Module deleted successfully.', 'info');
    }
  },

  handleResetModules() {
    if (confirm('I-reset ang lahat ng nutrition module sa opisyal na WHO & PPAN default guidelines?')) {
      const defaults = this.getDefaultNutritionModules();
      this.saveNutritionModules(defaults);
      this.renderContentManagerModules();
      if (window.NutriStorage && typeof NutriStorage.logAudit === 'function') {
        NutriStorage.logAudit('Curricula Reset', 'Content Management', 'Restored 5 official WHO & FNRI nutrition modules');
      }
      NutriApp.showToast('Curricula restored to standard defaults.', 'success');
    }
  },
  // ==========================================================================
  // DIETARY ADHERENCE & MEAL COMPLIANCE MONITORING ("saka na momonitor kang admin kung nasusunod ang pagkakan")
  // ==========================================================================
  initDietaryCompliance() {
    this.ensureDietarySeedData();
    this.renderDietaryCompliance();
  },

  // Seed realistic dietary compliance records if empty
  ensureDietarySeedData() {
    try {
      const key = 'nutrilearn_diet_adherence_records_v3';
      if (!localStorage.getItem(key)) {
        const seedRecords = [
          {
            id: 'diet-101',
            childName: 'Chloe Sofia Ramos',
            parentName: 'Maria Ramos',
            barangay: 'Barangay Manguiring',
            zone: 'Zone 1',
            dietPlan: 'Module 3: Iron & Protein Rich (Monggo, Dilis, Itlog)',
            adherenceRate: 94,
            complianceStatus: 'Compliant',
            lastMealLogged: 'Ginisang Monggo na may Sariwang Malunggay at Durog na Itlog',
            lastMealDate: 'Ngayong 12:30 PM',
            mealsLoggedCount: 28,
            foodsFollowed: ['Malunggay', 'Monggo', 'Itlog', 'Tubig'],
            history: [
              { date: '2026-10-11', time: '12:30 PM', meal: 'Ginisang Monggo + Malunggay + Itlog', foods: ['Malunggay', 'Monggo', 'Itlog'] },
              { date: '2026-10-11', time: '7:45 AM', meal: 'Lugaw na may itlog + Saging', foods: ['Itlog', 'Saging'] },
              { date: '2026-10-10', time: '6:30 PM', meal: 'Nilagang Isda at Gulay + Camote', foods: ['Isda', 'Camote'] }
            ]
          },
          {
            id: 'diet-102',
            childName: 'Mateo Alcantara',
            parentName: 'Elena Alcantara',
            barangay: 'Barangay Manguiring',
            zone: 'Zone 1',
            dietPlan: 'Module 2: Complementary Starter (Lugaw Booster & Camote)',
            adherenceRate: 42,
            complianceStatus: 'Non-Compliant',
            lastMealLogged: 'Am / Rice broth lamang (Walang gulay)',
            lastMealDate: 'Kahapon, 6:00 PM',
            mealsLoggedCount: 11,
            foodsFollowed: ['Rice Broth'],
            needsAttention: true,
            history: [
              { date: '2026-10-10', time: '6:00 PM', meal: 'Plain rice broth (Hindi hinaluan ng gulay)', foods: [] },
              { date: '2026-10-09', time: '12:00 PM', meal: 'Instant noodles soup (Mataas sa asin)', foods: [] }
            ]
          },
          {
            id: 'diet-103',
            childName: 'Daniel Bicolano',
            parentName: 'Rosa Bicolano',
            barangay: 'Barangay Manguiring',
            zone: 'Zone 1',
            dietPlan: 'Module 1: Therapeutic Catch-Up (Malunggay & Kalabasa Puree)',
            adherenceRate: 38,
            complianceStatus: 'Non-Compliant',
            lastMealLogged: 'Biskwit at powdered juice snack',
            lastMealDate: '2 araw ang nakalipas',
            mealsLoggedCount: 9,
            foodsFollowed: ['Tubig'],
            needsAttention: true,
            history: [
              { date: '2026-10-09', time: '3:30 PM', meal: 'Sugary biscuits and sweet tea', foods: [] }
            ]
          },
          {
            id: 'diet-104',
            childName: 'Lucas Nathaniel Reyes',
            parentName: 'Catherine Reyes',
            barangay: 'Barangay Manguiring',
            zone: 'Zone 2',
            dietPlan: 'Module 3: Iron & Protein Rich (Monggo, Dilis, Itlog)',
            adherenceRate: 88,
            complianceStatus: 'Compliant',
            lastMealLogged: 'Lugaw na may Malunggay, Durog na Dilis at Itlog',
            lastMealDate: 'Ngayong 11:45 AM',
            mealsLoggedCount: 25,
            foodsFollowed: ['Malunggay', 'Dilis', 'Itlog', 'Tubig'],
            history: [
              { date: '2026-10-11', time: '11:45 AM', meal: 'Lugaw + Malunggay + Dilis', foods: ['Malunggay', 'Dilis'] }
            ]
          },
          {
            id: 'diet-105',
            childName: 'Jasmine Santos',
            parentName: 'Grace Santos',
            barangay: 'Barangay Manguiring',
            zone: 'Zone 2',
            dietPlan: 'Module 2: High-Density Porridge & Liver Puree',
            adherenceRate: 68,
            complianceStatus: 'Moderate',
            lastMealLogged: 'Mashed Kalabasa at Kanin',
            lastMealDate: 'Kahapon, 7:15 PM',
            mealsLoggedCount: 18,
            foodsFollowed: ['Kalabasa', 'Kanin'],
            history: [
              { date: '2026-10-10', time: '7:15 PM', meal: 'Kalabasa + kanin', foods: ['Kalabasa'] }
            ]
          },
          {
            id: 'diet-106',
            childName: 'Gabriel Santos',
            parentName: 'Rosa Santos',
            barangay: 'Barangay Manguiring',
            zone: 'Zone 3',
            dietPlan: 'Module 3: Pinggang Pinoy Complete Family Diet',
            adherenceRate: 96,
            complianceStatus: 'Compliant',
            lastMealLogged: 'Sinabawang Isda na may Malunggay, Monggo at Saba',
            lastMealDate: 'Ngayong 1:00 PM',
            mealsLoggedCount: 29,
            foodsFollowed: ['Malunggay', 'Monggo', 'Isda', 'Saba'],
            history: [
              { date: '2026-10-11', time: '1:00 PM', meal: 'Isda + Malunggay + Monggo', foods: ['Malunggay', 'Monggo', 'Isda'] }
            ]
          },
          {
            id: 'diet-107',
            childName: 'Althea Mae Dela Cruz',
            parentName: 'Lourdes Dela Cruz',
            barangay: 'Barangay Manguiring',
            zone: 'Zone 3',
            dietPlan: 'Module 1: First 1,000 Days Growth Diet',
            adherenceRate: 46,
            complianceStatus: 'Non-Compliant',
            lastMealLogged: 'Tinapay at kape / Matamis na inumin',
            lastMealDate: 'Kahapon, 2:00 PM',
            mealsLoggedCount: 12,
            foodsFollowed: [],
            needsAttention: true,
            history: [
              { date: '2026-10-10', time: '2:00 PM', meal: 'White bread with condensed milk', foods: [] }
            ]
          },
          {
            id: 'diet-108',
            childName: 'Princess Joy Mendoza',
            parentName: 'Janice Mendoza',
            barangay: 'Barangay Manguiring',
            zone: 'Zone 4',
            dietPlan: 'Module 4: Healthy Habits & Self-Feeding Foods',
            adherenceRate: 91,
            complianceStatus: 'Compliant',
            lastMealLogged: 'Nilagang Camote Mash na may Gata at Nilagang Itlog',
            lastMealDate: 'Ngayong 10:15 AM',
            mealsLoggedCount: 27,
            foodsFollowed: ['Camote', 'Itlog', 'Gata'],
            history: [
              { date: '2026-10-11', time: '10:15 AM', meal: 'Camote + Itlog + Gata', foods: ['Camote', 'Itlog'] }
            ]
          },
          {
            id: 'diet-109',
            childName: 'Kenneth Ian Morales',
            parentName: 'Gina Morales',
            barangay: 'Barangay Manguiring',
            zone: 'Zone 4',
            dietPlan: 'Module 3: Iron & Protein Rich (Monggo, Dilis, Itlog)',
            adherenceRate: 49,
            complianceStatus: 'Non-Compliant',
            lastMealLogged: 'Kanin at toyo lamang (Walang protina)',
            lastMealDate: 'Kahapon, 1:10 PM',
            mealsLoggedCount: 13,
            foodsFollowed: ['Kanin'],
            needsAttention: true,
            history: [
              { date: '2026-10-10', time: '1:10 PM', meal: 'Rice with soy sauce (Deficient in protein)', foods: [] }
            ]
          },
          {
            id: 'diet-110',
            childName: 'Bea Patricia Lopez',
            parentName: 'Marites Lopez',
            barangay: 'Barangay Manguiring',
            zone: 'Zone 5',
            dietPlan: 'Module 3: Iron & Protein Rich (Monggo, Dilis, Itlog)',
            adherenceRate: 85,
            complianceStatus: 'Compliant',
            lastMealLogged: 'Tortang Talong na may Malunggay at Durog na Itlog',
            lastMealDate: 'Ngayong 12:00 PM',
            mealsLoggedCount: 24,
            foodsFollowed: ['Malunggay', 'Itlog', 'Gulay'],
            history: [
              { date: '2026-10-11', time: '12:00 PM', meal: 'Torta + Malunggay + Itlog', foods: ['Malunggay', 'Itlog'] }
            ]
          }
        ];
        localStorage.setItem(key, JSON.stringify(seedRecords));
      }
    } catch (e) {
      console.warn('Error seeding dietary compliance records:', e);
    }
  },

  getDietaryRecords() {
    try {
      const data = localStorage.getItem('nutrilearn_diet_adherence_records_v3');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveDietaryRecords(records) {
    localStorage.setItem('nutrilearn_diet_adherence_records_v3', JSON.stringify(records));
  },

  renderDietaryCompliance() {
    this.renderComplianceKPIs();
    this.renderFoodAdherenceBars();
    this.renderDietaryComplianceTable();
  },

  renderComplianceKPIs() {
    const container = document.getElementById('mho-compliance-kpis-container');
    if (!container) return;

    const records = this.getDietaryRecords();
    const total = 150; // Total enrolled families across community
    const compliant = records.filter(r => r.complianceStatus === 'Compliant').length + 114;
    const moderate = records.filter(r => r.complianceStatus === 'Moderate').length + 22;
    const low = records.filter(r => r.complianceStatus === 'Non-Compliant').length;
    const avgAdherence = ((compliant * 92 + moderate * 65 + low * 44) / total).toFixed(1);

    // Update pending pill on subtab
    const pill = document.getElementById('compliance-pending-pill');
    if (pill) pill.textContent = `${low} Nangangailangan ng Tulong`;

    container.innerHTML = `
      <div class="compliance-kpi-grid">
        <div class="compliance-kpi-card" style="border-top: 4px solid #16A34A;">
          <div>
            <div style="font-size: 0.82rem; font-weight: 700; color: #166534; text-transform: uppercase;">
              📈 Pangkalahatang Pagsunod
            </div>
            <div class="compliance-kpi-val" style="color: #15803D;">${avgAdherence}%</div>
            <div style="font-size: 0.78rem; color: #6B7280;">Average meal compliance rate</div>
          </div>
          <div style="height: 6px; background: #E5E7EB; border-radius: 4px; overflow: hidden; margin-top: 0.6rem;">
            <div style="width: ${avgAdherence}%; height: 100%; background: #16A34A;"></div>
          </div>
        </div>

        <div class="compliance-kpi-card" style="border-top: 4px solid #10B981;">
          <div>
            <div style="font-size: 0.82rem; font-weight: 700; color: #047857; text-transform: uppercase;">
              🟢 Nasusunod (Compliant)
            </div>
            <div class="compliance-kpi-val" style="color: #047857;">${compliant}</div>
            <div style="font-size: 0.78rem; color: #6B7280;">80% - 100% adherence rate</div>
          </div>
          <span class="badge-compliant" style="align-self: flex-start; margin-top: 0.5rem;">Wasto ang kinakain</span>
        </div>

        <div class="compliance-kpi-card" style="border-top: 4px solid #F59E0B;">
          <div>
            <div style="font-size: 0.82rem; font-weight: 700; color: #B45309; text-transform: uppercase;">
              🟡 Katamtaman (Moderate)
            </div>
            <div class="compliance-kpi-val" style="color: #B45309;">${moderate}</div>
            <div style="font-size: 0.78rem; color: #6B7280;">50% - 79% adherence rate</div>
          </div>
          <span class="badge-moderate" style="align-self: flex-start; margin-top: 0.5rem;">Kailangan ng follow-up</span>
        </div>

        <div class="compliance-kpi-card" style="border-top: 4px solid #EF4444; background: #FFFBFB;">
          <div>
            <div style="font-size: 0.82rem; font-weight: 700; color: #DC2626; text-transform: uppercase;">
              🔴 Hindi Nasusunod (At Risk)
            </div>
            <div class="compliance-kpi-val" style="color: #DC2626;">${low}</div>
            <div style="font-size: 0.78rem; color: #6B7280;">Mababang nutrisyon (&lt;50%)</div>
          </div>
          <span class="badge-low" style="align-self: flex-start; margin-top: 0.5rem;">Kailangan ng Ayuda / Bisita</span>
        </div>
      </div>
    `;
  },

  renderFoodAdherenceBars() {
    const container = document.getElementById('mho-food-adherence-bars');
    if (!container) return;

    const foodItems = [
      { name: '🌿 Sariwang Malunggay sa Sabaw/Lugaw', pct: 92, count: '138 / 150 pamilya' },
      { name: '🍲 Abot-kayang Monggo at Dilis', pct: 86, count: '129 / 150 pamilya' },
      { name: '🥚 Nilagang Itlog Araw-araw', pct: 79, count: '119 / 150 pamilya' },
      { name: '🍠 Dilaw na Camote at Kalabasa', pct: 83, count: '124 / 150 pamilya' },
      { name: '💧 Malinis na Tubig (Walang Matatamis)', pct: 89, count: '134 / 150 pamilya' },
      { name: '🧼 Paghuhugas ng Kamay Bago Kumain', pct: 95, count: '142 / 150 pamilya' }
    ];

    container.innerHTML = foodItems.map(item => `
      <div class="food-adherence-item">
        <div class="food-adherence-top">
          <span>${item.name}</span>
          <strong style="color: #1E3A2B;">${item.pct}%</strong>
        </div>
        <div class="food-adherence-track">
          <div class="food-adherence-fill" style="width: ${item.pct}%;"></div>
        </div>
        <div style="font-size: 0.72rem; color: #6B7280; margin-top: 0.3rem;">
          ${item.count} ang sumusunod
        </div>
      </div>
    `).join('');
  },

  renderDietaryComplianceTable() {
    const tbody = document.getElementById('mho-compliance-tbody');
    if (!tbody) return;

    const records = this.getDietaryRecords();
    const search = (document.getElementById('mho-compliance-search')?.value || '').toLowerCase().trim();
    const brgyFilter = document.getElementById('mho-compliance-barangay-filter')?.value || 'ALL';
    const statusFilter = document.getElementById('mho-compliance-status-filter')?.value || 'ALL';

    const filtered = records.filter(r => {
      const matchSearch = !search || r.childName.toLowerCase().includes(search) || r.parentName.toLowerCase().includes(search);
      const matchBrgy = brgyFilter === 'ALL' || r.barangay === brgyFilter;
      const matchStatus = statusFilter === 'ALL' || r.complianceStatus === statusFilter;
      return matchSearch && matchBrgy && matchStatus;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2.5rem; color: #9CA3AF;">
            Walang pamilyang tumutugma sa iyong filter criteria.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(r => {
      let statusBadge = '<span class="badge-compliant">🟢 Nasusunod</span>';
      if (r.complianceStatus === 'Moderate') {
        statusBadge = '<span class="badge-moderate">🟡 Katamtaman</span>';
      } else if (r.complianceStatus === 'Non-Compliant') {
        statusBadge = '<span class="badge-low">🔴 Hindi Nasusunod</span>';
      }

      return `
        <tr>
          <td>
            <strong style="color: #1E2320; font-size: 0.92rem;">${r.childName}</strong>
            <div style="font-size: 0.78rem; color: #6B7280;">Magulang: ${r.parentName}</div>
          </td>
          <td>
            <span style="font-weight: 600; color: #166534; background: #F0FDF4; padding: 2px 8px; border-radius: 6px; font-size: 0.8rem;">
              ${r.zone || r.barangay}
            </span>
            <div style="font-size: 0.72rem; color: #9CA3AF;">${r.barangay}</div>
          </td>
          <td>
            <div style="font-size: 0.82rem; font-weight: 600; color: #374151;">${r.dietPlan}</div>
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <div style="flex: 1; min-width: 60px; height: 6px; background: #E5E7EB; border-radius: 4px; overflow: hidden;">
                <div style="width: ${r.adherenceRate}%; height: 100%; background: ${r.adherenceRate >= 80 ? '#16A34A' : (r.adherenceRate >= 50 ? '#F59E0B' : '#EF4444')};"></div>
              </div>
              <strong style="font-size: 0.82rem; color: #1E2320;">${r.adherenceRate}%</strong>
            </div>
            <div style="font-size: 0.72rem; color: #6B7280;">${r.mealsLoggedCount || 0} naitalang araw</div>
          </td>
          <td>
            ${statusBadge}
          </td>
          <td>
            <div style="font-size: 0.82rem; color: #1F2937; font-weight: 500;">
              ${r.lastMealLogged || 'Walang naitala'}
            </div>
            <div style="font-size: 0.72rem; color: #6B7280;">
              ${r.lastMealDate || '-'}
            </div>
          </td>
          <td>
            <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
              <button type="button" class="btn btn-outline btn-sm" onclick="MHODashboard.openFamilyFoodLog('${r.id}')"
                style="font-size: 0.76rem; padding: 3px 8px;" title="Tingnan ang kumpletong talaan ng kinain">
                📋 Food Log
              </button>
              <button type="button" class="btn btn-accent btn-sm" onclick="MHODashboard.openDietaryAdvisory('${r.id}')"
                style="font-size: 0.76rem; padding: 3px 8px; font-weight: 700;" title="Magpadala ng paalala o abiso ng ayuda">
                📢 Paalala / Ayuda
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  filterComplianceRecords() {
    this.renderDietaryComplianceTable();
  },

  openFamilyFoodLog(recordId) {
    const records = this.getDietaryRecords();
    const rec = records.find(r => r.id === recordId);
    if (!rec) return;

    document.getElementById('food-log-modal-title').textContent = `📋 Talaan ng Pagkain: ${rec.childName}`;
    document.getElementById('food-log-modal-subtitle').textContent = `Pamilya ni ${rec.parentName} • ${rec.barangay} (${rec.zone || ''})`;

    const modalBody = document.getElementById('food-log-modal-body');
    const historyList = (rec.history || []).map(h => `
      <div style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 0.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
          <strong style="color: #1E293B; font-size: 0.88rem;">${h.meal}</strong>
          <span style="font-size: 0.75rem; color: #64748B;">📅 ${h.date} (${h.time || ''})</span>
        </div>
        ${(h.foods && h.foods.length > 0) ? `
          <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-top: 0.35rem;">
            ${h.foods.map(f => `<span class="admin-food-badge" style="font-size: 0.72rem;">✓ ${f}</span>`).join('')}
          </div>
        ` : '<span style="font-size: 0.74rem; color: #DC2626;">⚠️ Hindi nakitaan ng sapat na gulay o protina</span>'}
      </div>
    `).join('') || '<p style="color: #94A3B8; text-align: center; padding: 1rem;">Wala pang nakaraang meal entry.</p>';

    modalBody.innerHTML = `
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 1rem; margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <div style="font-size: 0.78rem; color: #64748B;">Nakatalagang Alituntunin sa Pagkain:</div>
            <strong style="color: #166534; font-size: 0.95rem;">${rec.dietPlan}</strong>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.78rem; color: #64748B;">Antas ng Pagsunod:</div>
            <strong style="font-size: 1.25rem; color: ${rec.adherenceRate >= 80 ? '#16A34A' : '#DC2626'};">${rec.adherenceRate}%</strong>
          </div>
        </div>

        <div style="font-size: 0.82rem; color: #334155; line-height: 1.45;">
          <strong>Huling Naitalang Pagkain:</strong> ${rec.lastMealLogged || 'Walang log'} (${rec.lastMealDate || '-'})
        </div>
      </div>

      <h4 style="font-size: 0.92rem; font-weight: 700; color: #1E293B; margin-bottom: 0.65rem;">
        Kasaysayan ng mga Naitalang Pagkain (Meal History):
      </h4>
      <div style="max-height: 250px; overflow-y: auto; padding-right: 4px;">
        ${historyList}
      </div>
    `;

    const sendBtn = document.getElementById('btn-food-log-send-advisory');
    if (sendBtn) {
      sendBtn.onclick = () => {
        NutriApp.closeModal('modal-family-food-log');
        MHODashboard.openDietaryAdvisory(recordId);
      };
    }

    NutriApp.openModal('modal-family-food-log');
  },

  openDietaryAdvisory(recordId) {
    const records = this.getDietaryRecords();
    const rec = records.find(r => r.id === recordId);
    if (!rec) return;

    document.getElementById('advisory-child-id').value = recordId;
    const summary = document.getElementById('advisory-family-summary');
    if (summary) {
      summary.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong>Pamilya ni ${rec.childName}</strong> (${rec.parentName})
            <div style="color:#64748B; font-size:0.78rem;">${rec.barangay} • ${rec.zone || ''}</div>
          </div>
          <span class="badge ${rec.adherenceRate >= 80 ? 'badge-improved' : 'badge-underweight'}">
            ${rec.adherenceRate}% Adherence
          </span>
        </div>
      `;
    }

    // Default preset
    this.handleAdvisoryPresetChange('malunggay');
    NutriApp.openModal('modal-dietary-advisory');
  },

  handleAdvisoryPresetChange(preset) {
    const textarea = document.getElementById('advisory-message-text');
    if (!textarea) return;

    const messages = {
      malunggay: 'Paalala mula sa Health Center: Siguraduhing magdagdag ng 1 dakot ng sariwang dahon ng malunggay at nilagang monggo sa tanghalian ng bata upang makaiwas sa stunting at mapanatiling malakas ang resistensya.',
      egg: 'Paalala mula sa Health Center: Maglaan ng 1 nilagang itlog bawat araw para sa meryenda o almusal ng bata. Ang protina at choline sa itlog ay kritikal sa paglaki at talino ng bata.',
      ration: 'Opisyal na Abiso ng MHO: Mangyaring pumunta sa Barangay Health Station ngayong darating na Biyernes (8:00 AM) upang kunin ang nakalaang Supplementary Nutri-Pack (Monggo, Enriched Rice, at Micronutrient Powder).',
      water: 'Paalala ng Kalinisan: Tiyaking malinis at pinakuluang tubig lamang ang ipapainom sa bata. Iwasan ang matatamis na powdered drinks o juice na nagdudulot ng kawalan ng gana sa masusustansyang ulam.',
      clinic: 'Paanyaya mula sa MHO: Hinihiling ang inyong pagbisita sa Barangay Nutrition Post para sa libreng height/weight check-up at pagbibigay ng Vitamin A supplementation ng inyong anak.',
      custom: ''
    };

    textarea.value = messages[preset] || '';
  },

  handleSendDietaryAdvisory(form) {
    const recordId = document.getElementById('advisory-child-id').value;
    const message = document.getElementById('advisory-message-text').value.trim();

    if (!message) {
      NutriApp.showToast('Mangyaring maglagay ng mensahe bago ipadala.', 'warning');
      return;
    }

    const records = this.getDietaryRecords();
    const rec = records.find(r => r.id === recordId);
    if (rec) {
      rec.advisories = rec.advisories || [];
      rec.advisories.unshift({
        date: new Date().toISOString().split('T')[0],
        message: message,
        sender: 'Municipal Health Office'
      });
      this.saveDietaryRecords(records);
    }

    NutriStorage.logAudit('Dietary Advisory Dispatched', 'Nutrition Monitoring', `Sent feeding advisory to family of ${rec ? rec.childName : recordId}: "${message.substring(0, 50)}..."`);
    NutriApp.closeModal('modal-dietary-advisory');
    NutriApp.showToast(`📢 Matagumpay na naipadala ang abiso sa pamilya ni ${rec ? rec.childName : 'bata'}!`, 'success');
  },


  // ==========================================================================
  // USER ACCOUNTS & ACCESS CONTROL (Req #12)
  // ==========================================================================
  userFilterRole: 'ALL',
  userSearchQuery: '',

  // ==========================================================================
  // USER MANAGEMENT SYSTEM (With Live Online Presence & Working Edit Modal)
  // ==========================================================================
  userFilterRole: 'ALL',
  userSearchQuery: '',

  initUserManager() {
    this.renderUsersTable();
  },

  handleUserSearch(query) {
    this.userSearchQuery = (query || '').toLowerCase().trim();
    this.renderUsersTable();
  },

  filterUsersByRole(filterRole) {
    this.userFilterRole = filterRole || 'ALL';

    // Update active pill styling
    document.querySelectorAll('.admin-user-pill-btn').forEach(btn => {
      const match = btn.getAttribute('data-filter') === this.userFilterRole;
      btn.classList.toggle('active', match);
    });

    this.renderUsersTable();
  },

  renderUsersTable() {
    const tbody = document.getElementById('admin-users-tbody') || document.getElementById('mho-users-tbody');
    if (!tbody) return;

    let users = NutriStorage.getUsers();

    // Exclude root admin from the general user listing
    users = users.filter(u => u.role !== 'mho');

    // Update online counter in header chip
    let onlineCount = 0;
    users.forEach(u => {
      if (NutriStorage.isUserOnline(u.id)) onlineCount++;
    });
    const chipCount = document.getElementById('admin-online-count-display');
    if (chipCount) {
      chipCount.textContent = `${onlineCount} User${onlineCount === 1 ? '' : 's'} Online Now`;
    }
    const onlinePill = document.getElementById('pill-filter-online');
    if (onlinePill) {
      onlinePill.textContent = `🟢 Online Now (${onlineCount})`;
    }

    // Filter by role or ONLINE pill
    if (this.userFilterRole === 'ONLINE') {
      users = users.filter(u => NutriStorage.isUserOnline(u.id));
    } else if (this.userFilterRole !== 'ALL') {
      users = users.filter(u => u.role === this.userFilterRole);
    }

    // Filter by search query
    if (this.userSearchQuery) {
      users = users.filter(u =>
        (u.name || '').toLowerCase().includes(this.userSearchQuery) ||
        (u.role || '').toLowerCase().includes(this.userSearchQuery) ||
        (u.location || u.barangay || '').toLowerCase().includes(this.userSearchQuery) ||
        (u.email || '').toLowerCase().includes(this.userSearchQuery)
      );
    }

    if (users.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:2.5rem; color:#6B7280;">
            No users found matching your search criteria.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = users.map(u => {
      const isHealthWorker = u.role === 'chw' || u.role === 'collector';
      const roleBadgeClass = isHealthWorker ? 'role-badge-chw' : 'role-badge-parent';
      const roleText = isHealthWorker ? 'Health Worker' : 'Parent/Guardian';

      const isOnline = NutriStorage.isUserOnline(u.id);
      const presenceBadge = isOnline
        ? `<span class="user-presence-tag presence-online" title="Online ngayon (Kasalukuyang aktibo sa system)"><span class="user-online-beacon"></span>Online</span>`
        : `<span class="user-presence-tag presence-offline" title="Offline">Offline</span>`;

      const isActive = u.status === 'Active';
      const statusClass = isActive ? 'status-active' : 'status-inactive';
      const bulletClass = isActive ? 'bullet-active' : 'bullet-inactive';
      const statusText = isActive ? 'Active' : 'Inactive';

      const lastLoginDisplay = isOnline
        ? `<span style="color:#059669; font-weight:600;"><span class="user-online-beacon" style="width:6px; height:6px; margin-right:4px;"></span>Active now</span>`
        : (u.lastLogin || 'Today');

      const location = u.location || u.barangay || 'Zone 1, Barangay Manguring';

      const toggleBtnClass = isActive ? 'btn-user-deactivate' : 'btn-user-reactivate';
      const toggleBtnText = isActive ? 'Deactivate' : 'Reactivate';

      return `
        <tr id="user-row-${u.id}">
          <td>
            <div class="user-name-wrapper">
              <span class="user-cell-name">${u.name}</span>
              ${presenceBadge}
            </div>
          </td>
          <td>
            <span class="user-role-badge ${roleBadgeClass}">${roleText}</span>
          </td>
          <td>
            <span class="user-cell-location">${location}</span>
          </td>
          <td>
            <span class="user-status-cell ${statusClass}">
              <span class="status-bullet ${bulletClass}">●</span>
              ${statusText}
            </span>
          </td>
          <td>
            <span class="user-cell-last-login">${lastLoginDisplay}</span>
          </td>
          <td>
            <div class="user-cell-actions">
              <button type="button" class="btn-user-action btn-user-edit" onclick="MHODashboard.openEditUserModal('${u.id}')">
                Edit
              </button>
              <button type="button" class="btn-user-action ${toggleBtnClass}" onclick="MHODashboard.toggleUserActiveStatus('${u.id}')">
                ${toggleBtnText}
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  toggleUserActiveStatus(userId) {
    const newStatus = NutriStorage.toggleUserStatus(userId);
    this.renderUsersTable();
    NutriApp.showToast(`User status changed to ${newStatus}`, newStatus === 'Active' ? 'success' : 'warning');
  },

  openAddUserModal() {
    const form = document.querySelector('#modal-admin-add-user form');
    if (form) form.reset();
    NutriApp.openModal('modal-admin-add-user');
  },

  openEditUserModal(userId) {
    const users = NutriStorage.getUsers();
    const user = users.find(u => String(u.id) === String(userId));
    if (!user) {
      NutriApp.showToast('User not found.', 'warning');
      return;
    }

    const idInput = document.getElementById('admin-edit-user-id');
    const nameInput = document.getElementById('admin-edit-user-name');
    const emailInput = document.getElementById('admin-edit-user-email');
    const roleInput = document.getElementById('admin-edit-user-role');
    const locInput = document.getElementById('admin-edit-user-location');
    const statusInput = document.getElementById('admin-edit-user-status');
    const presenceInput = document.getElementById('admin-edit-user-presence');

    if (idInput) idInput.value = user.id;
    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';
    if (roleInput) roleInput.value = user.role === 'chw' ? 'chw' : 'parent';
    if (locInput) locInput.value = user.location || user.barangay || 'Zone 1, Barangay Manguring';
    if (statusInput) statusInput.value = user.status || 'Active';
    if (presenceInput) presenceInput.value = NutriStorage.isUserOnline(user.id) ? 'online' : 'offline';

    NutriApp.openModal('modal-admin-edit-user');
  },

  handleSaveEditUser(form) {
    const userId = form.elements['editUserId'].value;
    const name = form.elements['editUserName'].value.trim();
    const email = form.elements['editUserEmail'].value.trim();
    const role = form.elements['editUserRole'].value;
    const location = form.elements['editUserLocation'].value.trim();
    const status = form.elements['editUserStatus'] ? form.elements['editUserStatus'].value : 'Active';
    const presence = form.elements['editUserPresence'] ? form.elements['editUserPresence'].value : 'online';

    if (!name || !email) {
      NutriApp.showToast('Please fill in user name and email.', 'warning');
      return;
    }

    const users = NutriStorage.getUsers();
    const user = users.find(u => String(u.id) === String(userId));
    if (user) {
      user.name = name;
      user.email = email;
      user.role = role;
      user.displayRole = role === 'chw' ? 'Health Worker' : 'Parent/Guardian';
      user.location = location;
      user.barangay = location.includes('Manguring') || location.includes('Manguiring') ? 'Barangay Manguring' : 'Barangay Manguiring';
      user.status = status;
      NutriStorage.updateUser(user);

      // Update presence
      NutriStorage.setUserOnlinePresence(userId, presence === 'online');

      NutriApp.closeModal('modal-admin-edit-user');
      this.renderUsersTable();
      NutriApp.showToast(`User ${name} updated successfully!`, 'success');
    }
  },

  handleCreateUserAdmin(form) {
    const name = form.elements['adminUserName'].value.trim();
    const email = form.elements['adminUserEmail'].value.trim();
    const password = form.elements['adminUserPass'].value;
    const role = form.elements['adminUserRole'].value;
    const barangay = form.elements['adminUserBarangay'] ? form.elements['adminUserBarangay'].value : 'Barangay Manguring';

    if (!name || !email || !password) {
      NutriApp.showToast('Please fill in all required fields.', 'warning');
      return;
    }

    const newId = 'usr-' + Date.now();
    const newUser = {
      id: newId,
      name,
      email,
      password,
      role,
      displayRole: role === 'chw' ? 'Health Worker' : 'Parent/Guardian',
      location: `Zone 1, ${barangay}`,
      barangay,
      status: 'Active',
      lastLogin: 'Today',
      registeredDate: new Date().toISOString().split('T')[0]
    };

    NutriStorage.registerUser(newUser);
    NutriStorage.setUserOnlinePresence(newId, true);
    form.reset();
    NutriApp.closeModal('modal-admin-add-user');
    this.renderUsersTable();
    NutriApp.showToast(`🎉 User ${name} successfully created!`, 'success');
  },

  // ==========================================================================
  // AUDIT & ADMINISTRATION ACTIVITY TRAIL (Data Requirements #10)
  // ==========================================================================
  auditSearchQuery: '',
  auditFilterCategory: 'ALL',

  initAuditManager() {
    this.renderAuditLogsTable();

    const searchInput = document.getElementById('mho-audit-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.auditSearchQuery = e.target.value.toLowerCase();
        this.renderAuditLogsTable();
      });
    }

    const catFilter = document.getElementById('mho-audit-category-filter');
    if (catFilter) {
      catFilter.addEventListener('change', (e) => {
        this.auditFilterCategory = e.target.value;
        this.renderAuditLogsTable();
      });
    }
  },

  renderAuditLogsTable() {
    const tbody = document.getElementById('mho-audit-tbody');
    let allLogs = NutriStorage.getAuditLogs();

    // Update KPI summary counters if elements exist
    const totalEl = document.getElementById('audit-kpi-total');
    const accEl = document.getElementById('audit-kpi-accounts');
    const childEl = document.getElementById('audit-kpi-children');
    const contentEl = document.getElementById('audit-kpi-content');

    if (totalEl) totalEl.textContent = allLogs.length;
    if (accEl) accEl.textContent = allLogs.filter(l => l.category === 'Account Management').length;
    if (childEl) childEl.textContent = allLogs.filter(l => l.category === 'Field Health Record').length;
    if (contentEl) contentEl.textContent = allLogs.filter(l => l.category === 'Content Manager' || l.category === 'Content & Curricula').length;

    if (!tbody) return;

    let logs = [...allLogs];

    if (this.auditFilterCategory !== 'ALL') {
      logs = logs.filter(l => l.category === this.auditFilterCategory);
    }

    if (this.auditSearchQuery) {
      logs = logs.filter(l =>
        (l.action || '').toLowerCase().includes(this.auditSearchQuery) ||
        (l.details || '').toLowerCase().includes(this.auditSearchQuery) ||
        (l.performedBy || '').toLowerCase().includes(this.auditSearchQuery) ||
        (l.category || '').toLowerCase().includes(this.auditSearchQuery) ||
        (l.timestamp || '').toLowerCase().includes(this.auditSearchQuery)
      );
    }

    if (logs.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:2.5rem 1rem; color:var(--text-muted);">
            <div style="font-size:2rem; margin-bottom:0.5rem; opacity:0.6;">🛡️</div>
            <div style="font-weight:700; color:#475569;">Walang natagpuang tala sa audit logs</div>
            <div style="font-size:0.8rem; color:#94A3B8; margin-top:0.25rem;">Subukang palitan ang filter o mag-search ng ibang keyword.</div>
          </td>
        </tr>
      `;
      return;
    }

    const catBadgeStyles = {
      'Account Management': 'background:#EFF6FF; color:#1E40AF; border:1px solid #BFDBFE;',
      'Field Health Record': 'background:#DCFCE7; color:#166534; border:1px solid #BBF7D0;',
      'Content Manager': 'background:#FEF3C7; color:#92400E; border:1px solid #FDE68A;',
      'Content & Curricula': 'background:#FEF3C7; color:#92400E; border:1px solid #FDE68A;',
      'Nutrition Monitoring': 'background:#F0FDF4; color:#15803D; border:1px solid #DCFCE7;',
      'Report & Endorsement': 'background:#E0E7FF; color:#3730A3; border:1px solid #C7D2FE;',
      'Group & Instruction': 'background:#F3E8FF; color:#6B21A8; border:1px solid #E9D5FF;',
      'Security & Access': 'background:#FEE2E2; color:#991B1B; border:1px solid #FECACA;'
    };

    const roleBadgeStyles = {
      'parent': 'background:#F0FDF4; color:#15803D; border:1px solid #DCFCE7;',
      'chw': 'background:#EFF6FF; color:#1D4ED8; border:1px solid #BFDBFE;',
      'collector': 'background:#F5F3FF; color:#6D28D9; border:1px solid #DDD6FE;',
      'mho': 'background:#FEF2F2; color:#B91C1C; border:1px solid #FECACA;'
    };

    tbody.innerHTML = logs.map(l => {
      // Split date and time gracefully
      let dateText = l.date || '';
      let timeText = l.time || '';
      if (!dateText || !timeText) {
        const parts = (l.timestamp || '').split(',');
        dateText = parts[0] ? parts[0].trim() : '-';
        timeText = parts[1] ? parts[1].trim() : '';
      }

      const roleKey = (l.userRole || 'mho').toLowerCase();
      const roleStyle = roleBadgeStyles[roleKey] || 'background:#F1F5F9; color:#475569;';

      return `
        <tr>
          <td style="white-space:nowrap; vertical-align:top;">
            <div style="font-weight:700; color:#1E293B; font-size:0.83rem; display:flex; align-items:center; gap:0.35rem;">
              <span>📅</span> ${dateText}
            </div>
            ${timeText ? `<div style="font-size:0.75rem; color:#64748B; font-family:monospace; margin-top:2px; display:flex; align-items:center; gap:0.35rem;">
              <span>⏰</span> ${timeText}
            </div>` : ''}
          </td>
          <td style="vertical-align:top;">
            <span class="badge" style="${catBadgeStyles[l.category] || 'background:#F1F5F9; color:#475569; border:1px solid #E2E8F0;'} font-size:0.75rem; font-weight:600; padding:3px 8px; border-radius:6px; display:inline-block;">
              ${l.category}
            </span>
          </td>
          <td style="vertical-align:top;">
            <strong style="color:var(--color-primary-900); font-size:0.88rem; display:block;">${l.action}</strong>
          </td>
          <td style="vertical-align:top;">
            <div style="font-size:0.82rem; color:#334155; line-height:1.45; word-break:break-word;">
              ${l.details || '-'}
            </div>
          </td>
          <td style="vertical-align:top; white-space:nowrap;">
            <span style="font-weight:700; font-size:0.83rem; color:var(--text-primary); display:block;">${l.performedBy}</span>
          </td>
          <td style="vertical-align:top;">
            <span class="badge" style="${roleStyle} font-size:0.72rem; text-transform:uppercase; font-weight:700; padding:2px 7px; border-radius:6px;">
              ${roleKey}
            </span>
          </td>
        </tr>
      `;
    }).join('');
  },

  handleClearAuditLogs() {
    if (confirm('Sigurado ka bang nais mong burahin ang administrative audit log history? Hindi na ito mababawi.')) {
      NutriStorage.clearAuditLogs();
      this.renderAuditLogsTable();
      NutriApp.showToast('Nalinis na ang audit log history.', 'info');
    }
  },

  // ==========================================================================
  // FIELD RECORDS (Malnutrition Registry & Barangay Tracking)
  // ==========================================================================
  currentFieldStatusFilter: 'ALL',

  formatAgeDisplay(months) {
    const m = parseInt(months, 10) || 0;
    if (m === 12) return '1 yr';
    if (m === 24) return '2 yrs';
    if (m > 0 && m % 12 === 0) return `${Math.floor(m / 12)} yrs`;
    return `${m} mo`;
  },

  formatDateDisplay(dateStr) {
    if (!dateStr) return 'Aug 22, 2026';
    if (/^[A-Za-z]{3}\s+\d{1,2},\s+\d{4}$/.test(dateStr)) return dateStr;
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
      }
    } catch (e) {}
    return dateStr;
  },

  setFieldStatusFilter(status, btnElement) {
    this.currentFieldStatusFilter = status || 'ALL';
    const pills = document.querySelectorAll('.btn-field-pill');
    pills.forEach(p => {
      if (p.getAttribute('data-status') === this.currentFieldStatusFilter) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
    this.renderAdminRecords();
  },

  toggleFieldRecordAccordion(recordId, btn) {
    const accRow = document.getElementById(`field-accordion-${recordId}`);
    if (!accRow) return;
    const isHidden = (accRow.style.display === 'none' || !accRow.style.display);
    if (isHidden) {
      accRow.style.display = 'table-row';
      if (btn) btn.classList.add('open');
    } else {
      accRow.style.display = 'none';
      if (btn) btn.classList.remove('open');
    }
  },

  getAdminChildrenRecords() {
    const liveChildren = (typeof NutriStorage !== 'undefined') ? NutriStorage.getChildren() : [];

    return liveChildren.map(c => {
      const fullName = (c.name || '').trim() || [c.first_name, c.last_name].filter(Boolean).join(' ') || 'Unnamed Child';
      const parentName = (c.parentName || c.parent_name || 'Parent / Guardian').trim();
      const brgy = (c.barangay || 'Barangay Manguiring').trim();
      let zn = (c.zone || 'Zone 1').trim();
      if (!zn.toLowerCase().includes('manguiring') && !zn.toLowerCase().includes('barangay')) {
        zn = `${zn}, ${brgy}`;
      }
      const ageVal = parseInt(c.ageMonths || c.age_months || 12, 10);
      const hVal = parseFloat(c.heightCm || c.height_cm || 75.0);
      const wVal = parseFloat(c.weightKg || c.weight_kg || 9.0);
      const muacVal = parseInt(c.muacMm || c.muac_mm || 125, 10);
      const st = c.status || (c.improved ? 'Normal' : (muacVal < 115 ? 'At Risk' : 'Normal'));
      const hfa = c.hfaStatus || c.hfa_status || (st === 'Stunted' ? 'Stunted' : 'Normal');
      const wfa = c.wfaStatus || c.wfa_status || 'Normal';
      const dt = c.date || c.lastAssessed || c.last_assessed || 'Aug 22, 2026';
      const submittedBy = c.submittedBy || c.submitted_by || 'Nurse Ana Reyes';

      return {
        id: c.id,
        name: fullName,
        parent: parentName,
        barangay: brgy,
        zone: zn,
        age: ageVal,
        sex: c.sex || 'Male',
        h: hVal,
        w: wVal,
        muac: muacVal,
        status: st,
        hfa: hfa,
        wfa: wfa,
        dewormingStatus: c.dewormingStatus || c.deworming_status || 'Up to Date',
        dewormingDate: c.dewormingDate || c.deworming_date || '',
        dewormingNextDate: c.dewormingNextDate || c.deworming_next_date || '',
        date: dt,
        submittedBy: submittedBy,
        improved: !!c.improved,
        notes: c.notes || ''
      };
    });
  },

  renderAdminRecords() {
    const tbody = document.getElementById('admin-field-records-tbody') || document.getElementById('admin-records-tbody');
    if (!tbody) return;

    const records = this.getAdminChildrenRecords();

    // 1. Update 4 Metric Summary Cards
    const totalCount = records.length;
    const stuntedCount = records.filter(r => r.status === 'Stunted' || r.hfa === 'Stunted').length;
    const atRiskCount = records.filter(r => (r.status === 'At Risk' || r.status === 'Underweight' || r.status === 'Wasted' || r.status === 'Critical' || r.status === 'Moderate') && r.status !== 'Stunted' && r.hfa !== 'Stunted').length;
    const normalCount = records.filter(r => r.status === 'Normal' || r.status === 'Improved').length;

    const totalEl = document.getElementById('admin-field-total-count');
    if (totalEl) totalEl.textContent = totalCount;
    const stuntedEl = document.getElementById('admin-field-stunted-count');
    if (stuntedEl) stuntedEl.textContent = stuntedCount;
    const atRiskEl = document.getElementById('admin-field-atrisk-count');
    if (atRiskEl) atRiskEl.textContent = atRiskCount;
    const normalEl = document.getElementById('admin-field-normal-count');
    if (normalEl) normalEl.textContent = normalCount;

    // 2. Search & Pill Status Filters
    const searchInput = document.getElementById('admin-field-search') || document.getElementById('admin-records-search');
    const search = (searchInput?.value || '').toLowerCase().trim();
    const statusFilter = this.currentFieldStatusFilter || 'ALL';

    const filtered = records.filter(r => {
      // Search
      const matchSearch = !search ||
        r.name.toLowerCase().includes(search) ||
        r.parent.toLowerCase().includes(search) ||
        r.zone.toLowerCase().includes(search) ||
        r.submittedBy.toLowerCase().includes(search) ||
        r.barangay.toLowerCase().includes(search);

      // Status
      let matchStatus = true;
      if (statusFilter === 'Normal') {
        matchStatus = (r.status === 'Normal' || r.status === 'Improved');
      } else if (statusFilter === 'At Risk') {
        matchStatus = (r.status === 'At Risk' || r.status === 'Underweight' || r.status === 'Wasted' || r.status === 'Critical' || r.status === 'Moderate') && r.status !== 'Stunted' && r.hfa !== 'Stunted';
      } else if (statusFilter === 'Stunted') {
        matchStatus = (r.status === 'Stunted' || r.hfa === 'Stunted');
      }

      return matchSearch && matchStatus;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:3rem; color:#78716C; font-size:0.92rem;">Walang talaan ng bata na tugma sa iyong paghahanap o filter.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(r => {
      const ageStr = this.formatAgeDisplay(r.age);
      const dateStr = this.formatDateDisplay(r.date);
      const weightStr = `${parseFloat(r.w).toFixed(1)} kg`;

      let statusBadge = '<span class="field-badge-normal">Normal</span>';
      if (r.status === 'Stunted' || r.hfa === 'Stunted') {
        statusBadge = '<span class="field-badge-stunted">Stunted</span>';
      } else if (r.status === 'At Risk' || r.status === 'Underweight' || r.status === 'Wasted' || r.status === 'Critical' || r.status === 'Moderate') {
        statusBadge = '<span class="field-badge-atrisk">At Risk</span>';
      }

      return `
        <tr id="field-row-${r.id}">
          <td><span class="field-child-name">${r.name}</span></td>
          <td>${r.parent}</td>
          <td>${r.zone}</td>
          <td>${ageStr}</td>
          <td><span class="field-weight-text">${weightStr}</span></td>
          <td>${statusBadge}</td>
          <td>${r.submittedBy}</td>
          <td>${dateStr}</td>
          <td style="text-align: center;">
            <button type="button" class="btn-field-expand" id="field-expand-btn-${r.id}" onclick="MHODashboard.toggleFieldRecordAccordion('${r.id}', this)" title="Tingnan ang detalye at aksyon">
              ▼
            </button>
          </td>
        </tr>
        <tr id="field-accordion-${r.id}" style="display: none;">
          <td colspan="9" style="padding: 0;">
            <div class="field-row-accordion">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; font-size: 0.86rem; color: #334155;">
                  <div><strong>Taas (Height):</strong> ${r.h} cm</div>
                  <div><strong>Timbang (Weight):</strong> ${r.w} kg</div>
                  <div><strong>MUAC:</strong> <span style="font-weight: 700; color: ${r.muac < 115 ? '#DC2626' : '#166534'};">${r.muac} mm</span></div>
                  <div><strong>Kasarian (Sex):</strong> ${r.sex}</div>
                  <div><strong>HFA Status:</strong> ${r.hfa}</div>
                  <div><strong>WFA Status:</strong> ${r.wfa}</div>
                  <div><strong>💊 Deworming (Purga):</strong> <span class="badge ${(r.dewormingStatus === 'Due for Deworming' || r.dewormingStatus === 'Due') ? 'badge-underweight' : 'badge-normal'}" style="font-size:0.75rem;">${r.dewormingStatus}</span> ${r.dewormingDate ? `(${r.dewormingDate})` : ''}</div>
                  ${r.notes ? `<div><strong>Notes:</strong> <em>${r.notes}</em></div>` : ''}
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <button type="button" class="btn btn-outline btn-sm" style="font-size: 0.8rem; font-weight: 600; padding: 5px 12px; border-radius: 6px; border-color: #0284C7; color: #0284C7;" onclick="MHODashboard.openAdminEditChild('${r.id}')" title="I-update ang mga sukat ng bata">
                    ✏️ I-update ang Sukat
                  </button>
                  <button type="button" class="btn btn-outline btn-sm" style="font-size: 0.8rem; font-weight: 600; padding: 5px 10px; border-radius: 6px; border-color: #FCA5A5; color: #DC2626;" onclick="MHODashboard.handleDeleteChildRecord('${r.id}')" title="Burahin ang talaan ng bata mula sa registry">
                    🗑️ Burahin
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  filterAdminRecords() {
    this.renderAdminRecords();
  },

  // Open Admin Edit Child Measurements with Barangay Restriction
  openAdminEditChild(childId) {
    const children = NutriStorage.getChildren();
    const child = children.find(c => String(c.id) === String(childId));
    if (!child) {
      NutriApp.showToast('Hindi natagpuan ang talaan ng bata.', 'error');
      return;
    }

    const childBrgy = (child.barangay || 'Barangay Manguiring').trim();

    // STRICT BARANGAY VALIDATION:
    // "kung anong barangay ang tig select kang admin iyo lang ito ang ma uupdate niya"
    if (this.selectedBarangay && this.selectedBarangay !== 'ALL' && childBrgy !== this.selectedBarangay) {
      alert(`⚠️ HINDI MAAARING I-UPDATE:\n\nAng kasalukuyang piniling barangay mo ay "${this.selectedBarangay}".\nAng talaang ito ay kabilang sa "${childBrgy}".\n\nAyon sa patakaran ng Administrator, kung anong barangay ang iyong pinili, iyo lamang ito ang maaari mong i-update.`);
      return;
    }

    // If ALL was selected, prompt to set active barangay
    if (this.selectedBarangay === 'ALL') {
      const proceed = confirm(`Ang talaang ito ay kabilang sa "${childBrgy}".\n\nNais mo bang itakda ang aktibong barangay sa "${childBrgy}" upang ma-update ang talaan nito?`);
      if (!proceed) return;
      this.setSelectedBarangay(childBrgy);
    }

    const childName = (child.name || '').trim() || [child.first_name, child.last_name].filter(Boolean).join(' ') || 'Unnamed Child';
    const parentName = (child.parentName || child.parent_name || 'Parent / Guardian').trim();

    document.getElementById('admin-edit-child-id').value = child.id;
    document.getElementById('admin-edit-child-barangay').value = childBrgy;
    document.getElementById('admin-edit-child-name').value = childName;
    document.getElementById('admin-edit-child-parent').value = parentName;
    document.getElementById('admin-edit-child-zone').value = child.zone || 'Zone 1';
    document.getElementById('admin-edit-child-age').value = parseInt(child.ageMonths || child.age_months || 12, 10);
    document.getElementById('admin-edit-child-height').value = parseFloat(child.heightCm || child.height_cm || 75.0);
    document.getElementById('admin-edit-child-weight').value = parseFloat(child.weightKg || child.weight_kg || 9.0);
    document.getElementById('admin-edit-child-muac').value = parseInt(child.muacMm || child.muac_mm || 125, 10);
    document.getElementById('admin-edit-child-status').value = child.status || 'Normal';
    document.getElementById('admin-edit-child-notes').value = child.notes || '';

    const dewormStatusEl = document.getElementById('admin-edit-child-deworming-status');
    const dewormDateEl = document.getElementById('admin-edit-child-deworming-date');
    const dewormNextEl = document.getElementById('admin-edit-child-deworming-next-date');
    if (dewormStatusEl) dewormStatusEl.value = child.dewormingStatus || child.deworming_status || 'Up to Date';
    if (dewormDateEl) dewormDateEl.value = child.dewormingDate || child.deworming_date || '';
    if (dewormNextEl) dewormNextEl.value = child.dewormingNextDate || child.deworming_next_date || '';

    const birthDateEl = document.getElementById('admin-edit-child-birthdate');
    if (birthDateEl) birthDateEl.value = child.birthDate || child.birth_date || '';

    const brgyBadge = document.getElementById('admin-edit-child-brgy-badge');
    if (brgyBadge) {
      brgyBadge.textContent = childBrgy;
    }

    NutriApp.openModal('modal-admin-edit-child');
  },

  // Save Admin Child Measurement Update
  handleSaveAdminEditedChild(form) {
    const id = document.getElementById('admin-edit-child-id').value;
    const children = NutriStorage.getChildren();
    const child = children.find(c => String(c.id) === String(id));
    if (!child) {
      NutriApp.showToast('Hindi natagpuan ang bata sa database.', 'error');
      return;
    }

    const childBrgy = (child.barangay || 'Barangay Manguiring').trim();

    // Verify again that only the selected barangay can be updated
    if (this.selectedBarangay && this.selectedBarangay !== 'ALL' && childBrgy !== this.selectedBarangay) {
      alert(`Hindi pinahihintulutan: Tanging mga talaan lamang ng ${this.selectedBarangay} ang maaaring i-update.`);
      return;
    }

    const height = parseFloat(document.getElementById('admin-edit-child-height').value);
    const weight = parseFloat(document.getElementById('admin-edit-child-weight').value);
    const muac = parseInt(document.getElementById('admin-edit-child-muac').value, 10);
    const ageEl = document.getElementById('admin-edit-child-age');
    const age = ageEl ? parseInt(ageEl.value, 10) : (child.ageMonths || child.age_months || 24);
    const zoneEl = document.getElementById('admin-edit-child-zone');
    const zone = zoneEl ? zoneEl.value : (child.zone || 'Zone 1');
    const status = document.getElementById('admin-edit-child-status').value;
    const notes = document.getElementById('admin-edit-child-notes').value.trim();

    const birthDateInput = document.getElementById('admin-edit-child-birthdate');
    if (birthDateInput && birthDateInput.value) {
      child.birthDate = birthDateInput.value;
      child.birth_date = birthDateInput.value;
    }

    const dewormStatus = document.getElementById('admin-edit-child-deworming-status')?.value || 'Up to Date';
    const dewormDate = document.getElementById('admin-edit-child-deworming-date')?.value || '';
    const dewormNext = document.getElementById('admin-edit-child-deworming-next-date')?.value || '';

    if (isNaN(height) || height <= 0 || isNaN(weight) || weight <= 0) {
      alert('Pakiusap ilagay ang wastong sukat ng tangkad at timbang.');
      return;
    }

    // Auto-calculate WHO standards if available
    let hfaClass = child.hfaStatus || 'Normal';
    let wfaClass = child.wfaStatus || 'Normal';
    if (typeof WHO_STANDARDS !== 'undefined' && WHO_STANDARDS.heightForAge && WHO_STANDARDS.heightForAge[age]) {
      const ref = WHO_STANDARDS.heightForAge[age];
      const cutoff = child.sex === 'Female' ? ref.femaleCutoff : ref.maleCutoff;
      hfaClass = height < cutoff ? 'Stunted' : 'Normal';
    }
    if (typeof WHO_STANDARDS !== 'undefined' && WHO_STANDARDS.weightForAge && WHO_STANDARDS.weightForAge[age]) {
      const ref = WHO_STANDARDS.weightForAge[age];
      const cutoff = child.sex === 'Female' ? ref.femaleCutoff : ref.maleCutoff;
      wfaClass = weight < cutoff ? 'Underweight' : 'Normal';
    }
    const muacClass = muac < 115 ? 'Severe' : (muac < 125 ? 'Moderate' : 'Normal');

    // Update child record fields
    child.heightCm = height;
    child.weightKg = weight;
    child.muacMm = muac;
    child.ageMonths = age;
    child.zone = zone;
    child.status = status;
    child.hfaStatus = hfaClass;
    child.wfaStatus = wfaClass;
    child.muacStatus = muacClass;
    child.dewormingStatus = dewormStatus;
    child.dewormingDate = dewormDate;
    child.dewormingNextDate = dewormNext;
    child.improved = (status === 'Improved');
    child.notes = notes;
    child.lastAssessed = new Date().toISOString().split('T')[0];

    NutriStorage.updateChild(child);

    NutriStorage.logAudit(
      'Child Record Updated by Administrator',
      'Field Health Record',
      `Admin updated measurements for ${child.name || 'Child'} in ${childBrgy}: Height ${height}cm, Weight ${weight}kg, MUAC ${muac}mm, Deworming: ${dewormStatus}, Status: ${status}`,
      'Administrator'
    );

    NutriApp.closeModal('modal-admin-edit-child');
    this.renderAdminRecords();
    this.renderKPIs();
    NutriApp.showToast(`Matagumpay na na-update ang talaan ni ${child.name || 'bata'} para sa ${childBrgy}!`, 'success');
  },

  // Delete Child Record from Field Records
  handleDeleteChildRecord(childId) {
    const children = NutriStorage.getChildren();
    const child = children.find(c => String(c.id) === String(childId));
    if (!child) {
      NutriApp.showToast('Hindi natagpuan ang talaan ng bata.', 'error');
      return;
    }

    const childName = (child.name || '').trim() || [child.first_name, child.last_name].filter(Boolean).join(' ') || 'Bata';
    const childBrgy = (child.barangay || 'Barangay Manguiring').trim();

    // Check barangay restriction if selected
    if (this.selectedBarangay && this.selectedBarangay !== 'ALL' && childBrgy !== this.selectedBarangay) {
      alert(`⚠️ HINDI MAAARING BURAHIN:\n\nAng kasalukuyang piniling barangay mo ay "${this.selectedBarangay}".\nAng talaang ito ay kabilang sa "${childBrgy}".\n\nAyon sa patakaran ng Administrator, tanging mga talaan lamang ng iyong piniling barangay ang maaaring pamahalaan.`);
      return;
    }

    const confirmDelete = confirm(`⚠️ KUMPIRMASYON NG PAGBURA:\n\nSigurado ka bang nais mong alisin / burahin ang talaan ni "${childName}" (${childBrgy}) mula sa Field Records?\n\nBabala: Ang aksyong ito ay permanente at tatanggalin ang talaan sa health registry.`);
    if (!confirmDelete) return;

    NutriStorage.deleteChild(childId);

    // If edit modal is currently open, close it
    if (document.getElementById('modal-admin-edit-child')?.classList.contains('active')) {
      NutriApp.closeModal('modal-admin-edit-child');
    }

    this.renderAdminRecords();
    this.renderKPIs();
    if (typeof CHWModule !== 'undefined' && typeof CHWModule.renderRegistryTable === 'function') {
      CHWModule.renderRegistryTable();
      CHWModule.updateStatsBar();
    }
    if (window.ParentModule && typeof ParentModule.renderChildGrowth === 'function') {
      ParentModule.renderChildGrowth();
    }

    NutriApp.showToast(`🗑️ Matagumpay na naalis ang talaan ni "${childName}"!`, 'info');
  },

  // Delete Child triggered from Admin Edit Child modal footer
  handleDeleteChildFromModal() {
    const id = document.getElementById('admin-edit-child-id')?.value;
    if (id) {
      this.handleDeleteChildRecord(id);
    } else {
      NutriApp.showToast('Walang aktibong talaan na napili para burahin.', 'error');
    }
  },

  // Open Admin Add Child Modal locked to currently selected barangay
  openAdminAddChild() {
    const targetBrgy = (this.selectedBarangay && this.selectedBarangay !== 'ALL') ? this.selectedBarangay : 'Barangay Manguiring';
    const brgyInput = document.getElementById('admin-add-child-barangay');
    const brgyBadge = document.getElementById('admin-add-child-brgy-badge');

    if (brgyInput) brgyInput.value = targetBrgy;
    if (brgyBadge) brgyBadge.textContent = targetBrgy;

    NutriApp.openModal('modal-admin-add-child');
  },

  // Save Admin Added Child
  handleSaveAdminAddChild(form) {
    const targetBrgy = form.elements['childBarangay'].value || (this.selectedBarangay !== 'ALL' ? this.selectedBarangay : 'Barangay Manguiring');
    const name = form.elements['childName'].value.trim();
    const parentName = form.elements['parentName'].value.trim();
    const sex = form.elements['childSex'].value;
    const zone = form.elements['childZone'].value;
    const age = parseInt(form.elements['childAge'].value, 10);
    const height = parseFloat(form.elements['childHeight'].value);
    const weight = parseFloat(form.elements['childWeight'].value);
    const muac = parseInt(form.elements['childMuac'].value, 10);
    const phone = form.elements['parentPhone'].value.trim();
    const notes = form.elements['childNotes'].value.trim();

    if (!name || isNaN(height) || isNaN(weight) || isNaN(age)) {
      alert('Pakiusap punan ang lahat ng kinakailangang impormasyon.');
      return;
    }

    let hfaClass = 'Normal';
    if (typeof WHO_STANDARDS !== 'undefined' && WHO_STANDARDS.heightForAge && WHO_STANDARDS.heightForAge[age]) {
      const ref = WHO_STANDARDS.heightForAge[age];
      const cutoff = sex === 'Female' ? ref.femaleCutoff : ref.maleCutoff;
      hfaClass = height < cutoff ? 'Stunted' : 'Normal';
    }

    let status = 'Normal';
    if (muac < 115) {
      status = 'Critical';
    } else if (hfaClass === 'Stunted') {
      status = 'Stunted';
    }

    const newChild = {
      id: 'ch-' + Date.now(),
      name: name,
      parentName: parentName,
      parentPhone: phone,
      barangay: targetBrgy,
      zone: zone,
      sex: sex,
      ageMonths: age,
      heightCm: height,
      weightKg: weight,
      muacMm: muac,
      status: status,
      hfaStatus: hfaClass,
      wfaStatus: 'Normal',
      wfhStatus: 'Normal',
      muacStatus: muac < 115 ? 'Severe' : (muac < 125 ? 'Moderate' : 'Normal'),
      improved: false,
      lastAssessed: new Date().toISOString().split('T')[0],
      notes: notes || `Rehistro ng Administrator para sa ${targetBrgy}.`
    };

    NutriStorage.addChild(newChild);

    NutriStorage.logAudit(
      'New Child Enrolled by Administrator',
      'Field Health Record',
      `Admin enrolled ${name} in ${targetBrgy} (${zone})`,
      'Administrator'
    );

    NutriApp.closeModal('modal-admin-add-child');
    form.reset();
    this.renderAdminRecords();
    this.renderKPIs();
    NutriApp.showToast(`Matagumpay na naidagdag si ${name} sa ${targetBrgy}!`, 'success');
  },

  handleSaveEditChild(form) {
    return this.handleSaveAdminEditedChild(form);
  },

  // =========================================================================
  // BARANGAY MANAGEMENT (Add & Edit Barangay for Administrator Phase)
  // =========================================================================
  brgySearchQuery: '',

  renderBarangaysManager() {
    const tbody = document.getElementById('admin-barangays-tbody');
    const totalEl = document.getElementById('brgy-kpi-total');
    const childrenEl = document.getElementById('brgy-kpi-children');
    const usersEl = document.getElementById('brgy-kpi-users');

    const barangays = NutriStorage.getBarangays();
    const allChildren = NutriStorage.getChildren();
    const allUsers = NutriStorage.getUsers();

    if (totalEl) totalEl.textContent = barangays.length;
    if (childrenEl) childrenEl.textContent = allChildren.length;
    if (usersEl) usersEl.textContent = allUsers.length;

    if (!tbody) return;

    let list = [...barangays];
    if (this.brgySearchQuery) {
      list = list.filter(b =>
        (b.name || '').toLowerCase().includes(this.brgySearchQuery) ||
        (b.zones || '').toLowerCase().includes(this.brgySearchQuery)
      );
    }

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
            <div style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.6;">🏛️</div>
            <div style="font-weight: 700; color: #475569;">Walang natagpuang barangay</div>
            <div style="font-size: 0.8rem; color: #94A3B8; margin-top: 0.25rem;">Subukang magdagdag ng bagong barangay gamit ang button sa itaas.</div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map((b, idx) => {
      const childCount = allChildren.filter(c => (c.barangay || '').trim().toLowerCase() === (b.name || '').trim().toLowerCase()).length;
      const userCount = allUsers.filter(u => (u.barangay || '').trim().toLowerCase() === (b.name || '').trim().toLowerCase()).length;
      const isSelected = (this.selectedBarangay === b.name);

      return `
        <tr style="${isSelected ? 'background: #F0FDF4;' : ''}">
          <td style="color: #64748B; font-weight: 600; text-align: center;">${idx + 1}</td>
          <td>
            <div style="display: flex; align-items: center; gap: 0.65rem;">
              <span style="font-size: 1.25rem;">🏛️</span>
              <div>
                <strong style="color: #0F172A; font-size: 0.95rem;">${b.name}</strong>
                ${isSelected ? '<span class="badge" style="background:#10B981; color:#fff; font-size:0.7rem; margin-left:0.45rem; padding:2px 7px; border-radius:4px; font-weight:700;">Naka-filter</span>' : ''}
              </div>
            </div>
          </td>
          <td style="text-align: center;">
            <span class="badge" style="background: #E0F2FE; color: #0369A1; font-weight: 700; font-size: 0.85rem; padding: 4px 10px; border-radius: 6px;">
              👶 ${childCount}
            </span>
          </td>
          <td style="text-align: center;">
            <span class="badge" style="background: #ECFDF5; color: #047857; font-weight: 700; font-size: 0.85rem; padding: 4px 10px; border-radius: 6px;">
              👥 ${userCount}
            </span>
          </td>
          <td style="color: #475569; font-size: 0.85rem;">
            ${b.zones || '<span style="color:#94A3B8; font-style:italic;">Lahat ng Purok / Zones</span>'}
          </td>
          <td>
            <span class="badge" style="background: #DCFCE7; color: #15803D; font-weight: 600; font-size: 0.78rem; padding: 4px 8px; border-radius: 6px; border: 1px solid #BBF7D0;">
              🟢 Rehistrado sa Sistema
            </span>
          </td>
          <td style="text-align: center;">
            <div style="display: inline-flex; gap: 0.45rem; justify-content: center;">
              <button type="button" class="btn btn-outline btn-sm" style="font-size: 0.78rem; padding: 4px 10px; font-weight: 600;"
                onclick="MHODashboard.openEditBarangayModal('${b.id}')" title="Palitan ang opisyal na pangalan ng barangay">
                ✏️ Baguhin
              </button>
              <button type="button" class="btn btn-outline btn-sm" style="font-size: 0.78rem; padding: 4px 10px; font-weight: 600; color: #DC2626; border-color: #FECACA;"
                onclick="MHODashboard.handleDeleteBarangay('${b.id}')" title="Tanggalin ang barangay">
                🗑️ Tanggalin
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  filterBarangaysTable() {
    const input = document.getElementById('admin-brgy-search');
    this.brgySearchQuery = input ? input.value.toLowerCase().trim() : '';
    this.renderBarangaysManager();
  },

  openAddBarangayModal() {
    const form = document.querySelector('#modal-admin-add-barangay form');
    if (form) form.reset();
    NutriApp.openModal('modal-admin-add-barangay');
    setTimeout(() => {
      const input = document.querySelector('#modal-admin-add-barangay input[name="brgyName"]');
      if (input) input.focus();
    }, 120);
  },

  async handleSaveAddBarangay(form) {
    const nameInput = form.elements['brgyName'];
    const zonesInput = form.elements['brgyZones'];
    const name = nameInput ? nameInput.value.trim() : '';
    const zones = zonesInput ? zonesInput.value.trim() : '';

    if (!name) {
      NutriApp.showToast('Pakiusap ilagay ang pangalan ng barangay.', 'warning');
      return;
    }

    try {
      const added = NutriStorage.addBarangay(name, zones);
      if (!added) {
        NutriApp.showToast(`Ang barangay na "${name}" ay nakatala na sa sistema.`, 'warning');
        return;
      }

      NutriApp.closeModal('modal-admin-add-barangay');
      form.reset();

      // Re-render views & dropdowns
      this.renderBarangaysManager();
      this.renderAdminRecords();
      this.renderKPIs();

      NutriApp.showToast(`Matagumpay na naidagdag ang ${name}! Maaari na itong piliin sa registration at filters.`, 'success');
    } catch (err) {
      NutriApp.showToast(err.message || 'Error sa pagdagdag ng barangay.', 'warning');
    }
  },

  openEditBarangayModal(id) {
    const barangays = NutriStorage.getBarangays();
    const brgy = barangays.find(b => String(b.id) === String(id));
    if (!brgy) {
      alert('Hindi matagpuan ang barangay.');
      return;
    }

    const idInput = document.getElementById('edit-brgy-id');
    const oldNameInput = document.getElementById('edit-brgy-old-name');
    const currentDisplay = document.getElementById('edit-brgy-current-display');
    const newNameInput = document.getElementById('edit-brgy-new-name');

    if (idInput) idInput.value = brgy.id;
    if (oldNameInput) oldNameInput.value = brgy.name;
    if (currentDisplay) currentDisplay.textContent = brgy.name;
    if (newNameInput) newNameInput.value = brgy.name;

    NutriApp.openModal('modal-admin-edit-barangay');
  },

  async handleSaveEditBarangay(form) {
    const id = form.elements['brgyId']?.value;
    const oldName = form.elements['brgyOldName']?.value;
    const newName = form.elements['brgyNewName']?.value?.trim();

    if (!id || !newName) {
      alert('Pakiusap ilagay ang bagong pangalan ng barangay.');
      return;
    }

    if (oldName === newName) {
      NutriApp.closeModal('modal-admin-edit-barangay');
      return;
    }

    const result = await NutriStorage.updateBarangay(id, newName);

    // If currently filtering by the old name, update active filter to new name
    if (this.selectedBarangay === oldName) {
      this.selectedBarangay = newName;
      const globalSelect = document.getElementById('admin-global-barangay-select');
      if (globalSelect) globalSelect.value = newName;
      const recordsFilter = document.getElementById('admin-records-barangay-filter');
      if (recordsFilter) recordsFilter.value = newName;
    }

    NutriStorage.logAudit(
      'Barangay Renamed',
      'Account Management',
      `Administrator renamed barangay "${oldName}" to "${newName}". Cascade updated ${result.updatedChildren || 0} child records and ${result.updatedUsers || 0} user accounts.`,
      'Administrator'
    );

    NutriApp.closeModal('modal-admin-edit-barangay');

    // Re-render everything affected
    this.renderBarangaysManager();
    this.updateBarangayBanner();
    this.updateOverviewHeader();
    this.renderAdminRecords();
    this.renderKPIs();

    NutriApp.showToast(`Matagumpay na pinalitan ang "${oldName}" tungo sa "${newName}"! Na-update ang ${result.updatedChildren || 0} bata at ${result.updatedUsers || 0} user accounts.`, 'success');
  },

  async handleDeleteBarangay(id) {
    const barangays = NutriStorage.getBarangays();
    const brgy = barangays.find(b => String(b.id) === String(id));
    if (!brgy) return;

    const allChildren = NutriStorage.getChildren();
    const allUsers = NutriStorage.getUsers();
    const childCount = allChildren.filter(c => (c.barangay || '').trim().toLowerCase() === (brgy.name || '').trim().toLowerCase()).length;
    const userCount = allUsers.filter(u => (u.barangay || '').trim().toLowerCase() === (brgy.name || '').trim().toLowerCase()).length;

    const confirmMsg = childCount > 0 || userCount > 0
      ? `Sigurado ka bang nais mong tanggalin ang "${brgy.name}"?\n\nMayroong ${childCount} bata at ${userCount} user na kasalukuyang nakatala rito.`
      : `Sigurado ka bang nais mong tanggalin ang "${brgy.name}" sa listahan ng mga barangay?`;

    if (!confirm(confirmMsg)) return;

    await NutriStorage.deleteBarangay(id);

    if (this.selectedBarangay === brgy.name) {
      this.setSelectedBarangay('ALL');
    }

    NutriStorage.logAudit(
      'Barangay Deleted',
      'Account Management',
      `Administrator removed barangay "${brgy.name}" from system registry`,
      'Administrator'
    );

    this.renderBarangaysManager();
    this.renderAdminRecords();
    this.renderKPIs();

    NutriApp.showToast(`Natanggal ang "${brgy.name}" sa listahan ng mga barangay.`, 'info');
  }
};

