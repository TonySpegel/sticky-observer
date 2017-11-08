window.onload = () => {
    const SECTIONS = [
        'City Lights',
        'Money Carp',
        'tff 2017',
        'Lily in a Box',
        'Library Lights',
    ];

    SECTIONS.forEach(section => {
        console.log(normalizeSectionNames(section));
    })
}

/**
 *
 * @param {string} section
 */
function normalizeSectionNames(section) {
    return section.replace(/ /g, '_').toLowerCase();
}
