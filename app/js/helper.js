/**
 * Normalizes sections by replacing
 * spaces with underscores and lowercase everything.
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
 * Hack to fix Chrome-Mobile's 100vh behaviour
 */
function calcVH() {
    let VH = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
    );

    document
        .querySelector('body')
        .setAttribute('style', `height: ${VH}px;`);
}

/**
 * scrollToTopic
 *
 * @param {*} element
 */
function scrollToTopic(element) {
    event.preventDefault();
    // Get the section in a normalized way
    const NORMALIZED_SECTION = normalizeSectionNames(element.textContent);
    // TARGET_ELEMENT is a sections h2-Element
    const TARGET_ELEMENT = document.querySelector(`#${NORMALIZED_SECTION}`);
    // Get parent-Element using the h2-Element
    const SECTION_ELEMENT = TARGET_ELEMENT.parentElement.parentElement;

    // Scroll-behaviour is smooth because arcticle scroll-behavior: smooth is set
    document.querySelector('#article-section').scrollTo({
        top: SECTION_ELEMENT.offsetTop + 3
    })
}

/**
 * Shuffle Array order
 *
 * © https://stackoverflow.com/a/6274398
 * @param {Array} array
 */
function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}


/**
 * Returns native CSS-variables
 *
 * @param {String} variableName
 */
function getCssVariable(variableName) {
    return getComputedStyle(document.body).getPropertyValue(variableName);
}


/**
 * Changes the meta theme-color-Tag to match a sections color
 *
 * @param {String} className
 * @param {HTML} target
 */
function setThemeColor(className, target) {
    let themeColorValue = '';

    if (className.includes('bg-color--city_lights')) {
        themeColorValue = getCssVariable('--city_lights');
    }

    if (className.includes('bg-color--money_carp')) {
        themeColorValue = getCssVariable('--carp-color');
    }

    if (className.includes('bg-color--tff_2017')) {
        themeColorValue = getCssVariable('--blue-color');
    }

    if (className.includes('bg-color--lily_in_a_box')) {
        themeColorValue = getCssVariable('--brown-color');
    }

    if (className.includes('bg-color--library_lights')) {
        themeColorValue = getCssVariable('--library-color');
    }

    target.setAttribute('content', themeColorValue);
}


function toggleDebugMode() {
    debugMode = !debugMode;
    document.body.classList.toggle('debug', debugMode);
    const sentinels = Array.from(document.querySelectorAll('.intersection_area'));
    sentinels.forEach(el => {
        el.textContent = el.className;
    });
}

/**
 * @param {!Element} container
 * @param {string} className
 */
function attachIntersectionArea(container, className) {
    const STICKY_ELEMENTS = Array.from(container.querySelectorAll('.sticky'));
    return STICKY_ELEMENTS.map(element => {
        const INTERSECTION_AREA = document.createElement('div');
        INTERSECTION_AREA.classList.add('intersection_area', className);

        return element.parentElement.appendChild(INTERSECTION_AREA);
    });
}
