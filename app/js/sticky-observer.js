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
    const THEME_COLOR_TAG = document.querySelector('meta[name=theme-color]');
    let arcticleSectionTemplate = '';
    let sectionListTemplate = '';

    shuffle(SECTIONS);

    // Create HTML-Templates
    SECTIONS.forEach(section => {
        arcticleSectionTemplate += createSections(section);
        sectionListTemplate += createSectionList(section);
    });

    // Create HTML-Templates
    ARTICLE_SECTION.insertAdjacentHTML('beforeend', arcticleSectionTemplate);
    SECTION_LIST.insertAdjacentHTML('beforeend', sectionListTemplate);

    const SECTION_LIST_ITEMS = Array.from(document.querySelectorAll('#section-list .section-list-item'));

    notifyWhenStickyHeadersChange(ARTICLE_SECTION);

    /**
     *
     */
    document.addEventListener('sticky-change', element => {
        const [header, sticky] = [element.detail.target, element.detail.sticky];
        const CLASS_NAME = element.detail.target.className;
        const HEADING_ID = header.getElementsByTagName('h2')[0].id;

        header.classList.toggle('shadow', sticky);

        // Select the current list-item inside
        SECTION_LIST_ITEMS.map(listItem =>  {
            const LINK_HREF = listItem.firstElementChild.getAttribute('href').slice(1);

            listItem.classList.toggle('active', LINK_HREF === HEADING_ID);
        });

        setThemeColor(CLASS_NAME, THEME_COLOR_TAG);
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
 * Dispatches a `sticky-event` custom event on the element.
 * @param {boolean} sticky True if element is sticky
 * @param {HTML} target Target element.
 */
function callCustomStickyEvent(sticky, target) {
    const stickyCustomEvent = new CustomEvent('sticky-change', {
        detail: {
            sticky,
            target
        }}
    );

    document.dispatchEvent(stickyCustomEvent);
}


/**
 * Calls callCustomStickyEvent when 'intersection_area--bottom' Elements become visible/invisible
 * at the top of the container (a section)
 *
 * @param {HTML} container
 */
function observeTopContainers(container) {
    const OBSERVER = new IntersectionObserver(records => {
        for (const record of records) {
            const ELEMENT_COORDINATES = record.boundingClientRect;
            const TARGET_ELEMENT = record.target.parentElement.querySelector('.sticky');
            const RECORD_ROOTBOUNDS = record.rootBounds;

            if (ELEMENT_COORDINATES.bottom < RECORD_ROOTBOUNDS.top) {
                callCustomStickyEvent(true, TARGET_ELEMENT);
            }

            if (
                ELEMENT_COORDINATES.bottom >= RECORD_ROOTBOUNDS.top &&
                ELEMENT_COORDINATES.bottom < RECORD_ROOTBOUNDS.bottom
            ) {
                callCustomStickyEvent(false, TARGET_ELEMENT);
            }
        }
    }, {
        threshold: [0],
        root: container
    });

    // Add the bottom sentinels to each section and attach an observer.
    const TOP_AREAS = attachIntersectionArea(container, 'intersection_area--top');
    TOP_AREAS.forEach(el => OBSERVER.observe(el));
}

/**
 * Calls callCustomStickyEvent when 'intersection_area--bottom' Elements become visible/invisible
 * at the bottom of the container (a section)
 *
 * @param {HTML} container
 */
function observeBottomContainers(container) {
    const OBSERVER = new IntersectionObserver(entries => {
        for (const entry of entries) {
            const ELEMENT_COORDINATES = entry.boundingClientRect;
            const TARGET_ELEMENT = entry.target.parentElement.querySelector('.sticky');
            const ENTRY_ROOTBOUNDS = entry.rootBounds;
            const INTERSECTION_RATIO = entry.intersectionRatio;

            if (ELEMENT_COORDINATES.bottom > ENTRY_ROOTBOUNDS.top && INTERSECTION_RATIO === 1) {
                callCustomStickyEvent(true, TARGET_ELEMENT);
            }

            if (
                ELEMENT_COORDINATES.top < ENTRY_ROOTBOUNDS.top &&
                ELEMENT_COORDINATES.bottom < ENTRY_ROOTBOUNDS.bottom
            ) {
                callCustomStickyEvent(false, TARGET_ELEMENT);
            }
        }
    }, {
        root: container,
        threshold: [1]
    });

    const BOTTOM_AREAS = attachIntersectionArea(container, 'intersection_area--bottom');
    BOTTOM_AREAS.forEach(bottomArea => OBSERVER.observe(bottomArea));
}

/**
 * Notifies when elements that have the class `sticky` begin to stick or not.
 * Note: these should be children of the `container` element.
 */
function notifyWhenStickyHeadersChange(container) {
    observeTopContainers(container);
    observeBottomContainers(container);
}
