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

    const container = document.querySelector('#article-section');
    notifyWhenStickyHeadersChange(container);

    const THEME_COLOR_TAG = document.querySelector('meta[name=theme-color]');

    document.addEventListener('sticky-change', e => {
        // Update sticking header title.
        const [header, stuck] = [e.detail.target, e.detail.stuck];
        header.classList.toggle('shadow', stuck);

        const className = e.detail.target.className;


        setThemeColor(className, THEME_COLOR_TAG)

        const str = stuck ? header.textContent : '--';
    });
}

function getCssVariable(variableName) {
    return getComputedStyle(document.body).getPropertyValue(variableName);
}

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
function addSentinels(container, className) {
    return Array.from(container.querySelectorAll('.sticky')).map(el => {
        const sentinel = document.createElement('div');
        sentinel.classList.add('sticky_sentinel', className);
        return el.parentElement.appendChild(sentinel);
    });
}

/**
 * Sets up an intersection observer to notify when elements with the class
 * `.sticky_sentinel--top` become visible/invisible at the top of the container.
 * @param {!Element} container
 */
function observeHeaders(container) {
    const observer = new IntersectionObserver((records, observer) => {
        for (const record of records) {
            const targetInfo = record.boundingClientRect;
            const stickyTarget = record.target.parentElement.querySelector('.sticky');
            const rootBoundsInfo = record.rootBounds;

            if (targetInfo.bottom < rootBoundsInfo.top) {
                fireEvent(true, stickyTarget);
            }

            if (targetInfo.bottom >= rootBoundsInfo.top &&
                targetInfo.bottom < rootBoundsInfo.bottom) {
                    fireEvent(false, stickyTarget);
                }
            }
    }, {
        // rootMargin: '-16px',
        threshold: [0],
        root: container
    });

    // Add the bottom sentinels to each section and attach an observer.
    const sentinels = addSentinels(container, 'sticky_sentinel--top');
    sentinels.forEach(el => observer.observe(el));
}

  /**
   * Sets up an intersection observer to notify when elements with the class
   * `.sticky_sentinel--bottom` become visible/invisible at the botton of the
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
      // rootMargin: '16px',
      // Get callback slightly before element is 100% visible/invisible.
      threshold: [1],
      root: container
    });

    // Add the bottom sentinels to each section and attach an observer.
    const sentinels = addSentinels(container, 'sticky_sentinel--bottom');
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
