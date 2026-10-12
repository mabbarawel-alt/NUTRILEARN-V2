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

  // 4 Default Evidence-Based Food Nutrition Modules
  getDefaultNutritionModules() {
    return [
      {
        id: 'mod-1',
        number: 'Module 1',
        title: 'Understanding Child Malnutrition',
        summary: 'Learn the signs, causes, and effects of stunting and wasting in children under 5.',
        image: 'assets/images/module-malnutrition.jpg',
        duration: '45 min',
        recommendedFoods: 'Malunggay leaves, Kalabasa puree, Mashed banana, Breastmilk on demand, Boiled clean water',
        feedingGuide: 'Pakainin ng maliliit ngunit madalas na beses. Ihalo ang sariwang dahon ng malunggay sa bawat lugaw o sabaw. Magpasuso nang eksklusibo hanggang 6 buwan.',
        lessonsCount: 5,
        lessons: [
          {
            title: 'What is Malnutrition?',
            icon: '📖',
            completed: true,
            content: 'Malnutrition occurs when a child does not get the right amount of nutrients their body needs to grow and develop. It includes both undernutrition and overnutrition. In the Philippines, undernutrition — especially stunting and wasting — remains a major concern for children under 5.'
          },
          {
            title: 'Stunting: Low Height for Age',
            icon: '✏️',
            completed: true,
            content: 'Stunting happens when chronic undernutrition prevents a child from growing to their expected height. It is not just about being short — stunting affects brain development, school readiness, and long-term health.'
          },
          {
            title: 'Wasting: Low Weight for Height',
            icon: '⚖️',
            completed: true,
            content: 'Wasting occurs when a child suffers from acute, rapid weight loss or failure to gain weight. A wasted child is dangerously thin and has a weakened immune system requiring immediate therapeutic supplementary feeding.'
          },
          {
            title: 'Recognizing the Signs',
            icon: '🔍',
            completed: true,
            content: 'Watch out for signs of growth faltering: constant fatigue, lack of energy to play, frequent infections, poor appetite, thin or brittle hair. Regular monthly monitoring catches these signs early.'
          },
          {
            title: 'Prevention Starts Early',
            icon: '🌱',
            completed: true,
            content: 'The First 1,000 Days is the critical window. Prevent stunting through maternal nutrition, exclusive breastfeeding for 6 months, and diverse nutrient-rich complementary foods (Malunggay, Monggo, Camote, Eggs).'
          }
        ]
      },
      {
        id: 'mod-2',
        number: 'Module 2',
        title: 'Complementary Feeding for Infants',
        summary: 'When and how to introduce solid foods alongside breastfeeding from 6 months.',
        image: 'assets/images/module-complementary.jpg',
        duration: '55 min',
        recommendedFoods: 'Thick Lugaw, Chicken liver puree, Mashed camote, Hard-boiled egg yolk, Boiled clean water',
        feedingGuide: 'Magsimula sa malapot na lugaw sa ika-6 na buwan. Magpakain ng 2-3 beses bawat araw (2-3 kutsara paakyat sa kalahating tasa). Huwag magbigay ng malabnaw na am o sabaw lamang.',
        lessonsCount: 6,
        lessons: [
          {
            title: 'The 6-Month Feeding Milestone',
            icon: '👶',
            completed: true,
            content: 'At 6 months, breast milk alone can no longer meet all of an infant\'s energy and micronutrient requirements, particularly iron and zinc. Introduce clean, soft complementary foods while continuing breastfeeding.'
          },
          {
            title: 'First Foods & Gradual Introduction',
            icon: '🥣',
            completed: true,
            content: 'Start with thick Lugaw enriched with mashed kalabasa, sweet potato (camote), or pureed chicken liver. Introduce one new food at a time every 3 to 4 days.'
          },
          {
            title: 'Texture Progression by Age',
            icon: '🥑',
            completed: true,
            content: 'Progress textures carefully: 6-8 months: Thick, smooth purée; 9-11 months: Finely chopped or soft finger foods; 12-23 months: Family foods cut into bite-sized pieces.'
          },
          {
            title: 'Daily Feeding Frequency & Portions',
            icon: '🍽️',
            completed: false,
            content: '6-8 months: 2 to 3 meals per day; 9-11 months: 3 to 4 meals plus 1 nutritious snack; 12-23 months: 3 to 4 meals plus 1-2 healthy snacks.'
          },
          {
            title: 'Nutrient Boosters: Fortifying Porridge',
            icon: '🌿',
            completed: false,
            content: 'Always boost plain rice lugaw by stirring in: 1) Finely chopped malunggay or camote leaves, 2) Mashed hard-boiled egg yolk, 3) Cooked monggo, and 4) Half a teaspoon of coconut oil.'
          },
          {
            title: 'Safe Food Preparation & Storage',
            icon: '🧼',
            completed: false,
            content: 'Wash caregiver and infant hands with soap before preparing or eating. Use clean utensils, serve immediately, and never keep leftovers at room temperature for over 2 hours.'
          }
        ]
      },
      {
        id: 'mod-3',
        number: 'Module 3',
        title: 'Affordable Nutrient-Dense Meals',
        summary: 'Cook iron-rich, protein-packed meals using locally available, budget-friendly ingredients.',
        image: 'assets/images/module-meals.jpg',
        duration: '1 hr 10 min',
        recommendedFoods: 'Ginisang Monggo, Pounded Dilis (anchovies), Whole Hard-boiled Eggs, Camote, Malunggay, Gata',
        feedingGuide: 'Sundin ang Pinggang Pinoy: 1/2 pinggan Glow (gulay at prutas), 1/4 pinggan Grow (itlog/monggo/isda), 1/4 pinggan Go (kanin/kamote). Ang monggo at dilis ay abot-kayang pampatangkad.',
        lessonsCount: 8,
        lessons: [
          {
            title: 'Pinggang Pinoy: The Filipino Nutrition Plate',
            icon: '🍛',
            completed: true,
            content: 'Pinggang Pinoy is a visual guide by FNRI-DOST: 1/2 plate Glow foods, 1/4 plate Grow foods, and 1/4 plate Go foods. Every family meal should balance all three groups.'
          },
          {
            title: 'Malunggay: The Backyard Miracle Superfood',
            icon: '🌿',
            completed: true,
            content: 'Malunggay is one of the cheapest and most nutrient-dense greens. Add fresh leaves to soups, rice, scrambled eggs, and fish stews during the last 2 minutes of cooking.'
          },
          {
            title: 'Monggo: High-Yield Plant Protein at ₱15-₱25',
            icon: '🍲',
            completed: false,
            content: 'Ginisang Monggo paired with rice creates a complete protein profile containing all essential amino acids necessary for muscle and height growth.'
          },
          {
            title: 'Camote & Local Root Crops for Sustained Energy',
            icon: '🍠',
            completed: false,
            content: 'Sweet potatoes (camote) provide complex carbohydrates that prevent sudden blood sugar spikes, alongside beta-carotene (vitamin A).'
          },
          {
            title: 'Eggs & Small Fish: Essential Brain Boosters',
            icon: '🥚',
            completed: false,
            content: 'One egg a day provides high-quality protein and choline. Small fish like dilis eaten whole supply concentrated calcium for strong bones.'
          },
          {
            title: 'Healthy Fats & Oils for Brain Development',
            icon: '🫒',
            completed: false,
            content: '60% of a child\'s brain is fat. Adding vegetable oil, coconut milk (gata), or avocado to meals helps absorb fat-soluble vitamins (A, D, E, K).'
          },
          {
            title: 'Reducing Salt, Sugar & Ultra-Processed Snacks',
            icon: '🚫',
            completed: false,
            content: 'Avoid junk foods, sugary biscuits, and instant noodles. High sodium damages kidneys, while excess sugar ruins appetite for real family meals.'
          },
          {
            title: 'Budget Meal Planning under ₱40 per Day',
            icon: '💰',
            completed: false,
            content: 'Plan weekly meals around backyard vegetables, local market produce in season, and bulk dried staples (monggo, dilis, eggs).'
          }
        ]
      },
      {
        id: 'mod-4',
        number: 'Module 4',
        title: 'Feeding Behaviors That Build Healthy Habits',
        summary: 'Responsive feeding techniques that encourage children to eat well and develop confidence.',
        image: 'assets/images/module-habits.jpg',
        duration: '30 min',
        recommendedFoods: 'Steamed carrot sticks, Soft banana slices, Scrambled egg strips, Avocado bites, Sliced papaya',
        feedingGuide: 'Maging mapagpasensya at huwag pilitin ang bata. Magpakain nang walang cellphone o TV. Hikayatin ang bata na humawak ng sariling finger foods.',
        lessonsCount: 4,
        lessons: [
          {
            title: 'Responsive Feeding: Talking & Encouragement',
            icon: '🗣️',
            completed: false,
            content: 'Feed slowly and patiently with encouragement, never force-feeding. Maintain eye contact, smile, and talk to your child about food colors and flavors.'
          },
          {
            title: 'Handling Picky Eating with Patience',
            icon: '🥦',
            completed: false,
            content: 'A child may need to see, touch, and smell a new vegetable 10 to 15 times before accepting it. Stay patient and serve tiny portions alongside favorite foods.'
          },
          {
            title: 'Creating a Screen-Free Mealtime Routine',
            icon: '📱',
            completed: false,
            content: 'Eating in front of smartphones or televisions disconnects children from natural fullness cues. Make mealtimes a family social occasion.'
          },
          {
            title: 'Self-Feeding & Fine Motor Skill Development',
            icon: '👶',
            completed: false,
            content: 'Offer safe finger foods (steamed carrots, soft banana slices). Messy eating builds hand-eye coordination, independence, and positive food associations.'
          }
        ]
      }
    ];
  },

  getNutritionModules() {
    try {
      const data = localStorage.getItem('nutrilearn_parent_modules_data_v3');
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error reading modules data:', e);
    }
    if (window.ParentModule && ParentModule.nutritionModules && ParentModule.nutritionModules.length > 0) {
      return ParentModule.nutritionModules;
    }
    return this.getDefaultNutritionModules();
  },

  saveNutritionModules(modules) {
    localStorage.setItem('nutrilearn_parent_modules_data_v3', JSON.stringify(modules));
    if (window.ParentModule) {
      ParentModule.nutritionModules = modules;
      ParentModule.renderModuleCards();
    }
    NutriStorage.saveModules(modules);
  },

  // Render Module Management Cards (with Food Badges & Edit Capabilities)
  renderContentManagerModules() {
    const container = document.getElementById('mho-content-modules-list');
    if (!container) return;

    const modules = this.getNutritionModules();

    container.innerHTML = modules.map(m => {
      const foods = (m.recommendedFoods || 'Malunggay, Monggo, Itlog, Camote')
        .split(',')
        .map(f => f.trim())
        .filter(Boolean);

      const foodBadges = foods.map(f => `<span class="admin-food-badge">🌱 ${f}</span>`).join('');
      const lessonsCount = m.lessons ? m.lessons.length : (m.lessonsCount || 0);

      return `
        <div class="admin-module-card">
          <div class="admin-module-thumb-wrap">
            <img src="${m.image || 'assets/images/module-malnutrition.jpg'}" alt="${m.title}" class="admin-module-thumb" onerror="this.src='assets/images/module-malnutrition.jpg'">
          </div>

          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem; flex-wrap: wrap;">
              <span class="badge badge-normal" style="font-size: 0.75rem; font-weight: 700;">${m.number || 'Module'}</span>
              <strong style="font-size: 1.12rem; color: #1E2320;">${m.title}</strong>
              <span style="font-size: 0.8rem; color: #6B7280;">• ⏱️ ${m.duration || '30 min'} • 📖 ${lessonsCount} aralin</span>
            </div>

            <p style="font-size: 0.86rem; color: #4B5563; line-height: 1.45; margin: 0 0 0.5rem;">
              ${m.summary}
            </p>

            <div style="margin-top: 0.4rem;">
              <div style="font-size: 0.78rem; font-weight: 700; color: #166534; margin-bottom: 0.25rem;">
                🥗 Ano ang Dapat na Pagkain (Recommended Foods):
              </div>
              <div class="admin-food-badge-list">
                ${foodBadges}
              </div>
            </div>

            ${m.feedingGuide ? `
              <div style="font-size: 0.79rem; color: #4B5563; background: #F8FAF8; border-left: 3px solid #16A34A; padding: 4px 10px; margin-top: 0.5rem; border-radius: 0 6px 6px 0;">
                <strong>Gabay sa Pagpapakain:</strong> ${m.feedingGuide}
              </div>
            ` : ''}
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.45rem; align-items: stretch; min-width: 150px;">
            <button type="button" class="btn btn-primary btn-sm" onclick="MHODashboard.openEditModuleModal('${m.id}')"
              style="font-weight: 700; font-size: 0.82rem; padding: 6px 12px;" title="Baguhin ang pagkain, larawan, at aralin">
              ✏️ Baguhin ang Pagkain
            </button>
            <button type="button" class="btn btn-outline btn-sm" onclick="MHODashboard.previewModuleInParentView('${m.id}')"
              style="font-size: 0.8rem; padding: 5px 10px;" title="Tingnan kung paano lalabas sa mga magulang">
              👁️ Tingnan sa Parent View
            </button>
            <button type="button" class="btn btn-outline btn-sm" style="color: #DC2626; border-color: #FCA5A5; font-size: 0.78rem; padding: 4px 8px;"
              onclick="MHODashboard.handleDeleteModule('${m.id}')" title="Burahin ang module">
              🗑️ Burahin
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  previewModuleInParentView(moduleId) {
    NutriApp.switchRole('parent');
    setTimeout(() => {
      if (window.ParentModule) {
        ParentModule.openModuleDrawer(moduleId);
      }
    }, 150);
  },

  addFoodTag(foodName) {
    const input = document.getElementById('edit-module-foods');
    if (!input) return;
    const current = input.value.trim();
    if (!current) {
      input.value = foodName;
    } else if (!current.toLowerCase().includes(foodName.toLowerCase())) {
      input.value = current + ', ' + foodName;
    }
    input.focus();
  },

  handleImageSelectChange(val) {
    const input = document.getElementById('edit-module-image-input');
    const preview = document.getElementById('edit-module-image-preview');
    const fileNameEl = document.getElementById('edit-module-file-name');
    if (fileNameEl) fileNameEl.textContent = '';
    if (val !== 'custom') {
      if (input) input.value = val;
      if (preview) preview.src = val;
    } else {
      if (input) {
        input.value = '';
        input.focus();
      }
    }
  },

  updateImagePreview(url) {
    const preview = document.getElementById('edit-module-image-preview');
    if (preview && url) {
      preview.src = url;
    }
  },

  handleModuleImageUpload(input) {
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 8 * 1024 * 1024) {
        NutriApp.showToast('Masyadong malaki ang imahe. Pumili ng larawan na mas maliit sa 8MB.', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        const preview = document.getElementById('edit-module-image-preview');
        const inputEl = document.getElementById('edit-module-image-input');
        const select = document.getElementById('edit-module-image-select');
        const fileNameEl = document.getElementById('edit-module-file-name');

        if (preview) preview.src = dataUrl;
        if (inputEl) inputEl.value = dataUrl;
        if (select) select.value = 'custom';
        if (fileNameEl) {
          fileNameEl.textContent = `✅ Napiling Larawan: ${file.name} (${Math.round(file.size / 1024)} KB)`;
        }
        NutriApp.showToast('✅ Matagumpay na na-upload at napalitan ang imahe ng module!', 'success');
      };
      reader.readAsDataURL(file);
    }
  },

  resetModuleImage() {
    const defaultImg = 'assets/images/module-malnutrition.jpg';
    const preview = document.getElementById('edit-module-image-preview');
    const inputEl = document.getElementById('edit-module-image-input');
    const select = document.getElementById('edit-module-image-select');
    const fileInput = document.getElementById('edit-module-file-input');
    const fileNameEl = document.getElementById('edit-module-file-name');

    if (preview) preview.src = defaultImg;
    if (inputEl) inputEl.value = defaultImg;
    if (select) select.value = defaultImg;
    if (fileInput) fileInput.value = '';
    if (fileNameEl) fileNameEl.textContent = '';
    NutriApp.showToast('Naibalik ang larawan sa default.', 'info');
  },

  openAddModuleModal() {
    const modules = this.getNutritionModules();
    document.getElementById('modal-edit-module-title').textContent = '➕ Magdagdag ng Bagong Module at Gabay sa Pagkain';
    document.getElementById('edit-module-id').value = '';
    document.getElementById('edit-module-number').value = `Module ${modules.length + 1}`;
    document.getElementById('edit-module-title-input').value = '';
    document.getElementById('edit-module-duration').value = '30 min';
    document.getElementById('edit-module-foods').value = 'Malunggay, Monggo, Nilagang Itlog, Dilaw na Camote, Malinis na Tubig';
    document.getElementById('edit-module-feeding-guide').value = 'Pakainin 3 beses sa isang araw kasama ang 2 masustansyang meryenda. Ihalo ang sariwang gulay sa sabaw.';
    document.getElementById('edit-module-image-select').value = 'assets/images/module-meals.jpg';
    document.getElementById('edit-module-image-input').value = 'assets/images/module-meals.jpg';
    document.getElementById('edit-module-image-preview').src = 'assets/images/module-meals.jpg';

    const fileInput = document.getElementById('edit-module-file-input');
    const fileNameEl = document.getElementById('edit-module-file-name');
    if (fileInput) fileInput.value = '';
    if (fileNameEl) fileNameEl.textContent = '';

    document.getElementById('edit-module-summary').value = '';
    document.getElementById('edit-module-lessons-text').value = 'Kahalagahan ng Masusustansyang Pagkain | 🌿 | Ang pagkain ng sariwang gulay tulad ng malunggay ay nagbibigay ng bitamina at resistensya sa bata.\nSapat na Protina sa Araw-araw | 🥚 | Magbigay ng 1 itlog o monggo araw-araw para tumangkad at lumakas ang kalamnan.';

    NutriApp.openModal('modal-edit-module');
  },

  openEditModuleModal(moduleId) {
    const mod = this.getNutritionModules().find(m => m.id === moduleId);
    if (!mod) return;

    document.getElementById('modal-edit-module-title').textContent = `🥗 Baguhin ang ${mod.number}: ${mod.title}`;
    document.getElementById('edit-module-id').value = mod.id;
    document.getElementById('edit-module-number').value = mod.number || '';
    document.getElementById('edit-module-title-input').value = mod.title || '';
    document.getElementById('edit-module-duration').value = mod.duration || '30 min';
    document.getElementById('edit-module-foods').value = mod.recommendedFoods || 'Malunggay, Monggo, Itlog, Camote';
    document.getElementById('edit-module-feeding-guide').value = mod.feedingGuide || '';

    const img = mod.image || 'assets/images/module-malnutrition.jpg';
    const select = document.getElementById('edit-module-image-select');
    const input = document.getElementById('edit-module-image-input');
    const preview = document.getElementById('edit-module-image-preview');

    if (input) input.value = img;
    if (preview) preview.src = img;
    if (select) {
      const match = Array.from(select.options).some(o => o.value === img);
      select.value = match ? img : 'custom';
    }

    const fileInput = document.getElementById('edit-module-file-input');
    const fileNameEl = document.getElementById('edit-module-file-name');
    if (fileInput) fileInput.value = '';
    if (fileNameEl) fileNameEl.textContent = '';

    document.getElementById('edit-module-summary').value = mod.summary || '';

    // Lessons to formatted text: Title | Icon | Content
    const lessons = mod.lessons || [];
    const lessonsText = lessons.map(l => `${l.title} | ${l.icon || '📖'} | ${l.content}`).join('\n');
    document.getElementById('edit-module-lessons-text').value = lessonsText;

    NutriApp.openModal('modal-edit-module');
  },

  handleSaveModule(form) {
    const id = document.getElementById('edit-module-id').value;
    const number = document.getElementById('edit-module-number').value.trim();
    const title = document.getElementById('edit-module-title-input').value.trim();
    const duration = document.getElementById('edit-module-duration').value.trim();
    const foods = document.getElementById('edit-module-foods').value.trim();
    const feedingGuide = document.getElementById('edit-module-feeding-guide').value.trim();
    const image = (document.getElementById('edit-module-image-input').value.trim()) || 'assets/images/module-malnutrition.jpg';
    const summary = document.getElementById('edit-module-summary').value.trim();
    const lessonsText = document.getElementById('edit-module-lessons-text').value.trim();

    if (!title || !number || !summary || !foods) {
      NutriApp.showToast('Punan ang module number, title, inirerekomendang pagkain, at buod bago i-save.', 'warning');
      return;
    }

    // Parse lessons from text
    const lessons = lessonsText.split('\n').filter(Boolean).map(line => {
      const parts = line.split('|');
      return {
        title: (parts[0] || 'Lesson Topic').trim(),
        icon: (parts[1] || '📖').trim(),
        content: (parts[2] || parts[0] || '').trim(),
        completed: false
      };
    });

    const modules = this.getNutritionModules();

    if (id) {
      const idx = modules.findIndex(m => m.id === id);
      if (idx !== -1) {
        modules[idx] = {
          ...modules[idx],
          number,
          title,
          duration,
          recommendedFoods: foods,
          feedingGuide,
          image,
          summary,
          lessons: lessons.length > 0 ? lessons : modules[idx].lessons,
          lessonsCount: lessons.length > 0 ? lessons.length : (modules[idx].lessons ? modules[idx].lessons.length : 4)
        };
        this.saveNutritionModules(modules);
        NutriStorage.logAudit('Module & Food Guidelines Updated', 'Content Manager', `Administrator updated "${number}: ${title}" with recommended foods: ${foods}`);
        NutriApp.showToast(`✅ Matagumpay na na-update ang ${number}!`, 'success');
      }
    } else {
      const newMod = {
        id: 'mod-' + Date.now(),
        number,
        title,
        duration,
        recommendedFoods: foods,
        feedingGuide,
        image,
        summary,
        lessonsCount: lessons.length || 4,
        lessons: lessons.length > 0 ? lessons : [
          { title: 'Gabay sa Nutrisyon', icon: '📖', content: summary, completed: false }
        ]
      };
      modules.push(newMod);
      this.saveNutritionModules(modules);
      NutriStorage.logAudit('New Module Created', 'Content Manager', `Administrator added new curriculum "${number}: ${title}"`);
      NutriApp.showToast(`🎉 Bagong module "${title}" idinagdag sa curricula!`, 'success');
    }

    NutriApp.closeModal('modal-edit-module');
    this.renderContentManagerModules();
  },

  handleDeleteModule(moduleId) {
    if (confirm('Sigurado ka bang nais mong burahin ang nutrition module na ito?')) {
      let modules = this.getNutritionModules();
      modules = modules.filter(m => m.id !== moduleId);
      this.saveNutritionModules(modules);
      this.renderContentManagerModules();
      NutriStorage.logAudit('Module Deleted', 'Content Manager', `Deleted nutrition module ID ${moduleId}`);
      NutriApp.showToast('Matagumpay na nabura ang module.', 'info');
    }
  },

  handleResetModules() {
    if (confirm('I-reset ang lahat ng nutrition module sa opisyal na WHO & PPAN default food guidelines?')) {
      const defaults = this.getDefaultNutritionModules();
      this.saveNutritionModules(defaults);
      this.renderContentManagerModules();
      NutriStorage.logAudit('Curricula Reset', 'Content Manager', 'Restored default 4 evidence-based food nutrition modules');
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

  initUserManager() {
    this.renderUsersTable();

    // Bind search & filter
    const searchInput = document.getElementById('mho-user-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.userSearchQuery = e.target.value.toLowerCase();
        this.renderUsersTable();
      });
    }

    const roleFilter = document.getElementById('mho-user-role-filter');
    if (roleFilter) {
      roleFilter.addEventListener('change', (e) => {
        this.userFilterRole = e.target.value;
        this.renderUsersTable();
      });
    }
  },

  renderUsersTable() {
    const tbody = document.getElementById('mho-users-tbody');
    if (!tbody) return;

    let users = NutriStorage.getUsers();

    // Filter by role
    if (this.userFilterRole !== 'ALL') {
      users = users.filter(u => u.role === this.userFilterRole);
    }

    // Filter by search query
    if (this.userSearchQuery) {
      users = users.filter(u =>
        (u.name || '').toLowerCase().includes(this.userSearchQuery) ||
        (u.email || '').toLowerCase().includes(this.userSearchQuery) ||
        (u.barangay || '').toLowerCase().includes(this.userSearchQuery)
      );
    }

    if (users.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:2rem; color:var(--text-muted);">
            No user accounts found matching your query.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = users.map(u => {
      const isSuspended = u.status === 'Suspended';
      const statusBadge = isSuspended
        ? '<span class="badge badge-stunted" style="background:#FEE2E2; color:#991B1B;">⛔ Suspended</span>'
        : '<span class="badge badge-normal" style="background:#DCFCE7; color:#166534;">✓ Active</span>';

      return `
        <tr>
          <td>
            <div style="font-weight:700; color:var(--color-primary-900);">${u.name}</div>
            <div style="font-size:0.76rem; color:var(--text-muted);">${u.email}</div>
          </td>
          <td>
            <select onchange="MHODashboard.handleRoleChange('${u.id}', this.value)" style="padding:4px 8px; border:1px solid var(--border-light); border-radius:4px; font-size:0.8rem; background:#FFFFFF;">
              <option value="parent" ${u.role === 'parent' ? 'selected' : ''}>Parent / Guardian</option>
              <option value="chw" ${u.role === 'chw' ? 'selected' : ''}>Health Worker (BHW/BNS)</option>
              <option value="collector" ${u.role === 'collector' ? 'selected' : ''}>Field Data Collector</option>
              <option value="mho" ${u.role === 'mho' ? 'selected' : ''}>Administrator (MHO)</option>
            </select>
          </td>
          <td>
            <span style="font-size:0.82rem; color:var(--text-secondary);">${u.barangay || u.department || 'All Municipal'}</span>
          </td>
          <td>${statusBadge}</td>
          <td>
            <span style="font-size:0.78rem; color:var(--text-muted);">${u.registeredDate || 'Pre-configured'}</span>
          </td>
          <td>
            <div class="table-actions">
              <button class="btn btn-sm ${isSuspended ? 'btn-accent' : 'btn-outline'}" onclick="MHODashboard.handleToggleUserStatus('${u.id}')" title="Toggle access permission">
                ${isSuspended ? 'Reactivate' : 'Suspend'}
              </button>
              <button class="btn btn-outline btn-sm" onclick="MHODashboard.handleResetUserPassword('${u.id}')" title="Reset password">
                🔑 Reset Pass
              </button>
              <button class="btn btn-outline btn-sm" style="color:#DC2626; border-color:#FCA5A5;" onclick="MHODashboard.handleDeleteUser('${u.id}')" title="Delete account">
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  handleRoleChange(userId, newRole) {
    const users = NutriStorage.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return;

    user.role = newRole;
    NutriStorage.updateUser(user);
    NutriApp.showToast(`Updated role for ${user.name} to ${newRole.toUpperCase()}.`, 'success');
  },

  handleToggleUserStatus(userId) {
    const newStatus = NutriStorage.toggleUserStatus(userId);
    this.renderUsersTable();
    NutriApp.showToast(`User status updated to: ${newStatus}`, newStatus === 'Active' ? 'success' : 'warning');
  },

  handleResetUserPassword(userId) {
    const newPass = prompt('Enter a new password for this user:', 'password123');
    if (!newPass) return;

    const users = NutriStorage.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.password = newPass;
      NutriStorage.updateUser(user);
      NutriApp.showToast(`Password successfully updated for ${user.name}.`, 'success');
    }
  },

  handleDeleteUser(userId) {
    if (confirm('Permanently delete this user account and revoke system access?')) {
      NutriStorage.deleteUser(userId);
      this.renderUsersTable();
      NutriApp.showToast('User account deleted.', 'info');
    }
  },

  openAddUserModal() {
    NutriApp.openModal('modal-admin-add-user');
  },

  handleCreateUserAdmin(form) {
    const name = form.elements['adminUserName'].value.trim();
    const email = form.elements['adminUserEmail'].value.trim();
    const password = form.elements['adminUserPass'].value;
    const role = form.elements['adminUserRole'].value;
    const barangay = form.elements['adminUserBarangay'].value;

    // Validation (Req #14)
    if (!name || !email || !password) {
      NutriApp.showToast('Please fill in all required user fields before saving.', 'warning');
      return;
    }

    const userData = {
      name,
      email,
      password,
      role,
      barangay,
      status: 'Active',
      registeredDate: new Date().toISOString().split('T')[0]
    };

    NutriStorage.registerUser(userData);
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
  getAdminChildrenRecords() {
    const liveChildren = (typeof NutriStorage !== 'undefined') ? NutriStorage.getChildren() : [];

    return liveChildren.map(c => {
      const fullName = (c.name || '').trim() || [c.first_name, c.last_name].filter(Boolean).join(' ') || 'Unnamed Child';
      const parentName = (c.parentName || c.parent_name || 'Parent / Guardian').trim();
      const brgy = (c.barangay || 'Barangay Manguiring').trim();
      const zn = c.zone || 'Zone 1';
      const ageVal = parseInt(c.ageMonths || c.age_months || 12, 10);
      const hVal = parseFloat(c.heightCm || c.height_cm || 75.0);
      const wVal = parseFloat(c.weightKg || c.weight_kg || 9.0);
      const muacVal = parseInt(c.muacMm || c.muac_mm || 125, 10);
      const st = c.improved ? 'Improved' : (c.status === 'Critical' || muacVal < 115 ? 'Critical' : (c.status || 'Normal'));
      const hfa = c.hfaStatus || c.hfa_status || (st === 'Stunted' ? 'Stunted' : 'Normal');
      const wfa = c.wfaStatus || c.wfa_status || 'Normal';
      const dt = c.lastAssessed || c.last_assessed || new Date().toISOString().split('T')[0];

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
        date: dt,
        improved: !!c.improved,
        notes: c.notes || ''
      };
    });
  },

  renderAdminRecords() {
    const tbody = document.getElementById('admin-records-tbody');
    if (!tbody) return;

    const records = this.getAdminChildrenRecords();
    const search = (document.getElementById('admin-records-search')?.value || '').toLowerCase().trim();
    const zoneFilter = document.getElementById('admin-records-zone-filter')?.value || 'ALL';
    const statusFilter = document.getElementById('admin-records-status-filter')?.value || 'ALL';
    const brgyFilter = this.selectedBarangay || 'ALL';

    const filtered = records.filter(r => {
      // 1. Barangay filter:
      const matchBarangay = (brgyFilter === 'ALL') || (r.barangay === brgyFilter);
      // 2. Search filter:
      const matchSearch = !search ||
        r.name.toLowerCase().includes(search) ||
        r.parent.toLowerCase().includes(search) ||
        r.zone.toLowerCase().includes(search) ||
        r.barangay.toLowerCase().includes(search);
      // 3. Zone filter:
      const matchZone = zoneFilter === 'ALL' ||
        r.zone === zoneFilter ||
        (zoneFilter.includes('7') && (r.zone.includes('7') || r.zone.toLowerCase().includes('purok 7'))) ||
        (r.zone.toLowerCase().replace(/\s+/g, '') === zoneFilter.toLowerCase().replace(/\s+/g, ''));
      // 4. Status filter:
      const matchStatus = statusFilter === 'ALL' || r.status === statusFilter || (statusFilter === 'Stunted' && r.hfa === 'Stunted');

      return matchBarangay && matchSearch && matchZone && matchStatus;
    });

    if (filtered.length === 0) {
      const msg = brgyFilter !== 'ALL'
        ? `Walang talaan ng bata para sa <strong>${brgyFilter}</strong> gamit ang kasalukuyang filter.`
        : 'Walang talaan ng bata na tugma sa iyong filter criteria.';
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:2.5rem; color:#64748B;">${msg}</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(r => {
      const isCritical = r.status === 'Critical' || r.muac < 115;
      const statusBadge = isCritical
        ? '<span style="background:#FEE2E2; color:#DC2626; padding:3px 10px; border-radius:9999px; font-weight:700; font-size:0.75rem;">Critical Case</span>'
        : r.status === 'Improved'
          ? '<span style="background:#DCFCE7; color:#166534; padding:3px 10px; border-radius:9999px; font-weight:700; font-size:0.75rem;">Improved / Recovered</span>'
          : '<span style="background:#E0F2FE; color:#0369A1; padding:3px 10px; border-radius:9999px; font-weight:600; font-size:0.75rem;">Normal Status</span>';

      return `
        <tr>
          <td>
            <strong style="color: #1F2937; font-size: 0.92rem;">${r.name}</strong>
            <div style="font-size: 0.78rem; color: #6B7280;">Magulang: ${r.parent}</div>
          </td>
          <td>
            <div style="display:flex; flex-direction:column; gap:2px;">
              <span style="font-weight:700; color:#065F46; background:#ECFDF5; border:1px solid #A7F3D0; padding:2px 8px; border-radius:6px; font-size:0.78rem; width:fit-content;">
                📍 ${r.barangay}
              </span>
              <span style="font-size:0.75rem; color:#6B7280; margin-left:4px;">${r.zone}</span>
            </div>
          </td>
          <td>${r.age} mos • ${r.sex}</td>
          <td>
            <div style="font-size: 0.84rem;"><strong>${r.h} cm</strong> • <strong>${r.w} kg</strong></div>
            <div style="font-size: 0.75rem; color: ${r.muac < 115 ? '#DC2626' : '#166534'};">MUAC: ${r.muac} mm</div>
          </td>
          <td>
            <span style="font-size: 0.82rem; font-weight: 600; color: #374151;">HFA: ${r.hfa} • WFA: ${r.wfa}</span>
          </td>
          <td>${statusBadge}</td>
          <td style="color: #6B7280; font-size: 0.8rem;">${r.date}</td>
          <td style="text-align: center; white-space: nowrap;">
            <div style="display: inline-flex; gap: 6px; align-items: center; justify-content: center;">
              <button type="button" class="btn btn-outline btn-sm" style="font-size: 0.78rem; font-weight: 600; padding: 4px 10px; border-radius: 6px; border-color: #0284C7; color: #0284C7;" onclick="MHODashboard.openAdminEditChild('${r.id}')" title="I-update ang mga sukat ng bata sa napiling barangay">
                ✏️ I-update
              </button>
              <button type="button" class="btn btn-outline btn-sm" style="font-size: 0.78rem; font-weight: 600; padding: 4px 8px; border-radius: 6px; border-color: #FCA5A5; color: #DC2626;" onclick="MHODashboard.handleDeleteChildRecord('${r.id}')" title="Alisin o burahin ang talaan ng bata mula sa registry">
                🗑️ Burahin
              </button>
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
    child.improved = (status === 'Improved');
    child.notes = notes;
    child.lastAssessed = new Date().toISOString().split('T')[0];

    NutriStorage.updateChild(child);

    NutriStorage.logAudit(
      'Child Record Updated by Administrator',
      'Field Health Record',
      `Admin updated measurements for ${child.name || 'Child'} in ${childBrgy}: Height ${height}cm, Weight ${weight}kg, MUAC ${muac}mm, Status: ${status}`,
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
    NutriApp.openModal('modal-admin-add-barangay');
  },

  async handleSaveAddBarangay(form) {
    const nameInput = form.elements['brgyName'];
    const zonesInput = form.elements['brgyZones'];
    const name = nameInput ? nameInput.value.trim() : '';
    const zones = zonesInput ? zonesInput.value.trim() : '';

    if (!name) {
      alert('Pakiusap ilagay ang pangalan ng barangay.');
      return;
    }

    const added = await NutriStorage.addBarangay(name, zones);
    if (!added) {
      NutriApp.showToast(`Ang barangay na "${name}" ay nakatala na sa sistema.`, 'warning');
      return;
    }

    NutriStorage.logAudit(
      'Barangay Added',
      'Account Management',
      `Administrator added new barangay: ${name}${zones ? ` (${zones})` : ''}`,
      'Administrator'
    );

    NutriApp.closeModal('modal-admin-add-barangay');
    form.reset();

    // Re-render views & dropdowns
    this.renderBarangaysManager();
    this.renderAdminRecords();
    this.renderKPIs();

    NutriApp.showToast(`Matagumpay na naidagdag ang ${name}! Maaari na itong piliin sa registration at filters.`, 'success');
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

