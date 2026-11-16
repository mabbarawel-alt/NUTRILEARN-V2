// ==============================================================================
// NUTRILEARN - STEP-BY-STEP MEAL-PLANNING GUIDE
// ------------------------------------------------------------------------------
// Thesis Activity Diagram 3.2.1 & Parent Journey step 4: "Parent follows the
// step-by-step meal-planning guide → System displays the next steps and
// meal-planning information." Personas 1 & 2 asked for a step-by-step guide
// using affordable, locally available food (Pinggang Pinoy: Go, Grow, Glow).
// Guidance is general nutrition education, not a medical prescription.
// ==============================================================================

const MealGuide = {
  step: 0,
  state: { age: null, budget: 35, go: null, grow: null, glow: null },

  AGES: {
    '6-8': {
      label: '6–8 buwan',
      texture: 'Dinurog o pinino (mashed / pureed), malapot na lugaw — hindi matubig.',
      amount: 'Simulan sa 2–3 kutsara, dahan-dahang dagdagan hanggang ½ tasa (125 ml) bawat kain.',
      frequency: '2–3 beses kumain sa isang araw, at ituloy ang pagpapasuso.'
    },
    '9-11': {
      label: '9–11 buwan',
      texture: 'Pinong hiniwa o dinurog, may kasamang malalambot na finger food.',
      amount: '½ tasa (125 ml) bawat kain.',
      frequency: '3–4 beses kumain, may 1–2 meryenda, at ituloy ang pagpapasuso.'
    },
    '12-23': {
      label: '12–23 buwan',
      texture: 'Pagkaing pampamilya, hiniwa nang maliliit.',
      amount: '¾ hanggang 1 tasa (175–250 ml) bawat kain.',
      frequency: '3–4 beses kumain, may 1–2 meryenda, at ituloy ang pagpapasuso.'
    },
    '24-59': {
      label: '2–5 taon',
      texture: 'Pagkaing pampamilya, hiwain kung kailangan.',
      amount: 'Mga 1 tasa (250 ml) bawat kain.',
      frequency: '3 beses kumain at 2 masustansyang meryenda.'
    }
  },

  FOODS: {
    go: [
      { id: 'rice', name: 'Kanin / Lugaw (Rice)', cost: 10, prep: 'Lutuin ang bigas bilang malapot na lugaw o malambot na kanin.' },
      { id: 'camote', name: 'Kamote (Sweet potato)', cost: 8, prep: 'Balatan, hugasan, at pakuluan ang kamote hanggang lumambot.' },
      { id: 'corn', name: 'Mais (Corn)', cost: 9, prep: 'Pakuluan ang mais hanggang lumambot; tanggalin sa busal kung kailangan.' },
      { id: 'saba', name: 'Saging na Saba', cost: 7, prep: 'Pakuluan ang saba nang may balat, saka balatan.' }
    ],
    grow: [
      { id: 'egg', name: 'Itlog (Egg)', cost: 10, prep: 'Lutuin nang buo ang itlog (hard-boiled) — huwag hilaw o malasado.' },
      { id: 'monggo', name: 'Monggo (Mung beans)', cost: 12, prep: 'Ibabad ang monggo, saka pakuluan hanggang lumambot at madurog.' },
      { id: 'dilis', name: 'Dilis (Anchovies)', cost: 8, prep: 'Hugasan ang dilis para mabawasan ang alat; lutuin at durugin nang pino.' },
      { id: 'tilapia', name: 'Tilapia', cost: 18, prep: 'Pasingawan o pakuluan ang isda; tanggalin nang mabuti ang lahat ng tinik.' },
      { id: 'liver', name: 'Atay ng Manok (Chicken liver)', cost: 15, prep: 'Lutuin nang buo ang atay ng manok, saka durugin.' }
    ],
    glow: [
      { id: 'malunggay', name: 'Malunggay', cost: 3, prep: 'Hugasan ang dahon ng malunggay; ihalo sa huling 2 minuto ng pagluluto.' },
      { id: 'kalabasa', name: 'Kalabasa (Squash)', cost: 6, prep: 'Pakuluan ang kalabasa hanggang lumambot.' },
      { id: 'papaya', name: 'Hinog na Papaya', cost: 5, prep: 'Hugasan, balatan at tanggalin ang buto ng hinog na papaya.' },
      { id: 'kangkong', name: 'Kangkong', cost: 4, prep: 'Hugasan nang mabuti ang dahon ng kangkong; lutuin nang sandali.' }
    ]
  },

  STEPS: ['Edad ng Bata', 'Budget', 'Pumili ng Pagkain', 'Paano Ihanda', 'Buod'],

  esc(v) {
    return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  },

  savedKey() {
    const user = (typeof NutriStorage !== 'undefined' && NutriStorage.getCurrentUser()) || {};
    return 'nutrilearn_saved_meal_plans_' + (user.id || 'guest');
  },

  getSavedPlans() {
    try {
      return JSON.parse(localStorage.getItem(this.savedKey()) || '[]');
    } catch (e) {
      return [];
    }
  },

  ageFromMonths(m) {
    if (m == null || isNaN(m)) return null;
    if (m < 9) return '6-8';
    if (m < 12) return '9-11';
    if (m < 24) return '12-23';
    return '24-59';
  },

  find(group, id) {
    return this.FOODS[group].find(f => f.id === id);
  },

  totalCost() {
    return ['go', 'grow', 'glow'].reduce((sum, g) => {
      const f = this.state[g] && this.find(g, this.state[g]);
      return sum + (f ? f.cost : 0);
    }, 0);
  },

  start() {
    const child = (typeof ParentModule !== 'undefined' && ParentModule.getActiveChild) ? ParentModule.getActiveChild() : null;
    this.state = { age: this.ageFromMonths(child && child.ageMonths) || '12-23', budget: 35, go: null, grow: null, glow: null };
    this.step = 0;
    this.render();
    const root = document.getElementById('meal-guide-root');
    if (root) root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  close() {
    this.step = -1;
    this.render();
  },

  canContinue() {
    if (this.step === 0) return Boolean(this.state.age);
    if (this.step === 1) return Boolean(this.state.budget);
    if (this.step === 2) return Boolean(this.state.go && this.state.grow && this.state.glow);
    return true;
  },

  next() {
    if (!this.canContinue()) {
      NutriApp.showToast('Pumili muna bago magpatuloy. / Please make a choice first.', 'warning');
      return;
    }
    this.step = Math.min(this.step + 1, this.STEPS.length - 1);
    this.render();
  },

  back() {
    this.step = Math.max(this.step - 1, 0);
    this.render();
  },

  choose(key, value) {
    this.state[key] = key === 'budget' ? Number(value) : value;
    this.render();
  },

  // Preparation steps generated from the chosen foods and the child's age
  preparationSteps() {
    const age = this.AGES[this.state.age];
    const go = this.find('go', this.state.go);
    const grow = this.find('grow', this.state.grow);
    const glow = this.find('glow', this.state.glow);
    return [
      'Maghugas ng kamay gamit ang sabon at malinis na tubig. Linisin ang mga gamit sa pagluluto.',
      go.prep,
      grow.prep,
      glow.prep,
      `Pagsamahin ang ${go.name}, ${grow.name} at ${glow.name}. ${age.texture}`,
      'Huwag lagyan ng asin, toyo, patis o asukal ang pagkain ng bata (lalo na bago mag-1 taon).',
      `Ihain: ${age.amount} ${age.frequency}`,
      'Pakainin nang dahan-dahan at may pagtitiyaga (responsive feeding). Huwag pilitin ang bata.',
      'Ubusin sa loob ng 2 oras. Takpan at ilagay sa malamig na lugar ang matitira; initin nang mabuti bago ipakain muli.'
    ];
  },

  save() {
    const plans = this.getSavedPlans();
    const plan = {
      id: 'mp-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      age: this.state.age,
      go: this.find('go', this.state.go).name,
      grow: this.find('grow', this.state.grow).name,
      glow: this.find('glow', this.state.glow).name,
      cost: this.totalCost(),
      budget: this.state.budget,
      steps: this.preparationSteps()
    };
    plans.unshift(plan);
    localStorage.setItem(this.savedKey(), JSON.stringify(plans.slice(0, 30)));
    if (typeof NutriStorage !== 'undefined') {
      NutriStorage.logAudit('Meal Plan Created', 'Meal Planning',
        `Guided meal plan saved: ${plan.go} + ${plan.grow} + ${plan.glow} (₱${plan.cost}/serving, ${this.AGES[plan.age].label})`);
    }
    NutriApp.showToast('✅ Na-save ang iyong meal plan! / Meal plan saved.', 'success');
    this.close();
  },

  print() {
    const s = this.state;
    const age = this.AGES[s.age];
    const items = ['go', 'grow', 'glow'].map(g => this.find(g, s[g]));
    const win = window.open('', '_blank');
    if (!win) {
      NutriApp.showToast('Payagan ang pop-ups para makapag-print.', 'warning');
      return;
    }
    win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Meal Plan</title>
      <style>body{font-family:Inter,Arial,sans-serif;margin:24px;color:#111827}h1{font-family:Georgia,serif;color:#0E3D26}li{margin:4px 0}</style>
      </head><body><h1>Gabay sa Pagkain ng Bata</h1>
      <p><strong>Edad:</strong> ${this.esc(age.label)} &nbsp; <strong>Gastos:</strong> ₱${this.totalCost()} bawat serving</p>
      <p><strong>Go:</strong> ${this.esc(items[0].name)} &nbsp; <strong>Grow:</strong> ${this.esc(items[1].name)} &nbsp; <strong>Glow:</strong> ${this.esc(items[2].name)}</p>
      <ol>${this.preparationSteps().map(t => `<li>${this.esc(t)}</li>`).join('')}</ol>
      <p style="font-size:11px;color:#6B7280">Pangkalahatang gabay sa nutrisyon ito, hindi reseta. Kumonsulta sa inyong health worker para sa espesyal na pangangailangan ng bata.</p>
      <button onclick="window.print()">🖨️ Print</button></body></html>`);
    win.document.close();
  },

  renderSaved() {
    const plans = this.getSavedPlans();
    if (!plans.length) return '';
    return `
      <div style="margin-top:0.9rem;">
        <div style="font-weight:700; color:#14532D; margin-bottom:0.35rem;">📒 Mga Na-save na Meal Plan</div>
        ${plans.slice(0, 5).map(p => `
          <div style="background:#F7FAF8; border:1px solid #DCFCE7; border-radius:8px; padding:0.45rem 0.65rem; margin-bottom:0.35rem; font-size:0.82rem;">
            <strong>${this.esc(p.go)} + ${this.esc(p.grow)} + ${this.esc(p.glow)}</strong>
            <span style="color:#6B7280;"> • ₱${this.esc(p.cost)} • ${this.esc((this.AGES[p.age] || {}).label || '')} • ${this.esc(p.date)}</span>
          </div>`).join('')}
      </div>`;
  },

  optionButton(selected, onclick, title, sub) {
    return `<button type="button" onclick="${onclick}"
      style="text-align:left; padding:0.65rem 0.8rem; border-radius:10px; border:2px solid ${selected ? '#16A34A' : '#E5E7EB'}; background:${selected ? '#F0FDF4' : '#FFFFFF'}; cursor:pointer; min-height:48px;">
      <div style="font-weight:700; color:#14532D;">${selected ? '✓ ' : ''}${title}</div>
      ${sub ? `<div style="font-size:0.78rem; color:#6B7280;">${sub}</div>` : ''}
    </button>`;
  },

  renderStepBody() {
    const s = this.state;
    if (this.step === 0) {
      return `<p style="margin:0 0 0.6rem;">Ilang buwan na ang iyong anak? Iba-iba ang lambot ng pagkain at dami ng kain ayon sa edad.</p>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:0.5rem;">
          ${Object.entries(this.AGES).map(([k, a]) => this.optionButton(s.age === k, `MealGuide.choose('age','${k}')`, a.label, a.amount)).join('')}
        </div>`;
    }
    if (this.step === 1) {
      return `<p style="margin:0 0 0.6rem;">Magkano ang kaya mong ilaan bawat serving?</p>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(120px, 1fr)); gap:0.5rem;">
          ${[25, 35, 45].map(b => this.optionButton(s.budget === b, `MealGuide.choose('budget',${b})`, `₱${b}`, 'bawat serving')).join('')}
        </div>`;
    }
    if (this.step === 2) {
      const total = this.totalCost();
      const over = total > s.budget;
      const group = (key, label, hint) => `
        <div style="margin-bottom:0.7rem;">
          <div style="font-weight:700; margin-bottom:0.3rem;">${label} <span style="font-weight:500; color:#6B7280; font-size:0.8rem;">${hint}</span></div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:0.4rem;">
            ${this.FOODS[key].map(f => this.optionButton(s[key] === f.id, `MealGuide.choose('${key}','${f.id}')`, this.esc(f.name), '₱' + f.cost)).join('')}
          </div>
        </div>`;
      return group('go', '🟡 GO', '(enerhiya)') + group('grow', '🔴 GROW', '(protina — para sa paglaki)') + group('glow', '🟢 GLOW', '(bitamina at mineral)') +
        `<div style="padding:0.5rem 0.7rem; border-radius:8px; font-weight:700; background:${over ? '#FEF2F2' : '#F0FDF4'}; color:${over ? '#B91C1C' : '#166534'};">
          Kabuuan: ₱${total} / ₱${s.budget} budget ${over ? '— lampas sa budget; pumili ng mas murang GROW o GO na pagkain (hal. dilis o saba).' : '✓'}
        </div>`;
    }
    if (this.step === 3) {
      return `<ol style="margin:0; padding-left:1.2rem; line-height:1.55;">
        ${this.preparationSteps().map(t => `<li style="margin-bottom:0.3rem;">${this.esc(t)}</li>`).join('')}
      </ol>`;
    }
    const age = this.AGES[s.age];
    return `<div style="display:grid; gap:0.35rem; font-size:0.9rem;">
        <div><strong>Edad:</strong> ${age.label}</div>
        <div><strong>Pagkain:</strong> ${this.esc(this.find('go', s.go).name)} + ${this.esc(this.find('grow', s.grow).name)} + ${this.esc(this.find('glow', s.glow).name)}</div>
        <div><strong>Gastos:</strong> ₱${this.totalCost()} bawat serving (budget ₱${s.budget})</div>
        <div><strong>Lambot:</strong> ${age.texture}</div>
        <div><strong>Dami at dalas:</strong> ${age.amount} ${age.frequency}</div>
      </div>
      <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-top:0.8rem;">
        <button type="button" class="btn btn-accent" onclick="MealGuide.save()">💾 I-save ang Meal Plan</button>
        <button type="button" class="btn btn-outline" onclick="MealGuide.print()">🖨️ I-print</button>
      </div>
      <p style="font-size:0.75rem; color:#6B7280; margin:0.6rem 0 0;">Pangkalahatang gabay sa nutrisyon ito, hindi reseta. Kumonsulta sa inyong health worker para sa espesyal na pangangailangan ng bata.</p>`;
  },

  render() {
    const root = document.getElementById('meal-guide-root');
    if (!root) return;
    if (this.step < 0) {
      root.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; gap:0.75rem; flex-wrap:wrap;">
          <div>
            <div style="font-family:'Playfair Display', Georgia, serif; font-size:1.25rem; font-weight:700; color:#1A3828;">🧭 Gabay sa Pagpaplano ng Pagkain</div>
            <div style="font-size:0.85rem; color:#6B7280;">Hakbang-hakbang: edad → budget → Go/Grow/Glow → paano ihanda</div>
          </div>
          <button type="button" class="btn btn-accent" onclick="MealGuide.start()">Simulan ang Gabay →</button>
        </div>
        ${this.renderSaved()}`;
      return;
    }
    const pct = Math.round(((this.step + 1) / this.STEPS.length) * 100);
    root.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
        <div style="font-weight:800; color:#14532D;">Hakbang ${this.step + 1} ng ${this.STEPS.length}: ${this.STEPS[this.step]}</div>
        <button type="button" class="btn btn-outline btn-sm" onclick="MealGuide.close()">Isara</button>
      </div>
      <div style="height:6px; background:#E5E7EB; border-radius:999px; margin-bottom:0.8rem;">
        <div style="height:6px; width:${pct}%; background:#16A34A; border-radius:999px;"></div>
      </div>
      ${this.renderStepBody()}
      <div style="display:flex; justify-content:space-between; margin-top:0.9rem;">
        <button type="button" class="btn btn-outline" onclick="MealGuide.back()" ${this.step === 0 ? 'disabled' : ''}>← Bumalik</button>
        ${this.step < this.STEPS.length - 1 ? `<button type="button" class="btn btn-accent" onclick="MealGuide.next()" ${this.canContinue() ? '' : 'disabled'}>Susunod →</button>` : ''}
      </div>`;
  },

  init() {
    this.step = -1;
    this.render();
  }
};

window.MealGuide = MealGuide;
document.addEventListener('DOMContentLoaded', () => MealGuide.init());
