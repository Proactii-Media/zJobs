import {
  FileText,
  LayoutDashboard,
  PencilLine,
  User,
  Users,
  UserPlus,
  Calculator,
  Search,
  HeartHandshake,
  FileUser,
  UserCog,
  Factory,
} from "lucide-react";

export const adminSidebarLinks = [
  {
    label: "Dashboard",
    route: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Blog",
    route: "/admin/blog",
    icon: PencilLine,
  },
  {
    label: "Company",
    route: "/admin/company",
    icon: Factory,
  },
  {
    label: " General Applications",
    route: "/admin/generalApplications",
    icon: User,
  },
  {
    label: "Job Applications",
    route: "/admin/jobApplications",
    icon: Users,
  },
  {
    label: "Job Posts",
    route: "/admin/job",
    icon: FileText,
  },
  {
    label: "Resume",
    route: "/admin/resumes",
    icon: FileUser,
  },
  {
    label: "Master",
    route: "/admin/master",
    icon: UserCog,
  },
];

// * Navbar Links
export const navbarLinks = [
  {
    route: "/",
    label: "Home",
  },

  {
    route: "/about",
    label: "About Us",
  },
  {
    route: "/services",
    label: "Services",
  },
  {
    route: "/find-jobs",
    label: "Find Jobs",
  },
  {
    route: "/blog",
    label: "Blog",
  },
  {
    route: "/client",
    label: "Client",
  },
];

// * jobs on home page
export const suggestedJobs = [
  "Designer",
  "Developer",
  "Tester",
  "Writing",
  "Project Manager",
  "Software Engineer",
  "Product Manager",
  "Data Analyst",
];

// * categories on home page
export const jobCategories = [
  { title: "Human Resource", jobs: "120 Jobs available" },
  { title: "Project Manager", jobs: "120 Jobs available" },
  { title: "Delivery Driver", jobs: "120 Jobs available" },
  { title: "Accounting", jobs: "120 Jobs available" },
  { title: "Customer Service", jobs: "120 Jobs available" },
  { title: "Data Science", jobs: "120 Jobs available" },
  { title: "Engineering", jobs: "120 Jobs available" },
  { title: "IT & Networking", jobs: "120 Jobs available" },
  { title: "Sales & Marketing", jobs: "120 Jobs available" },
  { title: "Writing", jobs: "120 Jobs available" },
];

// * testimonials
export const testimonials = [
  {
    quote:
      "Jobtex is allowing us to go through a large number of candidates with internal limited resources. We are able to do a first screening of candidates so much easier than if we had to meet everyone. We can truly identify and assess a talent pool more efficiently and have our talent ready to start in their new role faster.",
    author: "Pete Jones",
    position: "Head of Marketing Build",
    rating: 4,
  },
  {
    quote:
      "Jobtex is allowing us to go through a large number of candidates with internal limited resources. We are able to do a first screening of candidates so much easier than if we had to meet everyone. We can truly identify and assess a talent pool more efficiently and have our talent ready to start in their new role faster.",
    author: "Pete Jones",
    position: "Head of Marketing Build",
    rating: 4,
  },
  {
    quote:
      "Jobtex is allowing us to go through a large number of candidates with internal limited resources. We are able to do a first screening of candidates so much easier than if we had to meet everyone. We can truly identify and assess a talent pool more efficiently and have our talent ready to start in their new role faster.",
    author: "Pete Jones",
    position: "Head of Marketing Build",
    rating: 4,
  },
  {
    quote:
      "Jobtex is allowing us to go through a large number of candidates with internal limited resources. We are able to do a first screening of candidates so much easier than if we had to meet everyone. We can truly identify and assess a talent pool more efficiently and have our talent ready to start in their new role faster.",
    author: "Pete Jones",
    position: "Head of Marketing Build",
    rating: 4,
  },
  {
    quote:
      "Jobtex is allowing us to go through a large number of candidates with internal limited resources. We are able to do a first screening of candidates so much easier than if we had to meet everyone. We can truly identify and assess a talent pool more efficiently and have our talent ready to start in their new role faster.",
    author: "Pete Jones",
    position: "Head of Marketing Build",
    rating: 4,
  },
  {
    quote:
      "Jobtex is allowing us to go through a large number of candidates with internal limited resources. We are able to do a first screening of candidates so much easier than if we had to meet everyone. We can truly identify and assess a talent pool more efficiently and have our talent ready to start in their new role faster.",
    author: "Pete Jones",
    position: "Head of Marketing Build",
    rating: 4,
  },
];

//* footerData.ts

export const footerData = {
  contactInfo: {
    phone: "+91 989-843-3707",
    mail: "mail@zjobs.in",
    address:
      "332, 3RD Floor, Shoppers Gate, Vapi - Daman road, Chala, Vapi-396191, Gujarat",
    description:
      "Job Searching Just Got Easy. Use Z jobs to run a hiring site and earn money in the process!",
  },
  quickLinks: [
    { label: "Job Packages", href: "#" },
    { label: "Post New Job", href: "#" },
    { label: "Jobs Listing", href: "#" },
    { label: "Jobs Style Grid", href: "#" },
    { label: "Employer Listing", href: "#" },
    { label: "Employers Grid", href: "#" },
  ],
  candidateLinks: [
    { label: "User Dashboard", href: "#" },
    { label: "CV Packages", href: "#" },
    { label: "Candidate Listing", href: "#" },
    { label: "Candidates Grid", href: "#" },
    { label: "About us", href: "#" },
    { label: "Contact us", href: "#" },
  ],
  employerLinks: [
    { label: "Post New Job", href: "#" },
    { label: "Employer Listing", href: "#" },
    { label: "Employers Grid", href: "#" },
    { label: "Job Packages", href: "#" },
    { label: "Jobs Listing", href: "#" },
    { label: "Jobs Style Grid", href: "#" },
  ],
  socialLinks: [
    { icon: "Facebook", href: "https://www.facebook.com/zjobsconsultant/" },
    {
      icon: "Linkedin",
      href: "https://www.linkedin.com/in/z-jobs-consultant-932a1015a/",
    },
    // { icon: "X", href: "#" },
    // { icon: "Instagram", href: "#" },
  ],
  policyLinks: [
    { label: "Terms Of Services", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ],
};

export const services = [
  {
    id: 1,
    title: "Contract Staffing",
    description:
      "Flexible workforce solutions to meet your temporary and project-based staffing needs",
    icon: Users,
    color: "bg-cyan-500",
    route: "/services/contract-staffing",
  },
  {
    id: 2,
    title: "Permanent Recruitment",
    description:
      "End-to-end recruitment solutions for building your permanent workforce",
    icon: UserPlus,
    color: "bg-blue-500",
    route: "/services/permanent-recruitment",
  },
  {
    id: 3,
    title: "Payroll Management",
    description:
      "Comprehensive payroll solutions to streamline your HR operations",
    icon: Calculator,
    color: "bg-indigo-500",
    route: "/services/payroll-management",
  },
  {
    id: 4,
    title: "Executive Search",
    description:
      "Strategic talent acquisition for senior and executive positions",
    icon: Search,
    color: "bg-purple-500",
    route: "/services/executive-search",
  },
  {
    id: 5,
    title: "HR Consulting & Advisory",
    description: "Expert guidance on HR strategy, policies, and best practices",
    icon: HeartHandshake,
    color: "bg-pink-500",
    route: "/services/hr-consulting",
  },
];

export const clientImages = [
  {
    icon: "/brandLogo/accra.jpeg",
    name: "Accra Pac",
  },
  {
    icon: "/brandLogo/ajanta.png",
    name: "Ajanta Packaging",
  },
  {
    icon: "/brandLogo/ajantaPharma.svg",
    name: "Ajanta Pharma LTD.",
  },
  {
    icon: "/brandLogo/alkem.png",
    name: "Alkem Labs",
  },
  {
    icon: "/brandLogo/alpla.jpeg",
    name: "Alpla",
  },
  {
    icon: "/brandLogo/asian-paints.webp",
    name: "Asian Paints",
  },
  {
    icon: "/brandLogo/avikPharma.jpg",
    name: "Avik Pharmaceutical",
  },
  {
    icon: "/brandLogo/djs.png",
    name: "DJS Printers",
  },
  {
    icon: "/brandLogo/edelmann.jpg",
    name: "Edelmann and Associates",
  },
  {
    icon: "/brandLogo/hocl.jpg",
    name: "Hindustan Organic Chemicals",
  },
  {
    icon: "/brandLogo/Huhtamaki_logo.svg",
    name: "Huhtamaki",
  },

  {
    icon: "/brandLogo/ipca.svg",
    name: "IPCA Pharma",
  },
  {
    icon: "/brandLogo/itc.png",
    name: "ITC Limited",
  },
  {
    icon: "/brandLogo/JBPharmaeuticals.jpg",
    name: "JB Pharmaceuticals",
  },
  {
    icon: "/brandLogo/jcb.jpg",
    name: "JCB",
  },
  {
    icon: "/brandLogo/leoPrecision.webp",
    name: "Leo Precision",
  },
  {
    icon: "/brandLogo/liugong.png",
    name: "Liugong",
  },
  {
    icon: "/brandLogo/macleods.jpeg",
    name: "Macleods Pharma",
  },
  {
    icon: "/brandLogo/medley.jpg",
    name: "Medley Pharmaceuticals",
  },
  {
    icon: "/brandLogo/owens.svg",
    name: "Owens Corning",
  },
  {
    icon: "/brandLogo/Parksons.png",
    name: "Parksons Packaging",
  },
  {
    icon: "/brandLogo/Patanjali.png",
    name: "Patanjali",
  },
  {
    icon: "/brandLogo/sany.png",
    name: "Sany Heavy Industry Co.",
  },
  {
    icon: "/brandLogo/sovereignPharmaceuticals.jpeg",
    name: "Sovereign Pharmaceuticals",
  },
  {
    icon: "/brandLogo/sterlite1.png",
    name: "STL Tech",
  },
  {
    icon: "/brandLogo/sutlej.png",
    name: "Sutlej Textiles",
  },
  {
    icon: "/brandLogo/switz.jpg",
    name: "Switz Group",
  },
  {
    icon: "/brandLogo/vvf.gif",
    name: "VVf Pvt. Ltd.",
  },
  {
    icon: "/brandLogo/wockhardt.png",
    name: "Wockhardt Pharmaceuticals",
  },
];
