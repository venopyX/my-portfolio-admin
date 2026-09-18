export const initialProfile = {
  name: "Alex Morgan",
  description: "Senior Full-Stack Engineer and Open Source Contributor specializing in Vue.js, Node.js, and Cloud Architectures.",
  image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
};

export const initialHero = {
  title: "Building modern digital experiences",
  subtitle: "Full-Stack Developer, UI/UX Enthusiast, and Tech Writer",
  typedStrings: ["Web Developer", "Vue Specialist", "Cloud Architect"],
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
  imageAlt: "Developer portrait",
  exploreText: "Explore Projects",
  exploreLink: "/projects",
  contactText: "Get in Touch",
  contactLink: "#contact"
};

export const initialProjects = [
  {
    id: "proj-1",
    title: "Portfolio CMS Platform",
    description: "A headless portfolio management suite built with Vue 3, Tailwind CSS, and cloud persistence.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    link: "https://github.com",
    tags: ["Vue 3", "Tailwind", "Firebase"]
  },
  {
    id: "proj-2",
    title: "AI Code Reviewer",
    description: "Automated code quality and performance analysis tool powered by modern LLMs.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    link: "https://github.com",
    tags: ["TypeScript", "Node.js", "AI"]
  }
];

export const initialBlogPosts = [
  {
    id: "post-1",
    title: "Building Resilient Admin Dashboards with Vue 3",
    excerpt: "Best practices for architecting maintainable admin interfaces with modern Vue and DaisyUI.",
    content: "## Overview\n\nAdmin dashboards require clear separation of concerns, robust state management, and resilient network fallbacks.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    date: "2025-01-15",
    category: "Architecture",
    author: "Alex Morgan",
    slug: "building-resilient-admin-dashboards-with-vue-3"
  }
];

export const initialSocialMedia = [
  {
    id: "soc-1",
    name: "GitHub",
    link: "https://github.com",
    icon: "fab fa-github",
    class: "bg-[#333333]",
    order: 1
  },
  {
    id: "soc-2",
    name: "LinkedIn",
    link: "https://linkedin.com",
    icon: "fab fa-linkedin",
    class: "bg-[#0077B5]",
    order: 2
  },
  {
    id: "soc-3",
    name: "Telegram",
    link: "https://t.me/portfolio_admin",
    icon: "fab fa-telegram",
    class: "bg-[#229ED9]",
    order: 3
  }
];

const getStored = (key, fallback) => {
  try {
    const raw = localStorage.getItem(`portfolio_admin_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const setStored = (key, data) => {
  try {
    localStorage.setItem(`portfolio_admin_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn("Storage write error:", e);
  }
};

export const mockStorage = {
  getProjects: () => getStored('projects', initialProjects),
  setProjects: (data) => setStored('projects', data),
  getBlogPosts: () => getStored('blog_posts', initialBlogPosts),
  setBlogPosts: (data) => setStored('blog_posts', data),
  getSocialMedia: () => getStored('social_media', initialSocialMedia),
  setSocialMedia: (data) => setStored('social_media', data),
  getHero: () => getStored('hero', initialHero),
  setHero: (data) => setStored('hero', data),
  getProfile: () => getStored('profile', initialProfile),
  setProfile: (data) => setStored('profile', data),
};
