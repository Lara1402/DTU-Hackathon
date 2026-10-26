/**
 * Default high-quality structured UI templates for MoodUI Studio
 */

export const STARTER_TEMPLATES = {
  portfolio: {
    id: 'portfolio-template',
    name: 'Developer Portfolio',
    paletteName: 'dark-professional',
    components: [
      {
        id: 'nav-1',
        type: 'navbar',
        props: {
          brand: 'Alex Rivers',
          brandRole: 'Full-Stack Developer',
          links: [
            { label: 'About', href: '#about' },
            { label: 'Projects', href: '#projects' },
            { label: 'Experience', href: '#experience' },
            { label: 'Contact', href: '#contact' }
          ],
          ctaLabel: 'Get in Touch',
          ctaHref: '#contact',
          isSticky: true
        },
        style: {
          padding: '16px 32px'
        }
      },
      {
        id: 'hero-1',
        type: 'hero',
        props: {
          badge: 'Available for New Opportunities',
          title: 'Building digital experiences with modern web technologies',
          subtitle: 'Hi, I am Alex. I craft resilient frontend interfaces, scalable Node services, and delight users with micro-interactions and performance-first design.',
          primaryBtnText: 'View Projects',
          primaryBtnHref: '#projects',
          secondaryBtnText: 'Download CV',
          secondaryBtnHref: '#cv',
          imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Alex Rivers portrait'
        },
        style: {
          padding: '80px 24px',
          textAlign: 'left'
        }
      },
      {
        id: 'features-1',
        type: 'features',
        props: {
          badge: 'Core Expertise',
          title: 'What I bring to the table',
          subtitle: 'From pixel-perfect interactive UI to robust backend services and DevOps automation.',
          items: [
            {
              icon: 'Code2',
              title: 'Frontend Architecture',
              description: 'Modern React, TypeScript, state management, and accessible component libraries.'
            },
            {
              icon: 'Cpu',
              title: 'AI & LLM Integration',
              description: 'Integrating Google Gemma, Gemini models, agent workflows, and prompt engineering.'
            },
            {
              icon: 'Sparkles',
              title: 'Design Systems & Tokens',
              description: 'Creating cohesive tokens, theme switches, and responsive layouts that look stunning.'
            }
          ]
        },
        style: {
          padding: '64px 24px'
        }
      },
      {
        id: 'projects-1',
        type: 'card-grid',
        props: {
          badge: 'Featured Works',
          title: 'Recent Projects',
          subtitle: 'A selection of products and tools engineered from concept to launch.',
          columns: 3,
          cards: [
            {
              id: 'card-p1',
              title: 'Pulse Analytics',
              badge: 'Next.js & TypeScript',
              description: 'Real-time telemetry dashboard visualizing user interactions with sub-100ms latency.',
              imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
              linkText: 'View Demo',
              linkHref: '#'
            },
            {
              id: 'card-p2',
              title: 'Aura Design System',
              badge: 'React & Tokens',
              description: 'Accessible UI kit with container queries, dynamic theme tokens, and 40+ components.',
              imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
              linkText: 'GitHub Repo',
              linkHref: '#'
            },
            {
              id: 'card-p3',
              title: 'Cipher Cloud Agent',
              badge: 'Gemma & Python',
              description: 'Intelligent security monitor diagnosing misconfigurations and generating automated fixes.',
              imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
              linkText: 'Case Study',
              linkHref: '#'
            }
          ]
        },
        style: {
          padding: '64px 24px'
        }
      },
      {
        id: 'testimonials-1',
        type: 'testimonials',
        props: {
          badge: 'Recommendations',
          title: 'Kind words from colleagues',
          items: [
            {
              quote: 'Alex delivered our design system overhaul ahead of schedule with remarkable attention to detail and accessibility.',
              author: 'Sarah Chen',
              role: 'VP of Engineering at TechFlow',
              avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
            },
            {
              quote: 'One of the best frontend engineers I have collaborated with. Incredible grasp of CSS tokens and responsive layout.',
              author: 'Marcus Vance',
              role: 'Product Lead at Nexus',
              avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
            }
          ]
        },
        style: {
          padding: '64px 24px'
        }
      },
      {
        id: 'contact-form-1',
        type: 'form',
        props: {
          badge: 'Let us connect',
          title: 'Start a Conversation',
          subtitle: 'Have a project in mind or want to discuss opportunities? Send a message.',
          fields: [
            { name: 'fullName', label: 'Your Name', type: 'text', placeholder: 'Jane Doe', required: true },
            { name: 'email', label: 'Email Address', type: 'email', placeholder: 'jane@example.com', required: true },
            { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Tell me about your project...', required: true }
          ],
          submitLabel: 'Send Message'
        },
        style: {
          padding: '64px 24px',
          maxWidth: '680px',
          margin: '0 auto'
        }
      },
      {
        id: 'footer-1',
        type: 'footer',
        props: {
          brand: 'Alex Rivers',
          copyright: '© 2026 Alex Rivers. Built with MoodUI Studio.',
          links: [
            { label: 'GitHub', href: 'https://github.com' },
            { label: 'LinkedIn', href: 'https://linkedin.com' },
            { label: 'Twitter', href: 'https://twitter.com' }
          ]
        },
        style: {
          padding: '32px 24px'
        }
      }
    ]
  },

  learning: {
    id: 'learning-template',
    name: 'EdTech Learning Platform',
    paletteName: 'ocean-blue',
    components: [
      {
        id: 'nav-edu',
        type: 'navbar',
        props: {
          brand: 'EduSphere',
          brandRole: 'Online Academy',
          links: [
            { label: 'Courses', href: '#courses' },
            { label: 'Mentors', href: '#mentors' },
            { label: 'Pricing', href: '#pricing' },
            { label: 'FAQ', href: '#faq' }
          ],
          ctaLabel: 'Enroll Today',
          ctaHref: '#enroll',
          isSticky: true
        },
        style: { padding: '16px 32px' }
      },
      {
        id: 'hero-edu',
        type: 'hero',
        props: {
          badge: 'Fall Semester Registration Open',
          title: 'Master Modern Engineering with Interactive Curriculum',
          subtitle: 'Learn full-stack development, artificial intelligence, and cloud architectures from industry veterans with hands-on labs.',
          primaryBtnText: 'Explore Courses',
          primaryBtnHref: '#courses',
          secondaryBtnText: 'View Syllabus',
          secondaryBtnHref: '#syllabus',
          imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Students collaborating on code'
        },
        style: { padding: '80px 24px' }
      },
      {
        id: 'features-edu',
        type: 'features',
        props: {
          badge: 'Why EduSphere',
          title: 'Built for High-Impact Learning',
          subtitle: 'Everything you need to accelerate your technical career.',
          items: [
            {
              icon: 'GraduationCap',
              title: 'Accredited Curriculum',
              description: 'Co-developed with tier-1 technology firms to meet current engineering demands.'
            },
            {
              icon: 'Terminal',
              title: 'In-Browser Cloud Labs',
              description: 'Instant sandbox environments without painful local setup or machine limitations.'
            },
            {
              icon: 'Users',
              title: '1-on-1 Mentor Guidance',
              description: 'Weekly video code reviews and personalized career guidance from staff engineers.'
            }
          ]
        },
        style: { padding: '64px 24px' }
      },
      {
        id: 'courses-edu',
        type: 'card-grid',
        props: {
          badge: 'Popular Paths',
          title: 'Featured Learning Tracks',
          subtitle: 'Structured, comprehensive roadmaps from beginner to mastery.',
          columns: 3,
          cards: [
            {
              id: 'course-1',
              title: 'Full-Stack React & Node',
              badge: '12 Weeks',
              description: 'Build production web applications, database schemas, authentication, and CI/CD pipelines.',
              imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80',
              linkText: 'Course Details',
              linkHref: '#'
            },
            {
              id: 'course-2',
              title: 'AI Agents & Open Models',
              badge: '8 Weeks',
              description: 'Fine-tune Google Gemma, build retrieval-augmented agents, and deploy inference microservices.',
              imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
              linkText: 'Course Details',
              linkHref: '#'
            },
            {
              id: 'course-3',
              title: 'Cloud DevOps & Kubernetes',
              badge: '10 Weeks',
              description: 'Deploy resilient containerized workloads, configure observability, and automate deployments.',
              imageUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=600&q=80',
              linkText: 'Course Details',
              linkHref: '#'
            }
          ]
        },
        style: { padding: '64px 24px' }
      },
      {
        id: 'cta-edu',
        type: 'cta',
        props: {
          badge: 'Start Now',
          title: 'Ready to elevate your engineering career?',
          subtitle: 'Join over 14,000 students learning with EduSphere today. 14-day money-back guarantee.',
          btnText: 'Claim Free Trial',
          btnHref: '#signup'
        },
        style: { padding: '72px 24px' }
      },
      {
        id: 'footer-edu',
        type: 'footer',
        props: {
          brand: 'EduSphere Academy',
          copyright: '© 2026 EduSphere. All rights reserved.',
          links: [
            { label: 'Privacy Policy', href: '#' },
            { label: 'Terms of Service', href: '#' },
            { label: 'Campus Support', href: '#' }
          ]
        },
        style: { padding: '32px 24px' }
      }
    ]
  },

  saas: {
    id: 'saas-template',
    name: 'Modern SaaS Platform',
    paletteName: 'purple-gradient',
    components: [
      {
        id: 'nav-saas',
        type: 'navbar',
        props: {
          brand: 'Veloce AI',
          brandRole: 'Developer Platform',
          links: [
            { label: 'Features', href: '#features' },
            { label: 'Architecture', href: '#architecture' },
            { label: 'Pricing', href: '#pricing' },
            { label: 'Changelog', href: '#changelog' }
          ],
          ctaLabel: 'Start Free Sandbox',
          ctaHref: '#signup',
          isSticky: true
        },
        style: { padding: '16px 32px' }
      },
      {
        id: 'hero-saas',
        type: 'hero',
        props: {
          badge: 'Version 3.0 Released',
          title: 'Ship intelligent interfaces at supersonic speed',
          subtitle: 'The first AI-native visual studio built for engineering teams. Compose structured schemas, preview in real time, and auto-diagnose bugs.',
          primaryBtnText: 'Start Building',
          primaryBtnHref: '#start',
          secondaryBtnText: 'Read Documentation',
          secondaryBtnHref: '#docs',
          imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Veloce AI workspace visualization'
        },
        style: { padding: '88px 24px' }
      },
      {
        id: 'features-saas',
        type: 'features',
        props: {
          badge: 'Engineered for Performance',
          title: 'Everything engineers need to move faster',
          subtitle: 'Eliminate repetitive scaffolding and catch layout bugs before production.',
          items: [
            {
              icon: 'Zap',
              title: 'Sub-second Iterations',
              description: 'Instant local updates with reactive CSS design tokens and zero cold starts.'
            },
            {
              icon: 'ShieldCheck',
              title: 'Automated Diagnostic Engine',
              description: 'Continuous accessibility, contrast, and mobile overflow checks with one-click repairs.'
            },
            {
              icon: 'FileCode',
              title: 'Clean Code Export',
              description: 'Zero lock-in. Export production-ready standalone HTML/CSS or structured React projects.'
            }
          ]
        },
        style: { padding: '64px 24px' }
      },
      {
        id: 'cta-saas',
        type: 'cta',
        props: {
          badge: 'Get Started',
          title: 'Transform your design-to-code workflow today',
          subtitle: 'Free forever for individual developers. No credit card required.',
          btnText: 'Launch Studio',
          btnHref: '#demo'
        },
        style: { padding: '72px 24px' }
      },
      {
        id: 'footer-saas',
        type: 'footer',
        props: {
          brand: 'Veloce AI Technologies',
          copyright: '© 2026 Veloce AI. Powered by Google Gemma.',
          links: [
            { label: 'Status', href: '#' },
            { label: 'Docs', href: '#' },
            { label: 'GitHub', href: '#' }
          ]
        },
        style: { padding: '32px 24px' }
      }
    ]
  }
};
