window.onload = () => {
    const SECTIONS = [
        'City Lights',
        'Money Carp',
        'tff 2017',
        'Lily in a Box',
        'Library Lights',
    ];

    const ARTICLE_SECTION = document.querySelector('#article-section');
    const SECTION_LIST = document.querySelector('#section-list');
    let arcticleSectionTemplate = '';
    let sectionListTemplate = '';

    SECTIONS.forEach(section => {
        arcticleSectionTemplate += createSections(section);
        sectionListTemplate += createSectionList(section);
    });

    ARTICLE_SECTION.insertAdjacentHTML('beforeend', arcticleSectionTemplate);
    SECTION_LIST.insertAdjacentHTML('beforeend', sectionListTemplate);
}

/**
 * Normalizes sections by replacing
 * space with underscores and lowercase everything.
 *
 * Is used to create CSS-Class-Names and to set image paths as well.
 *
 * @param {string} section
 * @returns {string}
 */
function normalizeSectionNames(section) {
    return section.replace(/ /g, '_').toLowerCase();
}

/**
 * Uses getComputedStyle to determine if an element is positioned 'sticky'
 *
 * @param {HTML} element
 * @returns {boolean}
 */
function isElementSticky(element) {
    const POSTION_VALUE = getComputedStyle(element).position;
    return POSTION_VALUE.match('sticky') !== null;
}
