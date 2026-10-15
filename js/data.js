// ==========================================================================
// NUTRILEARN - DATA REPOSITORY & NUTRITION CURRICULUM
// Evidence-based WHO, PIDS & Philippine Nutrition Standards
// ==========================================================================

const NUTRI_DATA = {
  // Learning Modules for Parents
  modules: [
    {
      id: 'mod-1',
      number: 'Module 1',
      title: 'Understanding Child Malnutrition & Stunting',
      duration: '10 mins',
      difficulty: 'Essential',
      summary: 'Learn the critical differences between stunting, wasting, and underweight, and why early nutrition transforms a child’s future.',
      objectives: [
        'Differentiate stunting (low height-for-age) from wasting (low weight-for-height).',
        'Understand how reducing stunting by 10% prevents irreversible cognitive delays.',
        'Identify common signs of micronutrient deficiency in young children.'
      ],
      content: `
        <h3>What is Malnutrition?</h3>
        <p>Malnutrition refers to deficiencies, excesses, or imbalances in a child's intake of energy and nutrients. In our community, the most urgent challenge is <strong>Child Stunting</strong>.</p>
        
        <div class="calculator-result-box" style="margin: 1rem 0;">
          <h4 style="color: #0E3D26; margin-bottom: 0.5rem;">The Three Forms of Undernutrition:</h4>
          <ul style="margin-left: 1.25rem; line-height: 1.6;">
            <li><strong>Stunting (Maliit para sa edad):</strong> Chronic undernutrition leading to low height for age. It affects brain development and is largely irreversible after age 2.</li>
            <li><strong>Wasting (Payat para sa tangkad):</strong> Acute undernutrition resulting from severe weight loss or illness. Requires immediate nutritional feeding.</li>
            <li><strong>Underweight (Mababang timbang para sa edad):</strong> A composite marker reflecting both stunting and wasting.</li>
          </ul>
        </div>

        <h3>Why the 10% Stunting Reduction Goal Matters</h3>
        <p>Evidence from the Philippine Institute for Development Studies (PIDS) and the World Health Organization (WHO) proves that consistent caregiver education combined with affordable, locally sourced complementary feeding can reduce stunting by <strong>10% annually</strong>. This simple improvement prevents chronic school absenteeism, enhances intelligence, and breaks the cycle of generational poverty.</p>
      `,
      quiz: [
        {
          id: 'q1-1',
          question: 'What is child stunting and what does it measure?',
          options: [
            'A temporary low weight caused by a minor flu',
            'Chronic undernutrition resulting in low height-for-age with lifelong cognitive impacts',
            'Normal genetically determined height that needs no dietary change',
            'Overweight resulting from eating too much rice'
          ],
          answerIndex: 1,
          explanation: 'Stunting is chronic undernutrition indicated by low height-for-age (Height-for-Age z-score < -2 SD). It stunts both physical stature and brain development.'
        },
        {
          id: 'q1-2',
          question: 'According to WHO & Philippine health evidence, by how much can community education and better complementary feeding reduce stunting each year?',
          options: [
            '1% to 2%',
            'Around 10%',
            'No reduction is possible without expensive imported medicine',
            '50% in one month'
          ],
          answerIndex: 1,
          explanation: 'Targeted parent education and localized complementary food interventions have been shown to reduce community stunting prevalence by 10% annually.'
        },
        {
          id: 'q1-3',
          question: 'Why is it critical to prevent stunting before a child reaches their second birthday?',
          options: [
            'Because stunting damage to cognitive and physical growth is largely irreversible after age 2',
            'Because children no longer eat vegetables after age 2',
            'Because health clinics stop monitoring children at age 2',
            'Because height cannot be measured after infancy'
          ],
          answerIndex: 0,
          explanation: 'The first 1,000 days (from conception up to 2 years) is the critical window where brain and body growth happens fastest. Nutritional deficits during this period become permanent.'
        }
      ]
    },

    {
      id: 'mod-2',
      number: 'Module 2',
      title: 'The First 1,000 Days Golden Window',
      duration: '12 mins',
      difficulty: 'Crucial',
      summary: 'Master the feeding timeline from pregnancy to 24 months, focusing on exclusive breastfeeding and timely complementary feeding.',
      objectives: [
        'Understand the timeline of the First 1,000 Days (conception to age 2).',
        'Practice exclusive breastfeeding for the first 6 months without water or formula.',
        'Know when and how to start introducing soft solid foods at exactly 6 months.'
      ],
      content: `
        <h3>The Golden Window: Conception to 2 Years</h3>
        <p>80% of a child’s brain develops in the first 1,000 days. This period is the single best opportunity to build a child’s lifelong health, immunity, and learning capacity.</p>

        <div style="background: #F0FDF4; border-left: 4px solid #16A34A; padding: 1rem; margin: 1rem 0; border-radius: 4px;">
          <h4 style="color: #14532D; margin-bottom: 0.35rem;">Key Feeding Stages:</h4>
          <p><strong>0 to 6 Months:</strong> Exclusive Breastfeeding only. Breast milk provides all necessary water, fats, antibodies, and vitamins. Giving plain water, tea, or rice broth dilutes nutrient intake and introduces infections.</p>
          <p style="margin-top: 0.5rem;"><strong>At 6 Months:</strong> Introduce safe, nutrient-dense complementary foods while continuing breastfeeding up to 2 years or beyond.</p>
        </div>
      `,
      quiz: [
        {
          id: 'q2-1',
          question: 'What should a baby be fed during the first 6 months of life?',
          options: [
            'Rice water (am), formula, and tea',
            'Exclusively breast milk (no water, formula, or solids)',
            'Mashed bananas and cow milk',
            'Lugaw with sugar'
          ],
          answerIndex: 1,
          explanation: 'WHO and DOH recommend exclusive breastfeeding for the first 6 months. Breast milk satisfies all thirst and hunger while protecting against diarrhea and respiratory infections.'
        },
        {
          id: 'q2-2',
          question: 'At what age should soft complementary foods be introduced alongside breast milk?',
          options: [
            'At 2 months',
            'At 4 months',
            'At exactly 6 months',
            'At 12 months'
          ],
          answerIndex: 2,
          explanation: 'At 6 months, a baby’s energy and micronutrient requirements begin to exceed what breast milk alone can provide, making complementary feeding essential.'
        }
      ]
    },

    {
      id: 'mod-3',
      number: 'Module 3',
      title: 'Pinggang Pinoy: Local & Affordable Foods',
      duration: '15 mins',
      difficulty: 'Practical Skills',
      summary: 'Cook balanced, nutrient-dense meals for your family using accessible Filipino staples: Malunggay, Monggo, Camote, Dilis, and Eggs.',
      objectives: [
        'Balance every meal with Go (Energy), Grow (Protein), and Glow (Vitamins) foods.',
        'Use backyard vegetables like Malunggay to fortify baby food affordably.',
        'Replace expensive processed snacks with highly nutritious, low-cost local foods.'
      ],
      content: `
        <h3>Pinggang Pinoy: The Balanced Community Plate</h3>
        <p>You do not need expensive groceries to feed your child well. The best superfoods grow right in our backyards and local markets:</p>

        <div class="grid-3" style="margin: 1.25rem 0;">
          <div style="background:#FFFBEB; border:1px solid #FDE68A; padding:1rem; border-radius:8px;">
            <h4 style="color:#92400E;">🟡 GO Foods (Energy)</h4>
            <p style="font-size:0.85rem; color:#78350F; margin-top:0.35rem;">Rice, Sweet Potato (Camote), Corn, Saba banana, Gabi. Provides stamina for active toddlers.</p>
          </div>
          <div style="background:#FEF2F2; border:1px solid #FECACA; padding:1rem; border-radius:8px;">
            <h4 style="color:#991B1B;">🔴 GROW Foods (Protein)</h4>
            <p style="font-size:0.85rem; color:#7F1D1D; margin-top:0.35rem;">Eggs, Monggo beans, Dilis (dried anchovies), Tilapia, Tofu. Builds strong muscles and bones.</p>
          </div>
          <div style="background:#F0FDF4; border:1px solid #BBF7D0; padding:1rem; border-radius:8px;">
            <h4 style="color:#166534;">🟢 GLOW Foods (Vitamins)</h4>
            <p style="font-size:0.85rem; color:#14532D; margin-top:0.35rem;">Malunggay leaves, Kalabasa (squash), Papaya, Kangkong. Shields the immune system from illness.</p>
          </div>
        </div>

        <div style="background:#EBF8FF; border:1px solid #BEE3F8; padding:1rem; border-radius:8px;">
          <h4 style="color:#2B6CB0;">💡 Community Nutrition Tip: The Power of Dilis & Malunggay</h4>
          <p style="font-size:0.88rem; color:#2D3748; margin-top:0.25rem;">Pounding dried dilis into a fine powder and stirring it into baby lugaw adds massive amounts of calcium, zinc, and protein for less than ₱5 per meal!</p>
        </div>
      `,
      quiz: [
        {
          id: 'q3-1',
          question: 'Which local vegetable is considered a nutrition powerhouse for preventing micronutrient stunting?',
          options: [
            'Cabbage',
            'Malunggay (Moringa leaves)',
            'Cucumber',
            'Pickled radish'
          ],
          answerIndex: 1,
          explanation: 'Malunggay is packed with vitamin A, iron, calcium, and plant protein, making it one of the most cost-effective foods to prevent child stunting.'
        },
        {
          id: 'q3-2',
          question: 'What is an affordable and practical way to enrich plain rice porridge (lugaw) for a 9-month-old?',
          options: [
            'Adding white sugar and sweetened condensed milk',
            'Adding powdered dilis (dried fish), mashed egg yolk, and finely chopped malunggay',
            'Adding artificial seasoning cubes with high sodium',
            'Using canned soda for sweetness'
          ],
          answerIndex: 1,
          explanation: 'Plain lugaw is mostly water and simple carbs. Enriching it with egg yolk, pounded dilis, and malunggay turns it into a complete Go-Grow-Glow meal.'
        }
      ]
    },

    {
      id: 'mod-4',
      number: 'Module 4',
      title: 'Age-Appropriate Feeding (6 to 23 Months)',
      duration: '10 mins',
      difficulty: 'Practical Skills',
      summary: 'Learn the correct textures, portion sizes, and daily meal frequencies for infants and toddlers to ensure steady weight gain.',
      objectives: [
        'Progress texture from thick puree (6–8 mos) to finely chopped (9–11 mos) to family meals (12–23 mos).',
        'Learn appropriate portion sizes per meal to prevent infant undernutrition.',
        'Understand why responsive feeding encourages toddlers to finish nutritious meals.'
      ],
      content: `
        <h3>Feeding Frequency & Texture Progression</h3>
        <p>Infant stomachs are small (about the size of their fist). Each spoonful must be calorie-dense and nutrient-rich.</p>

        <div class="table-responsive" style="margin: 1rem 0;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Age Group</th>
                <th>Texture & Consistency</th>
                <th>Daily Frequency</th>
                <th>Portion Per Meal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>6 to 8 Months</strong></td>
                <td>Thick porridge (does not run off spoon), smooth purees</td>
                <td>2 to 3 meals/day + breast milk</td>
                <td>Start 2–3 tablespoons; build to 1/2 cup</td>
              </tr>
              <tr>
                <td><strong>9 to 11 Months</strong></td>
                <td>Finely chopped or mashed foods, finger foods</td>
                <td>3 to 4 meals/day + 1 snack</td>
                <td>1/2 cup to 3/4 cup</td>
              </tr>
              <tr>
                <td><strong>12 to 23 Months</strong></td>
                <td>Family foods, bite-sized cuts</td>
                <td>3 to 4 meals/day + 2 healthy snacks</td>
                <td>3/4 cup to 1 full cup</td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
      quiz: [
        {
          id: 'q4-1',
          question: 'How should the consistency of complementary porridge (lugaw) be for a 7-month-old infant?',
          options: [
            'Very watery so it drips immediately from the spoon like soup',
            'Thick enough that it stays on the spoon and does not easily slide off',
            'Hard and dry like regular uncooked rice',
            'Mixed with carbonated drinks'
          ],
          answerIndex: 1,
          explanation: 'Watery lugaw fills the baby’s stomach with water rather than nutrients. Thick porridge provides concentrated energy and nutrients.'
        }
      ]
    },

    {
      id: 'mod-5',
      number: 'Module 5',
      title: 'Hygiene, Water & Safe Food Preparation',
      duration: '8 mins',
      difficulty: 'Essential',
      summary: 'Prevent diarrhea and intestinal infections (environmental enteropathy) that block nutrient absorption and cause stunting.',
      objectives: [
        'Identify proper handwashing times before preparing food and feeding children.',
        'Ensure clean, safe drinking water using boiling or chlorination.',
        'Prevent cross-contamination during food storage at home.'
      ],
      content: `
        <h3>Clean Food = Healthy Absorption</h3>
        <p>Even the most nutritious food will not help a child grow if frequent bouts of diarrhea wash nutrients out of their body. Recurrent intestinal infections cause gut inflammation, preventing nutrient absorption.</p>

        <div class="calculator-result-box">
          <h4 style="color:#0E3D26;">5 Critical Times for Handwashing with Soap:</h4>
          <ol style="margin-left: 1.25rem; line-height: 1.7; margin-top: 0.5rem;">
            <li>Before preparing food or cooking.</li>
            <li>Before feeding a baby or eating.</li>
            <li>After cleaning a baby's bottom or changing diapers.</li>
            <li>After using the toilet or latrine.</li>
            <li>After handling poultry, livestock, or garbage.</li>
          </ol>
        </div>
      `,
      quiz: [
        {
          id: 'q5-1',
          question: 'How does repeated diarrhea directly contribute to child stunting?',
          options: [
            'It makes children sleep longer',
            'It damages the gut lining and prevents the body from absorbing essential nutrients',
            'It has no effect on child growth',
            'It only causes temporary hair loss'
          ],
          answerIndex: 1,
          explanation: 'Repeated bouts of diarrhea and gut inflammation (environmental enteropathy) prevent children from absorbing proteins and minerals, directly triggering stunting.'
        }
      ]
    }
  ],

  // Affordable Local Philippine Recipes (Budget-Friendly Go-Grow-Glow Meals)
  recipes: [
    {
      id: 'rec-1',
      title: 'Enriched Ginataang Monggo with Malunggay & Dilis',
      costPerServing: '₱28 / serving',
      targetAge: '8+ months & Family',
      prepTime: '25 mins',
      foodGroups: {
        go: 'Rice / Sweet Potato',
        grow: 'Mung beans (Monggo) & Dried Anchovies (Dilis)',
        glow: 'Malunggay leaves & Fresh Tomatoes'
      },
      ingredients: [
        '1/2 cup cooked monggo beans (mashed for toddlers)',
        '2 tbsp powdered or pounded dilis (calcium-rich)',
        '1 cup fresh malunggay leaves',
        '1/4 cup coconut milk (healthy fats for brain development)',
        '1 small clove garlic & 1/2 tomato'
      ],
      steps: [
        'Boil monggo until tender and mash for infant consistency.',
        'Lightly saute garlic and tomato in a teaspoon of oil.',
        'Add coconut milk and pounded dilis, simmering for 5 minutes.',
        'Stir in fresh malunggay leaves during the last 2 minutes.',
        'Serve warm with soft rice or mashed camote.'
      ],
      keyNutrients: 'High Iron, Zinc, Calcium, Plant & Fish Protein, Healthy Fats'
    },
    {
      id: 'rec-2',
      title: 'Camote-Egg Mash with Steamed Kalabasa',
      costPerServing: '₱22 / serving',
      targetAge: '6 to 11 months',
      prepTime: '15 mins',
      foodGroups: {
        go: 'Yellow Camote (Sweet Potato)',
        grow: 'Boiled Egg Yolk',
        glow: 'Steamed Kalabasa (Squash)'
      },
      ingredients: [
        '1/2 medium yellow sweet potato (camote)',
        '1/4 cup sliced kalabasa',
        '1 hardboiled egg yolk',
        '1 tsp breast milk or clean warm water',
        '1/2 tsp coconut or vegetable oil (for vitamin A absorption)'
      ],
      steps: [
        'Steam camote and kalabasa until fork-tender.',
        'Mash together thoroughly with a fork.',
        'Blend in the cooked egg yolk and a drop of healthy cooking oil.',
        'Thin with breast milk or warm water to desired consistency.'
      ],
      keyNutrients: 'Beta-Carotene (Vitamin A), Choline for Brain Growth, Healthy Calories'
    },
    {
      id: 'rec-3',
      title: 'NutriLugaw with Tilapia Flakes & Malunggay',
      costPerServing: '₱32 / serving',
      targetAge: '9+ months & Toddlers',
      prepTime: '20 mins',
      foodGroups: {
        go: 'Thick Rice Porridge',
        grow: 'Fresh Tilapia / Bangus flakes',
        glow: 'Finely minced Malunggay & Ginger'
      },
      ingredients: [
        '1/2 cup thick cooked rice porridge',
        '2 tbsp flaked steamed tilapia (carefully deboned)',
        '1 tbsp finely chopped malunggay leaves',
        'A tiny slice of ginger (remove before feeding)',
        '1/2 tsp oil'
      ],
      steps: [
        'Steam the tilapia fish and meticulously inspect for bones.',
        'Flake the fish finely.',
        'Stir fish flakes and chopped malunggay into hot simmering lugaw.',
        'Cook for 3 minutes until leaves soften.',
        'Cool to body temperature before feeding the toddler.'
      ],
      keyNutrients: 'Lean Fish Protein, Omega-3 Fatty Acids, Vitamin C, Iron'
    },
    {
      id: 'rec-4',
      title: 'Saba Banana & Peanut Butter Mash',
      costPerServing: '₱18 / serving',
      targetAge: '8 to 23 months (Snack)',
      prepTime: '5 mins',
      foodGroups: {
        go: 'Ripe Saba Banana',
        grow: 'Natural Peanut Butter / Crushed Peanuts',
        glow: 'Ripe Papaya cubes'
      },
      ingredients: [
        '1 ripe boiled or baked saba banana',
        '1 tsp plain creamy peanut butter (no added sugar)',
        '2 tbsp mashed ripe papaya'
      ],
      steps: [
        'Boil saba banana until soft, then mash smoothly with a fork.',
        'Mix in creamy peanut butter for concentrated healthy fats and protein.',
        'Top with mashed papaya for sweetness and digestion support.'
      ],
      keyNutrients: 'Potassium, Dietary Fiber, Energy-Dense Healthy Fats'
    }
  ],

  // Initial Sample Children Malnutrition Registry (for Community Health Workers & MHO)
  initialChildren: [
    {
      id: 'ch-101',
      name: 'Miguel Reyes',
      first_name: 'Miguel',
      last_name: 'Reyes',
      ageMonths: 12,
      sex: 'Male',
      parentName: 'Ana Reyes',
      parentPhone: '0917-234-5678',
      barangay: 'Barangay Manguiring',
      zone: 'Zone 5, Barangay Manguiring',
      heightCm: 75.0,
      weightKg: 9.8,
      muacMm: 128,
      status: 'Normal',
      hfaStatus: 'Normal',
      wfhStatus: 'Normal',
      wfaStatus: 'Normal',
      muacStatus: 'Normal',
      dewormingStatus: 'Up to Date',
      dewormingDate: '2026-06-15',
      dewormingNextDate: '2026-12-15',
      improved: false,
      submittedBy: 'Nurse Ana Reyes',
      lastAssessed: '2026-08-22',
      notes: 'Appropriate growth trajectory in Zone 5. Dewormed on schedule.'
    },
    {
      id: 'ch-102',
      name: 'Liam Santos',
      first_name: 'Liam',
      last_name: 'Santos',
      ageMonths: 18,
      sex: 'Male',
      parentName: 'Maria Santos',
      parentPhone: '0918-345-6789',
      barangay: 'Barangay Manguiring',
      zone: 'Zone 1, Barangay Manguiring',
      heightCm: 72.5,
      weightKg: 9.2,
      muacMm: 118,
      status: 'At Risk',
      hfaStatus: 'Normal',
      wfhStatus: 'Normal',
      wfaStatus: 'Underweight',
      muacStatus: 'Moderate',
      dewormingStatus: 'Due for Deworming',
      dewormingDate: '2026-02-10',
      dewormingNextDate: '2026-08-10',
      improved: false,
      submittedBy: 'Nurse Ana Reyes',
      lastAssessed: '2026-08-20',
      notes: 'Monitored under supplementary feeding program. Scheduled for 2nd deworming dose.'
    },
    {
      id: 'ch-103',
      name: 'Sofia Dela Cruz',
      first_name: 'Sofia',
      last_name: 'Dela Cruz',
      ageMonths: 24,
      sex: 'Female',
      parentName: 'Rose Dela Cruz',
      parentPhone: '0919-456-7890',
      barangay: 'Barangay Manguiring',
      zone: 'Zone 3, Barangay Manguiring',
      heightCm: 77.0,
      weightKg: 8.8,
      muacMm: 116,
      status: 'At Risk',
      hfaStatus: 'Normal',
      wfhStatus: 'At Risk',
      wfaStatus: 'Underweight',
      muacStatus: 'Moderate',
      improved: false,
      submittedBy: 'Nurse Ana Reyes',
      lastAssessed: '2026-08-18',
      notes: 'Monitored for slight weight lag in Zone 3.'
    }
  ],

  // Initial Submitted Community Reports for Municipal Health Office
  initialReports: [
    {
      reportId: 'REP-2026-0915',
      barangay: 'Barangay Manguiring',
      chwName: 'BHW Health Center Lead',
      submittedDate: '2026-09-15',
      totalChildren: 45,
      stuntedCount: 4,
      wastedCount: 1,
      underweightCount: 3,
      improvedCount: 8,
      stuntingRate: '8.9%',
      stuntingReductionAchieved: '-2.5%',
      status: 'Verified & Approved',
      notes: 'Baseline malnutrition tracking and infant supplementary feeding in Barangay Manguiring.'
    }
  ],

  // Initial Community & Municipal Announcements
  initialAnnouncements: [
    {
        "id": "ann-1",
        "title": "Community Nutrition Seminar \u2014 September 2026",
        "category": "Seminar",
        "targetZones": "All Zones, Barangay Manguring",
        "targetBarangays": [
            "Barangay Manguiring",
            "Barangay Manguring"
        ],
        "barangay": "Barangay Manguring",
        "content": "The Barangay Manguring Health Center is organizing a community nutrition seminar covering IYCF best practices, malnutrition prevention, and complementary feeding. Parents/Guardians from every zone are invited. Health workers are requested to coordinate attendance with their assigned groups.",
        "eventDate": "Sat, September 5, 2026",
        "relayByDate": "August 29",
        "eventTime": "9:00 AM \u2013 12:00 PM",
        "location": "Barangay Manguring Covered Court, Calabanga",
        "status": "relayed",
        "statusText": "\u2713 Relayed to Parents/Guardians by Nurse Ana Reyes",
        "relayedBy": "Nurse Ana Reyes",
        "authorName": "Dr. Jose Lim",
        "authorRole": "mho",
        "authorDesignation": "Municipal Health Officer",
        "targetAudience": "both",
        "priority": "normal",
        "createdAt": "2026-08-25T08:00:00.000Z",
        "pinned": false
    },
    {
        "id": "ann-2",
        "title": "Monthly Weight Monitoring Drive \u2014 September",
        "category": "Reminder",
        "targetZones": "All Zones, Barangay Manguring",
        "targetBarangays": [
            "Barangay Manguiring",
            "Barangay Manguring"
        ],
        "barangay": "Barangay Manguring",
        "content": "All Health Workers are directed to conduct monthly anthropometric monitoring for enrolled children. Completed weight and height data must be submitted via NutriLearn by September 30, 2026. Parents/Guardians of children flagged as at risk or stunted should be prioritized.",
        "eventDate": "Thu, September 10, 2026",
        "relayByDate": "September 3",
        "eventTime": "8:00 AM \u2013 4:00 PM",
        "location": "Manguring Health Center, Zone 2",
        "status": "overdue",
        "statusText": "Relay overdue",
        "relayedBy": "",
        "authorName": "Dr. Jose Lim",
        "authorRole": "mho",
        "authorDesignation": "Municipal Health Officer",
        "targetAudience": "bhw",
        "priority": "high",
        "createdAt": "2026-08-28T08:00:00.000Z",
        "pinned": false
    },
    {
        "id": "ann-3",
        "title": "Updated WHO IYCF Guidelines 2026 \u2014 Training",
        "category": "Update",
        "targetZones": "Zones 1\u20136, Barangay Manguring",
        "targetBarangays": [
            "Barangay Manguiring",
            "Barangay Manguring"
        ],
        "barangay": "Barangay Manguring",
        "content": "The WHO has released updated Infant and Young Child Feeding (IYCF) guidelines. A briefing for all Health Workers will be held before the content is shared with Parents/Guardians through NutriLearn modules. Attendance is mandatory.",
        "eventDate": "Fri, September 18, 2026",
        "relayByDate": "September 11",
        "eventTime": "1:00 PM \u2013 3:00 PM",
        "location": "Manguring Barangay Hall, Zone 4",
        "status": "overdue",
        "statusText": "Relay overdue",
        "relayedBy": "",
        "authorName": "Dr. Jose Lim",
        "authorRole": "mho",
        "authorDesignation": "Municipal Health Officer",
        "targetAudience": "both",
        "priority": "high",
        "createdAt": "2026-09-02T08:00:00.000Z",
        "pinned": false
    }
  ],

  // Initial "Try It at Home" Practical Self-Report Submissions (Nabugoomu 2015; Kuchenbecker et al. 2017)
  initialTryHomeSubmissions: [
    {
      id: 'sub-1',
      childId: 'ch-102',
      childName: 'Liam Santos',
      parentName: 'Maria Santos',
      parentEmail: 'maria.santos@nutrilearn.ph',
      barangay: 'Barangay Manguiring',
      actionTitle: 'Fresh Malunggay Leaf Boost in Rice Porridge',
      actionCategory: 'Micronutrient Fortification',
      mealType: 'Breakfast',
      dateSubmitted: '2026-10-14',
      timeSubmitted: '08:30 AM',
      ingredientsUsed: 'Lugaw, 1 dakot ng dahon ng Malunggay, 1/2 nilagang itlog',
      childAcceptance: 'Kinain nang buo (Enthusiastic)',
      washPracticesFollowed: ['Naghugas ng kamay gamit ang sabon at malinis na tubig', 'Pinakulo ang inuming tubig'],
      parentNotes: 'Mas naging masarap ang lugaw nang haluan ng dinurog na pula ng itlog at sariwang malunggay. Naubos ni Liam ang 1 mangkok.',
      evaluationStatus: 'Evaluated',
      bhwFeedback: 'Napakagaling, Nanay Maria! Ang malunggay at itlog ay sagana sa iron at protina na mabisang lumalaban sa stunting. Ipagpatuloy ang pagpapakulo ng tubig.',
      evaluatedBy: 'Nurse Ana Reyes (BHW)',
      evaluatedAt: '2026-10-14 10:15 AM'
    },
    {
      id: 'sub-2',
      childId: 'ch-101',
      childName: 'Miguel Reyes',
      parentName: 'Ana Reyes',
      parentEmail: 'ana.reyes@nutrilearn.ph',
      barangay: 'Barangay Manguiring',
      actionTitle: 'Affordable Ginisang Monggo with Dilis',
      actionCategory: 'Plant Protein & Calcium',
      mealType: 'Lunch',
      dateSubmitted: '2026-10-15',
      timeSubmitted: '12:15 PM',
      ingredientsUsed: 'Monggo, pinatuyong dilis (tinik tinanggal), dahon ng ampalaya at kamote',
      childAcceptance: 'Kinain ang kalahati (Moderate)',
      washPracticesFollowed: ['Naghugas ng kamay bago maghanda', 'Naghugas ng kamay bago kumain ang bata'],
      parentNotes: 'Medyo nanibago si Miguel sa lasa ng dahon pero nagustuhan ang sabaw ng monggo at kanin.',
      evaluationStatus: 'Pending Review',
      bhwFeedback: '',
      evaluatedBy: '',
      evaluatedAt: ''
    }
  ]
};

// WHO Simplified Anthropometric Standards for Community Health Workers
const WHO_STANDARDS = {
  // Height-for-Age median & -2 SD thresholds (approximate reference points for 6-24 months)
  heightForAge: {
    6:  { maleCutoff: 63.3, femaleCutoff: 61.2 },
    9:  { maleCutoff: 67.5, femaleCutoff: 65.3 },
    12: { maleCutoff: 71.0, femaleCutoff: 68.9 },
    15: { maleCutoff: 74.1, femaleCutoff: 72.0 },
    18: { maleCutoff: 76.9, femaleCutoff: 74.9 },
    21: { maleCutoff: 79.4, femaleCutoff: 77.5 },
    24: { maleCutoff: 81.7, femaleCutoff: 80.0 }
  },
  // Weight-for-Age median & -2 SD thresholds
  weightForAge: {
    6:  { maleCutoff: 6.4, femaleCutoff: 5.7 },
    9:  { maleCutoff: 7.2, femaleCutoff: 6.5 },
    12: { maleCutoff: 7.7, femaleCutoff: 7.0 },
    15: { maleCutoff: 8.3, femaleCutoff: 7.6 },
    18: { maleCutoff: 8.8, femaleCutoff: 8.1 },
    21: { maleCutoff: 9.2, femaleCutoff: 8.6 },
    24: { maleCutoff: 9.7, femaleCutoff: 9.0 }
  },
  // MUAC thresholds (Mid-Upper Arm Circumference in mm) for ages 6 to 59 months
  muac: {
    severe: 115,  // < 115 mm (Red: SAM - Severe Acute Malnutrition)
    moderate: 125 // 115 - 124 mm (Yellow: MAM - Moderate Acute Malnutrition)
                  // >= 125 mm (Green: Normal)
  }
,
    initialUsers: [
    {
        "id": "usr-1",
        "name": "Nurse Ana Reyes",
        "email": "ana.reyes@nutrilearn.ph",
        "password": "Password123!",
        "role": "chw",
        "displayRole": "Health Worker",
        "location": "Zone 1, Barangay Manguring",
        "barangay": "Barangay Manguring",
        "status": "Active",
        "lastLogin": "Today",
        "registeredDate": "2026-08-10"
    },
    {
        "id": "usr-2",
        "name": "Maria Santos",
        "email": "maria.santos@nutrilearn.ph",
        "password": "Password123!",
        "role": "parent",
        "displayRole": "Parent/Guardian",
        "location": "Zone 1, Barangay Manguring",
        "barangay": "Barangay Manguring",
        "status": "Active",
        "lastLogin": "Today",
        "registeredDate": "2026-08-12"
    },
    {
        "id": "usr-3",
        "name": "Nurse Ben Cruz",
        "email": "ben.cruz@nutrilearn.ph",
        "password": "Password123!",
        "role": "chw",
        "displayRole": "Health Worker",
        "location": "Zone 2, Barangay Manguring",
        "barangay": "Barangay Manguring",
        "status": "Active",
        "lastLogin": "Yesterday",
        "registeredDate": "2026-08-15"
    },
    {
        "id": "usr-4",
        "name": "Linda Mendoza",
        "email": "linda.mendoza@nutrilearn.ph",
        "password": "Password123!",
        "role": "parent",
        "displayRole": "Parent/Guardian",
        "location": "Zone 4, Barangay Manguring",
        "barangay": "Barangay Manguring",
        "status": "Inactive",
        "lastLogin": "12 days ago",
        "registeredDate": "2026-08-18"
    },
    {
        "id": "usr-5",
        "name": "Nurse Carla Lim",
        "email": "carla.lim@nutrilearn.ph",
        "password": "Password123!",
        "role": "chw",
        "displayRole": "Health Worker",
        "location": "Zone 5, Barangay Manguring",
        "barangay": "Barangay Manguring",
        "status": "Active",
        "lastLogin": "2 days ago",
        "registeredDate": "2026-08-20"
    },
    {
        "id": "usr-6",
        "name": "Rose Dela Cruz",
        "email": "rose.delacruz@nutrilearn.ph",
        "password": "Password123!",
        "role": "parent",
        "displayRole": "Parent/Guardian",
        "location": "Zone 3, Barangay Manguring",
        "barangay": "Barangay Manguring",
        "status": "Active",
        "lastLogin": "3 days ago",
        "registeredDate": "2026-08-22"
    },
    {
        "id": "usr-admin",
        "name": "Dr. Jose Lim",
        "email": "mho@nutrilearn.ph",
        "password": "Password123!",
        "role": "mho",
        "displayRole": "Administrator",
        "location": "Barangay Manguring Health Office, Calabanga",
        "barangay": "Barangay Manguring",
        "status": "Active",
        "lastLogin": "Today",
        "registeredDate": "2026-08-01"
    }
]
};