import { config, fields, singleton } from '@keystatic/core';

const commonSchema = {
    layout: fields.array(
        fields.object({
            id: fields.text({ label: 'ID' }),
            nav: fields.text({ label: 'Navigation Label' }),
            renderer: fields.text({ label: 'Renderer Function' }),
            dataKey: fields.text({ label: 'Data Key' })
        }),
        { label: 'Layout Control', itemLabel: props => props.fields.nav.value }
    ),
    uiText: fields.object({
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
            downloadButton: fields.text({ label: 'Download Button' })
        }),
        footer: fields.object({
            rights: fields.text({ label: 'Rights Text' })
        })
    }),
    seo: fields.object({
        description: fields.text({ label: 'Description', multiline: true }),
        ogTitle: fields.text({ label: 'OG Title' }),
        ogDescription: fields.text({ label: 'OG Description', multiline: true }),
        ogImage: fields.text({ label: 'OG Image Path' }),
        ogUrl: fields.text({ label: 'OG URL' }),
        twitterCard: fields.text({ label: 'Twitter Card Type' })
    }),
    personal: fields.object({
        name: fields.text({ label: 'Name' }),
        title: fields.text({ label: 'Title' }),
        profileImage: fields.text({ label: 'Profile Image Path' }),
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
    }),
    news: fields.object({
        title: fields.text({ label: 'Section Title' }),
        subtitle: fields.text({ label: 'Section Subtitle' }),
        items: fields.array(
            fields.object({
                date: fields.text({ label: 'Date' }),
                content: fields.text({ label: 'Content', multiline: true })
            }),
            { label: 'News Items', itemLabel: props => props.fields.date.value }
        )
    }),
    biography: fields.object({
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
    }),
    skills: fields.object({
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
    }),
    research: fields.object({
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
    }),
    projects: fields.object({
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
    }),
    publications: fields.object({
        title: fields.text({ label: 'Section Title' }),
        subtitle: fields.text({ label: 'Section Subtitle' }),
        items: fields.array(
            fields.object({
                title: fields.text({ label: 'Title' }),
                authors: fields.text({ label: 'Authors (HTML allowed)' }),
                venue: fields.text({ label: 'Venue' }),
                year: fields.integer({ label: 'Year' }),
                tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: props => props.value }),
                thumbnail: fields.text({ label: 'Thumbnail Path' }),
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
    }),
    teaching: fields.object({
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
    }),
    resources: fields.object({
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
    }),
    contact: fields.object({
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
    })
};

export default config({
  storage: {
    kind: 'local',
  },
  singletons: {
    portfolioEn: singleton({
      label: 'Portfolio (English)',
      path: 'public/data/en',
      format: { data: 'json' },
      schema: commonSchema
    }),
    portfolioJa: singleton({
      label: 'Portfolio (Japanese)',
      path: 'public/data/ja',
      format: { data: 'json' },
      schema: commonSchema
    })
  }
});
