export const teamBuildingStats = [
  { value: '500+', label: 'TEAMS HOSTED' },
  { value: '50+', label: 'COMPANIES' },
  { value: '100%', label: 'CUSTOM' },
] as const

export const pillars = [
  {
    number: '01',
    icon: 'game-icons:puzzle',
    title: 'CUSTOMIZABLE PROGRAMS',
    desc: "We work with you to create an experience that aligns with your company's goals — leadership, communication, or pure team bonding.",
  },
  {
    number: '02',
    icon: 'game-icons:team-idea',
    title: 'EXPERT FACILITATORS',
    desc: 'Our experienced team guides participants through exercises that challenge critical thinking and drive real collaboration.',
  },
  {
    number: '03',
    icon: 'game-icons:flag-objective',
    title: 'STATE-OF-THE-ART FIELDS',
    desc: 'Expansive outdoor fields designed to simulate real-life scenarios requiring quick thinking and team coordination.',
  },
  {
    number: '04',
    icon: 'solar:gift-bold',
    title: 'ALL-INCLUSIVE PACKAGES',
    desc: 'Equipment, catering, post-event analysis, and trophies for the winning team. Everything covered, nothing to worry about.',
  },
] as const

export const programs = [
  {
    id: 'strategy',
    icon: 'game-icons:crossed-swords',
    title: 'STRATEGY & COMMUNICATION',
    desc: 'Teams complete a series of objectives requiring clear communication and strategic planning. Perfect for enhancing problem-solving and ensuring every voice is heard.',
    tag: 'MOST POPULAR' as const,
    tagColor: '#E8001C',
    variant: 'red' as const,
  },
  {
    id: 'leadership',
    icon: 'game-icons:crown',
    title: 'LEADERSHIP DEVELOPMENT',
    desc: 'Identify and develop leadership qualities within your team. Participants take on roles that test their ability to lead under pressure.',
    tag: null,
    tagColor: undefined,
    variant: 'default' as const,
  },
  {
    id: 'trust',
    icon: 'game-icons:shield',
    title: 'TRUST BUILDING',
    desc: 'Through trust-based exercises, we help your team break down barriers and build stronger, more reliable relationships.',
    tag: null,
    tagColor: undefined,
    variant: 'default' as const,
  },
  {
    id: 'competition',
    icon: 'game-icons:trophy',
    title: 'COLLABORATIVE COMPETITIONS',
    desc: 'Friendly, high-energy competitions that require collaboration and quick thinking. Boosts morale and fosters healthy competitive spirit.',
    tag: null,
    tagColor: undefined,
    variant: 'default' as const,
  },
  {
    id: 'problem',
    icon: 'game-icons:brain',
    title: 'PROBLEM-SOLVING WORKSHOPS',
    desc: 'Challenge your team to think outside the box and develop creative solutions. Ideal for improving critical thinking and innovation.',
    tag: null,
    tagColor: undefined,
    variant: 'default' as const,
  },
  {
    id: 'custom',
    icon: 'solar:settings-bold',
    title: 'CUSTOMIZED CHALLENGES',
    desc: "Have something specific in mind? We create fully custom challenges that target your company's unique needs and culture.",
    tag: 'FULLY CUSTOM' as const,
    tagColor: '#FFD700',
    variant: 'gold' as const,
  },
] as const

export const games = [
  { name: 'BLANKET BALL HOLE', icon: 'game-icons:bulls-eye', desc: 'Precision and teamwork combined.' },
  { name: 'THE MAZE BALL', icon: 'game-icons:maze', desc: 'Navigate together or fail together.' },
  { name: 'PUTTER BALL', icon: 'game-icons:golf-flag', desc: 'Mini golf meets team challenge.' },
  { name: 'SHOOTING TARGETS', icon: 'game-icons:target-arrows', desc: 'Sharpen your aim and focus.' },
  { name: 'VOLLEY PONG', icon: 'game-icons:ping-pong', desc: 'High energy rally game.' },
  { name: 'SNAKE BALL', icon: 'game-icons:snake', desc: 'Coordination under pressure.' },
  { name: 'CORNHOLE', icon: 'game-icons:cornhole', desc: 'Classic aim and accuracy.' },
  { name: 'HUMAN BABYFOOT', icon: 'game-icons:soccer-ball', desc: 'Full body foosball madness.' },
] as const

export const processSteps = [
  {
    n: 1,
    title: 'CONTACT US',
    desc: 'Tell us your team size, goals, and date.',
    icon: 'solar:phone-calling-bold',
  },
  {
    n: 2,
    title: 'WE DESIGN YOUR PROGRAM',
    desc: 'Our team builds a custom experience around your objectives.',
    icon: 'solar:clipboard-list-bold',
  },
  {
    n: 3,
    title: 'GAME DAY',
    desc: 'Arrive, gear up, and let the mission begin.',
    icon: 'game-icons:crossed-swords',
  },
  {
    n: 4,
    title: 'POST-EVENT ANALYSIS',
    desc: 'We debrief, award trophies, and share insights.',
    icon: 'game-icons:trophy',
  },
] as const

export const tbTestimonials = [
  {
    id: 1,
    quote:
      'An unforgettable day that transformed how our team communicates. The facilitators were professional and the activities were brilliantly designed.',
    name: 'Sarah M.',
    role: 'HR Director, TechCorp Tunisia',
    companyInitial: 'T',
  },
  {
    id: 2,
    quote:
      "We've done many team building activities but Paintball Sousse was on another level. Our team is still talking about it months later.",
    name: 'Ahmed B.',
    role: 'CEO, StartupHub Sousse',
    companyInitial: 'S',
  },
  {
    id: 3,
    quote:
      'Perfect from start to finish. The custom program they built for us was exactly what we needed to break down silos between departments.',
    name: 'Leila K.',
    role: 'Operations Manager, MedGroup',
    companyInitial: 'M',
  },
] as const

export const teamSizeOptions = ['6–10', '10–20', '20–50', '50+'] as const
export const programInterestOptions = [
  'Strategy & Comm',
  'Leadership',
  'Trust',
  'Competition',
  'Custom',
  'Not sure',
] as const
export const budgetOptions = ['Under 300 TND', '300–600 TND', '600+ TND', 'Flexible'] as const
