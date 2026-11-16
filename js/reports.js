// ==============================================================================
// NUTRILEARN - PROGRAM REPORTS, FILTERS & DATA QUALITY
// ------------------------------------------------------------------------------
// Thesis Activity Diagram 3.2.3 (Administrator):
//   "Apply report filters: date, barangay, health worker, age, status"
//   "System aggregates and displays requested data"
//   "Data quality issues found? → Review warnings: missing data, overdue
//    follow-ups, inactive users → Request correction from Health Worker"
//   "Select format: PDF or print → System generates structured report"
// Thesis Activity Diagram 3.2.2 (Health Worker):
//   "Select report period or group of children → System generates report
//    automatically → Download, print, or submit report to municipal office"
// ==============================================================================

const NutriReports = {
  CORRECTIONS_KEY: 'nutrilearn_correction_requests_v1',

  AGE_GROUPS: {
    '0-5': [0, 5],
    '6-11': [6, 11],
    '12-23': [12, 23],
    '24-59': [24, 59],
    '60+': [60, 999]
  },

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  },

  today() {
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  },

  // Health worker responsible for a record: latest measurement, else original encoder
  recordedBy(child) {
    const latest = (child.growthRecords || [])[0];
    return (latest && latest.recordedBy) || child.submittedBy || 'Hindi naitala';
  },

  effectiveStatus(child) {
    return child.improved ? 'Improved' : (child.status || 'Normal');
  },

  followUpState(child) {
    if (!child.nextFollowUpDate) return 'none';
    return child.nextFollowUpDate < this.today() ? 'overdue' : 'scheduled';
  },

  // ---------------------------------------------------------------------------
  // Filtering & aggregation
  // ---------------------------------------------------------------------------
  filterChildren(f = {}) {
    let children = NutriStorage.getChildren();
    if (f.barangay && f.barangay !== 'ALL') children = children.filter(c => (c.barangay || '').trim() === f.barangay);
    if (f.dateFrom) children = children.filter(c => (c.lastAssessed || '') >= f.dateFrom);
    if (f.dateTo) children = children.filter(c => (c.lastAssessed || '') <= f.dateTo);
    if (f.worker && f.worker !== 'ALL') children = children.filter(c => this.recordedBy(c) === f.worker);
    if (f.ageGroup && f.ageGroup !== 'ALL') {
      const [min, max] = this.AGE_GROUPS[f.ageGroup] || [0, 999];
      children = children.filter(c => c.ageMonths >= min && c.ageMonths <= max);
    }
    if (f.status && f.status !== 'ALL') children = children.filter(c => this.effectiveStatus(c) === f.status);
    if (f.followUp && f.followUp !== 'ALL') children = children.filter(c => this.followUpState(c) === f.followUp);
    if (f.childIds) {
      const ids = new Set(f.childIds.map(String));
      children = children.filter(c => ids.has(String(c.id)));
    }
    return children;
  },

  summarize(children) {
    const total = children.length;
    const count = s => children.filter(c => this.effectiveStatus(c) === s).length;
    const stunted = count('Stunted');
    const pct = n => total ? ((n / total) * 100).toFixed(1) + '%' : '0.0%';
    const lessonsAssigned = children.reduce((s, c) => s + (c.assignedModules || []).length, 0);
    const lessonsDone = children.reduce((s, c) => s + (c.completedModules || []).length, 0);
    return {
      total,
      normal: count('Normal'),
      stunted,
      wasted: count('Wasted'),
      underweight: count('Underweight'),
      atRisk: count('At Risk'),
      improved: count('Improved'),
      stuntingRate: pct(stunted),
      followUpsScheduled: children.filter(c => this.followUpState(c) === 'scheduled').length,
      followUpsOverdue: children.filter(c => this.followUpState(c) === 'overdue').length,
      dewormingDue: children.filter(c => /due/i.test(c.dewormingStatus || '')).length,
      lessonCompletion: lessonsAssigned ? Math.round((lessonsDone / lessonsAssigned) * 100) + '%' : '—'
    };
  },

  // ---------------------------------------------------------------------------
  // Data quality (missing data, improbable values, overdue follow-ups, inactive users)
  // ---------------------------------------------------------------------------
  dataQualityIssues() {
    const issues = [];
    const today = this.today();
    NutriStorage.getChildren().forEach(c => {
      const add = (type, message) => issues.push({ type, childId: c.id, childName: c.name, barangay: c.barangay, worker: this.recordedBy(c), message });
      if (!c.birthDate) add('missing', 'Walang petsa ng kapanganakan (missing date of birth)');
      if (!c.heightCm || !c.weightKg) add('missing', 'Kulang ang taas o timbang (missing height/weight)');
      if (c.dewormingStatus === 'Up to Date' && !c.dewormingDate) add('missing', 'Up to Date ang purga pero walang petsa (missing deworming date)');
      if (c.heightCm && (c.heightCm < 40 || c.heightCm > 130)) add('unusual', `Hindi kapani-paniwala ang taas: ${c.heightCm} cm`);
      if (c.weightKg && (c.weightKg < 1.5 || c.weightKg > 35)) add('unusual', `Hindi kapani-paniwala ang timbang: ${c.weightKg} kg`);
      if (c.birthDate && c.birthDate > today) add('unusual', 'Petsa ng kapanganakan ay nasa hinaharap');
      if (c.nextFollowUpDate && c.nextFollowUpDate < today) add('overdue', `Overdue follow-up (${c.nextFollowUpDate})`);
      if (!c.nextFollowUpDate && !c.improved && !['Normal', 'Improved'].includes(c.status)) add('overdue', `Walang naka-schedule na follow-up para sa ${c.status} na bata`);
    });
    NutriStorage.getUsers().filter(u => u.status && u.status !== 'Active').forEach(u => {
      issues.push({ type: 'inactive', userId: u.id, childName: u.name, barangay: u.barangay || '', worker: '', message: `Inactive na account (${u.role})` });
    });
    return issues;
  },

  // ---------------------------------------------------------------------------
  // Correction requests (Administrator → Health Worker)
  // ---------------------------------------------------------------------------
  getCorrectionRequests() {
    try {
      return JSON.parse(localStorage.getItem(this.CORRECTIONS_KEY) || '[]');
    } catch (e) {
      return [];
    }
  },

  saveCorrectionRequests(list) {
    localStorage.setItem(this.CORRECTIONS_KEY, JSON.stringify(list));
  },

  requestCorrection(childId, message) {
    const child = NutriStorage.getChildren().find(c => String(c.id) === String(childId));
    if (!child) return null;
    const list = this.getCorrectionRequests();
    if (list.some(r => r.childId === child.id && r.message === message && r.status === 'Open')) {
      NutriApp.showToast('May bukas nang correction request para dito.', 'info');
      return null;
    }
    const admin = NutriStorage.getCurrentUser() || {};
    const req = {
      id: 'cr-' + Date.now(),
      childId: child.id,
      childName: child.name,
      barangay: child.barangay,
      assignedTo: this.recordedBy(child),
      message,
      requestedBy: admin.name || 'Municipal Health Office',
      requestedAt: new Date().toISOString(),
      status: 'Open'
    };
    list.unshift(req);
    this.saveCorrectionRequests(list);
    NutriStorage.logAudit('Correction Requested', 'Data Quality',
      `Requested correction for ${child.name} (${child.barangay}) from ${req.assignedTo}: ${message}`);
    NutriApp.showToast(`📨 Correction request sent to ${req.assignedTo}.`, 'success');
    return req;
  },

  resolveCorrection(requestId) {
    const list = this.getCorrectionRequests();
    const req = list.find(r => r.id === requestId);
    if (!req) return;
    req.status = 'Resolved';
    req.resolvedAt = new Date().toISOString();
    req.resolvedBy = (NutriStorage.getCurrentUser() || {}).name || 'Barangay Health Worker';
    this.saveCorrectionRequests(list);
    NutriStorage.logAudit('Correction Resolved', 'Data Quality', `${req.resolvedBy} resolved: ${req.childName} — ${req.message}`);
    NutriApp.showToast('✅ Na-mark bilang naayos (Resolved).', 'success');
    this.renderCorrectionRequestsForBHW();
    if (document.getElementById('rpt-quality-list')) this.renderAdminReports();
  },

  // ---------------------------------------------------------------------------
  // ADMIN: Program Reports tab
  // ---------------------------------------------------------------------------
  readAdminFilters() {
    const v = id => (document.getElementById(id) || {}).value || '';
    return {
      dateFrom: v('rpt-filter-from'),
      dateTo: v('rpt-filter-to'),
      barangay: v('rpt-filter-barangay') || 'ALL',
      worker: v('rpt-filter-worker') || 'ALL',
      ageGroup: v('rpt-filter-age') || 'ALL',
      status: v('rpt-filter-status') || 'ALL',
      followUp: v('rpt-filter-followup') || 'ALL'
    };
  },

  populateFilterOptions() {
    const fill = (id, values, allLabel) => {
      const el = document.getElementById(id);
      if (!el) return;
      const current = el.value || 'ALL';
      el.innerHTML = `<option value="ALL">${allLabel}</option>` +
        values.map(v => `<option value="${this.esc(v)}">${this.esc(v)}</option>`).join('');
      el.value = values.includes(current) ? current : 'ALL';
    };
    const children = NutriStorage.getChildren();
    fill('rpt-filter-barangay', [...new Set(children.map(c => (c.barangay || '').trim()).filter(Boolean))].sort(), 'Lahat ng Barangay');
    fill('rpt-filter-worker', [...new Set(children.map(c => this.recordedBy(c)))].sort(), 'Lahat ng Health Worker');
  },

  renderAdminReports() {
    if (!document.getElementById('rpt-results-tbody')) return;
    this.populateFilterOptions();
    const filters = this.readAdminFilters();
    const children = this.filterChildren(filters);
    const s = this.summarize(children);

    const kpi = document.getElementById('rpt-summary');
    if (kpi) {
      const card = (label, value, color) => `
        <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:10px; padding:0.75rem;">
          <div style="font-size:0.72rem; font-weight:700; text-transform:uppercase; color:#64748B;">${label}</div>
          <div style="font-size:1.4rem; font-weight:800; color:${color};">${value}</div>
        </div>`;
      kpi.innerHTML = [
        card('Bilang ng Bata', s.total, '#1E293B'),
        card('Stunted', `${s.stunted} (${s.stuntingRate})`, '#DC2626'),
        card('Wasted', s.wasted, '#C2410C'),
        card('Underweight', s.underweight, '#D97706'),
        card('Improved', s.improved, '#16A34A'),
        card('Overdue Follow-ups', s.followUpsOverdue, '#B91C1C'),
        card('Lesson Completion', s.lessonCompletion, '#2563EB')
      ].join('');
    }

    const tbody = document.getElementById('rpt-results-tbody');
    tbody.innerHTML = children.length ? children.map(c => `
      <tr>
        <td><strong>${this.esc(c.name)}</strong><div style="font-size:0.74rem; color:#64748B;">${this.esc(c.ageMonths)} mos • ${this.esc(c.sex)}</div></td>
        <td>${this.esc(c.barangay)}</td>
        <td>${this.esc(this.recordedBy(c))}</td>
        <td>${this.esc(c.heightCm)} cm / ${this.esc(c.weightKg)} kg</td>
        <td>${this.esc(this.effectiveStatus(c))}</td>
        <td>${this.esc(c.lastAssessed || '—')}</td>
        <td>${c.nextFollowUpDate ? this.esc(c.nextFollowUpDate) + (this.followUpState(c) === 'overdue' ? ' ⚠️' : '') : '—'}</td>
      </tr>`).join('') :
      '<tr><td colspan="7" style="text-align:center; padding:1.5rem; color:#64748B;">Walang tugmang talaan sa mga filter na ito.</td></tr>';

    this.renderDataQuality();
  },

  renderDataQuality() {
    const box = document.getElementById('rpt-quality-list');
    if (!box) return;
    const issues = this.dataQualityIssues();
    const open = this.getCorrectionRequests().filter(r => r.status === 'Open');
    const counts = { missing: 0, unusual: 0, overdue: 0, inactive: 0 };
    issues.forEach(i => { counts[i.type] = (counts[i.type] || 0) + 1; });
    const label = { missing: '📝 Kulang na Data', unusual: '❓ Kakaibang Halaga', overdue: '⏰ Follow-up', inactive: '🚫 Inactive Users' };

    const header = document.getElementById('rpt-quality-counts');
    if (header) {
      header.innerHTML = Object.keys(label).map(k =>
        `<span class="badge" style="background:#F1F5F9; color:#334155; margin-right:0.35rem;">${label[k]}: <strong>${counts[k]}</strong></span>`).join('') +
        `<span class="badge" style="background:#FEF3C7; color:#92400E;">📨 Open requests: <strong>${open.length}</strong></span>`;
    }

    if (!issues.length) {
      box.innerHTML = '<div style="padding:1rem; color:#16A34A; font-weight:600;">✅ Walang nakitang problema sa data.</div>';
      return;
    }
    box.innerHTML = issues.slice(0, 60).map(i => {
      const requested = i.childId && open.some(r => r.childId === i.childId && r.message === i.message);
      const action = i.childId
        ? (requested
          ? '<span style="font-size:0.75rem; color:#92400E;">📨 Requested</span>'
          : `<button type="button" class="btn btn-outline btn-sm" onclick='NutriReports.requestCorrection(${JSON.stringify(String(i.childId))}, ${JSON.stringify(i.message).replace(/'/g, '&#39;')}); NutriReports.renderDataQuality();'>Request correction</button>`)
        : `<button type="button" class="btn btn-outline btn-sm" onclick="NutriApp.switchMHOSubTab('users')">Review user</button>`;
      return `
        <div style="display:flex; justify-content:space-between; align-items:center; gap:0.75rem; padding:0.55rem 0.75rem; border-bottom:1px solid #F1F5F9;">
          <div>
            <div style="font-weight:700; color:#1E293B;">${this.esc(i.childName)} <span style="font-weight:500; color:#64748B; font-size:0.78rem;">${this.esc(i.barangay)}${i.worker ? ' • ' + this.esc(i.worker) : ''}</span></div>
            <div style="font-size:0.8rem; color:#B45309;">${label[i.type]} — ${this.esc(i.message)}</div>
          </div>
          <div>${action}</div>
        </div>`;
    }).join('');
  },

  resetAdminFilters() {
    ['rpt-filter-from', 'rpt-filter-to'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    ['rpt-filter-barangay', 'rpt-filter-worker', 'rpt-filter-age', 'rpt-filter-status', 'rpt-filter-followup']
      .forEach(id => { const el = document.getElementById(id); if (el) el.value = 'ALL'; });
    this.renderAdminReports();
  },

  describeFilters(f) {
    const parts = [];
    if (f.dateFrom || f.dateTo) parts.push(`Petsa ng pagsukat: ${f.dateFrom || 'simula'} hanggang ${f.dateTo || 'ngayon'}`);
    if (f.barangay && f.barangay !== 'ALL') parts.push(`Barangay: ${f.barangay}`);
    if (f.worker && f.worker !== 'ALL') parts.push(`Health Worker: ${f.worker}`);
    if (f.ageGroup && f.ageGroup !== 'ALL') parts.push(`Edad: ${f.ageGroup} buwan`);
    if (f.status && f.status !== 'ALL') parts.push(`Status: ${f.status}`);
    if (f.followUp && f.followUp !== 'ALL') parts.push(`Follow-up: ${f.followUp}`);
    if (f.groupName) parts.push(`Grupo: ${f.groupName}`);
    return parts.length ? parts.join(' • ') : 'Lahat ng talaan (walang filter)';
  },

  exportAdminCSV() {
    const f = this.readAdminFilters();
    const rows = this.filterChildren(f);
    const cell = v => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;
    const header = ['Name', 'Age (months)', 'Sex', 'Barangay', 'Health Worker', 'Height (cm)', 'Weight (kg)', 'MUAC (mm)', 'Status', 'Last Assessed', 'Next Follow-up', 'Deworming'];
    const lines = [header.map(cell).join(',')].concat(rows.map(c => [
      c.name, c.ageMonths, c.sex, c.barangay, this.recordedBy(c), c.heightCm, c.weightKg, c.muacMm,
      this.effectiveStatus(c), c.lastAssessed, c.nextFollowUpDate || '', c.dewormingStatus || ''
    ].map(cell).join(',')));
    const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `NutriLearn_Program_Report_${this.today()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    NutriStorage.logAudit('Report Exported', 'Reporting', `Program report CSV exported (${rows.length} records) — ${this.describeFilters(f)}`);
  },

  printAdminReport() {
    const f = this.readAdminFilters();
    this.openPrintableReport({
      title: 'Municipal Child Nutrition Program Report',
      subtitle: 'Municipal Health Office — Calabanga, Camarines Sur',
      filters: f,
      children: this.filterChildren(f),
      preparedBy: (NutriStorage.getCurrentUser() || {}).name || 'Municipal Health Officer'
    });
  },

  // ---------------------------------------------------------------------------
  // Structured printable report (Print → "Save as PDF")
  // ---------------------------------------------------------------------------
  openPrintableReport({ title, subtitle, filters, children, preparedBy, notes }) {
    const s = this.summarize(children);
    const e = v => this.esc(v);
    const rows = children.map((c, i) => `
      <tr>
        <td>${i + 1}</td><td>${e(c.name)}</td><td>${e(c.ageMonths)}</td><td>${e(c.sex)}</td>
        <td>${e(c.barangay)}</td><td>${e(c.heightCm)}</td><td>${e(c.weightKg)}</td><td>${e(c.muacMm || '')}</td>
        <td>${e(this.effectiveStatus(c))}</td><td>${e(c.lastAssessed || '')}</td><td>${e(c.nextFollowUpDate || '')}</td>
      </tr>`).join('');
    const html = `<!doctype html><html lang="fil"><head><meta charset="utf-8">
      <title>${e(title)} — ${this.today()}</title>
      <style>
        body { font-family: Inter, Arial, sans-serif; color: #111827; margin: 24px; font-size: 12px; }
        h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 20px; margin: 0; color: #0E3D26; }
        .sub { color: #4B5563; margin: 2px 0 12px; }
        .meta { border: 1px solid #D1D5DB; border-radius: 6px; padding: 8px 10px; margin-bottom: 12px; }
        .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 14px; }
        .kpi { border: 1px solid #D1D5DB; border-radius: 6px; padding: 6px 8px; }
        .kpi b { display: block; font-size: 16px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #D1D5DB; padding: 4px 6px; text-align: left; }
        th { background: #F0FDF4; }
        .sign { display: flex; justify-content: space-between; margin-top: 40px; }
        .sign div { width: 40%; border-top: 1px solid #111827; padding-top: 4px; text-align: center; }
        .note { margin-top: 10px; font-size: 11px; color: #4B5563; }
        @media print { .noprint { display: none; } body { margin: 10mm; } }
      </style></head><body>
      <div class="noprint" style="margin-bottom:12px;"><button onclick="window.print()">🖨️ Print / Save as PDF</button></div>
      <h1>${e(title)}</h1>
      <div class="sub">${e(subtitle || '')}</div>
      <div class="meta">
        <div><strong>Petsa ng ulat:</strong> ${this.today()}</div>
        <div><strong>Saklaw:</strong> ${e(this.describeFilters(filters || {}))}</div>
        <div><strong>Inihanda ni:</strong> ${e(preparedBy || '')}</div>
      </div>
      <div class="grid">
        <div class="kpi">Bilang ng bata<b>${s.total}</b></div>
        <div class="kpi">Stunted<b>${s.stunted} (${s.stuntingRate})</b></div>
        <div class="kpi">Wasted<b>${s.wasted}</b></div>
        <div class="kpi">Underweight<b>${s.underweight}</b></div>
        <div class="kpi">At Risk<b>${s.atRisk}</b></div>
        <div class="kpi">Improved<b>${s.improved}</b></div>
        <div class="kpi">Follow-ups (scheduled / overdue)<b>${s.followUpsScheduled} / ${s.followUpsOverdue}</b></div>
        <div class="kpi">Lesson completion<b>${s.lessonCompletion}</b></div>
      </div>
      ${notes ? `<div class="meta"><strong>Mga Tala:</strong> ${e(notes)}</div>` : ''}
      <table>
        <thead><tr><th>#</th><th>Pangalan</th><th>Edad (buwan)</th><th>Kasarian</th><th>Barangay</th><th>Taas (cm)</th><th>Timbang (kg)</th><th>MUAC (mm)</th><th>Status</th><th>Huling Sukat</th><th>Follow-up</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="11">Walang talaan.</td></tr>'}</tbody>
      </table>
      <div class="note">Ang ulat na ito ay para sa community nutrition monitoring at hindi isang clinical diagnosis.</div>
      <div class="sign"><div>Inihanda ni (Prepared by)</div><div>Sinuri ni (Reviewed by)</div></div>
      </body></html>`;

    const win = window.open('', '_blank');
    if (!win) {
      NutriApp.showToast('Pinigilan ng browser ang bagong window. Payagan ang pop-ups para makapag-print.', 'warning');
      return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
    NutriStorage.logAudit('Report Generated', 'Reporting', `${title} generated (${children.length} records) — ${this.describeFilters(filters || {})}`);
  },

  // ---------------------------------------------------------------------------
  // BHW: correction requests addressed to the signed-in health worker
  // ---------------------------------------------------------------------------
  renderCorrectionRequestsForBHW() {
    const box = document.getElementById('bhw-correction-requests');
    if (!box) return;
    const me = (NutriStorage.getCurrentUser() || {}).name;
    const open = this.getCorrectionRequests().filter(r => r.status === 'Open' &&
      (!me || r.assignedTo === me || r.assignedTo === 'Barangay Health Worker' || r.assignedTo === 'Hindi naitala'));
    const wrap = document.getElementById('bhw-correction-requests-card');
    if (wrap) wrap.style.display = open.length ? 'block' : 'none';
    box.innerHTML = open.map(r => `
      <div style="display:flex; justify-content:space-between; align-items:center; gap:0.75rem; padding:0.55rem 0; border-bottom:1px solid #FDE68A;">
        <div>
          <div style="font-weight:700;">${this.esc(r.childName)} <span style="font-weight:500; font-size:0.78rem; color:#92400E;">${this.esc(r.barangay)}</span></div>
          <div style="font-size:0.8rem;">${this.esc(r.message)}</div>
          <div style="font-size:0.72rem; color:#92400E;">Mula kay ${this.esc(r.requestedBy)} • ${this.esc((r.requestedAt || '').split('T')[0])}</div>
        </div>
        <div style="display:flex; gap:0.35rem;">
          <button type="button" class="btn btn-outline btn-sm" onclick="CHWModule.openEditModal('${this.esc(r.childId)}')">Buksan</button>
          <button type="button" class="btn btn-accent btn-sm" onclick="NutriReports.resolveCorrection('${this.esc(r.id)}')">Naayos na</button>
        </div>
      </div>`).join('');
  }
};

window.NutriReports = NutriReports;
