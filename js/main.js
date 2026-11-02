/*
=================================
MAIN JAVASCRIPT FILE
=================================
This file contains the core JavaScript functionality for the portfolio website.
It handles:
1.  Dynamic content rendering from js/data.js
2.  Mobile menu toggling
3.  Dark mode toggling
4.  Single-page navigation logic
5.  Scroll-triggered animations
6.  Generic modal window functionality
7.  Initial setup when the page loads
*/

// --- Language State Management ---
let currentLanguage = localStorage.getItem('lang') || 'en';
let portfolioData = null;

// Sorts tags and category names without regard to case, so "iOS" and "macOS" are not pushed behind "Zoology".
const byName = new Intl.Collator(undefined, { sensitivity: 'base', numeric: true }).compare;

const SECTIONS = ['layout', 'uiText', 'seo', 'personal', 'news', 'biography', 'skills', 'research', 'projects', 'publications', 'teaching', 'resources', 'contact'];

// The source tree keeps the content in editor/public/data; the deployed site serves it from data/ (the build copies it).
let dataPath = null;
const isLocalHost = (host) => /^(localhost|127\.|0\.0\.0\.0|\[::1\]|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host)
    || host.endsWith('.localhost') || host.endsWith('.local');

async function resolveDataPath() {
    if (dataPath) return dataPath;
    if (isLocalHost(window.location.hostname)) {
        dataPath = 'editor/public/data';
    } else {
        // Any other address (a tunnel, a custom development host, the deployed site): use data/ when it exists.
        const probe = await fetch(`data/${currentLanguage}/layout.json`, { method: 'HEAD' }).catch(() => null);
        dataPath = probe && probe.ok ? 'data' : 'editor/public/data';
    }
    return dataPath;
}

async function loadData() {
    try {
        const dataPath = await resolveDataPath();

        const promises = SECTIONS.map(sec => 
            fetch(`${dataPath}/${currentLanguage}/${sec}.json`)
                .then(r => r.ok ? r.json() : null)
                .catch(err => {
                    console.warn(`Could not load section: ${sec}`, err);
                    return null;
                })
        );
        const results = await Promise.all(promises);
        
        // Ensure at least some core data loaded successfully
        if (!results.some(r => r !== null)) {
            throw new Error("All data sections failed to load.");
        }

        portfolioData = {};
        SECTIONS.forEach((sec, i) => {
            if (results[i]) {
                portfolioData[sec] = (sec === 'layout' && results[i].layout) ? results[i].layout : results[i];
            }
        });
    } catch (error) {
        console.error("Failed to load portfolio data:", error);
        portfolioData = null;
    }
}

// Helper to update the language button text
const updateLangButton = () => {
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = currentLanguage === 'en' ? 'EN' : 'JP';
};

/**
 * ---------------------------------
 * 1. GENERIC COMPONENT RENDERERS
 * ---------------------------------
 * These functions generate HTML for different types of sections.
 * They are called by the main rendering engine based on the `renderer`
 * property specified in the `layout` array in `js/data.js`.
 */
const RENDERERS = {
    /**
     * Renders the Hero section (Home page)
     * @param {object} data - The `personal` object from portfolioData.
     * @returns {string} - The HTML string for the section content.
     */
    renderHero: (data) => {
        const newsData = portfolioData.news.items; // Get news data
        const skillsData = portfolioData.skills;   // Get skills data
        const uiText = portfolioData.uiText;       // Get UI text labels

        // Helper to render skills
        const renderSkillsInHero = (skills) => `
            <div class="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg shadow-inner h-full flex flex-col">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">${skills.title}</h2>
                <div class="space-y-6 flex-grow">
                    ${skills.categories.map((category, index) => `
                        <div class="fade-in-on-scroll" style="--animation-delay: ${0.7 + index * 0.15}s;">
                            <h3 class="text-lg font-semibold text-indigo-700 dark:text-indigo-400 mb-2">${category.title}</h3>
                            <div class="flex flex-wrap gap-2">
                                ${category.items.map(item => `
                                    <span class="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-3 py-1 rounded-md text-sm font-medium">
                                        ${item}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        return `
        <!-- "Above the fold" content -->
        <div class="relative">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-16">
                <div class="lg:col-span-2">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
                        <div class="md:col-span-1 flex justify-center fade-in-on-scroll">
                            <div class="w-48 h-48 md:w-56 md:h-56 flex-shrink-0">
                                <img src="${data.profileImage}" alt="Portrait of ${data.name}" class="rounded-full w-full h-full object-cover shadow-xl border-4 border-white dark:border-gray-800" loading="lazy">
                            </div>
                        </div>
                        <div class="md:col-span-3 text-center md:text-left md:pl-8">
                            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white fade-in-on-scroll" style="--animation-delay: 0.1s;">
                                ${data.name}
                            </h1>
                            <p class="mt-4 text-xl sm:text-2xl text-indigo-600 dark:text-indigo-400 font-medium fade-in-on-scroll" style="--animation-delay: 0.2s;">
                                ${data.title}
                            </p>
                        </div>
                    </div>
                    <div class="mt-8 text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto md:mx-0 fade-in-on-scroll" style="--animation-delay: 0.3s;">
                        ${data.introduction}
                    </div>
                    <div class="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8 text-center fade-in-on-scroll" style="--animation-delay: 0.35s;">
                        ${data.stats.map(stat => `
                            <div>
                                <p class="text-3xl font-bold text-gray-900 dark:text-white">${stat.value}</p>
                                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 tracking-wide uppercase">${stat.label}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="lg:col-span-1 fade-in-on-scroll" style="--animation-delay: 0.5s;">
                    <div class="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg shadow-inner mb-8">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">${uiText.hero.quickFacts}</h2>
                        <ul class="space-y-3">
                            ${data.quickFacts.map((fact, index) => `
                                <li class="flex items-start fade-in-on-scroll" style="--animation-delay: ${0.5 + index * 0.1}s;">
                                    <span class="flex-shrink-0 text-indigo-600 dark:text-indigo-400 mr-2" data-lucide="${fact.icon}" style="width:1.25rem; height:1.25rem;"></span>
                                    <p class="text-gray-700 dark:text-gray-300">${fact.text}</p>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="mt-8 flex flex-col items-center md:items-start gap-4">
                        ${data.links.map((link, index) => `
                            <a href="${link.url}" class="w-full text-center inline-flex items-center justify-center gap-2 ${index === 0 ? 'bg-indigo-600 text-white hover:bg-indigo-700 dark:hover:bg-indigo-500 animate-pulse-slow' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'} px-5 py-3 rounded-lg font-semibold shadow-md transition-all transform hover:-translate-y-0.5">
                                <span data-lucide="${link.icon}" class="w-5 h-5"></span>
                                ${link.name}
                            </a>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-24 pt-16 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16 items-stretch">
            <div class="fade-in-on-scroll" style="--animation-delay: 0.6s;">
                <div class="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg shadow-inner h-full flex flex-col">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">${uiText.hero.news}</h2>
                    <ul class="news-scroll-container space-y-6 flex-grow">
                        ${newsData.map((item, index) => `
                            <li>
                                <p class="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">${item.date}</p>
                                <p class="text-gray-700 dark:text-gray-300 mt-1">${item.content}</p>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            <div class="fade-in-on-scroll" style="--animation-delay: 0.7s;">
                ${renderSkillsInHero(skillsData)}
            </div>
        </div>
    `},

    /**
     * Renders a list of items with thumbnails (Publications)
     * @param {object} data - An object with `items` array.
     * @returns {string} - The HTML string for the item list content.
     */
    renderItemList: (data) => {
        const container = document.createElement('div');
        const uiText = portfolioData.uiText.publications; // Get UI text for publications

        // --- 1. Extract unique categories for filters ---
        const years = [...new Set(data.items.map(item => item.year))].sort((a, b) => b - a);
        const tags = [...new Set(data.items.flatMap(item => item.tags))].sort(byName);

        // --- 2. Generate HTML for filter UI ---
        const filtersContainer = document.createElement('div');
        filtersContainer.id = 'publication-filters';
        filtersContainer.className = 'flex flex-col sm:flex-row flex-wrap gap-4 items-center mb-8 fade-in-on-scroll';

        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'flex flex-wrap gap-2';

        const allButton = document.createElement('button');
        allButton.className = 'filter-btn is-active';
        allButton.dataset.filter = 'all';
        allButton.textContent = uiText.filters.all; // Use dynamic text
        buttonsDiv.appendChild(allButton);

        years.forEach(year => {
            const yearButton = document.createElement('button');
            yearButton.className = 'filter-btn';
            yearButton.dataset.filter = year;
            yearButton.textContent = year;
            buttonsDiv.appendChild(yearButton);
        });

        tags.forEach(tag => {
            const tagButton = document.createElement('button');
            tagButton.className = 'filter-btn';
            tagButton.dataset.filter = tag;
            tagButton.textContent = tag;
            buttonsDiv.appendChild(tagButton);
        });
        
        const searchDiv = document.createElement('div');
        searchDiv.className = 'relative sm:ml-auto w-full sm:w-auto';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'publication-search';
        searchInput.className = 'search-input';
        searchInput.placeholder = uiText.filters.searchPlaceholder; // Use dynamic text
        
        const searchIcon = document.createElement('span');
        searchIcon.className = 'absolute right-3 top-1/2 -translate-y-1/2 text-gray-400';
        searchIcon.setAttribute('data-lucide', 'search');
        searchIcon.style.width = '1.25rem';
        searchIcon.style.height = '1.25rem';

        searchDiv.appendChild(searchInput);
        searchDiv.appendChild(searchIcon);

        filtersContainer.appendChild(buttonsDiv);
        filtersContainer.appendChild(searchDiv);
        container.appendChild(filtersContainer);

        // --- 3. Generate HTML for the list of publications ---
        const itemsList = document.createElement('div');
        itemsList.id = 'publication-list';
        itemsList.className = 'mt-8 space-y-12';

        data.items.forEach((pub, index) => {
            const categories = [pub.year, ...pub.tags].join('|');
            const search_text = `${pub.title} ${pub.authors} ${pub.venue}`.toLowerCase();

            // Wrapper for Layout, Scroll Animation, and Filtering
            const wrapper = document.createElement('div');
            wrapper.className = 'publication-item-container fade-in-on-scroll w-full';
            wrapper.style.setProperty('--animation-delay', `${index * 0.05}s`);
            wrapper.dataset.category = categories;
            wrapper.dataset.searchText = search_text;

            // Inner Content for Styles, Hover Effects, and Interaction
            const itemContainer = document.createElement('div');
            itemContainer.className = 'clickable-modal bg-white dark:bg-gray-800 dark:border dark:border-gray-700 p-6 rounded-xl shadow-lg dark:shadow-none overflow-hidden flex flex-col md:flex-row gap-6 cursor-pointer hover-card dark:hover:bg-gray-700 w-full';
            itemContainer.setAttribute('tabindex', '0');
            itemContainer.setAttribute('role', 'button');
            itemContainer.dataset.modalTitle = pub.title;
            itemContainer.dataset.modalSubtitle = `${pub.authors} ${pub.venue}`;
            itemContainer.dataset.modalDescription = pub.description;
            itemContainer.dataset.modalLinks = generateLinksHTML(pub.links, true);

            const thumbnailContainer = document.createElement('div');
            thumbnailContainer.className = 'flex-shrink-0 w-full md:w-48 h-32 md:h-48';
            const thumbnail = document.createElement('img');
            thumbnail.src = pub.thumbnail;
            thumbnail.alt = 'Publication thumbnail';
            thumbnail.className = 'w-full h-full object-cover rounded-lg';
            thumbnail.loading = 'lazy';
            thumbnailContainer.appendChild(thumbnail);

            const textContainer = document.createElement('div');
            textContainer.className = 'flex-grow';

            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'flex flex-wrap gap-2 mb-2';
            [pub.year, ...pub.tags].forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.className = 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 px-2 py-1 rounded-md text-xs font-medium';
                tagSpan.textContent = tag;
                tagsContainer.appendChild(tagSpan);
            });

            const title = document.createElement('h3');
            title.className = 'text-xl font-semibold text-gray-900 dark:text-white';
            title.textContent = pub.title;

            const authors = document.createElement('p');
            authors.className = 'mt-2 text-gray-600 dark:text-gray-300';
            authors.innerHTML = pub.authors;

            const venue = document.createElement('p');
            venue.className = 'mt-1 text-gray-600 dark:text-gray-400 italic';
            venue.textContent = pub.venue;

            const linksContainer = document.createElement('div');
            linksContainer.className = 'mt-4 flex flex-wrap gap-x-4 gap-y-2';
            const links = generateLinks(pub.links, false);
            links.forEach(link => linksContainer.appendChild(link));

            textContainer.appendChild(tagsContainer);
            textContainer.appendChild(title);
            textContainer.appendChild(authors);
            textContainer.appendChild(venue);
            textContainer.appendChild(linksContainer);

            itemContainer.appendChild(thumbnailContainer);
            itemContainer.appendChild(textContainer);
            
            wrapper.appendChild(itemContainer);
            itemsList.appendChild(wrapper);
        });
        
        container.appendChild(itemsList);
        return container;
    },

    /**
     * Renders a timeline (Biography)
     * @param {object} data - The `biography` object from portfolioData.
     * @returns {string} - The HTML string for the timeline content.
     */
    renderTimeline: (data) => {
        const container = document.createElement('div');
        container.className = 'mt-20 timeline-container';
        const uiText = portfolioData.uiText.timeline; // Get UI text

        data.timeline.forEach((item, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item clickable-modal fade-in-on-scroll';
            timelineItem.setAttribute('tabindex', '0');
            timelineItem.setAttribute('role', 'button');
            timelineItem.style.setProperty('--animation-delay', `${index * 0.1}s`);
            timelineItem.dataset.modalDate = item.date;
            timelineItem.dataset.modalTitle = item.title;
            timelineItem.dataset.modalSubtitle = item.subtitle;
            timelineItem.dataset.modalDescription = item.description;

            const dot = document.createElement('div');
            dot.className = 'timeline-dot';

            const content = document.createElement('div');
            content.className = 'timeline-content';

            const date = document.createElement('span');
            date.className = 'block text-sm font-semibold text-indigo-600 dark:text-indigo-400';
            date.textContent = item.date;

            const title = document.createElement('h3');
            title.className = 'text-xl font-semibold text-gray-900 dark:text-white mt-1';
            title.textContent = item.title;

            const subtitle = document.createElement('p');
            subtitle.className = 'text-gray-700 dark:text-gray-300 mt-1';
            subtitle.textContent = item.subtitle;

            content.appendChild(date);
            content.appendChild(title);
            content.appendChild(subtitle);

            if (item.extra) {
                const extra = document.createElement('p');
                extra.className = 'text-gray-600 dark:text-gray-400 text-sm mt-2 italic';
                extra.textContent = item.extra;
                content.appendChild(extra);
            }

            const clickMore = document.createElement('p');
            clickMore.className = 'text-gray-500 dark:text-gray-400 text-sm mt-2';
            clickMore.textContent = uiText.readMore; // Use dynamic text
            content.appendChild(clickMore);

            timelineItem.appendChild(dot);
            timelineItem.appendChild(content);
            container.appendChild(timelineItem);
        });

        return container;
    },

    /**
     * Renders a grid of cards (Research, Projects)
     * @param {object} data - An object with `items` array.
     * @param {object} section - The layout entry (`id`, `nav`, `renderer`, `dataKey`) of this section.
     * @returns {string} - The HTML string for the card grid content.
     */
    renderCardGrid: (data, section) => {
        const container = document.createElement('div');
        // Use the layout id, not the displayed title: titles are translated and edited freely.
        const sectionId = section.id;

        if (section.id === 'projects') {
            const uiText = portfolioData.uiText.projects; // Get UI text for projects
            const tags = [...new Set(data.items.flatMap(item => item.tags))].sort(byName);
            const filtersContainer = document.createElement('div');
            filtersContainer.id = `${sectionId}-filters`;
            filtersContainer.className = 'flex flex-col sm:flex-row flex-wrap gap-4 items-center mb-8 fade-in-on-scroll';

            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'flex flex-wrap gap-2';
            
            const allButton = document.createElement('button');
            allButton.className = 'filter-btn is-active';
            allButton.dataset.filter = 'all';
            allButton.textContent = uiText.filters.all; // Use dynamic text
            buttonsDiv.appendChild(allButton);

            tags.forEach(tag => {
                const tagButton = document.createElement('button');
                tagButton.className = 'filter-btn';
                tagButton.dataset.filter = tag;
                tagButton.textContent = tag;
                buttonsDiv.appendChild(tagButton);
            });

            const searchDiv = document.createElement('div');
            searchDiv.className = 'relative sm:ml-auto w-full sm:w-auto';

            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.id = `${sectionId}-search`;
            searchInput.className = 'search-input';
            searchInput.placeholder = uiText.filters.searchPlaceholder; // Use dynamic text

            const searchIcon = document.createElement('span');
            searchIcon.className = 'absolute right-3 top-1/2 -translate-y-1/2 text-gray-400';
            searchIcon.setAttribute('data-lucide', 'search');
            searchIcon.style.width = '1.25rem';
            searchIcon.style.height = '1.25rem';

            searchDiv.appendChild(searchInput);
            searchDiv.appendChild(searchIcon);

            filtersContainer.appendChild(buttonsDiv);
            filtersContainer.appendChild(searchDiv);
            container.appendChild(filtersContainer);
        }

        const itemsGrid = document.createElement('div');
        itemsGrid.id = `${sectionId}-list`;
        itemsGrid.className = 'mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8';

        data.items.forEach((item, index) => {
            const category = item.tags ? item.tags.join('|') : '';
            const searchText = `${item.title} ${item.summary}`.toLowerCase();

            // Wrapper for Layout, Scroll Animation, and Filtering
            const wrapper = document.createElement('div');
            wrapper.className = 'project-item-container fade-in-on-scroll w-full';
            wrapper.style.setProperty('--animation-delay', `${index * 0.1}s`);
            wrapper.dataset.category = category;
            wrapper.dataset.searchText = searchText;

            // Inner Card for Styles, Hover Effects, and Interaction
            const card = document.createElement('div');
            card.className = 'clickable-modal h-full bg-gray-50 dark:bg-gray-900 dark:border dark:border-gray-700 p-6 rounded-xl shadow-lg hover-card dark:hover:bg-gray-700 cursor-pointer w-full';
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.dataset.modalTitle = item.title;
            card.dataset.modalDescription = item.description;

            const iconContainer = document.createElement('div');
            iconContainer.className = 'w-12 h-12 bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 rounded-full flex items-center justify-center';
            const icon = document.createElement('span');
            icon.setAttribute('data-lucide', item.icon);
            icon.className = 'w-6 h-6';
            iconContainer.appendChild(icon);

            const title = document.createElement('h3');
            title.className = 'mt-4 text-xl font-semibold text-gray-900 dark:text-white';
            title.textContent = item.title;

            const summary = document.createElement('p');
            summary.className = 'mt-2 text-gray-600 dark:text-gray-400';
            summary.textContent = item.summary;

            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'mt-4 flex flex-wrap gap-2';
            if (item.tags) {
                item.tags.forEach(tag => {
                    const tagSpan = document.createElement('span');
                    tagSpan.className = 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 px-2 py-1 rounded-md text-xs font-medium';
                    tagSpan.textContent = tag;
                    tagsContainer.appendChild(tagSpan);
                });
            }

            card.appendChild(iconContainer);
            card.appendChild(title);
            card.appendChild(summary);
            card.appendChild(tagsContainer);
            
            wrapper.appendChild(card);
            itemsGrid.appendChild(wrapper);
        });

        container.appendChild(itemsGrid);
        return container;
    },

    /**
     * Renders a list of teaching items.
     * @param {object} data - The `teaching` object from portfolioData.
     * @returns {string} - The HTML string for the teaching list content.
     */
    renderTeachingList: (data) => {
        const container = document.createElement('div');
        container.className = 'mt-16 space-y-12 max-w-4xl mx-auto';
        const uiText = portfolioData.uiText.teaching; // Get UI text

        data.items.forEach((course, index) => {
            // Wrapper for Layout and Scroll Animation
            const wrapper = document.createElement('div');
            wrapper.className = 'course-item-container fade-in-on-scroll w-full';
            wrapper.style.setProperty('--animation-delay', `${index * 0.1}s`);

            // Inner Content for Styles and Hover Effects
            const courseItem = document.createElement('div');
            courseItem.className = 'clickable-modal course-item bg-gray-50 dark:bg-gray-900 dark:border dark:border-gray-700 p-6 rounded-xl shadow-lg dark:shadow-none cursor-pointer hover-card dark:hover:bg-gray-700 w-full';
            courseItem.setAttribute('tabindex', '0');
            courseItem.setAttribute('role', 'button');
            courseItem.dataset.modalTitle = course.title;
            courseItem.dataset.modalSubtitle = `${uiText.role} ${course.role} | ${uiText.semesters} ${course.semesters}`;
            courseItem.dataset.modalDescription = course.description;

            const title = document.createElement('h3');
            title.className = 'text-xl font-semibold text-gray-900 dark:text-white';
            title.textContent = course.title;

            const role = document.createElement('p');
            role.className = 'mt-2 text-gray-600 dark:text-gray-400';
            const roleLabel = document.createElement('span');
            roleLabel.className = 'font-medium text-indigo-600 dark:text-indigo-400';
            roleLabel.textContent = `${uiText.role} `; // Use dynamic text
            role.appendChild(roleLabel);
            role.appendChild(document.createTextNode(course.role));

            const semesters = document.createElement('p');
            semesters.className = 'mt-1 text-gray-600 dark:text-gray-400';
            const semestersLabel = document.createElement('span');
            semestersLabel.className = 'font-medium text-indigo-600 dark:text-indigo-400';
            semestersLabel.textContent = `${uiText.semesters} `; // Use dynamic text
            semesters.appendChild(semestersLabel);
            semesters.appendChild(document.createTextNode(course.semesters));

            const summary = document.createElement('p');
            summary.className = 'mt-4 text-gray-700 dark:text-gray-300';
            summary.textContent = course.summary;

            courseItem.appendChild(title);
            courseItem.appendChild(role);
            courseItem.appendChild(semesters);
            courseItem.appendChild(summary);

            wrapper.appendChild(courseItem);
            container.appendChild(wrapper);
        });

        return container;
    },

    /**
     * Renders the Resources section with grouped types and a sidebar
     * @param {object} data - The `resources` object from portfolioData.
     * @returns {string} - The HTML string for the section content.
     */
    renderResourceList: (data) => {
        const uiText = portfolioData.uiText.resources;
        // Display name of a resource type; without a configured label it falls back to the plain plural.
        const typeLabel = (type) => (uiText.typeLabels || []).find(t => t.type === type)?.label || type + 's';

        // Group items by type
        const groupedItems = data.items.reduce((acc, item) => {
            if (!acc[item.type]) {
                acc[item.type] = [];
            }
            acc[item.type].push(item);
            return acc;
        }, {});

        const types = Object.keys(groupedItems).sort(byName);

        // Main Layout Container (Grid)
        const container = document.createElement('div');
        container.className = 'mt-12 grid grid-cols-1 md:grid-cols-4 gap-16 relative';

        // --- 1. Content Area (Left/Top) ---
        const contentArea = document.createElement('div');
        contentArea.className = 'md:col-span-3 space-y-16 order-2 md:order-1';

        types.forEach((type, typeIndex) => {
            const sectionId = `resource-type-${type.toLowerCase().replace(/\s+/g, '-')}`;
            
            const section = document.createElement('div');
            section.id = sectionId;
            section.className = 'scroll-mt-24 mb-32'; // Offset for sticky header and added large bottom margin

            const sectionTitle = document.createElement('h3');
            sectionTitle.className = 'text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-2';
            sectionTitle.textContent = typeLabel(type);
            section.appendChild(sectionTitle);

            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-6';

            groupedItems[type].forEach((item, index) => {
                // Wrapper for animation
                const wrapper = document.createElement('div');
                wrapper.className = 'resource-item-container fade-in-on-scroll w-full';
                wrapper.style.setProperty('--animation-delay', `${index * 0.1}s`);

                // Inner Card
                const card = document.createElement('div');
                card.className = 'bg-gray-50 dark:bg-gray-900 dark:border dark:border-gray-700 p-6 rounded-xl shadow-lg hover-card dark:hover:bg-gray-700 h-full flex flex-col';
                
                const header = document.createElement('div');
                header.className = 'flex items-center justify-between mb-4';
                
                const iconContainer = document.createElement('div');
                iconContainer.className = 'w-10 h-10 bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 rounded-full flex items-center justify-center';
                const icon = document.createElement('span');
                icon.setAttribute('data-lucide', item.icon);
                icon.className = 'w-5 h-5';
                iconContainer.appendChild(icon);

                header.appendChild(iconContainer);

                const title = document.createElement('h4');
                title.className = 'text-lg font-semibold text-gray-900 dark:text-white mb-2';
                title.textContent = item.title;

                const description = document.createElement('p');
                description.className = 'text-gray-600 dark:text-gray-400 text-sm flex-grow mb-6';
                description.textContent = item.description;

                const actionBtn = document.createElement('a');
                actionBtn.href = item.link;
                actionBtn.className = 'inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors';
                
                if (item.action === 'view') {
                    actionBtn.textContent = uiText.viewButton;
                    actionBtn.target = "_blank";
                } else {
                    actionBtn.textContent = uiText.downloadButton;
                    actionBtn.setAttribute('download', '');
                }

                card.appendChild(header);
                card.appendChild(title);
                card.appendChild(description);
                card.appendChild(actionBtn);

                wrapper.appendChild(card);
                grid.appendChild(wrapper);
            });

            section.appendChild(grid);
            contentArea.appendChild(section);
        });

        container.appendChild(contentArea);

        // --- 2. Sidebar Navigation (Right) ---
        const sidebar = document.createElement('div');
        sidebar.className = 'md:block md:col-span-1 order-1 md:order-2'; // Removed 'hidden' completely. Rely on grid placement.

        const stickyWrapper = document.createElement('div');
        stickyWrapper.className = 'sticky top-32';

        const navTitle = document.createElement('h4');
        navTitle.className = 'text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4';
        navTitle.textContent = uiText.categoriesLabel || 'Categories';
        stickyWrapper.appendChild(navTitle);

        const navList = document.createElement('ul');
        navList.className = 'space-y-2 border-l-2 border-gray-200 dark:border-gray-700';

        types.forEach(type => {
            const sectionId = `resource-type-${type.toLowerCase().replace(/\s+/g, '-')}`;
            const listItem = document.createElement('li');
            
            const link = document.createElement('a');
            link.href = `#${sectionId}`;
            link.className = 'block pl-4 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-l-2 hover:border-indigo-600 -ml-[2px] transition-all';
            link.textContent = typeLabel(type);
            
            // Smooth scroll behavior for sidebar links
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById(sectionId);
                if (target) {
                    const headerOffset = 80; // Approx header height
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            });

            listItem.appendChild(link);
            navList.appendChild(listItem);
        });

        stickyWrapper.appendChild(navList);
        sidebar.appendChild(stickyWrapper);
        container.appendChild(sidebar);

        return container;
    },

    /**
     * Renders the Contact section
     * @param {object} data - The `contact` object from portfolioData.
     * @returns {string} - The HTML string for the section content.
     */
    renderContactForm: (data) => {
        const container = document.createElement('div');
        container.className = 'mt-16 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8';

        data.items.forEach((item, index) => {
            const contactBlock = document.createElement('div');
            contactBlock.className = 'contact-item-hover bg-white dark:bg-gray-800 dark:border dark:border-gray-700 p-8 rounded-xl shadow-lg dark:shadow-none flex items-start gap-6 fade-in-on-scroll';
            // Add stagger delay
            if (index > 0) {
                contactBlock.style.setProperty('--animation-delay', `${index * 0.1}s`);
            }

            const iconContainer = document.createElement('div');
            iconContainer.className = 'flex-shrink-0 w-12 h-12 bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 rounded-full flex items-center justify-center';
            const icon = document.createElement('span');
            icon.setAttribute('data-lucide', item.icon);
            icon.className = 'w-6 h-6';
            iconContainer.appendChild(icon);

            const textContainer = document.createElement('div');
            
            const title = document.createElement('h3');
            title.className = 'text-xl font-semibold text-gray-900 dark:text-white';
            title.textContent = item.title;

            const desc = document.createElement('p');
            desc.className = 'mt-1 text-gray-600 dark:text-gray-400';
            desc.textContent = item.description;

            const content = document.createElement('p');
            content.className = 'mt-2 font-medium text-gray-700 dark:text-gray-300';
            
            if (item.link) {
                const link = document.createElement('a');
                link.href = item.link;
                link.className = 'text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 break-all';
                link.innerHTML = item.value; // Using innerHTML to support potential line breaks if sanitized, or textContent if strictly text
                content.appendChild(link);
            } else {
                // For addresses or other text, we might want line breaks
                content.innerHTML = item.value; 
            }

            textContainer.appendChild(title);
            textContainer.appendChild(desc);
            textContainer.appendChild(content);

            contactBlock.appendChild(iconContainer);
            contactBlock.appendChild(textContainer);
            container.appendChild(contactBlock);
        });

        return container;
    }
};

/**
 * ---------------------------------
 * 1.5. HELPER FUNCTIONS
 * ---------------------------------
 */
const generateLinks = (links, isClickable) => {
    return links.map(link => {
        const content = document.createDocumentFragment();
        const icon = document.createElement('span');
        icon.setAttribute('data-lucide', link.icon);
        icon.className = 'w-4 h-4';
        content.appendChild(icon);
        content.appendChild(document.createTextNode(` ${link.name}`));

        const classes = "inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400";
        let element;
        if (isClickable) {
            element = document.createElement('a');
            element.href = link.url;
            element.className = `${classes} hover:text-indigo-800 dark:hover:text-indigo-300`;
        } else {
            element = document.createElement('span');
            element.className = classes;
        }
        element.appendChild(content);
        return element;
    });
};

const generateLinksHTML = (links, isClickable) => {
    return links.map(link => {
        const classes = "inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400";
        const content = `<span data-lucide="${link.icon}" class="w-4 h-4"></span> ${link.name}`;
        if (isClickable) {
            return `<a href="${link.url}" class="${classes} hover:text-indigo-800 dark:hover:text-indigo-300">${content}</a>`;
        }
        return `<span class="${classes}">${content}</span>`;
    }).join('');
};


/**
 * ---------------------------------
 * 2. CORE RENDERING ENGINE
 * ---------------------------------
 */
function renderContent() {
    // Keep the document language in sync with the selected language (screen readers, CJK font selection, hyphenation).
    document.documentElement.lang = currentLanguage;

    const mainContainer = document.querySelector('main');
    const navContainer = document.getElementById('desktop-nav-links');
    const mobileNavContainer = document.getElementById('mobile-nav-links');

    // Clear existing content
    mainContainer.innerHTML = '';
    navContainer.innerHTML = '';
    mobileNavContainer.innerHTML = '';

    // Render sections and navigation
    portfolioData.layout.forEach(sectionInfo => {
        const sectionData = portfolioData[sectionInfo.dataKey];
        if (!sectionData) {
            console.warn(`Data key '${sectionInfo.dataKey}' not found in portfolioData for section '${sectionInfo.id}'.`);
            return;
        }

        // 1. Render Navigation Links using createElement
        const navLink = document.createElement('a');
        navLink.href = `#${sectionInfo.id}`;
        navLink.className = "nav-link text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors px-3 py-2 rounded-md text-sm font-medium";
        navLink.textContent = sectionInfo.nav;
        navContainer.appendChild(navLink);

        const mobileNavLink = document.createElement('a');
        mobileNavLink.href = `#${sectionInfo.id}`;
        mobileNavLink.className = "mobile-nav-link text-gray-700 hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-indigo-400 block px-3 py-2 rounded-md text-base font-medium";
        mobileNavLink.textContent = sectionInfo.nav;
        mobileNavContainer.appendChild(mobileNavLink);

        // 2. Create and render section content
        const renderer = RENDERERS[sectionInfo.renderer];
        if (renderer) {
            const sectionEl = document.createElement('section');
            sectionEl.id = sectionInfo.id;
            
            let finalBgClass = '';
            if (sectionInfo.id !== 'home') {
                if (['biography', 'research', 'teaching'].includes(sectionInfo.id)) {
                    finalBgClass = 'bg-white dark:bg-gray-800';
                } else {
                    finalBgClass = 'bg-gray-50 dark:bg-gray-900';
                }
            }
            sectionEl.className = `page-section py-24 sm:py-32 ${finalBgClass}`;

            if (sectionInfo.id === 'biography') {
                 sectionEl.classList.add('overflow-x-hidden');
            }

            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8';

            const renderedContent = renderer(sectionData, sectionInfo);

            if (sectionInfo.renderer !== 'renderHero') {
                 // Add title and subtitle for non-hero sections
                const textCenterDiv = document.createElement('div');
                textCenterDiv.className = 'text-center';
                
                const title = document.createElement('h2');
                title.className = 'text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white';
                title.textContent = sectionData.title;

                const subtitle = document.createElement('p');
                subtitle.className = 'mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12'; // Added mb-12
                subtitle.textContent = sectionData.subtitle;

                textCenterDiv.appendChild(title);
                textCenterDiv.appendChild(subtitle);
                contentWrapper.appendChild(textCenterDiv);
            }

            if (typeof renderedContent === 'string') {
                // To append a string of HTML after other elements, we need a temporary container
                const tempContainer = document.createElement('div');
                tempContainer.innerHTML = renderedContent;
                while (tempContainer.firstChild) {
                    contentWrapper.appendChild(tempContainer.firstChild);
                }
            } else {
                // If it's a DOM element, just append it
                contentWrapper.appendChild(renderedContent);
            }
            
            sectionEl.appendChild(contentWrapper);
            mainContainer.appendChild(sectionEl);

        } else {
            console.warn(`Renderer '${sectionInfo.renderer}' not found for section '${sectionInfo.id}'.`);
        }
    });

    // Render footer
    const personalData = portfolioData.personal;
    const uiText = portfolioData.uiText.footer; // Get UI text for footer
    document.querySelector('#header-name').textContent = personalData.name;
    const footerCopyright = document.querySelector('#footer-copyright');
    footerCopyright.textContent = `© ${new Date().getFullYear()} ${personalData.name}. ${uiText.rights}`; // Use dynamic text

    const footerSocial = document.querySelector('#footer-social');
    footerSocial.innerHTML = ''; // Clear existing icons
    personalData.social.forEach(link => {
        const socialLink = document.createElement('a');
        socialLink.href = link.url;
        socialLink.className = 'hover:text-gray-900 dark:hover:text-white transition-colors';
        socialLink.setAttribute('aria-label', link.name);
        socialLink.setAttribute('target', '_blank');
        socialLink.setAttribute('rel', 'noopener noreferrer');

        const srOnlySpan = document.createElement('span');
        srOnlySpan.className = 'sr-only';
        srOnlySpan.textContent = link.name;

        const iconSpan = document.createElement('span');
        iconSpan.setAttribute('data-lucide', link.icon);
        iconSpan.className = 'w-5 h-5';

        socialLink.appendChild(srOnlySpan);
        socialLink.appendChild(iconSpan);
        footerSocial.appendChild(socialLink);
    });
    
    // BUG FIX: Manually apply z-index to timeline items to ensure they are on top of the bar.
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.style.zIndex = 2;
    });

    // Accessible labels that live in index.html (the English text there is the fallback)
    const navText = portfolioData.uiText.nav;
    if (navText) {
        const langButton = document.getElementById('lang-toggle');
        if (navText.switchLanguage && langButton) {
            // The button shows the current language; its name says what a click does.
            langButton.setAttribute('aria-label', navText.switchLanguage);
            langButton.setAttribute('title', navText.switchLanguage);
        }
        const menuButton = document.getElementById('mobile-menu-button');
        if (navText.openMenu) {
            menuButton.setAttribute('aria-label', navText.openMenu);
            menuButton.querySelector('.sr-only').textContent = navText.openMenu;
        }
        if (navText.goToTop) {
            document.querySelector('#back-to-top .sr-only').textContent = navText.goToTop;
        }
    }

    // Update SEO Meta Tags
    if (portfolioData.seo) {
        const seo = portfolioData.seo;
        document.querySelector('meta[name="description"]').setAttribute('content', seo.description);
        document.querySelector('meta[property="og:title"]').setAttribute('content', seo.ogTitle);
        document.querySelector('meta[property="og:description"]').setAttribute('content', seo.ogDescription);
        // og:image must be an absolute URL: resolve it against the site URL (or this page when ogUrl is not absolute).
        const ogBase = /^https?:\/\//.test(seo.ogUrl) ? seo.ogUrl : document.baseURI;
        document.querySelector('meta[property="og:image"]').setAttribute('content', seo.ogImage ? new URL(seo.ogImage, ogBase).href : '');
        document.querySelector('meta[property="og:url"]').setAttribute('content', seo.ogUrl);
        document.querySelector('meta[name="twitter:card"]').setAttribute('content', seo.twitterCard);
        document.title = seo.ogTitle; // Sync title
    }
}


/**
 * ---------------------------------
 * 3. UI BEHAVIORS & EVENT LISTENERS
 * ---------------------------------
 */
let intersectionObserver = null; 

function setupUIListeners() {
    // --- Mobile Menu ---
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    menuButton.addEventListener('click', () => {
        const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
        menuButton.setAttribute('aria-expanded', !isExpanded);
        menuButton.classList.toggle('is-active');

        // BUG FIX: Animate mobile menu panel
        if (mobileMenu.classList.contains('is-open')) {
            mobileMenu.classList.remove('is-open');
        } else {
            mobileMenu.classList.remove('hidden');
            setTimeout(() => {
                mobileMenu.classList.add('is-open');
            }, 10);
        }
    });

    mobileMenu.addEventListener('transitionend', () => {
        if (!mobileMenu.classList.contains('is-open')) {
            mobileMenu.classList.add('hidden');
        }
    });

    document.getElementById('mobile-nav-links').addEventListener('click', () => {
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.classList.remove('is-active');
        mobileMenu.classList.remove('is-open');
    });

    // --- Dark Mode ---
    const themeToggleBtn = document.getElementById('dark-mode-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    const setTheme = (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.theme = theme;
        sunIcon.classList.toggle('hidden', theme !== 'dark');
        moonIcon.classList.toggle('hidden', theme === 'dark');
    };

    themeToggleBtn.addEventListener('click', () => setTheme(localStorage.theme === 'dark' ? 'light' : 'dark'));
    setTheme(localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light');

    // --- Language Toggle ---
    const langToggleBtn = document.getElementById('lang-toggle');
    if (langToggleBtn) {
        updateLangButton(); // Set initial text
        langToggleBtn.addEventListener('click', async () => {
            if (currentLanguage === 'en') {
                currentLanguage = 'ja';
            } else {
                currentLanguage = 'en';
            }
            
            localStorage.setItem('lang', currentLanguage);
            updateLangButton();
            
            await loadData();
            
            // Re-render the entire application with new data
            renderContent();
            // Re-initialize icons
            lucide.createIcons();
            // Re-apply filters if on a filterable page
            setupFilterSystem('publication-filters', 'publication-list', 'publication-item-container');
            setupFilterSystem('projects-filters', 'projects-list', 'project-item-container');
            
            // Ensure we stay on the same section (or update nav links if names changed)
            handleNavigation(window.location.hash);
        });
    }

    // --- Modal Logic ---
    const modal = document.getElementById('item-modal');
    
    // Function to open the modal
    const openModal = (item) => {
        // Populate modal content
        document.getElementById('item-modal-title').textContent = item.dataset.modalTitle || '';
        document.getElementById('item-modal-subtitle').innerHTML = item.dataset.modalSubtitle || '';
        document.getElementById('item-modal-date').textContent = item.dataset.modalDate || '';
        document.getElementById('item-modal-description').innerHTML = item.dataset.modalDescription || '';
        document.getElementById('item-modal-links').innerHTML = item.dataset.modalLinks || '';

        // Hide empty elements to prevent awkward spacing
        document.getElementById('item-modal-subtitle').style.display = item.dataset.modalSubtitle ? 'block' : 'none';
        document.getElementById('item-modal-date').style.display = item.dataset.modalDate ? 'block' : 'none';
        document.getElementById('item-modal-links').style.display = item.dataset.modalLinks ? 'flex' : 'none';

        // If there are new icons in the links, render them (scoped to the modal links)
        if (item.dataset.modalLinks) lucide.createIcons({ root: document.getElementById('item-modal-links') });

        // Add the 'is-open' class to trigger the animation
        modal.classList.add('is-open');
    };

    // Function to close the modal
    const closeModal = () => {
        modal.classList.remove('is-open');
    };

    // Event listener to open the modal (Click)
    document.body.addEventListener('click', (event) => {
        const item = event.target.closest('.clickable-modal');
        if (item) {
            openModal(item);
        }
    });

    // Event listener to open the modal (Keyboard: Enter or Space)
    document.body.addEventListener('keydown', (event) => {
        if ((event.key === 'Enter' || event.key === ' ') && event.target.closest('.clickable-modal')) {
            event.preventDefault();
            openModal(event.target.closest('.clickable-modal'));
        }
    });

    // Event listeners to close the modal
    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        // Only close if the click is on the overlay itself, not the content
        if (e.target === modal) {
            closeModal();
        }
    });
    document.addEventListener('keydown', (e) => {
        // Close on 'Escape' key press
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });

    /**
     * REUSABLE FILTER SYSTEM
     * Handles filtering for both Publications and Projects to avoid code duplication.
     */
    function setupFilterSystem(containerId, listId, itemClass) {
        const filtersContainer = document.getElementById(containerId);
        if (!filtersContainer) return;

        const listContainer = document.getElementById(listId);
        const searchInput = filtersContainer.querySelector('.search-input');
        let activeFilter = 'all';
        let searchTerm = '';

        const applyFilters = () => {
            // Note: Use querySelectorAll on the specific list container
            const items = listContainer.querySelectorAll(`.${itemClass}`);
            items.forEach(item => {
                const matchesFilter = activeFilter === 'all' || item.dataset.category.split('|').includes(activeFilter);
                const matchesSearch = searchTerm === '' || item.dataset.searchText.includes(searchTerm);
                
                if (matchesFilter && matchesSearch) {
                    // Use appropriate display property based on item type
                    // Projects use 'block' (grid items), Publications use 'flex'
                    item.style.display = itemClass.includes('project') ? 'block' : 'flex'; 
                } else {
                    item.style.display = 'none';
                }
            });
        };

        // Event listener for filter buttons
        filtersContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                const currentActive = filtersContainer.querySelector('.filter-btn.is-active');
                if (currentActive) currentActive.classList.remove('is-active');
                
                e.target.classList.add('is-active');
                activeFilter = e.target.dataset.filter;
                applyFilters();
            }
        });

        // Event listener for search input
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchTerm = e.target.value.toLowerCase().trim();
                applyFilters();
            });
        }

        // Initial apply
        applyFilters();
    };

    // Initialize filters
    setupFilterSystem('publication-filters', 'publication-list', 'publication-item-container');
    setupFilterSystem('projects-filters', 'projects-list', 'project-item-container');

    // --- Window Resize Handler ---
    // Closes mobile menu when resizing to desktop view
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) { // md breakpoint
            if (mobileMenu.classList.contains('is-open')) {
                menuButton.setAttribute('aria-expanded', 'false');
                menuButton.classList.remove('is-active');
                mobileMenu.classList.remove('is-open');
                mobileMenu.classList.add('hidden');
            }
        }
    });
}

/**
 * ---------------------------------
 * 4. NAVIGATION & SCROLLING
 * ---------------------------------
 */
function handleNavigation(hash) {
    const targetPageId = hash ? hash.substring(1) : portfolioData.layout[0].id;
    const targetPage = document.getElementById(targetPageId);
    const currentPage = document.querySelector('.page-section.active');

    if (targetPage === currentPage) return;

    const updateNavLinks = () => {
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${targetPageId}`);
        });
    };

    if (currentPage) {
        currentPage.style.animation = 'pageFadeOut 0.3s ease-out forwards';
        setTimeout(() => {
            currentPage.classList.remove('active');
            // Force animation reset
            currentPage.style.animation = 'none';
            void currentPage.offsetWidth; 

            if (targetPage) {
                targetPage.classList.add('active');
                targetPage.style.animation = 'pageFadeIn 0.3s ease-in forwards';
                // Re-initialize observer for the new page to make animations replay
                setupIntersectionObserver(targetPage);
                lucide.createIcons({ root: targetPage }); // Re-render icons for the new active page
            }
            updateNavLinks();
            window.scrollTo(0, 0);

        }, 300);
    } else if (targetPage) {
        // Initial page load
        targetPage.classList.add('active');
        targetPage.style.animation = 'pageFadeIn 0.3s ease-in forwards';
        updateNavLinks();
        setupIntersectionObserver(targetPage);
        lucide.createIcons(); // Render icons on initial load
    }
}

function setupIntersectionObserver(parentElement) {
    const elementsToAnimate = parentElement.querySelectorAll('.fade-in-on-scroll');
    if (elementsToAnimate.length === 0) return;
    
    // Use a single, persistent observer if one doesn't exist.
    if (!intersectionObserver) {
        const options = { root: null, rootMargin: '0px', threshold: 0.1 };
        intersectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    entry.target.classList.remove('is-visible');
                }
            });
        }, options);
    }
    
    // Observe all elements on the current page
    elementsToAnimate.forEach(item => intersectionObserver.observe(item));
}

function setupBackToTopButton() {
    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.remove('hidden');
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * ---------------------------------
 * 5. INITIAL PAGE LOAD
 * ---------------------------------
 */
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    if (!portfolioData) return;
    renderContent();
    setupUIListeners();
    setupBackToTopButton();
    lucide.createIcons();
    handleNavigation(window.location.hash);
});

window.addEventListener('hashchange', () => {
    handleNavigation(window.location.hash);
});