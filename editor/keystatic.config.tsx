import { config, fields, singleton } from '@keystatic/core';

// Separate schemas for each section
const layoutSchema = {
    layout: fields.array(
        fields.object({
            id: fields.select({
                label: 'Section ID (HTML anchor)',
                description: 'The internal ID used for scrolling (e.g., #home)',
                options: [
                    { label: 'home', value: 'home' },
                    { label: 'biography', value: 'biography' },
                    { label: 'research', value: 'research' },
                    { label: 'projects', value: 'projects' },
                    { label: 'publications', value: 'publications' },
                    { label: 'teaching', value: 'teaching' },
                    { label: 'resources', value: 'resources' },
                    { label: 'contact', value: 'contact' }
                ],
                defaultValue: 'home'
            }),
            nav: fields.text({ 
                label: 'Navigation Label',
                description: 'The text that will appear in the top menu bar (e.g., "Home" or "ホーム")' 
            }),
            renderer: fields.select({
                label: 'Renderer Function (Design Style)',
                description: 'Select which visual component should be used to display this section.',
                options: [
                    { label: 'Hero Layout (Profile & Quick Facts)', value: 'renderHero' },
                    { label: 'Timeline Layout (Biography)', value: 'renderTimeline' },
                    { label: 'Card Grid Layout (Projects/Research)', value: 'renderCardGrid' },
                    { label: 'Item List Layout (Publications)', value: 'renderItemList' },
                    { label: 'Teaching Layout (Courses)', value: 'renderTeachingList' },
                    { label: 'Resources Layout (Sidebar & Categories)', value: 'renderResourceList' },
                    { label: 'Contact Layout (Cards)', value: 'renderContactForm' }
                ],
                defaultValue: 'renderHero'
            }),
            dataKey: fields.select({
                label: 'Data Key (Content Source)',
                description: 'Which Keystatic data tab should this section load content from?',
                options: [
                    { label: 'Personal Information', value: 'personal' },
                    { label: 'Biography', value: 'biography' },
                    { label: 'Research', value: 'research' },
                    { label: 'Projects', value: 'projects' },
                    { label: 'Publications', value: 'publications' },
                    { label: 'Teaching', value: 'teaching' },
                    { label: 'Resources', value: 'resources' },
                    { label: 'Contact', value: 'contact' }
                ],
                defaultValue: 'personal'
            })
        }),
        { label: 'Layout Control', itemLabel: props => props.fields.nav.value }
    )
};

const uiTextSchema = {
    hero: fields.object({
        quickFacts: fields.text({ label: 'Quick Facts Label' }),
        news: fields.text({ label: 'News Label' })
    }),
    publications: fields.object({
        filters: fields.object({
            all: fields.text({ label: 'All Filter' }),
            searchPlaceholder: fields.text({ label: 'Search Placeholder' })
        })
    }),
    projects: fields.object({
        filters: fields.object({
            all: fields.text({ label: 'All Filter' }),
            searchPlaceholder: fields.text({ label: 'Search Placeholder' })
        })
    }),
    timeline: fields.object({
        readMore: fields.text({ label: 'Read More Text' })
    }),
    teaching: fields.object({
        role: fields.text({ label: 'Role Label' }),
        semesters: fields.text({ label: 'Semesters Label' })
    }),
    resources: fields.object({
        viewButton: fields.text({ label: 'View Button' }),
        downloadButton: fields.text({ label: 'Download Button' }),
        categoriesLabel: fields.text({ label: 'Categories Heading' }),
        typeLabels: fields.array(
            fields.object({
                type: fields.text({ label: 'Type (as written in the resource)' }),
                label: fields.text({ label: 'Heading Label' })
            }),
            { label: 'Type Labels', itemLabel: props => props.fields.type.value }
        )
    }),
    nav: fields.object({
        openMenu: fields.text({ label: 'Open Menu (accessible label)' }),
        goToTop: fields.text({ label: 'Go to Top (accessible label)' }),
        closeDialog: fields.text({ label: 'Close Dialog (accessible label)' }),
        switchLanguage: fields.text({ label: 'Switch Language (accessible label)' })
    }),
    footer: fields.object({
        rights: fields.text({ label: 'Rights Text' })
    })
};

const seoSchema = {
    description: fields.text({ label: 'Description', multiline: true }),
    ogTitle: fields.text({ label: 'OG Title' }),
    ogDescription: fields.text({ label: 'OG Description', multiline: true }),
    ogImage: fields.image({ label: 'OG Image', directory: '../assets/img', publicPath: 'assets/img' }),
    ogUrl: fields.text({ label: 'OG URL' }),
    twitterCard: fields.text({ label: 'Twitter Card Type' })
};

const personalSchema = {
    name: fields.text({ label: 'Name' }),
    title: fields.text({ label: 'Title' }),
    profileImage: fields.image({ label: 'Profile Image', directory: '../assets/img', publicPath: 'assets/img' }),
    introduction: fields.text({ label: 'Introduction', multiline: true }),
    stats: fields.array(
        fields.object({
            value: fields.text({ label: 'Value' }),
            label: fields.text({ label: 'Label' })
        }),
        { label: 'Stats', itemLabel: props => props.fields.label.value }
    ),
    quickFacts: fields.array(
        fields.object({
            text: fields.text({ label: 'Text' }),
            icon: fields.text({ label: 'Icon (Lucide)' })
        }),
        { label: 'Quick Facts', itemLabel: props => props.fields.text.value }
    ),
    links: fields.array(
        fields.object({
            name: fields.text({ label: 'Name' }),
            icon: fields.text({ label: 'Icon (Lucide)' }),
            url: fields.text({ label: 'URL' })
        }),
        { label: 'Personal Links', itemLabel: props => props.fields.name.value }
    ),
    social: fields.array(
        fields.object({
            name: fields.text({ label: 'Name' }),
            icon: fields.text({ label: 'Icon (Lucide)' }),
            url: fields.text({ label: 'URL' })
        }),
        { label: 'Social Links', itemLabel: props => props.fields.name.value }
    )
};

const newsSchema = {
    title: fields.text({ label: 'Section Title' }),
    subtitle: fields.text({ label: 'Section Subtitle' }),
    items: fields.array(
        fields.object({
            date: fields.text({ label: 'Date' }),
            content: fields.text({ label: 'Content', multiline: true })
        }),
        { label: 'News Items', itemLabel: props => props.fields.date.value }
    )
};

const biographySchema = {
    title: fields.text({ label: 'Section Title' }),
    subtitle: fields.text({ label: 'Section Subtitle' }),
    timeline: fields.array(
        fields.object({
            date: fields.text({ label: 'Date' }),
            title: fields.text({ label: 'Title' }),
            subtitle: fields.text({ label: 'Subtitle' }),
            description: fields.text({ label: 'Description (HTML allowed)', multiline: true }),
            extra: fields.text({ label: 'Extra Info (Optional)' })
        }),
        { label: 'Timeline Items', itemLabel: props => props.fields.title.value }
    )
};

const skillsSchema = {
    title: fields.text({ label: 'Section Title' }),
    subtitle: fields.text({ label: 'Section Subtitle' }),
    categories: fields.array(
        fields.object({
            title: fields.text({ label: 'Category Title' }),
            items: fields.array(
                fields.text({ label: 'Skill Item' }),
                { label: 'Skills', itemLabel: props => props.value }
            )
        }),
        { label: 'Skill Categories', itemLabel: props => props.fields.title.value }
    )
};

const researchSchema = {
    title: fields.text({ label: 'Section Title' }),
    subtitle: fields.text({ label: 'Section Subtitle' }),
    items: fields.array(
        fields.object({
            title: fields.text({ label: 'Title' }),
            icon: fields.text({ label: 'Icon (Lucide)' }),
            summary: fields.text({ label: 'Summary', multiline: true }),
            description: fields.text({ label: 'Description (HTML allowed)', multiline: true })
        }),
        { label: 'Research Items', itemLabel: props => props.fields.title.value }
    )
};

const projectsSchema = {
    title: fields.text({ label: 'Section Title' }),
    subtitle: fields.text({ label: 'Section Subtitle' }),
    items: fields.array(
        fields.object({
            title: fields.text({ label: 'Title' }),
            icon: fields.text({ label: 'Icon (Lucide)' }),
            summary: fields.text({ label: 'Summary', multiline: true }),
            description: fields.text({ label: 'Description (HTML allowed)', multiline: true }),
            tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: props => props.value })
        }),
        { label: 'Project Items', itemLabel: props => props.fields.title.value }
    )
};

const publicationsSchema = {
    title: fields.text({ label: 'Section Title' }),
    subtitle: fields.text({ label: 'Section Subtitle' }),
    items: fields.array(
        fields.object({
            title: fields.text({ label: 'Title' }),
            authors: fields.text({ label: 'Authors (HTML allowed)' }),
            venue: fields.text({ label: 'Venue' }),
            year: fields.integer({ label: 'Year' }),
            tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: props => props.value }),
            thumbnail: fields.image({ label: 'Thumbnail Image', directory: '../assets/img', publicPath: 'assets/img' }),
            description: fields.text({ label: 'Description (HTML allowed)', multiline: true }),
            links: fields.array(
                fields.object({
                    name: fields.text({ label: 'Name' }),
                    icon: fields.text({ label: 'Icon (Lucide)' }),
                    url: fields.text({ label: 'URL' })
                }),
                { label: 'Links', itemLabel: props => props.fields.name.value }
            )
        }),
        { label: 'Publication Items', itemLabel: props => props.fields.title.value }
    )
};

const teachingSchema = {
    title: fields.text({ label: 'Section Title' }),
    subtitle: fields.text({ label: 'Section Subtitle' }),
    items: fields.array(
        fields.object({
            title: fields.text({ label: 'Title' }),
            role: fields.text({ label: 'Role' }),
            semesters: fields.text({ label: 'Semesters' }),
            summary: fields.text({ label: 'Summary', multiline: true }),
            description: fields.text({ label: 'Description (HTML allowed)', multiline: true })
        }),
        { label: 'Teaching Items', itemLabel: props => props.fields.title.value }
    )
};

const resourcesSchema = {
    title: fields.text({ label: 'Section Title' }),
    subtitle: fields.text({ label: 'Section Subtitle' }),
    items: fields.array(
        fields.object({
            title: fields.text({ label: 'Title' }),
            type: fields.text({ label: 'Type' }),
            icon: fields.text({ label: 'Icon (Lucide)' }),
            description: fields.text({ label: 'Description' }),
            link: fields.text({ label: 'Link URL' }),
            action: fields.text({ label: 'Action (view or download)' })
        }),
        { label: 'Resource Items', itemLabel: props => props.fields.title.value }
    )
};

const contactSchema = {
    title: fields.text({ label: 'Section Title' }),
    subtitle: fields.text({ label: 'Section Subtitle' }),
    items: fields.array(
        fields.object({
            type: fields.text({ label: 'Type (email, office, etc)' }),
            title: fields.text({ label: 'Title' }),
            icon: fields.text({ label: 'Icon (Lucide)' }),
            description: fields.text({ label: 'Description' }),
            value: fields.text({ label: 'Value (HTML allowed)', multiline: true }),
            link: fields.text({ label: 'Link URL (Optional)' })
        }),
        { label: 'Contact Items', itemLabel: props => props.fields.title.value }
    )
};

// Helper to generate a set of singletons for a language
function makeSingletons(lang, langLabel) {
    const singletons = {};
    const schemas = {
        layout: { schema: layoutSchema, label: `Layout & Navigation` },
        uiText: { schema: uiTextSchema, label: `UI Text Labels` },
        seo: { schema: seoSchema, label: `SEO & Meta Data` },
        personal: { schema: personalSchema, label: `Personal Information` },
        news: { schema: newsSchema, label: `News Updates` },
        biography: { schema: biographySchema, label: `Biography` },
        skills: { schema: skillsSchema, label: `Skills` },
        research: { schema: researchSchema, label: `Research Interests` },
        projects: { schema: projectsSchema, label: `Projects` },
        publications: { schema: publicationsSchema, label: `Publications` },
        teaching: { schema: teachingSchema, label: `Teaching` },
        resources: { schema: resourcesSchema, label: `Resources` },
        contact: { schema: contactSchema, label: `Contact Info` }
    };
    
    for (const [key, { schema, label }] of Object.entries(schemas)) {
        singletons[`${lang}_${key}`] = singleton({
            label: `${label} (${langLabel})`,
            path: `public/data/${lang}/${key}`,
            format: { data: 'json' },
            schema
        });
    }
    return singletons;
}

export default config({
  // Keystatic storage mode:
  // 'local' mode saves directly to your computer's hard drive.
  // 'github' mode saves directly to your GitHub repository (needed for editing on the live internet).
  storage: process.env.NODE_ENV === 'production'
    ? {
        kind: 'github',
        // IMPORTANT: If you fork this, replace this with your actual GitHub username and repository name
        repo: 'kosuke-satake/scholar-static',
        pathPrefix: 'editor',
      }
    : {
        kind: 'local',
      },
  ui: {
    brand: { name: 'ScholarStatic' },
    navigation: {
      'English Content': ['en_personal', 'en_biography', 'en_research', 'en_projects', 'en_publications', 'en_teaching', 'en_resources', 'en_skills', 'en_news', 'en_contact', 'en_uiText', 'en_seo', 'en_layout'],
      'Japanese Content': ['ja_personal', 'ja_biography', 'ja_research', 'ja_projects', 'ja_publications', 'ja_teaching', 'ja_resources', 'ja_skills', 'ja_news', 'ja_contact', 'ja_uiText', 'ja_seo', 'ja_layout']
    }
  },
  singletons: {
      ...makeSingletons('en', 'EN'),
      ...makeSingletons('ja', 'JA')
  }
});