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

  // 10 Practical Feeding Activities for "Try It at Home" (Matches Reference Mockup)
  homeActions: [
    {
      id: 1,
      context: 'After "Iron-Rich Foods Are a Priority"',
      title: "Serve malunggay with tonight's dinner.",
      tip: "Add washed leaves to lugaw, soup, monggo, or scrambled egg."
    },
    {
      id: 2,
      context: 'After "What to Feed First"',
      title: "Prepare one thick, nutrient-rich porridge.",
      tip: "The food should stay on the spoon instead of running off like water."
    },
    {
      id: 3,
      context: 'After "Safe Water and Hygiene"',
      title: "Wash your hands and your child's hands before the next meal.",
      tip: "Use soap and clean running water for at least 20 seconds."
    },
    {
      id: 4,
      context: 'After "Recognizing Hunger and Fullness Cues"',
      title: "Let your child decide when they are full at one meal.",
      tip: "Watch for turning away or closing the mouth, and avoid forcing another bite."
    },
    {
      id: 5,
      context: 'After "Planning on a Budget"',
      title: "Add one affordable local protein to tomorrow's meal plan.",
      tip: "Choose egg, monggo, dilis, sardines, or another option available nearby."
    },
    {
      id: 6,
      context: 'After "Kamote as a Nutritious Base"',
      title: "Add one orange or dark green vegetable to a meal.",
      tip: "Try squash, kamote, malunggay, kangkong, or another affordable local vegetable."
    },
    {
      id: 7,
      context: 'After "Safe Water and Hygiene"',
      title: "Offer a drink using a clean cup instead of a feeding bottle.",
      tip: "Cups are easier to clean well and can lower the risk of infection."
    },
    {
      id: 8,
      context: 'After "Creating a Positive Meal Environment"',
      title: "Share one calm meal together without phones or television.",
      tip: "Sit with your child, talk gently, and give them time to eat without pressure."
    },
    {
      id: 9,
      context: 'After "Supporting Healthy Habits Long-Term"',
      title: "Offer one nutritious food your child is still learning to enjoy.",
      tip: "A child may need to see a food many times. Offer it gently without forcing a bite."
    },
    {
      id: 10,
      context: 'After "Iron-Rich Foods Are a Priority"',
      title: "Pair an iron-rich food with a source of Vitamin C.",
      tip: "Serve monggo, egg, fish, or malunggay with tomato, papaya, mango, or calamansi."
    }
  ],

  init() {
    this.loadProgressState();
    this.renderModuleCards();
    this.renderHomeActionsChecklist();
    this.renderRecipes();
    this.updateProgressHeader();
    this.initCustomMealBuilder();
    this.renderChildGrowth();
    this.renderActionSubmissionsHistory();
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

      // 2. Load lesson completion progress & Try It at Home practical action timestamps
      const savedProgress = localStorage.getItem('nutrilearn_parent_modules_v3');
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        this.nutritionModules.forEach(mod => {
          if (parsed[mod.id]) {
            mod.lessons.forEach((l, idx) => {
              if (parsed[mod.id].completedLessons && parsed[mod.id].completedLessons.includes(idx)) {
                l.completed = true;
              }
              if (parsed[mod.id].completedActions && parsed[mod.id].completedActions[idx]) {
                l.actionCompleted = true;
                l.actionCompletedAt = parsed[mod.id].completedActions[idx];
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
        const actionMap = {};
        mod.lessons.forEach((l, i) => {
          if (l.actionCompleted) {
            actionMap[i] = l.actionCompletedAt || new Date().toLocaleDateString();
          }
        });
        state[mod.id] = {
          completedLessons: mod.lessons.map((l, i) => l.completed ? i : -1).filter(i => i >= 0),
          completedActions: actionMap
        };
      });
      localStorage.setItem('nutrilearn_parent_modules_v3', JSON.stringify(state));
    } catch (e) {
      console.warn('Error saving parent progress:', e);
    }
  },

  // Switch Sub-Tabs in Parent Portal: 'learning', 'meal-planner', 'try-at-home', 'growth-tracker'
  switchTab(tabId) {
    if (!tabId || tabId === 'dashboard') tabId = 'learning';

    try {
      sessionStorage.setItem('nutrilearn_active_tab', tabId);
      localStorage.setItem('nutrilearn_active_tab', tabId);
      history.replaceState(null, '', '#' + tabId);
    } catch (e) {}

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
      try {
        sessionStorage.removeItem('nutrilearn_active_module');
        localStorage.removeItem('nutrilearn_active_module');
      } catch (e) {}
    } else if (tabId === 'try-at-home') {
      if (tryAtHomePane) tryAtHomePane.style.display = 'block';
      try {
        sessionStorage.removeItem('nutrilearn_active_module');
        localStorage.removeItem('nutrilearn_active_module');
      } catch (e) {}
    } else if (tabId === 'growth-tracker') {
      if (growthPane) growthPane.style.display = 'block';
      try {
        sessionStorage.removeItem('nutrilearn_active_module');
        localStorage.removeItem('nutrilearn_active_module');
      } catch (e) {}
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
    try {
      sessionStorage.setItem('nutrilearn_active_module', moduleId);
      localStorage.setItem('nutrilearn_active_module', moduleId);
    } catch (e) {}
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
          const practicalTip = lesson.tryHomeAction || this.getLessonPracticalAction(mod.id, lesson.title);

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

                <!-- Thesis Chapter 2.1 & UC-02: Try It at Home Practical Action Item with Tap Done Button -->
                <div class="try-home-lesson-box" style="margin: 0.85rem 0; padding: 0.95rem; background: #F0FDF4; border: 1.5px solid #86EFAC; border-radius: 10px;">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.45rem; flex-wrap: wrap; gap: 0.5rem;">
                    <div style="display: flex; align-items: center; gap: 0.45rem;">
                      <span style="font-size: 1.15rem;">🌱</span>
                      <strong style="color: #14532D; font-size: 0.86rem;">Try It at Home: Praktikal na Pagpapakain (Nabugoomu 2015)</strong>
                    </div>
                    <span class="badge ${lesson.actionCompleted ? 'badge-normal' : 'badge-underweight'}" style="font-size: 0.72rem; padding: 3px 8px;">
                      ${lesson.actionCompleted ? '🟢 Tapos na (Action Completed)' : '🟡 In Progress (Awaiting Home Action)'}
                    </span>
                  </div>
                  <div style="font-size: 0.83rem; color: #166534; line-height: 1.5; margin-bottom: 0.65rem;">
                    💡 <strong>Gawin sa Bahay:</strong> ${practicalTip}
                  </div>
                  <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                    ${lesson.actionCompleted ? `
                      <button type="button" class="btn btn-sm btn-outline" style="background: #FFFFFF; color: #15803D; border-color: #86EFAC; font-size: 0.76rem; padding: 4px 10px;" onclick="ParentModule.toggleLessonActionDone('${mod.id}', ${idx}, event)">
                        ✓ Nagawa Na (${lesson.actionCompletedAt || 'Nai-log'}) - I-undo
                      </button>
                    ` : `
                      <button type="button" class="btn btn-sm btn-accent" style="font-size: 0.78rem; font-weight: 700; padding: 5px 12px; background: #16A34A; border-color: #16A34A; color: #FFFFFF;" onclick="ParentModule.tapActionDone('${mod.id}', ${idx}, event)">
                        ✓ Nagawa Ko Na (Tap Done)
                      </button>
                    `}
                    <button type="button" class="btn btn-sm btn-outline" style="font-size: 0.75rem; background: #FFFFFF; padding: 4px 10px;" onclick="ParentModule.switchTab('meal-planner')">
                      🍲 Tingnan ang Step-by-Step Gabay sa Pagkain →
                    </button>
                  </div>
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
    try {
      sessionStorage.removeItem('nutrilearn_active_module');
      localStorage.removeItem('nutrilearn_active_module');
    } catch (e) {}
    const drawer = document.getElementById('parent-module-lesson-drawer');
    const grid = document.getElementById('parent-modules-container');
    const heading = document.getElementById('parent-modules-grid-heading');

    if (drawer) drawer.style.display = 'none';
    if (grid) grid.style.display = 'grid';
    if (heading) heading.textContent = 'Your Nutrition Modules';
    this.renderModuleCards();
    this.updateProgressHeader();
  },

  // Get specific practical feeding action for each lesson
  getLessonPracticalAction(modId, lessonTitle) {
    const title = (lessonTitle || '').toLowerCase();
    if (title.includes('malunggay')) {
      return 'Maghalo ng 1 dakot ng sariwang dahon ng malunggay sa lugaw o hapunan ng bata ngayong gabi.';
    }
    if (title.includes('monggo') || title.includes('protein')) {
      return 'Ihanda ang ginisang monggo na may dilis o maliliit na isda para sa pananghaliang protina ng bata.';
    }
    if (title.includes('egg') || title.includes('itlog') || title.includes('snack')) {
      return 'Maghain ng 1 buong pinakuluang itlog (hard-boiled egg) bilang pampatangkad na meryenda.';
    }
    if (title.includes('camote') || title.includes('solid') || title.includes('first food')) {
      return 'Ihain ang pinalambot na dilaw na kamote na may 1/2 kutsaritang mantika ng niyog para sa dagdag enerhiya.';
    }
    if (title.includes('wash') || title.includes('hygiene') || title.includes('safe food')) {
      return 'Hugasan ang kamay gamit ang sabon at malinis na tubig sa loob ng 20 segundo bago maghanda ng pagkain.';
    }
    if (title.includes('stunting') || title.includes('height') || title.includes('milestone')) {
      return 'Sukatin ang tangkad at timbang ng bata ngayong linggo kasama ang Barangay Nutrition Scholar (BNS).';
    }
    if (title.includes('texture') || title.includes('finger food') || title.includes('self-feeding')) {
      return 'Mag-alok ng malalambot na finger foods (hiniwang saba na saging, pinasingawang kalabasa) para sa bata.';
    }
    if (title.includes('responsive') || title.includes('screen-free') || title.includes('picky')) {
      return 'Maghapunan nang sabay ang pamilya nang walang telebisyon o cellphone sa hapag-kainan.';
    }
    return 'Subukan ang isang masustansyang rekomendasyon gamit ang mga abot-kayang lokal na sangkap.';
  },

  // Tap "Done" on Try It at Home action (Thesis Chapter 2.1 & UC-02)
  tapActionDone(moduleId, index, event) {
    if (event) event.stopPropagation();
    const mod = this.nutritionModules.find(m => m.id === moduleId);
    if (!mod || !mod.lessons[index]) return;

    const lesson = mod.lessons[index];
    lesson.actionCompleted = true;
    lesson.actionCompletedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
    lesson.completed = true;

    // Log practical activity completion (Thesis Chapter 3.1.3 UC-02 & Nabugoomu 2015)
    const currentUser = NutriStorage.getCurrentUser();
    const child = this.getActiveChild();
    const actionTip = lesson.tryHomeAction || this.getLessonPracticalAction(mod.id, lesson.title);

    try {
      NutriStorage.saveTryHomeSubmission({
        childId: child ? child.id : 'ch-102',
        childName: child ? child.name : (currentUser?.childName || 'Child'),
        parentName: currentUser ? currentUser.name : 'Parent',
        parentEmail: currentUser ? currentUser.email : '',
        barangay: currentUser?.barangay || (child ? child.barangay : 'Barangay Manguiring'),
        actionTitle: `Try It at Home: ${lesson.title}`,
        actionCategory: 'Lesson Practical Feeding Action',
        mealType: 'Dinner/Lunch',
        dateSubmitted: new Date().toISOString().split('T')[0],
        timeSubmitted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ingredientsUsed: 'Sariwang gulay, malunggay, itlog, o lokal na masustansyang sangkap',
        childAcceptance: 'Kinain nang masigla ng bata',
        washPracticesFollowed: ['Naghugas ng kamay gamit ang sabon', 'Pinakuluang inuming tubig'],
        parentNotes: `Nagawa ang praktikal na gawain para sa aralin: "${actionTip}".`,
        evaluationStatus: 'Pending Review'
      });
    } catch (e) {
      console.warn('Try home action log error:', e);
    }

    this.saveProgressState();
    this.openModuleDrawer(moduleId);
    this.updateProgressHeader();
    NutriApp.showToast(`🎉 Nagawa mo na ang practical action para sa "${lesson.title}"! Naitala ang timestamp sa system.`, 'success');

    // Live update BHW reviews table if loaded
    if (window.CHWModule && typeof CHWModule.renderTryHomeEvaluationsTable === 'function') {
      CHWModule.renderTryHomeEvaluationsTable();
    }
  },

  // Toggle Action Done undo
  toggleLessonActionDone(moduleId, index, event) {
    if (event) event.stopPropagation();
    const mod = this.nutritionModules.find(m => m.id === moduleId);
    if (!mod || !mod.lessons[index]) return;

    const lesson = mod.lessons[index];
    lesson.actionCompleted = !lesson.actionCompleted;
    if (!lesson.actionCompleted) {
      lesson.actionCompletedAt = null;
    } else {
      lesson.actionCompletedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
    }

    this.saveProgressState();
    this.openModuleDrawer(moduleId);
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

  // Render "Try It at Home" 10 actionable practices (Matches Reference Mockup)
  renderHomeActionsChecklist() {
    const container = document.getElementById('home-actions-list-container');
    if (!container) return;

    // Load saved checked indexes - default to [1]
    let checkedSet = new Set([1]);
    try {
      const saved = localStorage.getItem('nutrilearn_home_actions_checked');
      if (saved) {
        checkedSet = new Set(JSON.parse(saved));
      }
    } catch (e) {}

    const total = this.homeActions.length;
    const count = checkedSet.size;
    const pct = Math.round((count / total) * 100);

    // Update progress bar and counter
    const progressBar = document.getElementById('try-home-progress-bar');
    const countLabel = document.getElementById('try-home-count');
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (countLabel) countLabel.textContent = count;

    container.innerHTML = this.homeActions.map((act, idx) => {
      const isChecked = checkedSet.has(idx);
      const num = idx + 1;

      return `
        <div class="try-home-card ${isChecked ? 'is-tried' : ''}" id="try-home-card-${idx}">
          <div class="try-home-badge-col">
            <div class="try-home-num-circle">
              ${isChecked ? `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ` : num}
            </div>
          </div>
          <div class="try-home-content-col">
            <div class="try-home-context">${act.context || 'Practical Feeding Action'}</div>
            <h3 class="try-home-item-title">${act.title}</h3>
            <p class="try-home-item-hint">${act.tip}</p>
          </div>
          <div class="try-home-action-col">
            ${isChecked ? `
              <button type="button" class="btn-edit-action" onclick="ParentModule.openEditActivityModal(${idx})">
                Edit
              </button>
            ` : `
              <button type="button" class="btn-try-action" onclick="ParentModule.markActivityTried(${idx})">
                I tried it
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');

    this.updateHomeActionsMetrics(count);
  },

  // Mark an activity as tried
  markActivityTried(index) {
    let checkedSet = new Set([1]);
    try {
      const saved = localStorage.getItem('nutrilearn_home_actions_checked');
      if (saved) checkedSet = new Set(JSON.parse(saved));
    } catch (e) {}

    checkedSet.add(index);

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

    // Ensure body scroll is never locked
    document.body.style.overflow = '';
    this.renderHomeActionsChecklist();
    NutriApp.showToast(`🎉 "${this.homeActions[index].title}" marked as tried!`, 'success');
  },

  // Open modal to edit activity status (Tried vs Not yet)
  openEditActivityModal(index) {
    const act = this.homeActions[index];
    if (!act) return;
    this.selectedEditActivityIndex = index;

    let checkedSet = new Set([1]);
    try {
      const saved = localStorage.getItem('nutrilearn_home_actions_checked');
      if (saved) checkedSet = new Set(JSON.parse(saved));
    } catch (e) {}

    const isTried = checkedSet.has(index);

    const contextEl = document.getElementById('modal-edit-activity-context');
    const titleEl = document.getElementById('modal-edit-activity-title');
    const hintEl = document.getElementById('modal-edit-activity-hint');
    const statusTriedRadio = document.getElementById('modal-edit-status-tried');
    const statusUntriedRadio = document.getElementById('modal-edit-status-untried');

    if (contextEl) contextEl.textContent = act.context || 'PRACTICAL FEEDING ACTION';
    if (titleEl) titleEl.textContent = act.title || '';
    if (hintEl) hintEl.textContent = act.tip || '';

    if (statusTriedRadio && statusUntriedRadio) {
      statusTriedRadio.checked = isTried;
      statusUntriedRadio.checked = !isTried;
    }

    this.updateEditStatusUI();
    NutriApp.openModal('modal-edit-try-activity');
  },

  updateEditStatusUI() {
    const statusTriedRadio = document.getElementById('modal-edit-status-tried');
    const labelTried = document.getElementById('label-edit-status-tried');
    const labelUntried = document.getElementById('label-edit-status-untried');
    if (!statusTriedRadio || !labelTried || !labelUntried) return;

    if (statusTriedRadio.checked) {
      labelTried.style.borderColor = '#2E6845';
      labelTried.style.background = '#F0FDF4';
      labelUntried.style.borderColor = '#D1D5DB';
      labelUntried.style.background = '#F9FAFB';
    } else {
      labelTried.style.borderColor = '#D1D5DB';
      labelTried.style.background = '#F9FAFB';
      labelUntried.style.borderColor = '#2E6845';
      labelUntried.style.background = '#F0FDF4';
    }
  },

  // Save changes from Edit Modal (Tried vs Not yet)
  saveActivityEdit(event) {
    if (event) event.preventDefault();
    const idx = this.selectedEditActivityIndex;
    if (idx === null || idx === undefined || !this.homeActions[idx]) {
      NutriApp.closeModal('modal-edit-try-activity');
      return;
    }

    const statusTriedRadio = document.getElementById('modal-edit-status-tried');
    const isNowTried = statusTriedRadio ? statusTriedRadio.checked : true;

    // Update checked set
    let checkedSet = new Set([1]);
    try {
      const saved = localStorage.getItem('nutrilearn_home_actions_checked');
      if (saved) checkedSet = new Set(JSON.parse(saved));
    } catch (e) {}

    if (isNowTried) {
      checkedSet.add(idx);
    } else {
      checkedSet.delete(idx);
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
        if (isNowTried) {
          target.lastMealLogged = this.homeActions[idx].title;
          target.lastMealDate = 'Ngayong ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        localStorage.setItem('nutrilearn_diet_adherence_records_v3', JSON.stringify(records));
      }
    } catch (e) {}

    NutriApp.closeModal('modal-edit-try-activity');
    this.renderHomeActionsChecklist();
    NutriApp.showToast(isNowTried ? `🎉 Minarkahan bilang Tried!` : `Minarkahan bilang Not yet.`, 'success');
  },

  // Unmark an activity as tried (backward compatibility)
  unmarkActivityTried(index = null) {
    const idx = (index !== null) ? index : this.selectedEditActivityIndex;
    if (idx === null || idx === undefined) return;

    let checkedSet = new Set([1]);
    try {
      const saved = localStorage.getItem('nutrilearn_home_actions_checked');
      if (saved) checkedSet = new Set(JSON.parse(saved));
    } catch (e) {}

    checkedSet.delete(idx);

    try {
      localStorage.setItem('nutrilearn_home_actions_checked', JSON.stringify([...checkedSet]));
    } catch (e) {}

    NutriApp.closeModal('modal-edit-try-activity');
    this.renderHomeActionsChecklist();
    NutriApp.showToast('Aktibidad minarkahan bilang hindi pa nasusubukan.', 'info');
  },

  // Toggle home action item (backward compatibility)
  toggleHomeAction(index) {
    let checkedSet = new Set([1]);
    try {
      const saved = localStorage.getItem('nutrilearn_home_actions_checked');
      if (saved) checkedSet = new Set(JSON.parse(saved));
    } catch (e) {}

    if (checkedSet.has(index)) {
      this.unmarkActivityTried(index);
    } else {
      this.markActivityTried(index);
    }
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
            Hindi pa nakakonekta ang rekord ng iyong anak. I-update o magrehistro upang masubaybayan ang paglaki ng bata.
          </p>
          <button class="btn btn-accent" onclick="ParentModule.openParentLogGrowthModal(true)">
            ➕ Magrehistro ng Rekord ng Bata
          </button>
        </div>
      `;
      return;
    }

    const childId = child.id || 'ch-102';
    const childName = child.name || 'Liam Santos';
    const history = this.getChildWeightHistory(childId);

    // Calculate metrics
    const latestRecord = history.length > 0 ? history[0] : null;
    const currentWeight = latestRecord ? latestRecord.weight : (child.weightKg || 9.2);
    const recordsLogged = history.length;

    let deltaVal = 0.2;
    let deltaSign = '+';
    if (history.length >= 2) {
      const diff = +(history[0].weight - history[1].weight).toFixed(1);
      deltaVal = Math.abs(diff).toFixed(1);
      deltaSign = diff >= 0 ? '+' : '-';
    }

    // Determine status
    let whoStatus = child.status || child.nutritionStatus || 'At Risk';
    if (whoStatus === 'Underweight' || whoStatus === 'Wasted' || whoStatus === 'Stunted') {
      whoStatus = 'At Risk';
    }

    // Today's date for form input
    const todayStr = new Date().toISOString().split('T')[0];

    // Build History Items HTML
    const historyItemsHtml = history.map((item, idx) => {
      let deltaSpan = '';
      if (idx < history.length - 1) {
        const prev = history[idx + 1];
        const diff = +(item.weight - prev.weight).toFixed(1);
        if (diff >= 0) {
          deltaSpan = `<span class="wt-history-delta">▲ ${diff} kg</span>`;
        } else {
          deltaSpan = `<span class="wt-history-delta" style="color:#DC2626;">▼ ${Math.abs(diff)} kg</span>`;
        }
      }
      const weightDisplay = (item.weight % 1 === 0) ? `${item.weight} kg` : `${item.weight.toFixed(1)} kg`;
      const dateDisplay = this.formatWeightDate(item.date);
      const noteDisplay = item.note ? ` · ${item.note}` : '';

      return `
        <div class="wt-history-item">
          <div class="wt-history-top">
            <span class="wt-history-val">${weightDisplay}</span>
            ${deltaSpan}
          </div>
          <div class="wt-history-date">${dateDisplay}${noteDisplay}</div>
        </div>
      `;
    }).join('');

    // Generate Chart SVG
    const chartSvg = this.generateWeightChartSvg(history, 9.2);

    container.innerHTML = `
      <div class="weight-tracker-page-container">
        <!-- Header -->
        <div class="wt-header-row">
          <div class="wt-title-block">
            <h1>Weight Tracker</h1>
            <p>Optional for Parents/Guardians: log home measurements if you want to monitor weight between Health Worker visits</p>
          </div>
          <div class="wt-child-info wt-child-badge">
            Child: <strong>${childName}</strong>
          </div>
        </div>

        <!-- 4 Metric Cards Grid -->
        <div class="wt-metrics-grid">
          <div class="wt-metric-card">
            <div class="wt-metric-icon">⚖️</div>
            <div class="wt-metric-val">${currentWeight % 1 === 0 ? currentWeight : currentWeight.toFixed(1)} kg</div>
            <div class="wt-metric-label">Current Weight</div>
          </div>
          <div class="wt-metric-card">
            <div class="wt-metric-icon">🗓️</div>
            <div class="wt-metric-val">${recordsLogged}</div>
            <div class="wt-metric-label">Records Logged</div>
          </div>
          <div class="wt-metric-card">
            <div class="wt-metric-icon">📈</div>
            <div class="wt-metric-val green">${deltaSign}${deltaVal} kg</div>
            <div class="wt-metric-label">Since Last Record</div>
          </div>
          <div class="wt-metric-card highlight">
            <div class="wt-metric-icon">🩺</div>
            <div class="wt-metric-val">${whoStatus}</div>
            <div class="wt-metric-label">WHO Growth Status</div>
          </div>
        </div>

        <!-- Growth Chart Card -->
        <div class="wt-chart-card">
          <div class="wt-chart-header">
            <h2 class="wt-chart-title">Growth Chart — ${childName}</h2>
            <div class="wt-chart-legend">
              <div class="wt-legend-item">
                <span class="wt-legend-line-green"></span>
                <span>Child weight</span>
              </div>
              <div class="wt-legend-item">
                <span class="wt-legend-line-dashed"></span>
                <span>WHO median</span>
              </div>
            </div>
          </div>
          <div class="wt-chart-svg-wrap">
            ${chartSvg}
          </div>
        </div>

        <!-- Bottom 2-Column Grid -->
        <div class="wt-bottom-grid">
          <!-- Log New Weight Form Card -->
          <div class="wt-form-card">
            <h2 class="wt-card-title">Log New Weight</h2>
            <form onsubmit="ParentModule.saveNewWeightRecord(event)">
              <div class="wt-field-group">
                <label class="wt-field-label">Date *</label>
                <input type="date" id="wt-input-date" class="wt-input" value="${todayStr}" required />
              </div>
              <div class="wt-field-group">
                <label class="wt-field-label">Weight (kg) *</label>
                <input type="number" id="wt-input-weight" class="wt-input" step="0.1" min="2" max="40" placeholder="e.g. 9.4" required />
              </div>
              <div class="wt-field-group">
                <label class="wt-field-label">Note (optional)</label>
                <input type="text" id="wt-input-note" class="wt-input" placeholder="e.g. After starting malunggay..." />
              </div>
              <button type="submit" class="btn-wt-save">Save Record</button>
            </form>
            <div class="wt-callout-box">
              <span class="wt-callout-icon">💡</span>
              <span>Weigh your child at the same time each measurement — ideally in the morning before eating, using the same scale. Monthly records give the clearest picture of growth.</span>
            </div>
          </div>

          <!-- Weight History Card -->
          <div class="wt-history-card">
            <h2 class="wt-card-title">Weight History</h2>
            <div class="wt-history-list">
              ${historyItemsHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  getChildWeightHistory(childId) {
    if (!childId) return [];
    try {
      const stored = localStorage.getItem('nutrilearn_weight_history_' + childId);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    const defaultHistory = [
      { id: 'wh-1', date: '2026-08-01', weight: 9.2, note: 'Check-up confirmed improving' },
      { id: 'wh-2', date: '2026-07-01', weight: 9.0, note: '' },
      { id: 'wh-3', date: '2026-06-01', weight: 8.7, note: 'Eating well' },
      { id: 'wh-4', date: '2026-05-01', weight: 8.4, note: '' },
      { id: 'wh-5', date: '2026-04-01', weight: 8.1, note: '' },
      { id: 'wh-6', date: '2026-03-01', weight: 7.8, note: '' }
    ];
    try {
      localStorage.setItem('nutrilearn_weight_history_' + childId, JSON.stringify(defaultHistory));
    } catch (e) {}
    return defaultHistory;
  },

  saveNewWeightRecord(event) {
    if (event) event.preventDefault();
    const dateInput = document.getElementById('wt-input-date');
    const weightInput = document.getElementById('wt-input-weight');
    const noteInput = document.getElementById('wt-input-note');

    if (!dateInput || !weightInput) return;
    const dateVal = dateInput.value;
    const weightVal = parseFloat(weightInput.value);
    const noteVal = noteInput ? noteInput.value.trim() : '';

    if (!dateVal || isNaN(weightVal) || weightVal <= 0) {
      if (typeof NutriApp !== 'undefined') {
        NutriApp.showToast('Mangyaring ilagay ang wastong timbang (kg).', 'warning');
      } else {
        alert('Please enter a valid weight.');
      }
      return;
    }

    const child = this.getActiveChild();
    if (!child) return;

    const childId = child.id || 'ch-102';
    const history = this.getChildWeightHistory(childId);
    const newRecord = {
      id: 'wh-' + Date.now(),
      date: dateVal,
      weight: parseFloat(weightVal.toFixed(1)),
      note: noteVal
    };

    history.unshift(newRecord);
    try {
      localStorage.setItem('nutrilearn_weight_history_' + childId, JSON.stringify(history));
    } catch (e) {}

    child.weightKg = newRecord.weight;
    if (typeof NutriStorage !== 'undefined' && typeof NutriStorage.saveChild === 'function') {
      NutriStorage.saveChild(child);
    }

    if (typeof NutriApp !== 'undefined') {
      NutriApp.showToast(`Matagumpay na naitala ang timbang (${newRecord.weight} kg)!`, 'success');
    }

    this.renderChildGrowth();
  },

  formatWeightDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      if (months[monthIdx]) {
        return `${months[monthIdx]} ${day}, ${year}`;
      }
    }
    return dateStr;
  },

  generateWeightChartSvg(history, whoMedian = 9.2) {
    if (!history || history.length === 0) {
      return '<div style="text-align:center; padding:2rem; color:#64748B;">Walang sapat na datos para sa chart.</div>';
    }

    const points = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));

    const weights = points.map(p => p.weight);
    let minW = 7.6;
    let maxW = 9.2;
    if (Math.min(...weights) < 7.6) minW = Math.floor(Math.min(...weights) * 2) / 2;
    if (Math.max(...weights) > 9.2) maxW = Math.ceil(Math.max(...weights) * 2) / 2;

    const ticks = [];
    const step = 0.4;
    for (let w = maxW; w >= minW - 0.001; w -= step) {
      ticks.push(parseFloat(w.toFixed(1)));
    }

    const svgWidth = 840;
    const svgHeight = 250;
    const padLeft = 60;
    const padRight = 25;
    const padTop = 20;
    const padBottom = 35;
    const plotW = svgWidth - padLeft - padRight;
    const plotH = svgHeight - padTop - padBottom;

    const getY = (w) => {
      const pct = (w - minW) / (maxW - minW);
      return (padTop + plotH) - (pct * plotH);
    };

    const getX = (idx) => {
      if (points.length <= 1) return padLeft + plotW / 2;
      return padLeft + (idx / (points.length - 1)) * plotW;
    };

    let gridLinesSvg = '';
    ticks.forEach(tVal => {
      const yPos = getY(tVal);
      const formattedVal = (tVal % 1 === 0 ? tVal : tVal.toFixed(1)) + ' kg';
      gridLinesSvg += `
        <line x1="${padLeft}" y1="${yPos}" x2="${svgWidth - padRight}" y2="${yPos}" stroke="#EDE6DC" stroke-dasharray="3 3" stroke-width="1" />
        <text x="${padLeft - 10}" y="${yPos + 4}" font-size="11" fill="#78716C" font-weight="500" text-anchor="end" font-family="'Inter', -apple-system, sans-serif">${formattedVal}</text>
      `;
    });

    const whoY = getY(whoMedian);
    const whoLineSvg = `
      <line x1="${padLeft}" y1="${whoY}" x2="${svgWidth - padRight}" y2="${whoY}" stroke="#DC2626" stroke-dasharray="5 4" stroke-width="1.6" />
    `;

    const coords = points.map((p, idx) => ({
      x: getX(idx),
      y: getY(p.weight),
      date: p.date,
      weight: p.weight
    }));

    let vertLinesSvg = '';
    coords.forEach(pt => {
      const dateParts = pt.date.split('-');
      const label = dateParts.length === 3 ? `${dateParts[1]} ${dateParts[2]}` : pt.date;
      vertLinesSvg += `
        <line x1="${pt.x}" y1="${padTop}" x2="${pt.x}" y2="${padTop + plotH}" stroke="#EDE6DC" stroke-dasharray="3 3" stroke-width="1" />
        <text x="${pt.x}" y="${svgHeight - 10}" font-size="11" fill="#78716C" font-weight="500" text-anchor="middle" font-family="'Inter', -apple-system, sans-serif">${label}</text>
      `;
    });

    const pathD = coords.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
    const linePathSvg = `
      <path d="${pathD}" fill="none" stroke="#2E6845" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    `;

    let pointsSvg = '';
    coords.forEach(pt => {
      pointsSvg += `
        <circle cx="${pt.x}" cy="${pt.y}" r="3.5" fill="#2E6845" />
      `;
    });

    return `
      <svg class="wt-chart-svg" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMid meet">
        ${gridLinesSvg}
        ${vertLinesSvg}
        ${whoLineSvg}
        ${linePathSvg}
        ${pointsSvg}
      </svg>
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
      const dewormStatusInput = document.getElementById('parent-growth-child-deworming-status');
      const dewormDateInput = document.getElementById('parent-growth-child-deworming-date');
      const dewormNextInput = document.getElementById('parent-growth-child-deworming-next-date');
      if (dewormStatusInput) dewormStatusInput.value = 'Up to Date';
      if (dewormDateInput) dewormDateInput.value = new Date().toISOString().split('T')[0];
      if (dewormNextInput) {
        const next = new Date();
        next.setMonth(next.getMonth() + 6);
        dewormNextInput.value = next.toISOString().split('T')[0];
      }
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
      const dewormStatusInput = document.getElementById('parent-growth-child-deworming-status');
      const dewormDateInput = document.getElementById('parent-growth-child-deworming-date');
      const dewormNextInput = document.getElementById('parent-growth-child-deworming-next-date');
      if (dewormStatusInput) dewormStatusInput.value = child.dewormingStatus || 'Up to Date';
      if (dewormDateInput) dewormDateInput.value = child.dewormingDate || '';
      if (dewormNextInput) dewormNextInput.value = child.dewormingNextDate || '';
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
    const dewormingStatus = (document.getElementById('parent-growth-child-deworming-status')?.value || 'Up to Date');
    const dewormingDate = (document.getElementById('parent-growth-child-deworming-date')?.value || '');
    const dewormingNextDate = (document.getElementById('parent-growth-child-deworming-next-date')?.value || '');

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
        existing.dewormingStatus = dewormingStatus;
        existing.dewormingDate = dewormingDate;
        existing.dewormingNextDate = dewormingNextDate;
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
        dewormingStatus: dewormingStatus,
        dewormingDate: dewormingDate,
        dewormingNextDate: dewormingNextDate,
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
  },

  // ==========================================================================
  // "TRY IT AT HOME" PRACTICAL ACTION SUBMISSION & FEEDBACK (Nabugoomu 2015; Kuchenbecker 2017)
  // ==========================================================================
  openSubmitActionReportModal(actionId = null) {
    const select = document.getElementById('report-action-select');
    if (select) {
      select.innerHTML = this.homeActions.map(act => 
        `<option value="${act.title}" ${act.id === actionId ? 'selected' : ''}>${act.id}. ${act.title}</option>`
      ).join('');
    }

    const child = this.getActiveChild();
    const childDisplay = document.getElementById('report-action-child-display');
    if (childDisplay && child) {
      childDisplay.textContent = `${child.name} (${child.ageMonths} mos • ${child.barangay})`;
    }

    const dateInput = document.getElementById('report-action-date');
    if (dateInput) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }

    NutriApp.openModal('modal-parent-submit-action-report');
  },

  handleSaveActionReport(form) {
    const child = this.getActiveChild();
    const user = NutriStorage.getCurrentUser();
    const actionTitle = form.elements['actionTitle']?.value || 'Practical Feeding Action';
    const mealType = form.elements['actionMealType']?.value || 'Lunch';
    const date = form.elements['actionDate']?.value || new Date().toISOString().split('T')[0];
    const ingredients = (form.elements['actionIngredients']?.value || '').trim();
    const acceptance = form.elements['actionAcceptance']?.value || 'Kinain nang buo (Enthusiastic)';
    const notes = (form.elements['actionNotes']?.value || '').trim();

    const washBoxes = Array.from(form.querySelectorAll('input[name="washFollowed"]:checked')).map(el => el.value);

    const submission = {
      id: 'sub-' + Date.now(),
      childId: child ? child.id : 'ch-102',
      childName: child ? child.name : (user?.childName || 'Liam Santos'),
      parentName: user?.name || (child ? child.parentName : 'Maria Santos'),
      parentEmail: user?.email || '',
      barangay: user?.barangay || (child ? child.barangay : 'Barangay Manguiring'),
      actionTitle: actionTitle,
      actionCategory: 'Try it at home (Nabugoomu, 2015; Kuchenbecker et al., 2017)',
      mealType: mealType,
      dateSubmitted: date,
      timeSubmitted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ingredientsUsed: ingredients || 'Lokasyunal na masustansyang sangkap',
      childAcceptance: acceptance,
      washPracticesFollowed: washBoxes,
      parentNotes: notes,
      evaluationStatus: 'Pending Review',
      bhwFeedback: '',
      evaluatedBy: '',
      evaluatedAt: ''
    };

    NutriStorage.addTryHomeSubmission(submission);
    form.reset();
    NutriApp.closeModal('modal-parent-submit-action-report');
    NutriApp.showToast('🎉 Naipadala na ang iyong Feeding Action sa Health Worker para sa pagsusuri at gabay!', 'success');

    this.renderActionSubmissionsHistory();

    // Live refresh BHW reviews if open
    if (window.CHWModule && typeof CHWModule.renderTryHomeEvaluationsTable === 'function') {
      CHWModule.renderTryHomeEvaluationsTable();
    }
  },

  renderActionSubmissionsHistory() {
    const container = document.getElementById('parent-action-submissions-history');
    if (!container) return;

    const user = NutriStorage.getCurrentUser();
    const child = this.getActiveChild();
    const allSubs = NutriStorage.getTryHomeSubmissions();
    const mySubs = allSubs.filter(s => 
      (user && s.parentEmail && s.parentEmail.toLowerCase() === user.email?.toLowerCase()) ||
      (child && s.childId === child.id) ||
      (user && s.parentName && s.parentName.toLowerCase().includes(user.name.toLowerCase()))
    );

    if (mySubs.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem; color: #64748B; background: #F8FAFC; border-radius: 8px; border: 1px dashed #CBD5E1;">
          <div style="font-size: 2rem; margin-bottom: 0.35rem;">📝</div>
          <div style="font-weight: 600; color: #1E293B;">Wala ka pang naisusumiteng Feeding Action</div>
          <div style="font-size: 0.82rem; margin-top: 0.25rem;">
            Pindutin ang <strong>"Mag-Self-Report ng Feeding Action"</strong> sa itaas pagkatapos subukan ang alinman sa mga rekomendasyon upang mabigyan ka ng gabay ng BHW.
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = mySubs.map(s => {
      const isEvaluated = s.evaluationStatus === 'Evaluated';
      return `
        <div class="card" style="margin-bottom: 0.85rem; border: 1px solid #E2E8F0; padding: 1rem 1.15rem; background: #FFFFFF; border-left: 4px solid ${isEvaluated ? '#10B981' : '#F59E0B'};">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; flex-wrap: wrap;">
            <div>
              <div style="font-size: 0.96rem; font-weight: 700; color: #0E3D26;">
                ${s.actionTitle}
              </div>
              <div style="font-size: 0.78rem; color: #64748B; margin-top: 2px;">
                📅 ${s.dateSubmitted} (${s.mealType || 'Meal'}) • Para kay: <strong>${s.childName}</strong>
              </div>
            </div>
            <span class="badge ${isEvaluated ? 'badge-normal' : 'badge-underweight'}" style="font-size: 0.75rem;">
              ${isEvaluated ? '✓ Nasuri na ng BHW' : '⏳ Naghihintay ng Gabay'}
            </span>
          </div>

          <div style="margin-top: 0.65rem; font-size: 0.84rem; color: #334155; line-height: 1.5;">
            <div>🍲 <strong>Mga Sangkap:</strong> ${s.ingredientsUsed}</div>
            <div>👶 <strong>Pagtanggap ng Bata:</strong> ${s.childAcceptance}</div>
            ${s.parentNotes ? `<div>💬 <strong>Tala ng Magulang:</strong> ${s.parentNotes}</div>` : ''}
          </div>

          ${isEvaluated && s.bhwFeedback ? `
            <div style="margin-top: 0.75rem; background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 6px; padding: 0.7rem 0.9rem; font-size: 0.82rem; color: #14532D;">
              <strong>🩺 Gabay mula kay ${s.evaluatedBy || 'BHW'}:</strong>
              <div style="margin-top: 0.2rem;">"${s.bhwFeedback}"</div>
              <div style="font-size: 0.72rem; color: #059669; margin-top: 0.3rem;">Nasuri noong: ${s.evaluatedAt || 'Kamakailan'}</div>
            </div>
          ` : `
            <div style="margin-top: 0.65rem; font-size: 0.78rem; color: #94A3B8; font-style: italic;">
              Ipaparating ang payo at gabay ng iyong Barangay Health Worker dito kapag nasuri na ang iyong feeding log.
            </div>
          `}
        </div>
      `;
    }).join('');
  }
};
