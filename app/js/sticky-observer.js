window.onload = () => {
    const SECTIONS = [
        'City Lights',
        'Money Carp',
        'tff 2017',
        'Lily in a Box',
        'Library Lights',
    ];


    shuffle(SECTIONS);

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

    const container = document.querySelector('#article-section');
    notifyWhenStickyHeadersChange(container);

    const THEME_COLOR_TAG = document.querySelector('meta[name=theme-color]');
    const SECTION_LIST_ITEM = document.querySelectorAll('#section-list .section-list-item');
    const SECTION_LIST_ITEMS = Array.from(SECTION_LIST_ITEM);

    /**
     *
     */
    document.addEventListener('sticky-change', element => {
        // Update sticking header title.
        const [header, stuck] = [element.detail.target, element.detail.stuck];
        const className = element.detail.target.className;
        const HEADING_ID = header.getElementsByTagName('h2')[0].id;

        header.classList.toggle('shadow', stuck);

        // Select the current list-item inside
        SECTION_LIST_ITEMS.map(listItem =>  {
            const LINK_HREF = listItem.firstElementChild.getAttribute('href').slice(1);

            listItem.classList.toggle('active', LINK_HREF === HEADING_ID);
        });

        setThemeColor(className, THEME_COLOR_TAG)
    });

    /**
     * Event-Delegation to add an Event-Listener
     * on each SECTION_LIST a-Tag
     */
    SECTION_LIST.addEventListener('click', event => {
        let target = event.target;
        if (target.tagName != 'A') return;

        scrollToTopic(target);
    });

    document.querySelector('#debug-mode').addEventListener('click', element => {
        toggleDebugMode();
    });

    if (window.innerWidth <= 425) {
        // Fix for Chrome-Mobile
        calcVH();
    }
}

let debugMode = false;

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


/**
 * Dispatches a `sticky-event` custom event on the element.
 * @param {boolean} stuck
 * @param {!Element} target Target element of event.
 */
function fireEvent(stuck, target) {
    const evt = new CustomEvent('sticky-change', {
        detail: {
            stuck,
            target
        }}
    );

    document.dispatchEvent(evt);
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

/**
 * Sets up an intersection observer to notify when elements with the class
 * `.intersection_area--top` become visible/invisible at the top of the container.
 * @param {!Element} container
 */
function observeHeaders(container) {
    const observer = new IntersectionObserver((records, observer) => {
        for (const record of records) {
            const ELEMENT_COORDINATES = record.boundingClientRect;
            const TARGET_ELEMENT = record.target.parentElement.querySelector('.sticky');
            const rootBoundsInfo = record.rootBounds;

            if (ELEMENT_COORDINATES.bottom < rootBoundsInfo.top) {
                fireEvent(true, TARGET_ELEMENT);
            }

            if (ELEMENT_COORDINATES.bottom >= rootBoundsInfo.top &&
                ELEMENT_COORDINATES.bottom < rootBoundsInfo.bottom) {
                    fireEvent(false, TARGET_ELEMENT);
                }
            }
    }, {
        threshold: [0],
        root: container
    });

    // Add the bottom sentinels to each section and attach an observer.
    const sentinels = attachIntersectionArea(container, 'intersection_area--top');
    sentinels.forEach(el => observer.observe(el));
}

/**
 * Sets up an intersection observer to notify when elements with the class
 * `.intersection_area--bottom` become visible/invisible at the botton of the
 * container.
 * @param {!Element} container
 */
function observeFooters(container) {
const observer = new IntersectionObserver((records, observer) => {
    for (const record of records) {
        const targetInfo = record.boundingClientRect;
        const stickyTarget = record.target.parentElement.querySelector('.sticky');
        const rootBoundsInfo = record.rootBounds;
        const ratio = record.intersectionRatio;

        if (targetInfo.bottom > rootBoundsInfo.top && ratio === 1) {
            fireEvent(true, stickyTarget);
        }

        if (targetInfo.top < rootBoundsInfo.top &&
            targetInfo.bottom < rootBoundsInfo.bottom) {
            fireEvent(false, stickyTarget);
        }
    }
    }, {
        // Get callback slightly before element is 100% visible/invisible.
        threshold: [1],
        root: container
    });

    // Add the bottom sentinels to each section and attach an observer.
    const sentinels = attachIntersectionArea(container, 'intersection_area--bottom');
    sentinels.forEach(el => observer.observe(el));
}

/**
 * Notifies when elements that have the class `sticky` begin to stick or not.
 * Note: these should be children of the `container` element.
 */
function notifyWhenStickyHeadersChange(container) {
    observeHeaders(container);
    observeFooters(container);
}
