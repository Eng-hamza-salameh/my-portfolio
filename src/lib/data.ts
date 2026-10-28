import type { L } from './i18n';

export const LINKS = {
  email: 'hamzaeng444@gmail.com',
  phone: '+963 986 389 578',
  whatsapp: 'https://wa.me/963986389578',
  github: 'https://github.com/Eng-hamza-salameh',
  linkedin: 'https://www.linkedin.com/in/%D8%AD%D9%85%D8%B2%D8%A9-%D8%B3%D9%84%D8%A7%D9%85%D8%A9-6a2ab9422',
  instagram: 'https://www.instagram.com/_hamza_salameh_',
  facebook: 'https://www.facebook.com/share/19oSrkVRVD/',
  cv: '/Hamza_Salameh_CV.pdf',
  mutqanRepo: 'https://github.com/Eng-hamza-salameh/motqan-app',
  mutqanApk: 'https://expo.dev/artifacts/eas/9N7iuFuggq9lM-tFmNOsUum6gtcnPFUmYpRBDucts_0.apk',
  qmpLive: 'https://Eng-hamza-salameh.github.io/qmp-warehouse-dashboard/',
  qmpRepo: 'https://github.com/Eng-hamza-salameh/qmp-warehouse-dashboard',
};

export const ui = {
  nav: {
    about: { en: 'About', ar: 'نبذة' },
    work: { en: 'Work', ar: 'أعمالي' },
    journey: { en: 'Journey', ar: 'المسيرة' },
    skills: { en: 'Skills', ar: 'المهارات' },
    contact: { en: 'Contact', ar: 'تواصل' },
  },
  cv: { en: 'Download CV', ar: 'تحميل السيرة' },
  seeWork: { en: 'Explore my work', ar: 'استكشف أعمالي' },
  getInTouch: { en: 'Let’s talk', ar: 'لنتحدّث' },
  scroll: { en: 'Scroll', ar: 'مرّر' },
  status: { en: 'Damascus · Available for new opportunities', ar: 'دمشق · متاح لفرص جديدة' },
  eng: { en: 'Eng.', ar: 'م.' },
  first: { en: 'Hamza', ar: 'حمزة' },
  last: { en: 'Salameh', ar: 'سلامة' },
  hello: { en: 'Hello, I’m', ar: 'مرحباً، أنا' },
  roles: {
    en: ['Web Developer', 'Mobile App Developer', 'Informatics Engineer', 'IT Support & Networks'],
    ar: ['مطوّر ويب', 'مطوّر تطبيقات موبايل', 'مهندس معلوماتية', 'دعم فني وشبكات'],
  },
  heroLine: {
    en: 'I turn ideas into polished digital products — modern websites, mobile apps and reliable systems, backed by hands-on IT support experience.',
    ar: 'أحوّل الأفكار إلى منتجات رقمية متقنة — مواقع حديثة، تطبيقات موبايل، وأنظمة يُعتمد عليها، مدعومة بخبرة عملية في الدعم التقني.',
  },
  theme: { en: 'Space theme', ar: 'لون الفضاء' },
  music: { en: 'Music', ar: 'موسيقى' },
  menu: { en: 'Menu', ar: 'القائمة' },
  sections: {
    about: { en: '01 · About', ar: '01 · نبذة' },
    tools: { en: '02 · Toolkit', ar: '02 · أدواتي' },
    work: { en: '03 · Selected work', ar: '03 · أعمال مختارة' },
    journey: { en: '04 · Journey', ar: '04 · المسيرة' },
    skills: { en: '05 · Skills', ar: '05 · المهارات' },
    contact: { en: '06 · Contact', ar: '06 · تواصل' },
  },
};

export const about = {
  title: { en: 'From an idea to a product that works.', ar: 'من الفكرة إلى منتج يعمل بإتقان.' },
  text: {
    en: 'IT engineering assistant from Damascus, now continuing my Informatics Engineering degree at the Syrian Virtual University. I build websites, mobile apps and data-driven systems, with hands-on experience in technical & IT support, customer service and networking fundamentals. I also use AI tools in my projects to work faster and with more precision.',
    ar: 'مساعد مهندس معلوماتية من دمشق، أتابع دراسة هندسة المعلوماتية في الجامعة الافتراضية السورية. أطوّر مواقع وتطبيقات موبايل وأبني أنظمة لإدارة البيانات، ولدي خبرة عملية في الدعم الفني والتقني، وخدمة العملاء، وأساسيات الشبكات. وأوظّف أدوات الذكاء الاصطناعي في مشاريعي لأعمل بسرعة ودقة أعلى.',
  },
  stats: [
    { n: '3', suffix: '', l: { en: 'Featured projects', ar: 'مشاريع مميّزة' } },
    { n: '9', suffix: '+', l: { en: 'Months of hands-on experience', ar: 'أشهر خبرة عملية' } },
    { n: '6', suffix: '', l: { en: 'Certificates', ar: 'شهادات' } },
  ],
  facts: [
    {
      k: { en: 'Education', ar: 'التعليم' },
      v: {
        en: 'Informatics Engineering — Syrian Virtual University (in progress) · IT Engineering Assistant — DTC / UNRWA (2026)',
        ar: 'هندسة المعلوماتية — الجامعة الافتراضية السورية (قيد الدراسة) · مساعد مهندس معلوماتية — معهد دمشق المتوسط DTC / الأونروا (2026)',
      },
    },
    {
      k: { en: 'Experience', ar: 'الخبرة' },
      v: {
        en: 'Technical & IT support · Customer service · Networking fundamentals',
        ar: 'الدعم الفني والتقني · خدمة العملاء · أساسيات الشبكات',
      },
    },
    {
      k: { en: 'Location', ar: 'الموقع' },
      v: { en: 'Damascus, Syria', ar: 'دمشق، سوريا' },
    },
  ],
};

/* Two rows for the toolkit band */
export const toolsDev = [
  'HTML5', 'CSS3', 'JavaScript', 'WordPress', 'Laravel', 'SQL Server', 'MySQL', 'Flutter', 'Dart', 'C#', 'Python', 'Figma',
];
export const toolsIt: L[] = [
  { en: 'Systems Analysis', ar: 'تحليل النظم' },
  { en: 'Technical Support', ar: 'الدعم الفني' },
  { en: 'IT Help Desk', ar: 'دعم تقني' },
  { en: 'Customer Service', ar: 'خدمة العملاء' },
  { en: 'CCNA', ar: 'CCNA' },
  { en: 'Network Management', ar: 'إدارة الشبكات' },
  { en: 'ICDL', ar: 'ICDL' },
  { en: 'MS Office', ar: 'MS Office' },
  { en: 'AI-assisted development', ar: 'التطوير بالذكاء الاصطناعي' },
];

export type Shot = { src: string; kind: 'phone' | 'wide'; alt: L };
export type Project = {
  id: string;
  logo: { type: 'img'; src: string; bg: string } | { type: 'qmp' };
  badge: L;
  name: L;
  sub?: L;
  caption: L;
  problem: L;
  solution: L;
  features: L[];
  role: L;
  /** Technologies used — shown as "Stack" */
  stack?: string[];
  /** Scope keywords, used when the stack is not public */
  scope?: L[];
  shots: Shot[];
  links: { label: L; href: string; kind: 'repo' | 'live' | 'apk' }[];
  note?: L;
};

export const projects: Project[] = [
  {
    id: 'mutqan',
    logo: { type: 'img', src: '/brand/mutqan-logo.webp', bg: '#1e1e1c' },
    badge: { en: 'Mobile app · Solo project', ar: 'تطبيق موبايل · مشروع فردي' },
    name: { en: 'Mutqan', ar: 'متقن' },
    sub: { en: 'formerly Herafi', ar: 'سابقاً «حرفي»' },
    caption: {
      en: 'A mobile app that connects clients with craftsmen and engineers in Syria: compare quotes, negotiate the price, track the worker live and get a warranty on the job.',
      ar: 'تطبيق موبايل يربط الزبون بالحرفي والمهندس والمقاول في سوريا: مقارنة عروض الأسعار، تفاوض على السعر، تتبّع مباشر للحرفي وكفالة على الشغل.',
    },
    problem: {
      en: 'Finding a trusted craftsman depends on word of mouth and random ads. There is no warranty, no way to follow the worker, and craftsmen have no professional place to show their work.',
      ar: 'العثور على حرفي موثوق يعتمد على التوصيات والإعلانات العشوائية. لا كفالة ولا تتبّع للحرفي، والحرفيون بلا منصة مهنية تعرض أعمالهم.',
    },
    solution: {
      en: 'One app that covers the whole job: verified profiles and portfolios, one request sent to several craftsmen, offers to compare, live tracking, a PDF receipt, and a warranty with an admin team that handles complaints.',
      ar: 'تطبيق واحد يغطي دورة الشغل كاملة: ملفات وأعمال موثّقة، طلب واحد يصل لعدة حرفيين، عروض للمقارنة، تتبّع مباشر، إيصال PDF، وكفالة مع فريق إدارة يعالج الشكاوى.',
    },
    features: [
      { en: 'Broadcast a job and compare price quotes', ar: 'بثّ الطلب ومقارنة عروض الأسعار' },
      { en: 'Price negotiation in rounds', ar: 'تفاوض على السعر بجولات' },
      { en: 'Live tracking on the map', ar: 'تتبّع مباشر على الخريطة' },
      { en: 'Warranty, complaints and admin dashboard', ar: 'كفالة وشكاوى ولوحة إدارة' },
      { en: 'Craftsman portfolio with before / after photos', ar: 'معرض أعمال للحرفي مع صور قبل / بعد' },
    ],
    role: { en: 'Solo project · built with AI-assisted development', ar: 'مشروع فردي · مبني بالتطوير بمساعدة الذكاء الاصطناعي' },
    stack: ['React Native (Expo)', 'TypeScript', 'Node.js', 'Express', 'MySQL', 'Socket.IO', 'JWT'],
    shots: [
      { src: '/shots/mutqan-splash.webp', kind: 'phone', alt: { en: 'Splash screen', ar: 'شاشة البداية' } },
      { src: '/shots/mutqan-welcome.webp', kind: 'phone', alt: { en: 'Welcome', ar: 'الترحيب' } },
      { src: '/shots/mutqan-home.webp', kind: 'phone', alt: { en: 'Client home', ar: 'الرئيسية' } },
      { src: '/shots/mutqan-request.webp', kind: 'phone', alt: { en: 'Request price quotes', ar: 'طلب عروض أسعار' } },
      { src: '/shots/mutqan-quotes.webp', kind: 'phone', alt: { en: 'Compare quotes', ar: 'مقارنة العروض' } },
      { src: '/shots/mutqan-tracking.webp', kind: 'phone', alt: { en: 'Live tracking', ar: 'التتبّع المباشر' } },
      { src: '/shots/mutqan-receipt.webp', kind: 'phone', alt: { en: 'PDF receipt', ar: 'الإيصال' } },
      { src: '/shots/mutqan-provider.webp', kind: 'phone', alt: { en: 'Craftsman profile', ar: 'ملف الحرفي' } },
      { src: '/shots/mutqan-admin.webp', kind: 'phone', alt: { en: 'Admin dashboard', ar: 'لوحة الإدارة' } },
    ],
    links: [
      { label: { en: 'Download APK', ar: 'تحميل التطبيق' }, href: LINKS.mutqanApk, kind: 'apk' },
      { label: { en: 'GitHub', ar: 'غيت هاب' }, href: LINKS.mutqanRepo, kind: 'repo' },
    ],
    note: {
      en: 'Built entirely by me with AI-assisted development. Screenshots use demo data.',
      ar: 'نفّذته بالكامل بمفردي بالتطوير بمساعدة الذكاء الاصطناعي. اللقطات على بيانات تجريبية.',
    },
  },
  {
    id: 'wms',
    logo: { type: 'img', src: '/brand/wms-logo.webp', bg: '#ffffff' },
    badge: { en: 'Warehouse system · Group project', ar: 'نظام مستودعات · مشروع جماعي' },
    name: { en: 'Warehouse Management System', ar: 'نظام إدارة المستودعات' },
    sub: { en: 'WMS · for DTC / UNRWA', ar: 'WMS · لمعهد دمشق المتوسط / الأونروا' },
    caption: {
      en: 'A warehouse management system built for Damascus Training Center (DTC), UNRWA. It replaces manual stock tracking with one item-coding scheme, live balances, department-to-warehouse approvals and a full record of every movement.',
      ar: 'نظام إدارة مستودعات منفّذ لمعهد دمشق المتوسط (DTC) التابع للأونروا. يستبدل المتابعة اليدوية للمخزون بترميز موحّد للمواد، وأرصدة لحظية، وموافقات من القسم حتى المستودع، وسجلّ كامل لكل حركة.',
    },
    problem: {
      en: 'Stock was tracked by hand: similar items got mixed up, issues were hard to trace, nobody could see the real balance at any moment, and material requests had no clear approval path.',
      ar: 'كان المخزون يُتابع يدوياً: تشابه الأصناف وتكرارها، صعوبة تتبّع الصرف، ولا أحد يعرف الرصيد الحقيقي في أي لحظة، وطلبات المواد بلا مسار موافقات واضح.',
    },
    solution: {
      en: 'A unified item code and category tree, automatic balance updates, a block on issuing more than the available stock, and a full audit trail of who issued what, to which department, and when.',
      ar: 'رقم مادة موحّد وشجرة تصنيف، تحديث آلي للأرصدة، منع صرف كمية تتجاوز المتاح، وسجلّ تدقيق كامل: من صرف، وماذا، ولأي قسم، ومتى.',
    },
    features: [
      { en: 'Unique item numbers and a category tree', ar: 'أرقام مواد فريدة وشجرة تصنيف' },
      { en: 'Request workflow: department head, then main warehouse', ar: 'دورة طلب: رئيس القسم ثم المستودع الرئيسي' },
      { en: 'Five roles with separate permissions', ar: 'خمسة أدوار بصلاحيات مستقلة' },
      { en: 'Movement documents: receipts, issues, returns, transfers', ar: 'سندات حركة: وارد، صادر، مرتجع، تحويل' },
      { en: 'Stock valuation and reports', ar: 'تقييم المخزون وتقارير' },
    ],
    role: { en: 'Group project · for Damascus Training Center (DTC), UNRWA', ar: 'مشروع جماعي · لمعهد دمشق المتوسط (DTC)، الأونروا' },
    scope: [
      { en: 'Item coding', ar: 'ترميز المواد' },
      { en: 'Approval workflow', ar: 'مسار الموافقات' },
      { en: 'Role-based access', ar: 'صلاحيات حسب الدور' },
      { en: 'Stock movements', ar: 'حركات المخزون' },
      { en: 'Reports', ar: 'التقارير' },
    ],
    shots: [{ src: '/shots/wms-dashboard.webp', kind: 'wide', alt: { en: 'WMS dashboard', ar: 'لوحة التحكم' } }],
    links: [],
    note: {
      en: 'Internal system for DTC / UNRWA — not published online.',
      ar: 'نظام داخلي لمعهد دمشق المتوسط / الأونروا وغير منشور على الإنترنت.',
    },
  },
  {
    id: 'qmp',
    logo: { type: 'qmp' },
    badge: { en: 'Web dashboard · Solo project', ar: 'لوحة ويب · مشروع فردي' },
    name: { en: 'QMP Warehouse Dashboard', ar: 'لوحة مستودعات QMP' },
    sub: { en: 'QMP Building Materials', ar: 'QMP لمواد البناء' },
    caption: {
      en: 'A live trial dashboard for a building-materials company: stock across a main and a sub warehouse, low-stock alerts, movements and reports, in Arabic and English with dark mode.',
      ar: 'لوحة تجريبية حيّة لشركة مواد بناء: مخزون المستودع الرئيسي والفرعي، تنبيهات النقص، الحركات والتقارير، بالعربية والإنجليزية مع وضع داكن.',
    },
    problem: {
      en: 'A company with two warehouses needs one place to see what is in stock, what is running low, and what moved today.',
      ar: 'شركة بمستودعين تحتاج مكاناً واحداً ترى فيه ما هو متوفر، وما هو قريب من النفاد، وما الذي تحرّك اليوم.',
    },
    solution: {
      en: 'An overview page with per-warehouse stock bars, counters for items, today’s movements and items under the minimum, plus tabs for balances, movements, reports, materials and users.',
      ar: 'صفحة نظرة عامة بأشرطة مخزون لكل مستودع وعدّادات للمواد وحركات اليوم والمواد تحت الحد الأدنى، مع تبويبات للأرصدة والحركات والتقارير والمواد والمستخدمين.',
    },
    features: [
      { en: 'Main and sub warehouse view', ar: 'عرض المستودع الرئيسي والفرعي' },
      { en: 'Low-stock and critical alerts', ar: 'تنبيهات النقص والحالات الحرجة' },
      { en: 'Arabic / English with RTL and dark mode', ar: 'عربي / إنجليزي مع RTL ووضع داكن' },
    ],
    role: { en: 'Solo project · built for QMP', ar: 'مشروع فردي · مبني لشركة QMP' },
    stack: ['HTML5', 'CSS3', 'JavaScript'],
    shots: [{ src: '/shots/qmp-dashboard.webp', kind: 'wide', alt: { en: 'QMP overview', ar: 'النظرة العامة' } }],
    links: [
      { label: { en: 'Live demo', ar: 'تجربة مباشرة' }, href: LINKS.qmpLive, kind: 'live' },
      { label: { en: 'GitHub', ar: 'غيت هاب' }, href: LINKS.qmpRepo, kind: 'repo' },
    ],
  },
];

export type Step = { when: L; title: L; org: L; text: L };
export type StepGroup = { id: 'edu' | 'work' | 'vol'; title: L; steps: Step[] };

export const journey: StepGroup[] = [
  {
    id: 'edu',
    title: { en: 'Education', ar: 'التعليم' },
    steps: [
      {
        when: { en: '2026', ar: '2026' },
        title: { en: 'IT Engineering Assistant', ar: 'مساعد مهندس معلوماتية' },
        org: { en: 'Damascus Training Center (DTC) · UNRWA', ar: 'معهد دمشق المتوسط (DTC) · الأونروا' },
        text: { en: 'Graduated from the Information Technology (IT) department.', ar: 'تخرّجت من قسم المعلوماتية (IT).' },
      },
      {
        when: { en: 'Now', ar: 'الآن' },
        title: { en: 'Informatics Engineering', ar: 'هندسة المعلوماتية' },
        org: { en: 'Syrian Virtual University · Damascus', ar: 'الجامعة الافتراضية السورية · دمشق' },
        text: {
          en: 'Continuing my engineering degree to deepen my foundations in software and systems.',
          ar: 'أتابع دراسة الهندسة لتعميق أسسي في البرمجيات والأنظمة.',
        },
      },
    ],
  },
  {
    id: 'work',
    title: { en: 'Experience', ar: 'الخبرة العملية' },
    steps: [
      {
        when: { en: '2 months', ar: 'شهران' },
        title: { en: 'IT Support Center Trainee', ar: 'متدرّب في مركز الدعم التقني' },
        org: { en: 'Sarafand School · DTC / UNRWA', ar: 'مدرسة صرفند · DTC / الأونروا' },
        text: { en: 'Diagnosed and fixed a wide range of IT issues.', ar: 'تشخيص وحل مجموعة واسعة من أعطال تقنية المعلومات.' },
      },
      {
        when: { en: '7 months', ar: '7 أشهر' },
        title: { en: 'IT Support & Customer Service Trainee', ar: 'متدرّب دعم تقني وخدمة عملاء' },
        org: { en: 'Dash Net Company', ar: 'شركة داش نت' },
        text: {
          en: 'Resolved client network issues and supervised the team’s daily support work.',
          ar: 'حلّ مشاكل الشبكات للعملاء والإشراف على سير عمل فريق الدعم اليومي.',
        },
      },
    ],
  },
  {
    id: 'vol',
    title: { en: 'Volunteering & events', ar: 'التطوّع والفعاليات' },
    steps: [
      {
        when: { en: 'Volunteer', ar: 'تطوّع' },
        title: { en: 'Community Engagement Specialist', ar: 'أخصائي مشاركة مجتمعية' },
        org: { en: 'EMBS Company', ar: 'شركة EMBS' },
        text: {
          en: 'Helped organise the “UNRWA First SparkTech” tech event.',
          ar: 'ساهمت في تنظيم فعالية «UNRWA First SparkTech» التقنية.',
        },
      },
      {
        when: { en: 'Aug 2026', ar: 'آب 2026' },
        title: { en: '“Next Step” event', ar: 'فعالية «الخطوة التالية»' },
        org: { en: 'You Can Foundation · Ministry of Social Affairs and Labour', ar: 'مؤسسة يو كان · وزارة الشؤون الاجتماعية والعمل' },
        text: { en: 'Self-discovery, leadership and entrepreneurship.', ar: 'اكتشاف الذات والقيادة وريادة الأعمال.' },
      },
    ],
  },
];

export const certs: L[] = [
  { en: 'English — Intermediate (DTC)', ar: 'اللغة الإنجليزية — متوسط (DTC)' },
  { en: 'Customer Service — Dash Net', ar: 'خدمة العملاء — داش نت' },
  { en: 'IT Support — Sarafand / DTC · UNRWA', ar: 'الدعم التقني — صرفند / DTC · UNRWA' },
  { en: 'Volunteering — EMBS', ar: 'التطوّع — EMBS' },
  { en: 'Entrepreneurship — DTC', ar: 'ريادة الأعمال — DTC' },
  { en: 'Computer Applications — DTC', ar: 'تطبيقات حاسوبية — DTC' },
];

export type Skill = { name: L; level: L };
const s = (name: string, en: string, ar: string): Skill => ({ name: { en: name, ar: name }, level: { en, ar } });
const PRACTICAL = ['Practical', 'عملي'] as const;
const BASICS = ['Basics', 'أساسيات'] as const;

export const skillGroups: { title: L; items: Skill[] }[] = [
  {
    title: { en: 'Web', ar: 'الويب' },
    items: [
      s('HTML5', 'Advanced', 'متقدّم'),
      s('WordPress', 'Intermediate', 'متوسط'),
      s('CSS3', ...BASICS),
      s('Laravel', 'Foundational', 'تأسيسي'),
      s('JavaScript', 'Learning', 'قيد التعلّم'),
    ],
  },
  {
    title: { en: 'Systems analysis & design', ar: 'تحليل وتصميم النظم' },
    items: [
      { name: { en: 'Systems analysis', ar: 'تحليل النظم' }, level: { en: PRACTICAL[0], ar: PRACTICAL[1] } },
      { name: { en: 'Requirements gathering', ar: 'جمع المتطلبات' }, level: { en: PRACTICAL[0], ar: PRACTICAL[1] } },
      { name: { en: 'Database design (ERD)', ar: 'تصميم قواعد البيانات (ERD)' }, level: { en: PRACTICAL[0], ar: PRACTICAL[1] } },
      { name: { en: 'UML diagrams', ar: 'مخططات UML' }, level: { en: BASICS[0], ar: BASICS[1] } },
    ],
  },
  {
    title: { en: 'Databases', ar: 'قواعد البيانات' },
    items: [s('SQL Server', 'Expert', 'خبير'), s('MySQL', 'Expert', 'خبير')],
  },
  {
    title: { en: 'Software & Mobile', ar: 'البرمجيات والموبايل' },
    items: [s('Flutter', ...BASICS), s('Dart', ...BASICS), s('C# Windows Forms', ...BASICS), s('Python', ...BASICS)],
  },
  {
    title: { en: 'Networking & IT support', ar: 'الشبكات والدعم التقني' },
    items: [
      s('CCNA (Routing & Switching)', ...BASICS),
      { name: { en: 'Network management', ar: 'إدارة الشبكات' }, level: { en: PRACTICAL[0], ar: PRACTICAL[1] } },
      { name: { en: 'IT help desk', ar: 'الدعم الفني' }, level: { en: PRACTICAL[0], ar: PRACTICAL[1] } },
      { name: { en: 'Customer service', ar: 'خدمة العملاء' }, level: { en: PRACTICAL[0], ar: PRACTICAL[1] } },
      s('ICDL', 'Theory & practice', 'عملي ونظري'),
    ],
  },
  {
    title: { en: 'Design & Office', ar: 'التصميم والمكتب' },
    items: [s('Figma UI/UX', ...PRACTICAL), s('MS Office', 'Advanced', 'متقدّم')],
  },
  {
    title: { en: 'Artificial intelligence', ar: 'الذكاء الاصطناعي' },
    items: [
      { name: { en: 'AI tools in my projects', ar: 'أدوات الذكاء الاصطناعي في مشاريعي' }, level: { en: 'Daily', ar: 'يومي' } },
      { name: { en: 'AI-assisted development', ar: 'التطوير بمساعدة الذكاء الاصطناعي' }, level: { en: PRACTICAL[0], ar: PRACTICAL[1] } },
    ],
  },
];

export const contactText = {
  title: { en: 'Let’s build something great together.', ar: 'لنصنع شيئاً مميّزاً معاً.' },
  text: {
    en: 'Have a project idea, a job opportunity, or need reliable technical support? Don’t hesitate to reach out — I read every message and reply quickly. I’d love to hear what you have in mind.',
    ar: 'عندك فكرة مشروع، فرصة عمل، أو تحتاج دعماً تقنياً موثوقاً؟ لا تتردد بالتواصل معي — أقرأ كل رسالة وأرد بسرعة، ويسعدني أن أسمع فكرتك.',
  },
  badge: { en: 'Usually replies within a few hours', ar: 'عادةً أرد خلال ساعات قليلة' },
  name: { en: 'Your name', ar: 'اسمك' },
  reach: { en: 'Your email or phone', ar: 'إيميلك أو رقمك' },
  msg: { en: 'Tell me about your idea…', ar: 'احكِ لي عن فكرتك…' },
  viaEmail: { en: 'Send by email', ar: 'أرسل بالإيميل' },
  viaWa: { en: 'Send on WhatsApp', ar: 'أرسل بالواتساب' },
  copy: { en: 'Copy email', ar: 'نسخ الإيميل' },
  copied: { en: 'Copied', ar: 'تم النسخ' },
  note: {
    en: 'This opens your email app or WhatsApp with the message ready. Nothing is stored.',
    ar: 'يفتح تطبيق الإيميل أو الواتساب والرسالة جاهزة. لا يتم حفظ أي شيء.',
  },
  required: { en: 'Please write a message first.', ar: 'اكتب رسالة أولاً.' },
  subject: { en: 'Portfolio message', ar: 'رسالة من الموقع' },
  reachLabel: { en: 'Contact', ar: 'للتواصل' },
};

export const modalText = {
  problem: { en: 'The problem', ar: 'المشكلة' },
  solution: { en: 'The solution', ar: 'الحل' },
  features: { en: 'Highlights', ar: 'أبرز الميزات' },
  stack: { en: 'Technologies', ar: 'التقنيات' },
  scope: { en: 'Scope', ar: 'نطاق النظام' },
  caseStudy: { en: 'Case study', ar: 'تفاصيل المشروع' },
  close: { en: 'Close', ar: 'إغلاق' },
  prev: { en: 'Previous', ar: 'السابق' },
  next: { en: 'Next', ar: 'التالي' },
};

/** Space themes: CSS accents + the nebula palette painted by the 3D background. */
export type Theme = {
  id: string;
  name: L;
  a: string; // accent
  b: string; // accent2
  /** nebula colours: deep, mid, bright, highlight */
  neb: [string, string, string, string];
  density: number;
};
export const themes: Theme[] = [
  { id: 'nebula', name: { en: 'Nebula', ar: 'سديم' }, a: '#a78bfa', b: '#f472b6', neb: ['#1a0838', '#7b1d8c', '#e0479e', '#38d6e8'], density: 1 },
  { id: 'milkyway', name: { en: 'Milky Way', ar: 'درب التبانة' }, a: '#5eead4', b: '#93c5fd', neb: ['#031a22', '#0d5560', '#7fb8d8', '#e4b7d6'], density: 0.85 },
  { id: 'deep', name: { en: 'Deep space', ar: 'الفضاء العميق' }, a: '#60a5fa', b: '#818cf8', neb: ['#02040e', '#0b1c55', '#2e5bd8', '#9fb8ff'], density: 0.5 },
  { id: 'aurora', name: { en: 'Aurora', ar: 'شفق' }, a: '#34d399', b: '#22d3ee', neb: ['#021612', '#0a5a45', '#1fc29a', '#9df5ff'], density: 0.8 },
  { id: 'solar', name: { en: 'Solar', ar: 'شمسي' }, a: '#fbbf24', b: '#fb7185', neb: ['#160805', '#6b1d10', '#e2622a', '#ffd27a'], density: 0.85 },
  { id: 'crimson', name: { en: 'Crimson', ar: 'قرمزي' }, a: '#fb7185', b: '#c084fc', neb: ['#14040c', '#6d0f35', '#d6336c', '#b98cff'], density: 0.9 },
];
