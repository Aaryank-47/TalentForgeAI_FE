// ─── Landing Page Centralized Content ──────────────────────────────────────
// All hardcoded arrays, mock data, and config for the landing page live here.
// Components import from this file — never hardcode content inside components.

// ─── Navbar ──────────────────────────────────────────────────────────────────

export const navbarContent = {
  navItems: [
    { label: 'For Recruiters', href: '#recruiter-features', iconKey: 'building' },
    { label: 'For Candidates', href: '#candidate-features', iconKey: 'user-circle' },
    { label: 'Pricing', href: '#pricing', iconKey: 'currency-rupee' },
    { label: 'About', href: '#about', iconKey: 'question-circle' },
  ],
  mobileNavItems: ['For Recruiters', 'For Candidates', 'Pricing', 'About'],
  ctaLoginLabel: 'Log in',
  ctaRegisterLabel: 'Get Started Free',
  ctaRegisterPath: '/signup-role',
  ctaLoginPath: '/login',
};

// ─── Hero ─────────────────────────────────────────────────────────────────────

export const heroContent = {
  badge: 'Now with GPT-4o AI Screening',
  headline1: 'The AI Hiring Platform',
  headline2: 'Built for Both',
  headline3: 'Sides',
  subheadline:
    'TalentForge unifies your entire recruitment workflow — ATS, AI screening, interviews, assessments, and analytics — so recruiters move faster and candidates get a better experience.',
  primaryCTA: { label: "I'm a Recruiter", href: '/register?role=recruiter' },
  secondaryCTA: { label: "I'm a Job Seeker", href: '/register?role=candidate' },
  metrics: [
    { value: '3.5×', label: 'Faster time-to-hire' },
    { value: '92%', label: 'Candidate satisfaction' },
    { value: '10K+', label: 'Teams onboarded' },
  ],
  avatarColors: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'],
  avatarInitials: ['S', 'R', 'K', 'M', 'A'],
  trustText: 'Trusted by 10,000+ hiring teams',
};

// ─── Trusted Companies ────────────────────────────────────────────────────────

export const companiesContent = {
  label: 'Trusted by forward-thinking hiring teams',
  companies: [
    { name: 'OdeaLabs', iconKey: 'layers' },
    { name: 'Kintsugi', iconKey: 'zap' },
    { name: 'StackEd', iconKey: 'building' },
    { name: 'Magnolia', iconKey: 'users' },
    { name: 'Warpspeed', iconKey: 'briefcase' },
    { name: 'Sisyphus', iconKey: 'globe' },
    { name: 'Vertex', iconKey: 'target' },
    { name: 'Nexora', iconKey: 'cpu' },
  ],
};

// ─── Recruiter Features ───────────────────────────────────────────────────────

export const recruiterFeaturesContent = {
  badge: 'For Recruiters',
  headline1: 'Cut time-to-hire in half.',
  headline2: 'Without cutting corners.',
  subheadline:
    'Every recruiter workflow you need — from sourcing to offer — in one unified platform. No more tab-switching between 6 different tools.',
  features: [
    {
      imageKey: 'resume_matching',
      imageAlt: 'AI Resume Matching',
      label: 'AI Resume Matching',
      title: 'Rank 200 resumes in 60 seconds.',
      desc: 'Our LLM-powered engine parses resumes against your job requirements, ranks candidates by fit score, and surfaces the top 10% automatically. Stop scrolling through stacks.',
      color: 'blue',
      stats: [
        { value: '94%', label: 'Match accuracy' },
        { value: '8×', label: 'Faster shortlisting' },
      ],
    },
    {
      imageKey: 'ats_pipeline',
      imageAlt: 'ATS Pipeline',
      label: 'ATS Pipeline',
      title: 'Your entire pipeline, visualized.',
      desc: 'Drag-and-drop Kanban boards, custom hiring stages, team collaboration, and automated stage transitions — all in a clean, intuitive interface your team will actually use.',
      color: 'violet',
      stats: [
        { value: '100%', label: 'Pipeline visibility' },
        { value: '40%', label: 'Less admin time' },
      ],
    },
    {
      imageKey: 'hiring_automation',
      imageAlt: 'Hiring Automation',
      label: 'Hiring Automation',
      title: 'Automate the work that slows you down.',
      desc: 'Set workflow triggers to send rejection emails, schedule interviews, move candidates between stages, and notify hiring managers — without lifting a finger.',
      color: 'cyan',
      stats: [
        { value: '5hrs', label: 'Saved per week' },
        { value: '12×', label: 'Faster follow-ups' },
      ],
    },
    {
      imageKey: 'ai_proctoring',
      imageAlt: 'AI Proctoring',
      label: 'AI Proctoring',
      title: 'Fair assessments. Zero cheating.',
      desc: 'Identity verification, tab-switch detection, gaze tracking, and AI anomaly flagging ensure every assessment is completed fairly and with integrity.',
      color: 'emerald',
      stats: [
        { value: '99%', label: 'Integrity rate' },
        { value: '0', label: 'Manual reviews' },
      ],
    },
  ],
  colorMap: {
    blue: { bg: 'bg-blue-50', border: 'border-blue-100/70', badge: 'bg-blue-100 text-blue-700', stat: 'text-[#2563EB]', glow: 'group-hover:shadow-blue-100/60' },
    violet: { bg: 'bg-violet-50', border: 'border-violet-100/70', badge: 'bg-violet-100 text-violet-700', stat: 'text-[#7C3AED]', glow: 'group-hover:shadow-violet-100/60' },
    cyan: { bg: 'bg-cyan-50', border: 'border-cyan-100/70', badge: 'bg-cyan-100 text-cyan-700', stat: 'text-[#0891B2]', glow: 'group-hover:shadow-cyan-100/60' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-100/70', badge: 'bg-emerald-100 text-emerald-700', stat: 'text-[#059669]', glow: 'group-hover:shadow-emerald-100/60' },
  } as Record<string, { bg: string; border: string; badge: string; stat: string; glow: string }>,
};

// ─── Candidate Features ───────────────────────────────────────────────────────

export const candidateFeaturesContent = {
  badge: 'For Candidates',
  headline1: 'Apply smarter.',
  headline2: 'Get hired faster.',
  subheadline:
    "TalentForge isn't just built for recruiters. We believe candidates deserve a great experience too. Transparent, fast, and fair — from first click to offer letter.",
  ctaLabel: 'Find Your Next Role',
  ctaPath: '/register?role=candidate',
  timelineSteps: [
    { label: 'Applied', time: 'June 10', active: true, done: true },
    { label: 'AI Screening', time: 'June 10', active: true, done: true },
    { label: 'Assessment', time: 'June 12', active: true, done: true },
    { label: 'Interview', time: 'June 14', active: true, done: false },
    { label: 'Offer', time: 'Pending', active: false, done: false },
  ],
  profileTags: [
    { label: 'Skills ✓', color: 'emerald' },
    { label: 'Experience ✓', color: 'emerald' },
    { label: 'Portfolio ↗', color: 'amber' },
  ],
  features: [
    { iconKey: 'search', title: 'Smart Job Discovery', desc: 'AI matches you with roles that fit your skills, experience, and career goals — not just keywords.' },
    { iconKey: 'eye', title: 'Application Tracking', desc: 'Real-time visibility into every application stage. No more wondering what happened after you hit submit.' },
    { iconKey: 'brain', title: 'AI Interview Preparation', desc: 'Practice with AI-generated questions specific to your target role before the real interview.' },
    { iconKey: 'user-check', title: 'Recruiter Visibility', desc: "See which recruiters have viewed your profile. Know when you're being considered." },
    { iconKey: 'trending-up', title: 'Profile Strength Score', desc: 'Get actionable recommendations to strengthen your profile and stand out to recruiters.' },
  ],
};

// ─── ATS Showcase ─────────────────────────────────────────────────────────────

export const atsShowcaseContent = {
  badge: 'ATS Pipeline',
  headline1: 'Your entire pipeline.',
  headline2: 'Zero confusion.',
  subheadline:
    'A next-gen ATS that your team will actually enjoy using. Customizable stages, AI-powered auto-advancement, real-time collaboration, and deep analytics — all in one view.',
  stages: [
    { label: 'Applied', count: 42, color: '#E2E8F0', textColor: '#475569' },
    { label: 'Screening', count: 18, color: '#DBEAFE', textColor: '#2563EB' },
    { label: 'Interview', count: 9, color: '#EDE9FE', textColor: '#7C3AED' },
    { label: 'Final Round', count: 4, color: '#D1FAE5', textColor: '#059669' },
    { label: 'Offer', count: 1, color: '#FEF3C7', textColor: '#D97706' },
  ],
  candidates: [
    { name: 'Sarah Chen', role: 'Sr. Engineer', score: 94, stage: 1, avatar: '#3B82F6' },
    { name: 'Marcus Lee', role: 'Product Designer', score: 88, stage: 1, avatar: '#8B5CF6' },
    { name: 'Priya Nair', role: 'Data Scientist', score: 97, stage: 2, avatar: '#10B981' },
    { name: 'James Ford', role: 'Frontend Dev', score: 81, stage: 0, avatar: '#F59E0B' },
  ],
  animCandidateName: 'Alex Rivera',
  animStageLabels: ['Applied', 'Screening', 'Interview'],
  checklist: [
    'Drag-and-drop Kanban with unlimited custom stages',
    'AI automatically advances top candidates through stages',
    'One-click bulk actions for stage transitions, emails & rejections',
    'Full activity log and audit trail for compliance',
  ],
};

// ─── AI Interview Showcase ────────────────────────────────────────────────────

export const aiInterviewContent = {
  badge: 'AI Interviews',
  headline1: 'First-round interviews.',
  headline2: 'Handled by AI.',
  subheadline:
    'Our AI interviewer conducts natural, adaptive voice and text conversations. It asks follow-up questions, evaluates answers, and gives you a structured report — before you\'ve even opened your laptop.',
  questions: [
    { q: 'Tell me about your experience with distributed systems.', type: 'Technical' },
    { q: 'Describe a time you navigated a major technical disagreement with your team.', type: 'Behavioral' },
    { q: "Walk me through how you'd architect a real-time chat feature at scale.", type: 'System Design' },
  ],
  reportTitle: 'AI-Generated Assessment Report',
  candidateName: 'Sarah Chen',
  candidateRole: 'Sr. Software Engineer Candidate',
  overallScore: 91,
  assessmentScores: [
    { label: 'Technical Depth', score: 95 },
    { label: 'Communication', score: 88 },
    { label: 'Problem Solving', score: 92 },
    { label: 'Culture Fit', score: 87 },
  ],
  featureBullets: [
    { iconKey: 'zap', text: 'Generates structured report instantly after the interview' },
    { iconKey: 'brain', text: 'Scores 15+ competencies automatically, no bias' },
    { iconKey: 'clock', text: 'Available 24/7 — candidates interview on their schedule' },
  ],
};

// ─── Analytics Showcase ───────────────────────────────────────────────────────

export const analyticsContent = {
  badge: 'Hiring Analytics',
  headline1: 'Data that drives',
  headline2: 'better hires.',
  subheadline:
    'Stop guessing why hires are slow. TalentForge surfaces time-to-hire bottlenecks, source quality scores, pipeline conversion rates, and offer decline reasons — in real time.',
  ctaLabel: 'View Sample Dashboard',
  ctaPath: '/register',
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  hired: [8, 12, 10, 18, 22, 28],
  screened: [40, 55, 48, 72, 80, 95],
  countUpTargets: {
    days: { value: 14, duration: 1800, suffix: ' days', label: 'Avg. time-to-hire', trend: '↓ 40%' },
    percent: { value: 68, duration: 1800, suffix: '%', label: 'Offer acceptance rate', trend: '↑ 22%' },
    roi: { value: 38, duration: 1800, divisor: 10, suffix: '×', label: 'ROI on sourcing spend', trend: 'vs industry avg' },
    hour: { value: 1, duration: 800, prefix: '< ', suffix: 'hr', label: 'Avg. screening time', trend: '↓ from 3 days' },
  },
  miniStats: [
    { label: 'Sourced', value: '1,240', iconKey: 'users', bg: 'bg-blue-50' },
    { label: 'Interviewed', value: '186', iconKey: 'video', bg: 'bg-violet-50' },
    { label: 'Hired', value: '98', iconKey: 'award', bg: 'bg-emerald-50' },
  ],
};

// ─── How It Works ─────────────────────────────────────────────────────────────

export const howItWorksContent = {
  badge: 'How It Works',
  headline1: 'From zero to your',
  headline2: 'best hire ever.',
  subheadline:
    'TalentForge is designed to be live in minutes, not months. No implementation consultants required.',
  steps: [
    {
      step: '01',
      imageKey: 'workspace',
      imageClass: 'w-13 h-13',
      title: 'Set Up Your Workspace',
      desc: 'Create your company profile, define hiring stages, and invite your recruiting team in under 10 minutes. No setup fees, no IT required.',
      detail: 'SSO, SCIM provisioning & custom RBAC included on all plans',
    },
    {
      step: '02',
      imageKey: 'jobPost',
      imageClass: 'w-15 h-15',
      title: 'Post & Source Jobs',
      desc: 'AI writes optimized job descriptions and distributes them to LinkedIn, Indeed, and 50+ job boards simultaneously with one click.',
      detail: '50+ job board integrations included out-of-the-box',
    },
    {
      step: '03',
      imageKey: 'ai_interview',
      imageClass: 'w-16 h-16',
      title: 'Let AI Do the Screening',
      desc: 'AI scores resumes, conducts initial interviews, proctors assessments, and surfaces your top 10% of candidates automatically.',
      detail: 'Average 92% recruiter agreement with AI candidate rankings',
    },
    {
      step: '04',
      imageKey: 'hiring_automation',
      imageClass: 'w-16 h-10',
      title: 'Hire & Celebrate',
      desc: "Send offers, collect e-signatures, and trigger onboarding workflows — all from TalentForge. Your team's fastest hire yet.",
      detail: 'Native DocuSign & Rippling integration for seamless offers',
    },
  ],
};

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const testimonialsContent = {
  badge: 'Customer Stories',
  headline1: 'Real teams.',
  headline2: 'Real results.',
  subheadline: "Don't take our word for it. Here's what teams building with TalentForge have to say.",
  reviews: [
    {
      name: 'Sarah Kim', role: 'Head of Talent', company: 'Vertex Systems', avatar: '#3B82F6',
      stars: 5,
      text: 'TalentForge replaced three different tools we were juggling. Our ATS, screening, and scheduling now live in one place. Time-to-hire dropped from 45 to 18 days.',
      metric: '18 days avg. time-to-hire',
    },
    {
      name: 'Marcus Chen', role: 'VP Engineering', company: 'Kintsugi Health', avatar: '#8B5CF6',
      stars: 5,
      text: "The AI interview transcripts are shockingly good. We used to spend 2 hours per candidate on phone screens. Now we spend 20 minutes reviewing the AI's assessment report.",
      metric: '6× faster candidate screening',
    },
    {
      name: 'Priya Nair', role: 'Recruiting Lead', company: 'OdeaLabs', avatar: '#10B981',
      stars: 5,
      text: 'I was skeptical about AI interviews, but candidates actually prefer them — less scheduling anxiety, more flexibility. Our acceptance rate jumped 22% since switching.',
      metric: '22% higher offer acceptance',
    },
    {
      name: 'James Park', role: 'CEO', company: 'Warpspeed AI', avatar: '#F59E0B',
      stars: 5,
      text: "We hired 40 engineers in Q1 with a team of 3 recruiters. That's only possible with TalentForge. The automation and AI does the heavy lifting.",
      metric: '40 engineers hired in Q1',
    },
    {
      name: 'Elena Rodriguez', role: 'CHRO', company: 'Magnolia Finance', avatar: '#EF4444',
      stars: 5,
      text: "The analytics dashboard alone is worth the price. I can now tell our board exactly where hiring bottlenecks are and what we're doing to fix them.",
      metric: 'Real-time pipeline visibility',
    },
    {
      name: 'Omar Shah', role: 'Founder', company: 'StackEd Lab', avatar: '#06B6D4',
      stars: 5,
      text: "Before TalentForge, candidates would wait 2 weeks for an update. Now they get automated status updates and our Glassdoor score went from 3.2 to 4.7.",
      metric: '4.7 Glassdoor rating',
    },
  ],
};

// ─── Pricing ──────────────────────────────────────────────────────────────────

export const pricingContent = {
  badge: 'Pricing',
  headline1: 'Transparent pricing.',
  headline2: 'No surprises.',
  subheadline: '14-day free trial on all plans. No credit card required.',
  enterpriseLogos: ['OdeaLabs', 'Kintsugi', 'Magnolia', 'Warpspeed'],
  plans: [
    {
      name: 'Starter',
      monthlyPrice: 29,
      annualPrice: 23,
      desc: 'For small teams taking their first steps into structured hiring.',
      cta: 'Start Free Trial',
      ctaLink: '/register',
      highlight: false,
      features: [
        '5 active job postings',
        'Up to 3 team members',
        'Core ATS Pipeline',
        'Basic resume parsing',
        'Email templates',
        'Standard support',
      ],
    },
    {
      name: 'Professional',
      monthlyPrice: 79,
      annualPrice: 63,
      desc: 'For growing teams ready to leverage AI for competitive hiring.',
      cta: 'Start Free Trial',
      ctaLink: '/register',
      highlight: true,
      badge: 'Most Popular',
      features: [
        'Unlimited job postings',
        'Up to 20 team members',
        'AI Resume Matching',
        'AI Interview Screening',
        'Hiring Automation',
        'Advanced Analytics',
        'Priority support',
        'All integrations',
      ],
    },
    {
      name: 'Enterprise',
      monthlyPrice: null as number | null,
      annualPrice: null as number | null,
      priceLabel: 'Custom',
      desc: 'For large organizations that need control, compliance, and scale.',
      cta: 'Talk to Sales',
      ctaLink: '/contact',
      highlight: false,
      features: [
        'Unlimited everything',
        'SAML SSO & SCIM',
        'Custom API access',
        'Dedicated CSM',
        'SLA guarantees',
        'Custom security policies',
        'On-premise option',
        'Volume discounts',
      ],
    },
  ],
};

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export const faqContent = {
  badge: 'FAQ',
  headline1: 'Questions?',
  headline2: 'We have answers.',
  subheadline: 'Everything you need to know before you get started.',
  supportEmail: 'hello@talentforge.ai',
  supportPhone: '+1-800-TALENT',
  faqs: [
    { q: 'Can I try TalentForge before paying?', a: 'Yes. All plans come with a 14-day free trial, no credit card required. You get full access to every feature during the trial period.' },
    { q: 'How does the AI resume matching work?', a: 'We use a fine-tuned large language model to semantically parse and compare resumes against your job description. It goes beyond keyword matching to understand context, experience depth, and skill adjacency — generating a weighted fit score for every candidate.' },
    { q: 'Can candidates tell the interviewer is an AI?', a: 'Yes — we believe in full transparency. Every AI-conducted interview clearly identifies itself as AI. Candidates consistently rate the experience highly (4.4/5 average) because of the flexibility and non-judgmental environment.' },
    { q: 'Can I migrate data from another ATS?', a: 'Absolutely. We have direct migration tools for Greenhouse, Lever, Workday, and Taleo. Our implementation team can handle custom migrations for other platforms at no extra cost.' },
    { q: 'Is TalentForge GDPR and SOC 2 compliant?', a: 'Yes. TalentForge is SOC 2 Type II certified and fully GDPR compliant. We offer data processing agreements, candidate data deletion workflows, and EU-based data residency on Enterprise plans.' },
    { q: 'How does pricing scale with team size?', a: 'Our Starter and Professional plans are per-seat per-month. Enterprise plans are negotiated based on hiring volume, team size, and required features. We offer significant volume discounts for annual commitments.' },
    { q: 'What integrations does TalentForge support?', a: 'We integrate with LinkedIn, Indeed, Glassdoor, Slack, Teams, DocuSign, Rippling, Workato, Zapier, and 50+ more. We also offer a full REST API and webhooks for custom integrations.' },
    { q: 'Do you offer solutions for staffing agencies?', a: 'Yes. We offer a white-label version of TalentForge for staffing agencies and RPOs. Contact our sales team for details on multi-tenant deployments and custom branding options.' },
  ],
};

// ─── Final CTA ────────────────────────────────────────────────────────────────

export const finalCTAContent = {
  badge: '14-day free trial · No credit card · Cancel anytime',
  headline1: 'Your next great hire',
  headline2: 'is 14 days away.',
  subheadline: 'Join 10,000+ recruiting teams who cut their time-to-hire in half with TalentForge AI. Setup takes 10 minutes.',
  primaryCTA: { label: 'Start Hiring for Free', href: '/register' },
  secondaryCTA: { label: 'Watch 2-min Demo', href: '#how-it-works' },
  trustBadges: [
    { iconKey: 'shield', label: 'SOC 2 Certified' },
    { iconKey: 'lock', label: 'GDPR Compliant' },
    { iconKey: 'globe', label: 'Global Data Centers' },
    { iconKey: 'award', label: 'G2 Top Rated 2026' },
  ],
};

// ─── Footer ───────────────────────────────────────────────────────────────────

export const footerContent = {
  tagline: 'The AI-powered recruitment platform built for modern teams.',
  copyright: '© 2026 TalentForge AI, Inc. All rights reserved.',
  columns: [
    { heading: 'Product', links: ['ATS Pipeline', 'AI Matching', 'AI Interviews', 'Assessments', 'Analytics', 'Automations', 'Integrations', 'Changelog'] },
    { heading: 'Solutions', links: ['For Startups', 'For Enterprise', 'For Agencies', 'For Tech Teams', 'For HR Leaders', 'Case Studies'] },
    { heading: 'Resources', links: ['Help Center', 'Documentation', 'API Reference', 'Blog', 'Hiring Guide', 'Webinars'] },
    { heading: 'Company', links: ['About Us', 'Careers', 'Press', 'Partners', 'Security', 'Contact'] },
    { heading: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR', 'DPA'] },
  ],
  trustBadges: [
    { iconKey: 'shield', label: 'SOC 2' },
    { iconKey: 'lock', label: 'GDPR' },
    { iconKey: 'globe', label: '🇺🇸 English' },
  ],
};

// ─── Sign Up Role Page ────────────────────────────────────────────────────────

export const signupRoleContent = {
  heading: 'Join TalentForge AI',
  subheading: "Tell us who you are — we'll set up the right experience.",
  roles: [
    {
      key: 'recruiter',
      iconKey: 'building',
      title: 'Recruiter / Hiring Team',
      description: 'Post jobs, manage candidates, run interviews, and hire faster.',
      cta: 'Continue',
      href: '/register?role=recruiter',
    },
    {
      key: 'candidate',
      iconKey: 'user',
      title: 'Job Seeker',
      description: 'Build your profile, discover jobs, apply, and track applications.',
      cta: 'Continue',
      href: '/register?role=candidate',
    },
  ],
};
