// Menu items with `path` link to a dedicated page (real URL, indexable by Google).
// Items without `path` scroll to that section on the homepage (or jump home + scroll).
export const NAV_LINKS: { id: string; label: string; path?: string }[] = [
  { id: "about", label: "About", path: "/about" },
  { id: "services", label: "Services", path: "/services" },
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "faq", label: "FAQ", path: "/faq" },
  { id: "contact", label: "Contact", path: "/contact" },
];

export const CV_PATH = "/Fahad_Al_Noman_CV.pdf";
export const AVATAR_URL = "/avatar_v2.jpg";

export const SERVICES = [
  {
    title: "React & Next.js Development",
    desc: "Building high-performance, responsive frontends and single-page apps with React and Next.js.",
    tag: "<react/>",
  },
  {
    title: "Laravel Web App Development",
    desc: "Custom backends, secure APIs, and robust database architecture using PHP and Laravel.",
    tag: "<laravel/>",
  },
  {
    title: "WordPress Development & Maintenance",
    desc: "Bespoke theme design, plugin customisation, and speed optimization for WordPress and WooCommerce.",
    tag: "<wordpress/>",
  },
  {
    title: "SEO Services for Malta & EU Businesses",
    desc: "Technical audits, on-page optimization, local citations, and digital marketing strategies to rank first on Google.",
    tag: "<seo/>",
  },
  {
    title: "UI/UX Design",
    desc: "Creating clean, modern, and user-focused interfaces that drive visitor engagement and conversions.",
    tag: "<design/>",
  },
  {
    title: "Mobile App Development",
    desc: "Developing native-feeling cross-platform mobile apps for iOS and Android tailored to client needs.",
    tag: "<apps/>",
  },
];

export const EXPERIENCE = [
  {
    role: "Marketing & Technology Coordinator",
    company: "Prochimps LTD",
    period: "Jul 2026 – Present",
    bullets: [
      "Develop and deploy new web projects for the company, handling front-end and back-end delivery.",
      "Maintain and update the company website, ensuring uptime and performance.",
      "Plan and execute Meta (Facebook/Instagram) marketing campaigns to drive brand awareness and generate leads.",
      "Manage website marketing and SEO initiatives to grow online visibility.",
    ],
  },
  {
    role: "Junior DevOps Engineer",
    company: "CartUp LTD",
    period: "Aug 2024 – Feb 2026",
    bullets: [
      "Deployed and managed e-commerce applications on Hostinger VPS servers.",
      "Containerized services with Docker to standardize development and production environments.",
      "Managed repositories and team workflows using GitHub for version control.",
      "Wrote Python scripts to automate daily PostgreSQL backups and enforce retention policies.",
      "Tuned queries, indexed tables, and secured access to keep PostgreSQL performant and reliable.",
      "Hardened servers using firewalls, SSH keys, and secure database connections.",
      "Monitored server, container, and uptime metrics to detect and resolve issues early.",
    ],
  },
  {
    role: "Marketing & Technology Coordinator",
    company: "SAIL Corporation",
    period: "Apr 2022 – Jul 2024",
    bullets: [
      "Designed, developed, and maintained company websites, including the Bonikbazar.com classifieds marketplace (React, Laravel, PostgreSQL).",
      "Planned, built, and launched multiple web properties; ran SEO improvements that grew organic rankings.",
      "Ran digital marketing campaigns (Google Ads + social) on bdproperty.xyz that drove 5M+ visits.",
      "Maintained financial records, tracking sales performance, expenses, purchases, and payables.",
      "Managed VPS infrastructure and databases.",
    ],
  },
  {
    role: "Freelance Full-Stack Web Developer",
    company: "Independent",
    period: "2020 – Present",
    bullets: [
      "Delivered end-to-end website builds for independent clients worldwide.",
      "Currently developing garikinun.com.",
    ],
  },
];

export const SAIL_PROJECTS = [
  {
    name: "Bonikbazar.com",
    url: "https://bonikbazar.com",
    desc: "Classifieds marketplace platform. Full-stack build plus SEO leadership.",
    stack: ["React", "Laravel", "PostgreSQL", "SEO"],
  },
  {
    name: "bdproperty.xyz",
    url: "https://bdproperty.xyz",
    desc: "Property platform; grown via digital ad campaigns that drove 5M+ visits.",
    stack: ["React", "Laravel", "MySQL", "Digital Marketing"],
  },
  {
    name: "Ispondon.com",
    url: "https://ispondon.com",
    desc: "Company web platform.",
    stack: ["React", "Laravel", "MySQL"],
  },
  {
    name: "hideexpo.com",
    url: "https://hideexpo.com",
    desc: "Company web platform.",
    stack: ["React", "Laravel", "MySQL"],
  },
  {
    name: "sailtechbd.com",
    url: "https://sailtechbd.com",
    desc: "Corporate / IT services site.",
    stack: ["WordPress"],
  },
];

export const EU_PROJECTS = [
  {
    name: "infixclean.com",
    url: "https://infixclean.com",
    desc: "Premium cleaning services platform in the EU. Shipped the marketing website, custom admin dashboard, and drove organic growth via SEO & Google Ads campaigns.",
    stack: ["React", "Laravel", "SEO", "Digital Marketing"],
  },
];

export const FREELANCE_PROJECTS = [
  { name: "garikinun.com", url: "https://garikinun.com", desc: "Full build — ongoing / active.", stack: ["Full-Stack"] },
  { name: "bdcare.com.bd", url: "https://bdcare.com.bd", desc: "Full build.", stack: ["Full-Stack"] },
  { name: "rentthecampbell.com", url: "https://rentthecampbell.com", desc: "Full build.", stack: ["Full-Stack"] },
  { name: "onereal.ca", url: "https://onereal.ca", desc: "Full build.", stack: ["Full-Stack"] },
  { name: "kendortextiles.com", url: "https://kendortextiles.com", desc: "Full build.", stack: ["Full-Stack"] },
  { name: "reliancesupermarket.com.au", url: "https://reliancesupermarket.com.au", desc: "Full build.", stack: ["Full-Stack"] },
  { name: "smileswallet.com", url: "https://smileswallet.com", desc: "Frontend design & build.", stack: ["Frontend"] },
];

export const SKILL_GROUPS = [
  {
    title: "DevOps & Infrastructure",
    items: ["Docker & Containerization", "Linux Administration", "VPS & Cloud Infrastructure", "Server Hardening", "SSH & Firewall Configuration", "CI/CD", "Database Administration", "Automated Backups", "Query Optimization", "Git / GitHub"],
  },
  {
    title: "Web Development",
    items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "PHP", "Laravel", "WordPress", "MySQL", "PostgreSQL", "MongoDB", "REST APIs"],
  },
  {
    title: "Digital Marketing",
    items: ["SEO (Technical / On-Page / Off-Page)", "Google Ads", "Paid Campaigns", "Social Media Marketing", "Content Strategy", "Analytics"],
  },
  {
    title: "Productivity & Tools",
    items: ["AI & Prompt Engineering", "LLMs", "VS Code", "Microsoft Office", "Project Management"],
  },
];

export const CERTIFICATIONS = [
  { name: "Programming with a Purpose", issuer: "Princeton University", url: "https://www.coursera.org/learn/cs-programming-java/home/welcome" },
  { name: "Search Engine Optimization (SEO) with Squarespace", issuer: "Coursera", url: "https://www.coursera.org/learn/search-engine-optimization-with-squarespace/home/welcome" },
  { name: "Fundamentals of Machine Learning and Artificial Intelligence", issuer: "Amazon Web Services", url: "https://www.coursera.org/learn/fundamentals-of-machine-learning-and-artificial-intelligence/home/welcome" },
  { name: "Google Ads for Beginners", issuer: "Coursera", url: "https://www.coursera.org/learn/google-ads-beginner/home/welcome" },
  { name: "Business Analysis & Process Management", issuer: "Coursera", url: "https://www.coursera.org/learn/business-analysis-process-management/home/welcome" },
  { name: "Build a Free Website with WordPress", issuer: "Coursera", url: "https://www.coursera.org/learn/build-free-website-wordpress/home/welcome" },
  { name: "Deep Learning with PyTorch", issuer: "Cursa", url: "#" },
];

export const CONTACT = {
  email: "fahadnomanofficial@gmail.com",
  phone: "+356 9978 4477",
  whatsapp: "https://wa.me/35699784477",
  location: "Qormi, Malta",
  linkedin: "https://www.linkedin.com/in/fahad-al-noman-555039411/",
};
