-- ==============================================================================
-- NUTRILEARN - SUPABASE DATABASE SCHEMA SETUP
-- Aligned with Thesis Chapter 3.4 & 3.5 (Entity-Relationship & Class Diagrams)
-- Patakbuhin ito sa Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Table: System Users & Roles (ERD Entity: User)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'parent', -- 'parent', 'chw', 'mho'
    barangay TEXT DEFAULT 'Barangay Manguiring',
    -- Passwords are never stored in plain text (Chapter 2.2): salted PBKDF2-SHA256
    password_hash TEXT,
    password_salt TEXT,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table: Children Profile & Monitoring (ERD Entity: Child)
CREATE TABLE IF NOT EXISTS public.children (
    id TEXT PRIMARY KEY,
    name TEXT,
    first_name TEXT,
    last_name TEXT,
    birth_date DATE,
    age_months INTEGER DEFAULT 0,
    sex TEXT DEFAULT 'Male',
    parent_user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    parent_name TEXT,
    parent_phone TEXT,
    barangay TEXT DEFAULT 'Barangay Manguiring',
    zone TEXT DEFAULT 'Zone 1',
    height_cm NUMERIC(5,2) DEFAULT 0.0,
    weight_kg NUMERIC(5,2) DEFAULT 0.0,
    muac_mm INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Normal',
    hfa_status TEXT DEFAULT 'Normal',
    wfh_status TEXT DEFAULT 'Normal',
    wfa_status TEXT DEFAULT 'Normal',
    muac_status TEXT DEFAULT 'Normal',
    deworming_status TEXT DEFAULT 'Up to Date',
    deworming_date DATE,
    deworming_next_date DATE,
    improved BOOLEAN DEFAULT FALSE,
    submitted_by TEXT DEFAULT 'Nurse Ana Reyes',
    last_assessed DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table: Child Growth History Records (ERD Entity: Growth Record)
CREATE TABLE IF NOT EXISTS public.growth_records (
    id TEXT PRIMARY KEY,
    child_id TEXT REFERENCES public.children(id) ON DELETE CASCADE,
    recorded_by_user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    record_date DATE DEFAULT CURRENT_DATE,
    weight_kg NUMERIC(5,2) NOT NULL,
    height_cm NUMERIC(5,2) NOT NULL,
    muac_mm INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Table: Child Deworming Records (ERD Entity: Deworming Record)
CREATE TABLE IF NOT EXISTS public.deworming_records (
    id TEXT PRIMARY KEY,
    child_id TEXT REFERENCES public.children(id) ON DELETE CASCADE,
    record_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Table: Parent Groups (ERD Entity: Parent Group)
CREATE TABLE IF NOT EXISTS public.parent_groups (
    id TEXT PRIMARY KEY,
    name TEXT,
    barangay TEXT DEFAULT 'Barangay Manguiring',
    target_category TEXT,
    facilitator TEXT,
    scheduled_date DATE,
    scheduled_time TEXT,
    venue TEXT DEFAULT 'Barangay Health Center',
    assigned_modules TEXT[],
    enrolled_child_ids TEXT[],
    advice_notes TEXT,
    created_by_user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Table: Group Membership (ERD Entity: Group Membership)
CREATE TABLE IF NOT EXISTS public.group_memberships (
    id TEXT PRIMARY KEY,
    group_id TEXT REFERENCES public.parent_groups(id) ON DELETE CASCADE,
    parent_user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    date_joined DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Table: Educational Nutrition Lessons (ERD Entity: Lesson)
CREATE TABLE IF NOT EXISTS public.lessons (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    status TEXT DEFAULT 'Published',
    created_by_user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Table: Assigned Lessons by Health Workers (ERD Entity: Assigned Lesson)
CREATE TABLE IF NOT EXISTS public.assigned_lessons (
    id TEXT PRIMARY KEY,
    lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
    assigned_by_user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    parent_user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    group_id TEXT REFERENCES public.parent_groups(id) ON DELETE CASCADE,
    assigned_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Table: Parent Learning Progress (ERD Entity: Learning Progress)
CREATE TABLE IF NOT EXISTS public.learning_progress (
    id TEXT PRIMARY KEY,
    parent_user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'In Progress', -- 'In Progress', 'Completed'
    completion_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Table: Practical "Try It at Home" Activities (ERD Entity: Practical Activity)
CREATE TABLE IF NOT EXISTS public.practical_activities (
    id TEXT PRIMARY KEY,
    lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    instructions TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Table: Activity Logs / Action Submissions (ERD Entity: Activity Log & Try Home Submissions)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id TEXT PRIMARY KEY,
    activity_id TEXT REFERENCES public.practical_activities(id) ON DELETE SET NULL,
    parent_user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    completion_date DATE DEFAULT CURRENT_DATE,
    completion_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'Completed',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Table: "Try It at Home" Practical Action Submissions (Nabugoomu 2015; Kuchenbecker 2017)
CREATE TABLE IF NOT EXISTS public.try_home_submissions (
    id TEXT PRIMARY KEY,
    child_id TEXT,
    child_name TEXT,
    parent_name TEXT,
    parent_email TEXT,
    barangay TEXT DEFAULT 'Barangay Manguiring',
    action_title TEXT,
    action_category TEXT,
    meal_type TEXT,
    date_submitted DATE DEFAULT CURRENT_DATE,
    time_submitted TEXT,
    ingredients_used TEXT,
    child_acceptance TEXT,
    wash_practices TEXT[],
    parent_notes TEXT,
    evaluation_status TEXT DEFAULT 'Pending Review',
    bhw_feedback TEXT,
    evaluated_by TEXT,
    evaluated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Table: Meal Planning Templates (ERD Entity: Meal Template)
CREATE TABLE IF NOT EXISTS public.meal_templates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    instructions TEXT,
    created_by_user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. Table: Monthly Nutrition Consolidated Reports
CREATE TABLE IF NOT EXISTS public.monthly_reports (
    id TEXT PRIMARY KEY,
    report_code TEXT UNIQUE,
    barangay TEXT DEFAULT 'Barangay Manguiring',
    chw_name TEXT,
    submitted_date DATE DEFAULT CURRENT_DATE,
    total_children INTEGER DEFAULT 0,
    stunted_count INTEGER DEFAULT 0,
    wasted_count INTEGER DEFAULT 0,
    underweight_count INTEGER DEFAULT 0,
    improved_count INTEGER DEFAULT 0,
    stunting_rate TEXT DEFAULT '0.0%',
    stunting_reduction_achieved TEXT DEFAULT '0.0%',
    status TEXT DEFAULT 'Pending Review',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Table: Follow-up Visits (ERD Entity: Follow-up) — Thesis AD 3.2.2 "schedule follow-up"
CREATE TABLE IF NOT EXISTS public.follow_ups (
    id TEXT PRIMARY KEY,
    child_id TEXT REFERENCES public.children(id) ON DELETE CASCADE,
    scheduled_by_user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    scheduled_date DATE NOT NULL,
    guidance TEXT,
    status TEXT DEFAULT 'Scheduled', -- 'Scheduled', 'Done'
    completed_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. Table: Announcements (ERD Entity: Announcement) — posted by MHO, relayed by BHW
CREATE TABLE IF NOT EXISTS public.announcements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    category TEXT,
    target_audience TEXT,
    barangay TEXT,
    event_date DATE,
    posted_by_user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'Published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. Table: Data Correction Requests (ERD Entity: Correction Request) — Thesis AD 3.2.3
CREATE TABLE IF NOT EXISTS public.correction_requests (
    id TEXT PRIMARY KEY,
    child_id TEXT REFERENCES public.children(id) ON DELETE CASCADE,
    requested_by_user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    assigned_to TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'Open', -- 'Open', 'Resolved'
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 18. Table: Audit Log (Data Requirements 2.3: audit and administration data)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    category TEXT,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Columns used by the app since the workflow update (safe to re-run)
ALTER TABLE public.children ADD COLUMN IF NOT EXISTS next_follow_up_date DATE;
ALTER TABLE public.learning_progress ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.lessons ALTER COLUMN status SET DEFAULT 'draft'; -- 'draft', 'review', 'published', 'archived'
ALTER TABLE public.monthly_reports ADD COLUMN IF NOT EXISTS report_period TEXT;
ALTER TABLE public.monthly_reports ADD COLUMN IF NOT EXISTS child_group TEXT;
ALTER TABLE public.monthly_reports ADD COLUMN IF NOT EXISTS overdue_follow_ups INTEGER DEFAULT 0;
ALTER TABLE public.monthly_reports ADD COLUMN IF NOT EXISTS submitted_by_user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deworming_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assigned_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practical_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.try_home_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.correction_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Upgrade older installs: drop the plain-text password column
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_salt TEXT;
ALTER TABLE public.users DROP COLUMN IF EXISTS password;

-- User accounts: NO anonymous access. RLS is enabled with no policy for the
-- anon/authenticated roles, so only the backend (service-role key, which
-- bypasses RLS) can read or write accounts. The browser never queries this table.
DROP POLICY IF EXISTS "Public Users Access" ON public.users;

-- PROTOTYPE NOTE: the tables below still allow anonymous access because the
-- browser talks to them directly with the anon key and the app does not use
-- Supabase Auth yet. Phase 2 replaces these with per-role policies based on
-- auth.uid() (parents: own children; BHW: assigned barangay; MHO: aggregates).

DROP POLICY IF EXISTS "Public Children Access" ON public.children;
CREATE POLICY "Public Children Access" ON public.children FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public GrowthRecords Access" ON public.growth_records;
CREATE POLICY "Public GrowthRecords Access" ON public.growth_records FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public DewormingRecords Access" ON public.deworming_records;
CREATE POLICY "Public DewormingRecords Access" ON public.deworming_records FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public ParentGroups Access" ON public.parent_groups;
CREATE POLICY "Public ParentGroups Access" ON public.parent_groups FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public GroupMemberships Access" ON public.group_memberships;
CREATE POLICY "Public GroupMemberships Access" ON public.group_memberships FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Lessons Access" ON public.lessons;
CREATE POLICY "Public Lessons Access" ON public.lessons FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public AssignedLessons Access" ON public.assigned_lessons;
CREATE POLICY "Public AssignedLessons Access" ON public.assigned_lessons FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public LearningProgress Access" ON public.learning_progress;
CREATE POLICY "Public LearningProgress Access" ON public.learning_progress FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public PracticalActivities Access" ON public.practical_activities;
CREATE POLICY "Public PracticalActivities Access" ON public.practical_activities FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public ActivityLogs Access" ON public.activity_logs;
CREATE POLICY "Public ActivityLogs Access" ON public.activity_logs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public TryHome Access" ON public.try_home_submissions;
CREATE POLICY "Public TryHome Access" ON public.try_home_submissions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public MealTemplates Access" ON public.meal_templates;
CREATE POLICY "Public MealTemplates Access" ON public.meal_templates FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Reports Access" ON public.monthly_reports;
CREATE POLICY "Public Reports Access" ON public.monthly_reports FOR ALL USING (true) WITH CHECK (true);

-- New workflow tables follow the same prototype access as the tables above
-- (audit_logs is server-only: no anon policy).
DROP POLICY IF EXISTS "Public FollowUps Access" ON public.follow_ups;
CREATE POLICY "Public FollowUps Access" ON public.follow_ups FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Announcements Access" ON public.announcements;
CREATE POLICY "Public Announcements Access" ON public.announcements FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public CorrectionRequests Access" ON public.correction_requests;
CREATE POLICY "Public CorrectionRequests Access" ON public.correction_requests FOR ALL USING (true) WITH CHECK (true);
