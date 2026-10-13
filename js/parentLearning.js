// ==========================================================================
// NUTRILEARN - PARENT LEARNING & MEAL PLANNING MODULE (v3.0)
// Interactive Food Modules, Lesson Accordion, Home Actions, Pinggang Pinoy
// ==========================================================================

const ParentModule = {
  currentModuleId: 'mod-1',
  activeAccordionLessonIndex: 0,
  currentQuizQuestionIndex: 0,
  currentQuizAnswers: {},
  selectedQuizOption: null,

  // 4 Featured Evidence-Based Food Nutrition Modules matching official mockups
  nutritionModules: [
    {
      id: 'mod-1',
      number: 'Module 1',
      title: 'Understanding Child Malnutrition',
      summary: 'Learn the signs, causes, and effects of stunting and wasting in children under 5.',
      image: 'assets/images/module-malnutrition.jpg',
      duration: '45 min',
      lessonsCount: 5,
      defaultProgress: 100,
      defaultStatus: 'Completed',
      statusClass: 'badge-completed',
      lessons: [
        {
          title: 'What is Malnutrition?',
          icon: '📖',
          completed: true,
          content: 'Malnutrition occurs when a child does not get the right amount of nutrients their body needs to grow and develop. It includes both undernutrition (too little food or nutrients) and overnutrition (too much). In the Philippines, undernutrition — especially stunting and wasting — remains a major concern for children under 5.'
        },
        {
          title: 'Stunting: Low Height for Age',
          icon: '✏️',
          completed: true,
          content: 'Stunting happens when chronic undernutrition prevents a child from growing to their expected height. It is not just about being short — stunting affects brain development, school readiness, and long-term health. It is usually caused by poor diet over many months, repeated illnesses, or both.'
        },
        {
          title: 'Wasting: Low Weight for Height',
          icon: '⚖️',
          completed: true,
          content: 'Wasting occurs when a child suffers from acute, rapid weight loss or failure to gain weight. It is often triggered by sudden food shortages, infectious illness, or chronic diarrhea. A wasted child is dangerously thin and has a weakened immune system requiring immediate therapeutic supplementary feeding.'
        },
        {
          title: 'Recognizing the Signs',
          icon: '🔍',
          completed: true,
          content: 'Watch out for signs of growth faltering: constant fatigue, lack of energy to play, frequent infections, poor appetite, thin or brittle hair, and swelling (edema) in feet or legs. Regular monthly monitoring using Mid-Upper Arm Circumference (MUAC) and height-for-age charts catches these signs early.'
        },
        {
          title: 'Prevention Starts Early',
          icon: '🌱',
          completed: true,
          content: 'The First 1,000 Days (conception to age 2) is the critical window. Prevent stunting through: 1) Maternal nutrition and iron-folic acid during pregnancy, 2) Exclusive breastfeeding for 6 months, 3) Diverse, nutrient-rich complementary foods (Malunggay, Monggo, Camote, Eggs) starting at 6 months, and 4) Clean drinking water and WASH hygiene.'
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
      lessonsCount: 6,
      defaultProgress: 50,
      defaultStatus: 'In Progress',
      statusClass: 'badge-in-progress',
      lessons: [
        {
          title: 'The 6-Month Feeding Milestone',
          icon: '👶',
          completed: true,
          content: 'At 6 months, breast milk alone can no longer meet all of an infant\'s energy and micronutrient requirements, particularly iron and zinc. Introduce clean, soft complementary foods while continuing frequent breastfeeding on demand up to 2 years and beyond.'
        },
        {
          title: 'First Foods & Gradual Introduction',
          icon: '🥣',
          completed: true,
          content: 'Start with thick Lugaw enriched with mashed kalabasa, sweet potato (camote), or pureed chicken liver. Introduce one new food at a time every 3 to 4 days to check for possible food allergies or intolerances.'
        },
        {
          title: 'Texture Progression by Age',
          icon: '🥑',
          completed: true,
          content: 'Progress textures carefully: 6-8 months: Thick, smooth purée or well-mashed food; 9-11 months: Finely chopped, mashed, or soft finger foods; 12-23 months: Family foods cut into bite-sized pieces. Avoid overly watery broths which fill the child\'s stomach without providing calories.'
        },
        {
          title: 'Daily Feeding Frequency & Portions',
          icon: '🍽️',
          completed: false,
          content: '6-8 months: 2 to 3 meals per day plus breastmilk (start with 2-3 tablespoons, building up to 1/2 cup); 9-11 months: 3 to 4 meals plus 1 nutritious snack (1/2 cup per meal); 12-23 months: 3 to 4 meals plus 1-2 healthy snacks (3/4 to 1 full cup per meal).'
        },
        {
          title: 'Nutrient Boosters: Fortifying Porridge',
          icon: '🌿',
          completed: false,
          content: 'Plain rice lugaw is mostly water and simple carbohydrates. Always boost your child\'s porridge by stirring in: 1) Finely chopped malunggay or camote leaves, 2) Mashed hard-boiled egg yolk, 3) Cooked monggo or mashed tofu, and 4) Half a teaspoon of coconut oil or butter for brain-building healthy fats.'
        },
        {
          title: 'Safe Food Preparation & Storage',
          icon: '🧼',
          completed: false,
          content: 'Infants have immature immune systems and are vulnerable to diarrhea. Wash caregiver and infant hands with soap before preparing or eating. Use thoroughly cleaned utensils, serve food immediately after cooking, and never keep leftovers at room temperature for more than 2 hours.'
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
      lessonsCount: 8,
      defaultProgress: 25,
      defaultStatus: 'In Progress',
      statusClass: 'badge-in-progress',
      lessons: [
        {
          title: 'Pinggang Pinoy: The Filipino Nutrition Plate',
          icon: '🍛',
          completed: true,
          content: 'Pinggang Pinoy is a visual guide by FNRI-DOST: 1/2 plate Glow foods (vegetables and fruits), 1/4 plate Grow foods (proteins like fish, eggs, monggo), and 1/4 plate Go foods (energy-giving rice, camote, or corn). Every family meal should balance all three groups.'
        },
        {
          title: 'Malunggay: The Backyard Miracle Superfood',
          icon: '🌿',
          completed: true,
          content: 'Malunggay (Moringa) is one of the cheapest and most nutrient-dense greens in the world. It provides vitamin A for immunity and eyesight, vitamin C, calcium, iron, and protein. Add fresh malunggay leaves to soups, rice, scrambled eggs, and fish stews during the last 2 minutes of cooking.'
        },
        {
          title: 'Monggo: High-Yield Plant Protein at ₱15-₱25',
          icon: '🍲',
          completed: false,
          content: 'Ginisang Monggo is an affordable protein powerhouse. Pairing monggo with rice creates a complete protein profile containing all essential amino acids necessary for muscle, tissue, and height growth.'
        },
        {
          title: 'Camote & Local Root Crops for Sustained Energy',
          icon: '🍠',
          completed: false,
          content: 'Orange and yellow sweet potatoes (camote) provide complex carbohydrates that prevent sudden blood sugar spikes, alongside beta-carotene (vitamin A). Steam, bake, or mash with milk or coconut oil as a healthy alternative to white bread.'
        },
        {
          title: 'Eggs & Small Fish: Essential Brain Boosters',
          icon: '🥚',
          completed: false,
          content: 'One egg a day provides high-quality protein, choline for brain development, and essential minerals. Small fish like dilis (anchovies) eaten whole with bones supply concentrated calcium to build strong bones and teeth.'
        },
        {
          title: 'Healthy Fats & Oils for Brain Development',
          icon: '🫒',
          completed: false,
          content: '60% of a child\'s brain is composed of fat. Adding small amounts of vegetable oil, coconut milk (gata), or avocado to your child\'s meals helps absorb fat-soluble vitamins (A, D, E, K) and provides concentrated energy.'
        },
        {
          title: 'Reducing Salt, Sugar & Ultra-Processed Snacks',
          icon: '🚫',
          completed: false,
          content: 'Avoid junk foods, sugary biscuits, powdered juices, and instant noodles. High sodium damages toddler kidneys, while excess sugar displaces nutrient-dense foods and ruins appetite for real family meals.'
        },
        {
          title: 'Budget Meal Planning under ₱40 per Day',
          icon: '💰',
          completed: false,
          content: 'Plan weekly meals around backyard vegetables, market produce in season, and bulk dried staples (monggo, dilis, eggs). Buying local and in-season saves up to 40% on food costs while providing freshest nutrients.'
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
      lessonsCount: 4,
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      statusClass: 'badge-not-started',
      lessons: [
        {
          title: 'Responsive Feeding: Talking & Encouragement',
          icon: '🗣️',
          completed: false,
          content: 'Feed slowly and patiently with encouragement, never force-feeding. Maintain eye contact, smile, talk to your child about food colors and flavors, and respond promptly to hunger cues (opening mouth, reaching for food) and fullness cues (turning head away, closing lips).'
        },
        {
          title: 'Handling Picky Eating with Patience',
          icon: '🥦',
          completed: false,
          content: 'It is normal for toddlers to be cautious with unfamiliar foods (neophobia). Research shows a child may need to see, smell, and touch a new vegetable 10 to 15 times before accepting it. Stay patient, serve a tiny portion alongside favorite foods, and avoid expressing frustration.'
        },
        {
          title: 'Creating a Screen-Free Mealtime Routine',
          icon: '📱',
          completed: false,
          content: 'Eating in front of smartphones, tablets, or televisions promotes mindless chewing and disconnects children from their body\'s natural fullness signals. Make mealtimes a family social occasion where everyone eats together at the table.'
        },
        {
          title: 'Self-Feeding & Fine Motor Skill Development',
          icon: '👶',
          completed: false,
          content: 'Encourage self-feeding by offering safe finger foods (steamed carrot batons, soft banana slices, bite-sized omelet strips). Messy eating is an essential developmental stage that builds hand-eye coordination, independence, and a positive relationship with healthy eating.'
        }
      ]
    }
  ],

  // 10 Daily Nutrition Practices for "Try It at Home"
  homeActions: [
    { id: 1, title: 'Fresh Malunggay Leaf Boost', tip: 'Add 1 handful of fresh malunggay leaves to your child\'s soup or rice porridge.' },
    { id: 2, title: 'Affordable Ginisang Monggo', tip: 'Prepare boiled monggo with dilis or small fish for lunch protein.' },
    { id: 3, title: 'Daily Hard-Boiled Egg Snack', tip: 'Offer 1 whole hard-boiled or scrambled egg as an afternoon growth snack.' },
    { id: 4, title: 'Yellow Camote Energy Mash', tip: 'Serve mashed yellow/orange sweet potato with 1/2 teaspoon of healthy coconut oil.' },
    { id: 5, title: 'Clean Handwashing with Soap', tip: 'Wash hands with soap and water before handling food and feeding your child.' },
    { id: 6, title: 'Clean Boiled Drinking Water', tip: 'Ensure your child drinks clean, boiled water throughout the day instead of sugary drinks.' },
    { id: 7, title: 'Soft Finger Foods Practice', tip: 'Offer soft finger foods (steamed carrots, banana slices) so child practices self-feeding.' },
    { id: 8, title: 'Responsive Mealtime Conversation', tip: 'Talk, smile, and make eye contact during mealtimes without TV or phone distractions.' },
    { id: 9, title: 'Fresh Local Fruits After Meal', tip: 'Serve fresh sliced papaya, saba banana, or avocado after family meals.' },
    { id: 10, title: 'Monthly Barangay Growth Weigh-in', tip: 'Attend the monthly barangay weighing and MUAC growth check-up with your BHW.' }
  ],

  init() {
    this.loadProgressState();
    this.renderModuleCards();
    this.renderHomeActionsChecklist();
    this.renderRecipes();
    this.updateProgressHeader();
    this.initCustomMealBuilder();
    this.renderChildGrowth();
  },

  // Load saved lesson and action progress from localStorage
  loadProgressState() {
    try {
      // 1. Load custom module definitions from Administrator if modified
      const savedModulesData = localStorage.getItem('nutrilearn_parent_modules_data_v3');
      if (savedModulesData) {
        const customMods = JSON.parse(savedModulesData);
        if (Array.isArray(customMods) && customMods.length > 0) {
          this.nutritionModules = customMods;
        }
      }

      // 2. Load lesson completion progress
      const savedProgress = localStorage.getItem('nutrilearn_parent_modules_v3');
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        this.nutritionModules.forEach(mod => {
          if (parsed[mod.id]) {
            mod.lessons.forEach((l, idx) => {
              if (parsed[mod.id].completedLessons && parsed[mod.id].completedLessons.includes(idx)) {
                l.completed = true;
              }
            });
          }
        });
      }
    } catch (e) {
      console.warn('Error loading parent progress:', e);
    }
  },

  saveProgressState() {
    try {
      const state = {};
      this.nutritionModules.forEach(mod => {
        state[mod.id] = {
          completedLessons: mod.lessons.map((l, i) => l.completed ? i : -1).filter(i => i >= 0)
        };
      });
      localStorage.setItem('nutrilearn_parent_modules_v3', JSON.stringify(state));
    } catch (e) {
      console.warn('Error saving parent progress:', e);
    }
  },

  // Switch Sub-Tabs in Parent Portal: 'learning', 'meal-planner', 'try-at-home', 'growth-tracker'
  switchTab(tabId) {
    // 1. Update top taskbar pill buttons
    document.querySelectorAll('.parent-pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // 2. Hide/show relevant tab panes in view-parent
    const dashboardPane = document.querySelector('.parent-tab-pane[data-tab="dashboard"]');
    const mealPane = document.querySelector('.parent-tab-pane[data-tab="meal-planner"]');
    const growthPane = document.querySelector('.parent-tab-pane[data-tab="growth-tracker"]');
    const tryAtHomePane = document.getElementById('parent-pane-try-at-home');

    // Default hide all
    if (dashboardPane) dashboardPane.style.display = 'none';
    if (mealPane) mealPane.style.display = 'none';
    if (growthPane) growthPane.style.display = 'none';
    if (tryAtHomePane) tryAtHomePane.style.display = 'none';

    // Show selected
    if (tabId === 'learning') {
      if (dashboardPane) dashboardPane.style.display = 'block';
      this.closeModuleDrawer();
      this.renderChildGrowth();
    } else if (tabId === 'meal-planner') {
      if (mealPane) mealPane.style.display = 'block';
    } else if (tabId === 'try-at-home') {
      if (tryAtHomePane) tryAtHomePane.style.display = 'block';
    } else if (tabId === 'growth-tracker') {
      if (growthPane) growthPane.style.display = 'block';
      this.renderChildGrowth();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // Render Parent Learning Modules Cards (2x2 Grid)
  renderModuleCards() {
    const container = document.getElementById('parent-modules-container');
    if (!container) return;

    const isFil = !window.NutriI18n || NutriI18n.currentLang === 'fil';

    container.innerHTML = this.nutritionModules.map(mod => {
      const completedCount = mod.lessons.filter(l => l.completed).length;
      const totalCount = mod.lessons.length;
      const pct = Math.round((completedCount / totalCount) * 100);

      const statusBadge = pct === 100 
        ? `<span class="module-status-badge badge-completed">${isFil ? 'Natapos' : 'Completed'}</span>`
        : (pct > 0 
            ? `<span class="module-status-badge badge-in-progress">${isFil ? 'Ginagawa Pa' : 'In Progress'}</span>` 
            : `<span class="module-status-badge badge-not-started">${isFil ? 'Hindi Pa Nasisimulan' : 'Not Started'}</span>`);

      const fillClass = pct === 100 ? 'fill-green' : (pct > 0 ? 'fill-orange' : 'fill-gray');
      const actionText = pct === 100 
        ? (isFil ? 'Balikan ang Aralin →' : 'Review Lessons →') 
        : (pct > 0 
            ? (isFil ? 'Magpatuloy →' : 'Continue →') 
            : (isFil ? 'Simulan →' : 'Start →'));

      const foods = (mod.recommendedFoods || 'Malunggay, Monggo, Itlog, Camote')
        .split(',')
        .map(f => f.trim())
        .filter(Boolean);
      const foodSnippet = foods.length > 0 
        ? `<div style="font-size:0.75rem; color:#15803D; font-weight:600; margin:0.35rem 0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">🌱 ${foods.slice(0, 3).join(', ')}${foods.length > 3 ? '...' : ''}</div>` 
        : '';

      const lessonsLabel = isFil ? `${totalCount} aralin` : `${totalCount} lessons`;
      const pctLabel = isFil ? `${pct}% tapos na` : `${pct}% complete`;

      return `
        <div class="nutrition-module-card" onclick="ParentModule.openModuleDrawer('${mod.id}')">
          <div class="module-img-container">
            <img src="${mod.image || 'assets/images/module-malnutrition.jpg'}" alt="${mod.title}" class="module-card-img" loading="lazy" onerror="this.src='assets/images/module-malnutrition.jpg'">
            ${statusBadge}
          </div>
          <div class="module-card-content">
            <div class="module-card-title">${mod.title}</div>
            <div class="module-card-summary">${mod.summary}</div>
            ${foodSnippet}
            <div class="module-card-meta">
              <span>📖 ${lessonsLabel}</span>
              <span>⏱ ${mod.duration}</span>
            </div>
            <div class="module-progress-track">
              <div class="module-progress-fill ${fillClass}" style="width: ${pct}%;"></div>
            </div>
            <div class="module-card-footer">
              <span class="module-pct-text">${pctLabel}</span>
              <span class="module-action-link">${actionText}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  // Open the interactive module lesson accordion drawer (Screenshot 2)
  openModuleDrawer(moduleId) {
    this.currentModuleId = moduleId;
    const mod = this.nutritionModules.find(m => m.id === moduleId) || this.nutritionModules[0];
    const drawer = document.getElementById('parent-module-lesson-drawer');
    const grid = document.getElementById('parent-modules-container');
    const heading = document.getElementById('parent-modules-grid-heading');

    if (!drawer) return;

    const completedCount = mod.lessons.filter(l => l.completed).length;
    const totalCount = mod.lessons.length;
    const pct = Math.round((completedCount / totalCount) * 100);

    const statusBadge = pct === 100 
      ? '<span class="module-status-badge badge-completed">Completed</span>'
      : (pct > 0 ? '<span class="module-status-badge badge-in-progress">In Progress</span>' : '<span class="module-status-badge badge-not-started">Not Started</span>');

    const fillClass = pct === 100 ? 'fill-green' : (pct > 0 ? 'fill-orange' : 'fill-gray');

    drawer.innerHTML = `
      <div class="drawer-top-nav">
        <button type="button" class="btn-drawer-back" onclick="ParentModule.closeModuleDrawer()">
          ← Back to All Modules
        </button>
        <div style="font-size: 0.82rem; font-weight: 700; color: #2E7D32;">
          ${mod.number} of 4
        </div>
      </div>

      <!-- Module Preview Card (Screenshot 2 Top) -->
      <div class="drawer-preview-card">
        <div class="drawer-preview-img-wrap">
          <img src="${mod.image || 'assets/images/module-malnutrition.jpg'}" alt="${mod.title}" onerror="this.src='assets/images/module-malnutrition.jpg'">
          ${statusBadge}
        </div>
        <div class="drawer-preview-body">
          <div style="font-size: 1.25rem; font-weight: 800; color: #1E293B; margin-bottom: 0.35rem;">
            ${mod.title}
          </div>
          <div style="font-size: 0.88rem; color: #64748B; margin-bottom: 0.55rem; line-height: 1.45;">
            ${mod.summary}
          </div>

          <!-- Ano ang Dapat na Pagkain Section -->
          ${mod.recommendedFoods ? `
            <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 0.6rem 0.85rem; margin-bottom: 0.65rem;">
              <div style="font-size: 0.76rem; font-weight: 700; color: #14532D; margin-bottom: 0.3rem;">
                🥗 Ano ang Dapat na Pagkain (Inirerekomenda ng Health Center):
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                ${mod.recommendedFoods.split(',').map(f => `<span style="background: #FFFFFF; color: #15803D; border: 1px solid #86EFAC; font-size: 0.72rem; font-weight: 600; padding: 2px 7px; border-radius: 4px;">🌱 ${f.trim()}</span>`).join('')}
              </div>
              ${mod.feedingGuide ? `
                <div style="font-size: 0.75rem; color: #374151; margin-top: 0.35rem; line-height: 1.35;">
                  <strong>Gabay:</strong> ${mod.feedingGuide}
                </div>
              ` : ''}
            </div>
          ` : ''}

          <div class="module-card-meta" style="margin-bottom: 0.65rem;">
            <span>📖 ${totalCount} lessons</span>
            <span>⏱ ${mod.duration}</span>
          </div>
          <div class="module-progress-track" style="height: 7px; margin-bottom: 0.5rem;">
            <div class="module-progress-fill ${fillClass}" style="width: ${pct}%;"></div>
          </div>
          <div style="font-size: 0.8rem; font-weight: 700; color: #64748B;">
            ${pct}% complete
          </div>
        </div>
      </div>

      <!-- Lessons Progress Bar Subheader (Screenshot 2 Subheader) -->
      <div class="drawer-lessons-progress-bar">
        <div class="drawer-lessons-progress-text">
          ${completedCount} / ${totalCount} lessons completed
        </div>
        <div class="drawer-mini-track">
          <div class="drawer-mini-fill" style="width: ${pct}%;"></div>
        </div>
      </div>

      <!-- Accordion of Lessons -->
      <div class="lesson-accordion-list">
        ${mod.lessons.map((lesson, idx) => {
          // In Screenshot 2, lessons 0 and 1 are expanded for Module 1 by default
          const isInitiallyOpen = (moduleId === 'mod-1' && (idx === 0 || idx === 1)) || (idx === 0);
          const iconStatus = lesson.completed 
            ? '<div class="lesson-status-icon">✓</div>' 
            : '<div class="lesson-status-icon incomplete">○</div>';

          return `
            <div class="lesson-accordion-item ${isInitiallyOpen ? 'active' : ''}" id="accordion-item-${idx}">
              <div class="lesson-accordion-header" onclick="ParentModule.toggleLessonAccordion('${mod.id}', ${idx})">
                <div class="lesson-header-left">
                  ${iconStatus}
                  <div class="lesson-title-text">
                    <span>${lesson.icon}</span>
                    <span>${lesson.title}</span>
                  </div>
                </div>
                <div class="lesson-accordion-toggle" id="toggle-arrow-${idx}">
                  ${isInitiallyOpen ? '▲' : '▼'}
                </div>
              </div>
              <div class="lesson-accordion-body" id="accordion-body-${idx}" style="display: ${isInitiallyOpen ? 'block' : 'none'};">
                <div class="lesson-quote-box">
                  ${lesson.content}
                </div>
                <div class="lesson-actions-row">
                  <button type="button" class="btn btn-sm ${lesson.completed ? 'btn-outline' : 'btn-accent'}" 
                    style="font-size: 0.78rem; padding: 4px 12px;"
                    onclick="ParentModule.toggleLessonComplete('${mod.id}', ${idx}, event)">
                    ${lesson.completed ? '✓ Completed' : 'Mark as Completed'}
                  </button>
                  <button type="button" class="btn btn-primary btn-sm" 
                    style="font-size: 0.78rem; padding: 4px 12px;"
                    onclick="ParentModule.startQuiz('${mod.id}')">
                    Take Module Quiz →
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    drawer.style.display = 'block';
    if (grid) grid.style.display = 'none';
    if (heading) heading.textContent = `Lesson Details: ${mod.title}`;

    drawer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  // Close the drawer and return to 2x2 grid
  closeModuleDrawer() {
    const drawer = document.getElementById('parent-module-lesson-drawer');
    const grid = document.getElementById('parent-modules-container');
    const heading = document.getElementById('parent-modules-grid-heading');

    if (drawer) drawer.style.display = 'none';
    if (grid) grid.style.display = 'grid';
    if (heading) heading.textContent = 'Your Nutrition Modules';
    this.renderModuleCards();
    this.updateProgressHeader();
  },

  // Toggle individual lesson accordion item open/closed
  toggleLessonAccordion(moduleId, index) {
    const item = document.getElementById(`accordion-item-${index}`);
    const body = document.getElementById(`accordion-body-${index}`);
    const arrow = document.getElementById(`toggle-arrow-${index}`);

    if (!item || !body) return;

    const isOpen = item.classList.contains('active');
    if (isOpen) {
      item.classList.remove('active');
      body.style.display = 'none';
      if (arrow) arrow.textContent = '▼';
    } else {
      item.classList.add('active');
      body.style.display = 'block';
      if (arrow) arrow.textContent = '▲';
    }
  },

  // Toggle a lesson completed or incomplete
  toggleLessonComplete(moduleId, index, event) {
    if (event) event.stopPropagation();

    const mod = this.nutritionModules.find(m => m.id === moduleId);
    if (!mod || !mod.lessons[index]) return;

    mod.lessons[index].completed = !mod.lessons[index].completed;
    this.saveProgressState();
    this.openModuleDrawer(moduleId);
    this.updateProgressHeader();
    NutriApp.showToast(mod.lessons[index].completed ? '🎉 Lesson marked as completed!' : 'Lesson status updated.', 'success');
  },

  // Render "Try It at Home" 10 actionable practices checklist
  renderHomeActionsChecklist() {
    const container = document.getElementById('home-actions-list-container');
    if (!container) return;

    // Load saved checked indexes
    let checkedSet = new Set([0]); // Default item 0 checked (1/10 = 10% Actions Tried)
    try {
      const saved = localStorage.getItem('nutrilearn_home_actions_checked');
      if (saved) {
        checkedSet = new Set(JSON.parse(saved));
      }
    } catch (e) {}

    container.innerHTML = this.homeActions.map((act, idx) => {
      const isChecked = checkedSet.has(idx);
      return `
        <div class="home-action-item ${isChecked ? 'checked' : ''}" onclick="ParentModule.toggleHomeAction(${idx})">
          <div class="home-action-checkbox">
            ${isChecked ? '✓' : ''}
          </div>
          <div class="home-action-text">
            <div class="home-action-title">${act.title}</div>
            <div class="home-action-tip">${act.tip}</div>
          </div>
        </div>
      `;
    }).join('');

    this.updateHomeActionsMetrics(checkedSet.size);
  },

  // Toggle home action item checkbox
  toggleHomeAction(index) {
    let checkedSet = new Set([0]);
    try {
      const saved = localStorage.getItem('nutrilearn_home_actions_checked');
      if (saved) checkedSet = new Set(JSON.parse(saved));
    } catch (e) {}

    if (checkedSet.has(index)) {
      checkedSet.delete(index);
    } else {
      checkedSet.add(index);
    }

    try {
      localStorage.setItem('nutrilearn_home_actions_checked', JSON.stringify([...checkedSet]));

      // Live sync to dietary adherence records
      const records = JSON.parse(localStorage.getItem('nutrilearn_diet_adherence_records_v3') || '[]');
      const target = records.find(r => r.parentName.includes('Maria') || r.childName.includes('Chloe')) || records[0];
      if (target) {
        const actionScore = Math.min(100, Math.round((checkedSet.size / this.homeActions.length) * 100));
        target.adherenceRate = Math.max(target.adherenceRate, actionScore);
        target.complianceStatus = target.adherenceRate >= 80 ? 'Compliant' : (target.adherenceRate >= 50 ? 'Moderate' : 'Non-Compliant');
        target.lastMealLogged = this.homeActions[index] ? this.homeActions[index].title : 'Nutrition action done';
        target.lastMealDate = 'Ngayong ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        localStorage.setItem('nutrilearn_diet_adherence_records_v3', JSON.stringify(records));
      }
    } catch (e) {}

    this.renderHomeActionsChecklist();
    NutriApp.showToast('✅ Home action progress updated!', 'success');
  },

  // Open modal for parent to log today's meal
  openDailyMealLogModal() {
    NutriApp.openModal('modal-parent-log-meal');
  },

  handleSaveDailyMealLog(form) {
    const checkedFoods = Array.from(document.querySelectorAll('input[name="mealFood"]:checked')).map(el => el.value);
    const checkedWASH = Array.from(document.querySelectorAll('input[name="mealWASH"]:checked')).map(el => el.value);
    const notes = (document.getElementById('parent-meal-notes')?.value || '').trim();

    const allChecked = [...checkedFoods, ...checkedWASH];
    const totalGoals = 8;
    const adherenceRate = Math.min(100, Math.round((allChecked.length / totalGoals) * 100));

    // Update family record in localStorage
    try {
      const records = JSON.parse(localStorage.getItem('nutrilearn_diet_adherence_records_v3') || '[]');
      const target = records.find(r => r.parentName.includes('Maria') || r.childName.includes('Chloe')) || records[0];
      if (target) {
        target.adherenceRate = Math.max(target.adherenceRate, adherenceRate);
        target.complianceStatus = target.adherenceRate >= 80 ? 'Compliant' : (target.adherenceRate >= 50 ? 'Moderate' : 'Non-Compliant');
        target.lastMealLogged = checkedFoods.slice(0, 3).join(', ') + (notes ? ` (${notes})` : '');
        target.lastMealDate = 'Ngayong ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        target.history = target.history || [];
        target.history.unshift({
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          meal: checkedFoods.slice(0, 3).join(' + ') + (notes ? ` (${notes})` : ''),
          foods: checkedFoods
        });
        localStorage.setItem('nutrilearn_diet_adherence_records_v3', JSON.stringify(records));
      }
    } catch (e) {
      console.warn('Error saving dietary record:', e);
    }

    NutriApp.closeModal('modal-parent-log-meal');
    NutriApp.showToast(`🎉 Nai-save ang pagkain ni Baby (${adherenceRate}% Adherence)! Na-update na ito sa talaan ng MHO.`, 'success');

    if (window.MHODashboard && typeof MHODashboard.renderDietaryCompliance === 'function') {
      MHODashboard.renderDietaryCompliance();
    }
  },

  updateHomeActionsMetrics(count) {
    const total = this.homeActions.length;
    const pct = Math.round((count / total) * 100);

    // 1. Hero banner circular counter
    const heroPct = document.getElementById('parent-hero-actions-pct');
    if (heroPct) heroPct.textContent = `${pct}%`;

    // 2. Metric card 1: Actions Tried
    const metricTried = document.getElementById('metric-actions-tried-val');
    if (metricTried) metricTried.textContent = count;

    // 3. Metric card 2: Actions Available
    const metricAvailable = document.getElementById('metric-actions-avail-val');
    if (metricAvailable) metricAvailable.textContent = total;
  },

  // Update top progress summary in Parent View
  updateProgressHeader() {
    let totalLessons = 0;
    let completedLessons = 0;

    this.nutritionModules.forEach(mod => {
      mod.lessons.forEach(l => {
        totalLessons++;
        if (l.completed) completedLessons++;
      });
    });

    const overallPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 43;

    // Metric card 3: Learning Progress
    const metricProgress = document.getElementById('metric-learning-progress-val');
    if (metricProgress) metricProgress.textContent = `${overallPct}%`;

    // Update parent name in top taskbar and greeting
    const currentUser = NutriStorage.getCurrentUser();
    const heroName = document.getElementById('parent-hero-greeting-name');
    const topName = document.getElementById('parent-top-user-name');
    const topAvatar = document.getElementById('parent-top-user-avatar');

    if (currentUser && currentUser.name) {
      if (heroName) heroName.textContent = currentUser.name.split(' ')[0] + ' 👋';
      if (topName) topName.textContent = currentUser.name;
      if (topAvatar) {
        const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        topAvatar.textContent = initials || 'MS';
      }
    }
    this.renderChildGrowth();
  },

  // Open Lesson Reader (Modal fallback)
  openLesson(moduleId) {
    this.openModuleDrawer(moduleId);
  },

  // Start Interactive Quiz
  startQuiz(moduleId) {
    const mod = this.nutritionModules.find(m => m.id === moduleId) || this.nutritionModules[0];
    const dataMod = NutriStorage.getModules().find(m => m.id === moduleId) || NutriStorage.getModules()[0];

    if (!dataMod || !dataMod.quiz || !dataMod.quiz.length) {
      NutriApp.showToast('Ready for knowledge check! All lessons verified.', 'success');
      return;
    }

    this.currentModuleId = moduleId;
    this.currentQuizQuestionIndex = 0;
    this.currentQuizAnswers = {};
    this.selectedQuizOption = null;

    NutriApp.closeModal('modal-lesson-viewer');
    NutriApp.openModal('modal-quiz');
    this.renderCurrentQuizQuestion();
  },

  // Render current quiz question
  renderCurrentQuizQuestion() {
    const mod = NutriStorage.getModules().find(m => m.id === this.currentModuleId) || NutriStorage.getModules()[0];
    const q = mod.quiz[this.currentQuizQuestionIndex];
    const totalQuestions = mod.quiz.length;

    const quizModTitle = document.getElementById('quiz-mod-title');
    const quizCounter = document.getElementById('quiz-q-counter');

    if (quizModTitle) quizModTitle.textContent = `${mod.number || 'Module'} Knowledge Check`;
    if (quizCounter) quizCounter.textContent = `Question ${this.currentQuizQuestionIndex + 1} of ${totalQuestions}`;

    const container = document.getElementById('quiz-content-area');
    if (!container) return;

    container.innerHTML = `
      <div class="quiz-question-box">
        <div class="quiz-question-text">${q.question}</div>
        <div class="quiz-options-list">
          ${q.options.map((opt, idx) => `
            <button class="quiz-option-btn" id="opt-btn-${idx}" onclick="ParentModule.selectQuizOption(${idx})">
              <span style="font-weight:700; width:22px; height:22px; border-radius:50%; background:#F1F5F9; display:inline-flex; align-items:center; justify-content:center; font-size:0.78rem;">
                ${String.fromCharCode(65 + idx)}
              </span>
              <span>${opt}</span>
            </button>
          `).join('')}
        </div>
        <div id="quiz-feedback-container" style="display:none;"></div>
      </div>
    `;

    const btnSubmit = document.getElementById('btn-quiz-submit');
    const btnNext = document.getElementById('btn-quiz-next');

    if (btnSubmit) {
      btnSubmit.style.display = 'inline-flex';
      btnSubmit.textContent = 'Verify Answer';
    }
    if (btnNext) btnNext.style.display = 'none';
  },

  selectQuizOption(index) {
    this.selectedQuizOption = index;
    const mod = NutriStorage.getModules().find(m => m.id === this.currentModuleId) || NutriStorage.getModules()[0];
    const q = mod.quiz[this.currentQuizQuestionIndex];

    for (let i = 0; i < q.options.length; i++) {
      const btn = document.getElementById(`opt-btn-${i}`);
      if (btn) btn.classList.toggle('selected', i === index);
    }
  },

  verifyCurrentAnswer() {
    if (this.selectedQuizOption === null) {
      NutriApp.showToast('Please select an option before continuing.', 'warning');
      return;
    }

    const mod = NutriStorage.getModules().find(m => m.id === this.currentModuleId) || NutriStorage.getModules()[0];
    const q = mod.quiz[this.currentQuizQuestionIndex];
    const isCorrect = this.selectedQuizOption === q.answerIndex;

    this.currentQuizAnswers[this.currentQuizQuestionIndex] = isCorrect;

    for (let i = 0; i < q.options.length; i++) {
      const btn = document.getElementById(`opt-btn-${i}`);
      if (btn) {
        btn.disabled = true;
        if (i === q.answerIndex) {
          btn.classList.add('correct');
        } else if (i === this.selectedQuizOption && !isCorrect) {
          btn.classList.add('incorrect');
        }
      }
    }

    const feedbackBox = document.getElementById('quiz-feedback-container');
    if (feedbackBox) {
      feedbackBox.style.display = 'block';
      feedbackBox.className = `quiz-feedback-box ${isCorrect ? 'correct' : 'incorrect'}`;
      feedbackBox.innerHTML = `
        <div style="font-weight:700; margin-bottom:0.25rem;">
          ${isCorrect ? '🎉 Correct! Well done!' : '💡 Learning Moment:'}
        </div>
        <div>${q.explanation}</div>
      `;
    }

    const btnSubmit = document.getElementById('btn-quiz-submit');
    const nextBtn = document.getElementById('btn-quiz-next');

    if (btnSubmit) btnSubmit.style.display = 'none';
    if (nextBtn) {
      nextBtn.style.display = 'inline-flex';
      if (this.currentQuizQuestionIndex === mod.quiz.length - 1) {
        nextBtn.textContent = 'Finish & See Results';
      } else {
        nextBtn.textContent = 'Next Question →';
      }
    }
  },

  nextQuestion() {
    const mod = NutriStorage.getModules().find(m => m.id === this.currentModuleId) || NutriStorage.getModules()[0];
    if (this.currentQuizQuestionIndex < mod.quiz.length - 1) {
      this.currentQuizQuestionIndex++;
      this.selectedQuizOption = null;
      this.renderCurrentQuizQuestion();
    } else {
      this.finishQuiz();
    }
  },

  finishQuiz() {
    const mod = NutriStorage.getModules().find(m => m.id === this.currentModuleId) || NutriStorage.getModules()[0];
    const totalQ = mod.quiz.length;
    let correctCount = 0;
    for (let i = 0; i < totalQ; i++) {
      if (this.currentQuizAnswers[i] === true) correctCount++;
    }

    const finalPct = Math.round((correctCount / totalQ) * 100);

    const progress = NutriStorage.getParentProgress();
    if (!progress.completedModules.includes(this.currentModuleId)) {
      progress.completedModules.push(this.currentModuleId);
    }
    progress.quizScores[this.currentModuleId] = finalPct;
    NutriStorage.saveParentProgress(progress);

    NutriApp.closeModal('modal-quiz');

    // Mark current module lessons as completed in nutritionModules
    const activeMod = this.nutritionModules.find(m => m.id === this.currentModuleId);
    if (activeMod) {
      activeMod.lessons.forEach(l => l.completed = true);
      this.saveProgressState();
    }

    this.showCertificate(mod, finalPct, correctCount, totalQ);
    this.renderModuleCards();
    this.updateProgressHeader();
  },

  showCertificate(mod, scorePct, correctCount, total) {
    const certModName = document.getElementById('cert-module-name');
    const certScore = document.getElementById('cert-score');
    const certDate = document.getElementById('cert-date');

    if (certModName) certModName.textContent = `${mod.number || 'Module'}: ${mod.title}`;
    if (certScore) certScore.textContent = `${scorePct}% (${correctCount}/${total} Correct)`;
    if (certDate) {
      certDate.textContent = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
    NutriApp.openModal('modal-certificate');
  },

  renderRecipes() {
    const container = document.getElementById('recipes-container');
    if (!container || !window.NUTRI_DATA || !NUTRI_DATA.recipes) return;

    container.innerHTML = NUTRI_DATA.recipes.map(rec => `
      <div class="recipe-card">
        <div class="recipe-header">
          <span style="font-weight: 700; color: var(--color-primary-900);">${rec.title}</span>
          <span class="recipe-cost">${rec.costPerServing}</span>
        </div>
        <div class="recipe-body">
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">
            👶 Recommended for: <strong>${rec.targetAge}</strong> • ⏱️ Prep: ${rec.prepTime}
          </div>
          
          <div style="font-size: 0.82rem; font-weight: 600; color: var(--color-primary-800); margin-top: 0.5rem;">
            Pinggang Pinoy Food Group Balance:
          </div>
          <div class="ingredient-tags">
            <span class="food-tag" style="background:#FEF3C7; color:#92400E;">🟡 GO: ${rec.foodGroups.go}</span>
            <span class="food-tag" style="background:#FEE2E2; color:#991B1B;">🔴 GROW: ${rec.foodGroups.grow}</span>
            <span class="food-tag local">🟢 GLOW: ${rec.foodGroups.glow}</span>
          </div>

          <div style="margin-top: 0.75rem; font-size: 0.84rem; line-height: 1.5;">
            <strong>Affordable Local Ingredients:</strong>
            <ul style="margin-left: 1.25rem; color: var(--text-secondary); margin-top: 0.25rem;">
              ${rec.ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
          </div>

          <div style="margin-top: 0.75rem; padding: 0.5rem 0.75rem; background: #F0FDF4; border-radius: 6px; font-size: 0.8rem; color: #166534;">
            ✨ <strong>Key Nutrients:</strong> ${rec.keyNutrients}
          </div>
        </div>
      </div>
    `).join('');
  },

  initCustomMealBuilder() {
    const goSelect = document.getElementById('meal-builder-go');
    const growSelect = document.getElementById('meal-builder-grow');
    const glowSelect = document.getElementById('meal-builder-glow');

    const updateMealCalculation = () => {
      if (!goSelect || !growSelect || !glowSelect) return;

      const goCost = parseInt(goSelect.selectedOptions[0]?.dataset.cost || 10, 10);
      const growCost = parseInt(growSelect.selectedOptions[0]?.dataset.cost || 15, 10);
      const glowCost = parseInt(glowSelect.selectedOptions[0]?.dataset.cost || 5, 10);

      const totalCost = goCost + growCost + glowCost;
      const displayElem = document.getElementById('meal-calc-total');
      if (displayElem) {
        displayElem.textContent = `₱${totalCost} per serving`;
      }
    };

    [goSelect, growSelect, glowSelect].forEach(el => {
      if (el) el.addEventListener('change', updateMealCalculation);
    });

    updateMealCalculation();
  },

  // ========================================================================
  // CHILD GROWTH TRACKER & LIVE DATA SYNCHRONIZATION
  // ========================================================================
  selectedChildId: null,

  // Get matching children strictly belonging to the logged-in parent
  getChildrenForParent(user) {
    const allChildren = (typeof NutriStorage !== 'undefined' ? NutriStorage.getChildren() : []) || [];
    if (!allChildren.length) return [];
    if (!user) return [];

    const userId = (user.id || '').trim();
    const userName = (user.name || '').trim().toLowerCase();
    const userEmail = (user.email || '').trim().toLowerCase();
    const userPhone = (user.phone || '').trim().toLowerCase();
    const userChildName = (user.childName || '').trim().toLowerCase();
    const userChildId = (user.childId || '').trim();

    // STRICT ISOLATION: A parent only sees their own child/children
    let matches = allChildren.filter(c => {
      // 1. Direct parent account ID match
      if (userId && c.parentId && String(c.parentId) === String(userId)) return true;

      // 2. Direct child ID match linked to parent account
      if (userChildId && String(c.id) === String(userChildId)) return true;

      // 3. Direct parent email / phone match
      const pPhone = (c.parentPhone || '').trim().toLowerCase();
      const pEmail = (c.parentEmail || '').trim().toLowerCase();
      if (userEmail && (pEmail === userEmail || pPhone === userEmail)) return true;
      if (userPhone && (pPhone === userPhone || pEmail === userPhone)) return true;

      // 4. Exact parent name match
      const pName = (c.parentName || '').trim().toLowerCase();
      if (userName && pName && (pName === userName || pName.includes(userName) || userName.includes(pName))) {
        if (userChildName) {
          const cName = (c.name || '').trim().toLowerCase();
          return cName === userChildName || cName.includes(userChildName) || userChildName.includes(cName);
        }
        return true;
      }

      // 5. Direct child name match if specified on user registration
      if (userChildName) {
        const cName = (c.name || '').trim().toLowerCase();
        if (cName === userChildName || cName.includes(userChildName) || userChildName.includes(cName)) {
          return true;
        }
      }

      return false;
    });

    // Parents only see their own children. Do NOT fall back to other children or barangay list.
    return matches;
  },

  getActiveChild() {
    const user = (typeof NutriStorage !== 'undefined' ? NutriStorage.getCurrentUser() : null);
    const parentChildren = this.getChildrenForParent(user);
    if (!parentChildren.length) return null;

    const savedId = localStorage.getItem('nutrilearn_selected_child_id');
    if (savedId) {
      const found = parentChildren.find(c => String(c.id) === String(savedId));
      if (found) return found;
    }
    return parentChildren[0];
  },

  selectChild(childId) {
    this.selectedChildId = childId;
    localStorage.setItem('nutrilearn_selected_child_id', childId);
    this.renderChildGrowth();
    NutriApp.showToast('Aktibong bata na-update sa dashboard.', 'info');
  },

  renderChildGrowth() {
    const user = (typeof NutriStorage !== 'undefined' ? NutriStorage.getCurrentUser() : null);
    const parentChildren = this.getChildrenForParent(user);
    const child = this.getActiveChild();

    // 1. Update Hero Greeting & Subtitle
    const heroName = document.getElementById('parent-hero-greeting-name');
    const heroTag = document.getElementById('parent-hero-child-tag');
    const actionSub = document.getElementById('parent-action-child-sub');

    if (user && user.name && heroName) {
      heroName.textContent = user.name.split(' ')[0] + ' 👋';
    }

    if (child) {
      let badgeClass = 'badge-normal';
      let statusLabel = child.status || 'Normal';
      if (child.improved) {
        badgeClass = 'badge-completed';
        statusLabel = 'Improved (Normal)';
      } else if (child.status === 'Stunted') {
        badgeClass = 'badge-stunted';
      } else if (child.status === 'Wasted') {
        badgeClass = 'badge-wasted';
      } else if (child.status === 'Underweight') {
        badgeClass = 'badge-underweight';
      }

      if (heroTag) {
        heroTag.innerHTML = `<span>${child.name} · ${child.ageMonths} mos</span> <span class="badge ${badgeClass}" style="margin-left:6px; font-size:0.75rem; padding:2px 8px;">${statusLabel}</span>`;
      }
      if (actionSub) {
        actionSub.textContent = `Subaybayan ang paglaki ni ${child.name}`;
      }
    } else if (heroTag) {
      heroTag.textContent = 'Walang nakatala na bata · Magrehistro sa BHW';
    }

    // 2. Render Growth Tracker Tab Pane (#parent-growth-tracker-container)
    const container = document.getElementById('parent-growth-tracker-container');
    if (!container) return;

    if (!child) {
      container.innerHTML = `
        <div class="card" style="padding: 2.5rem; text-align: center; border: 1.5px dashed #CBD5E1; border-radius: 16px;">
          <div style="font-size: 3rem; margin-bottom: 0.75rem;">👶</div>
          <h3 style="color: #0E3D26; margin-bottom: 0.5rem;">Wala Pang Nakatalang Bata</h3>
          <p style="color: #64748B; max-width: 480px; margin: 0 auto 1.5rem auto; font-size: 0.9rem;">
            Hindi pa nakakonekta ang rekord ng iyong anak. I-update o magrehistro upang masubaybayan ang Height, Weight, at MUAC growth.
          </p>
          <button class="btn btn-accent" onclick="ParentModule.openParentLogGrowthModal(true)">
            ➕ Magrehistro ng Rekord ng Bata
          </button>
        </div>
      `;
      return;
    }

    // Calculate WHO cutoff references for this child's age
    const age = parseInt(child.ageMonths, 10) || 12;
    const sex = child.sex || 'Male';
    const ageBrackets = [6, 9, 12, 15, 18, 21, 24];
    let closestAge = 12;
    let minDiff = 999;
    for (const b of ageBrackets) {
      const diff = Math.abs(age - b);
      if (diff < minDiff) {
        minDiff = diff;
        closestAge = b;
      }
    }

    const hfaTarget = (typeof WHO_STANDARDS !== 'undefined' && WHO_STANDARDS.heightForAge && WHO_STANDARDS.heightForAge[closestAge])
      ? (sex === 'Female' ? WHO_STANDARDS.heightForAge[closestAge].femaleCutoff : WHO_STANDARDS.heightForAge[closestAge].maleCutoff)
      : 76.9;

    const wfaTarget = (typeof WHO_STANDARDS !== 'undefined' && WHO_STANDARDS.weightForAge && WHO_STANDARDS.weightForAge[closestAge])
      ? (sex === 'Female' ? WHO_STANDARDS.weightForAge[closestAge].femaleCutoff : WHO_STANDARDS.weightForAge[closestAge].maleCutoff)
      : 8.8;

    // MUAC band info
    let muacDotColor = '#10B981';
    let muacBandText = 'Green Band (Normal)';
    if (child.muacMm < 115) {
      muacDotColor = '#EF4444';
      muacBandText = 'Red Band (SAM - Severe Acute)';
    } else if (child.muacMm < 125) {
      muacDotColor = '#F59E0B';
      muacBandText = 'Yellow Band (MAM - Moderate Acute)';
    }

    // Badge for primary status
    let badgeClass = 'badge-normal';
    let statusLabel = child.status || 'Normal';
    let guidanceColor = '#10B981';
    let guidanceTitle = 'Appropriate Growth & Weight Trajectory';
    let guidanceDesc = 'Patuloy na magbigay ng masusustansyang pagkain ayon sa Pinggang Pinoy (Go, Grow, Glow). Ipagpatuloy ang regular na pagpapainom ng malinis na tubig at paghuhugas ng kamay.';

    if (child.improved) {
      badgeClass = 'badge-completed';
      statusLabel = 'Improved & Recovered';
      guidanceColor = '#10B981';
      guidanceTitle = 'Matagumpay na Pag-unlad!';
      guidanceDesc = 'Naabot na ng bata ang malusog na timbang at taas. Ipagpatuloy ang balanseng pagkain upang mapanatili ang tamang nutrisyon.';
    } else if (child.status === 'Stunted') {
      badgeClass = 'badge-stunted';
      statusLabel = 'Stunted (Maliit para sa edad)';
      guidanceColor = '#EF4444';
      guidanceTitle = 'Target: 10% Stunting Reduction Trajectory';
      guidanceDesc = 'Pataasin ang sustansya ng bawat pagkain: Maghalo ng Malunggay, Monggo, at Itlog sa Lugaw araw-araw. Magdagdag ng kaunting mantika o gata para sa brain development.';
    } else if (child.status === 'Wasted') {
      badgeClass = 'badge-wasted';
      statusLabel = 'Wasted (Payat para sa tangkad)';
      guidanceColor = '#C2410C';
      guidanceTitle = 'Kailangan ng Mas Madalas na Pagpapakain';
      guidanceDesc = 'Dagdagan ang dalas ng pagkain (4-5 beses kada araw). Magbigay ng masustansyang meryenda tulad ng nilagang itlog o mashed camote na may gatas.';
    } else if (child.status === 'Underweight') {
      badgeClass = 'badge-underweight';
      statusLabel = 'Underweight (Mababang Timbang)';
      guidanceColor = '#F59E0B';
      guidanceTitle = 'I-boost ang Timbang ng Bata';
      guidanceDesc = 'Bigyan ng pagkaing mayaman sa protina at enerhiya: isda, manok, itlog, at monggo. Siguraduhing malinis ang inuming tubig upang maiwasan ang impeksyon.';
    }

    // Multi-children switcher pills if parent has >1 child
    let childSelectorHtml = '';
    if (parentChildren.length > 1) {
      childSelectorHtml = `
        <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.25rem; padding:0.6rem 0.85rem; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px;">
          <span style="font-size:0.8rem; font-weight:700; color:#475569;">Pumili ng Bata:</span>
          ${parentChildren.map(c => `
            <button type="button" 
              class="btn btn-sm ${String(c.id) === String(child.id) ? 'btn-primary' : 'btn-outline'}" 
              onclick="ParentModule.selectChild('${c.id}')"
              style="font-size:0.8rem; padding:4px 12px; border-radius:9999px;">
              ${c.sex === 'Female' ? '👧' : '👦'} ${c.name} (${c.ageMonths} mos)
            </button>
          `).join('')}
          <button type="button" class="btn btn-outline btn-sm" onclick="ParentModule.openParentLogGrowthModal(true)" style="font-size:0.78rem; padding:4px 10px; margin-left:auto;">
            ➕ Dagdag Rekord
          </button>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="card" style="border: 1px solid #EAE6DF; border-radius: 18px; overflow: hidden;">
        <div class="card-header" style="border-bottom: 1px solid #EAE6DF; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 class="card-title" style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.45rem; color: #1A382A; margin: 0 0 0.25rem 0;">
              Child Growth &amp; Feeding Log
            </h2>
            <p class="card-subtitle" style="font-size: 0.86rem; color: #64748B; margin: 0;">
              Live-synced measurements from Community Health Workers (BHW) and parent feeding updates.
            </p>
          </div>
          <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
            <button class="btn btn-accent btn-sm" onclick="ParentModule.openParentLogGrowthModal(false)" style="font-weight: 700; display: inline-flex; align-items: center; gap: 5px;">
              ✏️ I-update ang Sukat
            </button>
            <button class="btn btn-outline btn-sm" onclick="ParentModule.openParentLogGrowthModal(true)" style="font-weight: 600; display: inline-flex; align-items: center; gap: 5px;">
              ➕ Magdagdag ng Anak
            </button>
          </div>
        </div>

        <div style="padding: 1.5rem;">
          ${childSelectorHtml}

          <!-- Child Profile Banner -->
          <div style="background: #F0FDF4; border: 1.5px solid #BBF7D0; border-radius: 14px; padding: 1.35rem; margin-bottom: 1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
              <div style="display: flex; gap: 0.85rem; align-items: center;">
                <div style="width: 48px; height: 48px; border-radius: 12px; background: #DCFCE7; color: #166534; display: flex; align-items: center; justify-content: center; font-size: 1.6rem;">
                  ${child.sex === 'Female' ? '👧' : '👦'}
                </div>
                <div>
                  <span style="font-size:0.75rem; color:#15803D; font-weight:700; text-transform:uppercase; letter-spacing:0.04em;">
                    Kasalukuyang Nakatala:
                  </span>
                  <h3 style="font-size:1.35rem; color:#0E3D26; margin:0.15rem 0; font-weight: 800;">
                    ${child.name} (${child.ageMonths} buwan · ${child.sex})
                  </h3>
                  <p style="font-size:0.83rem; color:#475569; margin: 0;">
                    📍 ${child.barangay || 'Barangay Manguiring'} • Magulang: <strong>${child.parentName || 'Maria Santos'}</strong>
                    ${child.lastAssessed ? ` • Huling Sinuri: <strong>${child.lastAssessed}</strong>` : ''}
                  </p>
                </div>
              </div>
              <div>
                <span class="badge ${badgeClass}" style="font-size:0.88rem; padding:0.4rem 0.95rem; font-weight: 700;">
                  ${statusLabel}
                </span>
              </div>
            </div>

            <!-- Anthropometric 3-Cards Grid -->
            <div class="grid-3" style="margin-top: 1.25rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 1rem;">
              <!-- 1. Height-for-Age -->
              <div style="background:#FFFFFF; padding:1.1rem; border-radius:12px; border:1px solid #E2E8F0; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
                <div style="font-size:0.74rem; color:#64748B; font-weight:700; text-transform: uppercase;">HEIGHT-FOR-AGE (Taas):</div>
                <div style="font-size:1.55rem; font-weight:800; color:${child.hfaStatus === 'Stunted' ? '#EF4444' : '#15803D'}; margin:0.3rem 0;">
                  ${child.heightCm} cm
                </div>
                <div style="font-size:0.76rem; color:#64748B;">
                  WHO Target: <strong>&gt; ${hfaTarget} cm</strong> (${child.hfaStatus || 'Normal'})
                </div>
              </div>

              <!-- 2. Weight-for-Age -->
              <div style="background:#FFFFFF; padding:1.1rem; border-radius:12px; border:1px solid #E2E8F0; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
                <div style="font-size:0.74rem; color:#64748B; font-weight:700; text-transform: uppercase;">WEIGHT-FOR-AGE (Timbang):</div>
                <div style="font-size:1.55rem; font-weight:800; color:${child.wfaStatus === 'Underweight' ? '#F59E0B' : '#15803D'}; margin:0.3rem 0;">
                  ${child.weightKg} kg
                </div>
                <div style="font-size:0.76rem; color:#64748B;">
                  WHO Target: <strong>&gt; ${wfaTarget} kg</strong> (${child.wfaStatus || 'Normal'})
                </div>
              </div>

              <!-- 3. MUAC Circumference -->
              <div style="background:#FFFFFF; padding:1.1rem; border-radius:12px; border:1px solid #E2E8F0; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
                <div style="font-size:0.74rem; color:#64748B; font-weight:700; text-transform: uppercase;">MUAC CIRCUMFERENCE:</div>
                <div style="font-size:1.55rem; font-weight:800; color:#1F2937; margin:0.3rem 0; display:flex; align-items:center; gap:8px;">
                  <span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:${muacDotColor}; box-shadow: 0 0 6px ${muacDotColor};"></span>
                  ${child.muacMm} mm
                </div>
                <div style="font-size:0.76rem; color:#64748B;">
                  ${muacBandText} • Normal starts at 125 mm
                </div>
              </div>
            </div>
          </div>

          <!-- Nutritional Action Plan Guidance -->
          <div style="background: #FFFFFF; border-left: 4px solid ${guidanceColor}; border-radius: 8px; padding: 1.15rem 1.35rem; margin-bottom: 1.25rem; box-shadow: 0 1px 4px rgba(0,0,0,0.04); border-top: 1px solid #E2E8F0; border-right: 1px solid #E2E8F0; border-bottom: 1px solid #E2E8F0;">
            <div style="font-size: 0.95rem; font-weight: 700; color: #0E3D26; margin-bottom: 0.35rem;">
              💡 Gabay sa Pagpapakain: ${guidanceTitle}
            </div>
            <div style="font-size: 0.86rem; color: #334155; line-height: 1.6;">
              ${guidanceDesc}
            </div>
            ${child.notes ? `
              <div style="margin-top: 0.75rem; padding-top: 0.65rem; border-top: 1px dashed #E2E8F0; font-size: 0.82rem; color: #64748B;">
                <strong>Tala mula sa BHW / Community Worker:</strong> ${child.notes}
              </div>
            ` : ''}
          </div>

          <!-- Quick Navigation Buttons -->
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button class="btn btn-outline btn-sm" onclick="ParentModule.switchTab('meal-planner')">
              🥗 Pinggang Pinoy Meal Planner →
            </button>
            <button class="btn btn-outline btn-sm" onclick="ParentModule.switchTab('try-at-home')">
              🌱 Try It at Home Checklist →
            </button>
            <button class="btn btn-outline btn-sm" onclick="ParentModule.switchTab('learning')">
              📖 Mga Aralin sa Nutrisyon →
            </button>
          </div>
        </div>
      </div>
    `;
  },

  openParentLogGrowthModal(isNew = false) {
    const child = this.getActiveChild();
    const user = (typeof NutriStorage !== 'undefined' ? NutriStorage.getCurrentUser() : null);

    const modalTitle = document.getElementById('parent-log-growth-title');
    const childIdInput = document.getElementById('parent-growth-child-id');
    const childNameInput = document.getElementById('parent-growth-child-name');
    const childAgeInput = document.getElementById('parent-growth-child-age');
    const childHeightInput = document.getElementById('parent-growth-child-height');
    const childWeightInput = document.getElementById('parent-growth-child-weight');
    const childMuacInput = document.getElementById('parent-growth-child-muac');
    const childNotesInput = document.getElementById('parent-growth-child-notes');

    if (isNew || !child) {
      if (modalTitle) modalTitle.textContent = 'Magrehistro ng Bagong Bata / Register Child';
      if (childIdInput) childIdInput.value = '';
      if (childNameInput) {
        childNameInput.value = (user && user.childName) ? user.childName : '';
        childNameInput.disabled = false;
      }
      if (childAgeInput) childAgeInput.value = (user && user.childAge) ? user.childAge : 18;
      if (childHeightInput) childHeightInput.value = (user && user.childHeight) ? user.childHeight : 75.0;
      if (childWeightInput) childWeightInput.value = (user && user.childWeight) ? user.childWeight : 9.0;
      if (childMuacInput) childMuacInput.value = 125;
      if (childNotesInput) childNotesInput.value = '';
    } else {
      if (modalTitle) modalTitle.textContent = `I-update ang Sukat ni ${child.name}`;
      if (childIdInput) childIdInput.value = child.id;
      if (childNameInput) {
        childNameInput.value = child.name;
        childNameInput.disabled = false;
      }
      if (childAgeInput) childAgeInput.value = child.ageMonths || 18;
      if (childHeightInput) childHeightInput.value = child.heightCm || 75.0;
      if (childWeightInput) childWeightInput.value = child.weightKg || 9.0;
      if (childMuacInput) childMuacInput.value = child.muacMm || 125;
      if (childNotesInput) childNotesInput.value = child.notes || '';
    }

    NutriApp.openModal('modal-parent-log-growth');
  },

  handleSaveParentGrowth(event) {
    if (event) event.preventDefault();
    const id = (document.getElementById('parent-growth-child-id')?.value || '').trim();
    const name = (document.getElementById('parent-growth-child-name')?.value || '').trim();
    const age = parseInt(document.getElementById('parent-growth-child-age')?.value, 10);
    const height = parseFloat(document.getElementById('parent-growth-child-height')?.value);
    const weight = parseFloat(document.getElementById('parent-growth-child-weight')?.value);
    const muac = parseInt(document.getElementById('parent-growth-child-muac')?.value, 10) || 125;
    const notes = (document.getElementById('parent-growth-child-notes')?.value || '').trim();

    if (!name || isNaN(age) || isNaN(height) || isNaN(weight)) {
      NutriApp.showToast('Pakilagay ang kumpletong impormasyon ng bata (Pangalan, Edad, Taas, at Timbang).', 'warning');
      return;
    }

    const user = (typeof NutriStorage !== 'undefined' ? NutriStorage.getCurrentUser() : null);
    const parentName = (user && user.name) ? user.name : 'Maria Santos';
    const barangay = (user && user.barangay) ? user.barangay : 'Barangay Manguiring';

    // Calculate WHO classification
    let classification = { overallStatus: 'Normal', hfaStatus: 'Normal', wfaStatus: 'Normal', wfhStatus: 'Normal', muacStatus: 'Normal' };
    if (window.CHWModule && typeof CHWModule.calculateNutritionalStatus === 'function') {
      classification = CHWModule.calculateNutritionalStatus(age, 'Male', height, weight, muac);
    } else {
      if (height < 74.0 && age >= 12) classification.overallStatus = 'Stunted';
      else if (weight < 8.2 && age >= 12) classification.overallStatus = 'Underweight';
    }

    if (id) {
      // Update existing child
      const children = NutriStorage.getChildren();
      const existing = children.find(c => String(c.id) === String(id));
      if (existing) {
        existing.name = name;
        existing.ageMonths = age;
        existing.heightCm = height;
        existing.weightKg = weight;
        existing.muacMm = muac;
        existing.status = classification.overallStatus;
        existing.hfaStatus = classification.hfaStatus;
        existing.wfaStatus = classification.wfaStatus;
        existing.wfhStatus = classification.wfhStatus;
        existing.muacStatus = classification.muacStatus;
        existing.notes = notes;
        existing.lastAssessed = new Date().toISOString().split('T')[0];
        NutriStorage.updateChild(existing);
      }
    } else {
      // Create new child linked directly to this parent
      const newChild = {
        id: 'ch-' + Date.now(),
        name: name,
        ageMonths: age,
        sex: 'Male',
        parentName: parentName,
        parentPhone: (user && user.email) ? user.email : '',
        parentEmail: (user && user.email) ? user.email : '',
        parentId: (user && user.id) ? user.id : '',
        barangay: barangay,
        heightCm: height,
        weightKg: weight,
        muacMm: muac,
        status: classification.overallStatus,
        hfaStatus: classification.hfaStatus,
        wfaStatus: classification.wfaStatus,
        wfhStatus: classification.wfhStatus,
        muacStatus: classification.muacStatus,
        improved: false,
        lastAssessed: new Date().toISOString().split('T')[0],
        assignedModules: ['mod-1', 'mod-2', 'mod-3'],
        completedModules: [],
        quizScore: 0,
        notes: notes || `Nakatala ng magulang na si ${parentName}.`
      };
      NutriStorage.addChild(newChild);
      localStorage.setItem('nutrilearn_selected_child_id', newChild.id);
    }

    NutriApp.closeModal('modal-parent-log-growth');
    NutriApp.showToast(`🎉 Na-save ang sukat ni ${name} (${classification.overallStatus})! Naka-sync na sa BHW at MHO.`, 'success');

    // Update parent view
    this.renderChildGrowth();

    // Live update BHW and Admin
    if (window.CHWModule) {
      if (typeof CHWModule.renderRegistryTable === 'function') CHWModule.renderRegistryTable();
      if (typeof CHWModule.updateStatsBar === 'function') CHWModule.updateStatsBar();
    }
    if (window.MHODashboard) {
      if (typeof MHODashboard.renderAdminRecords === 'function') MHODashboard.renderAdminRecords();
      if (typeof MHODashboard.renderKPIs === 'function') MHODashboard.renderKPIs();
    }
  }
};
