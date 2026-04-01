const portfolioDataEn = {
    // =================================
    // LAYOUT CONTROL
    // This array controls the sections and their order on the page.
    // To remove a section, just delete its line from this array.
    // To reorder sections, just move the lines around.
    // =================================
    layout: [
        { id: 'home',       nav: 'Home',         renderer: 'renderHero',       dataKey: 'personal'     },
        { id: 'biography',  nav: 'Biography',    renderer: 'renderTimeline',   dataKey: 'biography'    },
        { id: 'research',   nav: 'Research',     renderer: 'renderCardGrid',   dataKey: 'research'     },
        { id: 'projects',   nav: 'Projects',     renderer: 'renderCardGrid',   dataKey: 'projects'     },
        { id: 'publications', nav: 'Publications', renderer: 'renderItemList',   dataKey: 'publications' },
        { id: 'teaching',   nav: 'Teaching',     renderer: 'renderTeachingList',   dataKey: 'teaching'     },
        { id: 'resources',  nav: 'Resources',    renderer: 'renderResourceList',   dataKey: 'resources'    },
        { id: 'contact',    nav: 'Contact',      renderer: 'renderContactForm',dataKey: 'contact'      }
    ],

    // =================================
    // UI TEXT & LABELS
    // =================================
    uiText: {
        hero: {
            quickFacts: "Quick Facts",
            news: "Latest News"
        },
        publications: {
            filters: {
                all: "All",
                searchPlaceholder: "Search publications..."
            }
        },
        projects: {
            filters: {
                all: "All",
                searchPlaceholder: "Search projects..."
            }
        },
        timeline: {
            readMore: "Click to read more..."
        },
        teaching: {
            role: "Role:",
            semesters: "Semesters:"
        },
        resources: {
            viewButton: "View",
            downloadButton: "Download"
        },
        footer: {
            rights: "All rights reserved."
        }
    },

    // =================================
    // SEO & METADATA
    // =================================
    seo: {
        description: "Academic Portfolio of Dr. Jane Doe - Assistant Professor of Computer Science. Researching HCI, Machine Learning, and Visualization.",
        ogTitle: "Dr. Jane Doe - Academic Portfolio",
        ogDescription: "Academic Portfolio of Dr. Jane Doe. Researching HCI, Machine Learning, and Visualization.",
        ogImage: "assets/img/og-image.svg",
        ogUrl: "#",
        twitterCard: "summary_large_image"
    },

    // =================================
    // PERSONAL INFORMATION
    // =================================
    personal: {
        name: "Dr. Jane Doe",
        title: "Assistant Professor of Computer Science",
        profileImage: "assets/img/profile.svg",
        introduction: "Welcome to my portfolio. I am a researcher at [Your University], specializing in human-computer interaction, machine learning, and data visualization. My work aims to create intelligent systems that augment human capabilities and promote equitable access to information.",
        // Stats for the highlight reel in the hero section
        stats: [
            { value: "50+", label: "Publications" },
            { value: "1500+", label: "Citations" },
            { value: "10+", label: "Years of Experience" },
            { value: "20+", label: "Students Mentored" }
        ],
        // Quick facts or highlights for the home page
        quickFacts: [
            { text: "Passionate about Human-AI Collaboration", icon: "users" },
            { text: "Expert in Explainable AI (XAI)", icon: "brain-circuit" },
            { text: "Advocate for Ethical Data Practices", icon: "shield-check" },
            { text: "Outdoor enthusiast & photographer", icon: "camera" }
        ],
        links: [
            { name: "Download CV", icon: "download", url: "#" },
            { name: "Google Scholar", icon: "book-open", url: "#" },
            { name: "LinkedIn", icon: "linkedin", url: "#" }
        ],
        // Social links for the footer
        social: [
            { name: "Twitter", icon: "twitter", url: "#" },
            { name: "LinkedIn", icon: "linkedin", url: "#" },
            { name: "GitHub", icon: "github", url: "#" }
        ]
    },

    // =================================
    // NEWS & UPDATES
    // =================================
    news: {
        title: "News & Updates",
        subtitle: "Recent announcements and achievements.",
        items: [
            { date: "Oct 2025", content: "Excited to announce our paper '[Paper Title]' was accepted to [Conference Name]!" },
            { date: "Sep 2025", content: "I will be giving a talk at the [Event Name] on the topic of [Topic]." },
            { date: "Jul 2025", content: "Our work on [Project Name] was featured in [Publication/News Outlet]." },
            { date: "May 2025", content: "Received the [Award Name] for contributions to the field of HCI." }
        ]
    },

    // =================================
    // BIOGRAPHY TIMELINE
    // =================================
    biography: {
        title: "Biography",
        subtitle: "An interactive overview of my academic and professional journey.",
        timeline: [
            {
                date: "2022 - Present",
                title: "Assistant Professor",
                subtitle: "[Your University], [City, State]",
                description: "<p>At [Your University], I lead the [Your Lab Name] lab, focusing on [Your research area]. I mentor graduate and undergraduate students and teach courses on [Course 1] and [Course 2].</p><p class='mt-4'>My current research projects include [Project 1] and [Project 2], funded by [Funding Source].</p>"
            },
            {
                date: "2020 - 2022",
                title: "Postdoctoral Researcher",
                subtitle: "[Previous University], [City, State]",
                description: "<p>As a postdoc in the [Lab Name] with [Advisor Name], I worked on [Project Name]. This work resulted in [Number] publications, including a Best Paper award at [Conference Name].</p><p class='mt-4'>I also co-organized the [Workshop Name] and mentored several junior students.</p>"
            },
            {
                date: "2016 - 2020",
                title: "Ph.D. in Computer Science",
                subtitle: "[Graduate University], [City, State]",
                description: "<p>My doctoral research focused on [Dissertation Topic]. I was advised by [Advisor Name] and was fortunate to be supported by the [Fellowship Name].</p><p class='mt-4'>My dissertation, '[Dissertation Title],' proposed a new model for [Field] and was awarded the [Award Name].</p>",
                extra: 'Dissertation: "Title of Your Dissertation"'
            },
        ]
    },

    // =================================
    // SKILLS
    // =================================
    skills: {
        title: "Skills & Expertise",
        subtitle: "A summary of my technical and academic skills.",
        categories: [
            {
                title: "Programming Languages",
                items: ["JavaScript", "Python", "Java", "C++", "SQL", "R"]
            },
            {
                title: "Technologies & Frameworks",
                items: ["React", "Node.js", "D3.js", "TensorFlow", "PyTorch", "WebGL"]
            },
            {
                title: "Methodologies",
                items: ["User-Centered Design", "Agile Development", "Data Analysis", "Statistical Modeling"]
            }
        ]
    },
    
    // =================================
    // RESEARCH INTERESTS
    // =================================
    research: {
        title: "Research Interests",
        subtitle: "My research explores the intersection of technology and human-centered design. Key areas of focus include:",
        items: [
            {
                title: "Human-Computer Interaction",
                icon: "users",
                summary: "Designing and evaluating novel interactive systems that are intuitive, efficient, and enjoyable to use.",
                description: "<p>Here you can write a detailed explanation of your work in HCI.</p><p class='mt-4'>This could include your design philosophy, specific methodologies you use (e.g., user-centered design, participatory design), and the ultimate goals of your HCI research.</p>"
            },
            {
                title: "Machine Learning",
                icon: "brain-circuit",
                summary: "Developing interpretable ML models and applying them to understand complex human behaviors and social phenomena.",
                description: "<p>This is the space to elaborate on your machine learning research.</p><p class='mt-4'>You could discuss the types of models you build (e.g., deep learning, reinforcement learning), your focus on interpretability and fairness, and specific application domains (e.g., healthcare, education).</p>"
            },
            {
                title: "Data Visualization",
                icon: "bar-chart-3",
                summary: "Creating interactive visualizations that help people explore, understand, and communicate complex data.",
                description: "<p>Expand on your data visualization work here.</p><p class='mt-4'>Detail your work on information visualization (InfoVis) or scientific visualization (SciVis), the development of new visualization techniques, or your research on how visualizations impact human perception and decision-making.</p>"
            }
        ]
    },

    // =================================
    // PROJECTS
    // =================================
    projects: {
        title: "Projects",
        subtitle: "A selection of software projects and tools I have developed.",
        items: [
            {
                title: "Interactive Data Explorer",
                icon: "database-zap",
                summary: "A web-based tool for interactively exploring and visualizing large datasets.",
                description: "<p>More details about the project, its technologies, and a link to the live demo or source code.</p>",
                tags: ["Web App", "Data Viz"]
            },
            {
                title: "Community Engagement Platform",
                icon: "megaphone",
                summary: "A mobile application designed to facilitate communication and engagement in local communities.",
                description: "<p>More details about the project, its impact, and user feedback.</p>",
                tags: ["Mobile App", "Social"]
            },
            {
                title: "Personal Portfolio Engine",
                icon: "layout-template",
                summary: "The data-driven engine that runs this website, designed for easy updates.",
                description: "<p>This very website is powered by a custom, lightweight rendering engine that pulls all content from a single JavaScript data file. This makes it incredibly easy to add, remove, or reorder sections without touching the core HTML or CSS.</p>",
                tags: ["Web App", "JavaScript"]
            }
        ]
    },

    // =================================
    // SELECTED PUBLICATIONS
    // =================================
    publications: {
        title: "Selected Publications",
        subtitle: "A list of my most recent and impactful research contributions.",
        items: [
            {
                title: "The Future of Interactive Data Systems",
                authors: "<strong>Doe, J.</strong>, Smith, A., & Johnson, B. (2024).",
                venue: "In Proceedings of the ACM Conference on Human Factors in Computing Systems (CHI '24).",
                year: 2024,
                tags: ["HCI", "Data Visualization", "Systems"],
                thumbnail: "assets/img/publication-thumb.svg",
                description: "<p>This is where you can add the full abstract of your paper. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>",
                links: [
                    { name: "PDF", icon: "file-text", url: "#" },
                    { name: "DOI", icon: "link", url: "#" },
                    { name: "Code", icon: "github", url: "#" }
                ]
            },
            {
                title: "Understanding Algorithmic Bias in Social Media Feeds",
                authors: "<strong>Doe, J.</strong>, & Lee, C. (2023).",
                venue: "Journal of Computer-Mediated Communication (JCMC).",
                year: 2023,
                tags: ["HCI", "Social Computing", "Algorithmic Bias"],
                thumbnail: "assets/img/publication-thumb.svg",
                description: "<p>This is where you can add the full abstract of your paper. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>",
                links: [
                    { name: "PDF", icon: "file-text", url: "#" },
                    { name: "DOI", icon: "link", url: "#" }
                ]
            }
        ]
    },

    // =================================
    // TEACHING & MENTORING
    // =================================
    teaching: {
        title: "Teaching & Mentoring",
        subtitle: "I am passionate about teaching the next generation of researchers and engineers.",
        items: [
            {
                title: "CS 101: Introduction to Human-Computer Interaction",
                role: "Lead Instructor",
                semesters: "Fall 2023, Fall 2024",
                summary: "A project-based course covering the fundamentals of user-centered design, prototyping, and evaluation methods.",
                description: "<p>A project-based course covering the fundamentals of user-centered design, prototyping, and evaluation methods.</p><p class='mt-4'>Here you could add more details, like a link to the syllabus, key learning objectives, or examples of student projects.</p>"
            },
            {
                title: "CS 202: Data Visualization",
                role: "Co-Instructor",
                semesters: "Spring 2024",
                summary: "Graduate-level seminar on the principles and techniques for creating effective and ethical data visualizations.",
                description: "<p>Graduate-level seminar on the principles and techniques for creating effective and ethical data visualizations.</p><p class='mt-4'>You could elaborate on the key topics covered, the assigned readings, or the final project requirements.</p>"
            }
        ]
    },

    // =================================
    // RESOURCES
    // =================================
    resources: {
        title: "Resources",
        subtitle: "Lecture notes, presentations, and other academic materials.",
        items: [
            {
                title: "CS 101: Introduction to HCI - Slides",
                type: "Presentation",
                icon: "presentation",
                description: "Web-based slides for the introductory lecture of CS 101. Powered by Reveal.js.",
                link: "assets/slides/slides_demo.html",
                action: "view"
            },
            {
                title: "HCI Design Principles - Cheat Sheet",
                type: "PDF",
                icon: "file-text",
                description: "A quick reference guide for common design heuristics and accessibility standards.",
                link: "#",
                action: "download"
            },
            {
                title: "Data Viz Syllabus (Spring 2024)",
                type: "PDF",
                icon: "file-text",
                description: "Full course syllabus including reading list and grading policy.",
                link: "#",
                action: "download"
            }
        ]
    },

    // =================================
    // CONTACT INFORMATION
    // =================================
    contact: {
        title: "Get in Touch",
        subtitle: "I am always open to discussing research, new projects, and collaboration opportunities.",
        items: [
            {
                type: "email",
                title: "Email",
                icon: "mail",
                description: "For academic inquiries and collaboration.",
                value: "jane.doe@university.edu",
                link: "mailto:jane.doe@university.edu"
            },
            {
                type: "office",
                title: "Office",
                icon: "map-pin",
                description: "Feel free to stop by during office hours.",
                value: "Room 404, [Your Building Name]<br>[Your University]<br>[City, State, Zip]",
                link: null
            }
        ]
    }
};
