# Scrollspy-Pattern ohne Scroll-Event

Das sogenannte Scrollspy-Pattern wird häufig in Blogs verwendet,
um dem Nutzer einen Fortschritt des gelesenen Inhalts zu präsentieren
oder die aktuelle Teilüberschrift hervorzuheben wenn diese den oberen Rand des Bildschirms erreicht hat.
Aussehen kann das ganze dann in etwa so:<br>
![https://code.visualstudio.com/docs/languages/markdown](scroll-spy.gif "Scroll Spy Example")<br>
Frameworks wie Bootstrap oder Plug-ins setzen dieses Pattern schon länger mit Hilfe von Scroll-Events um.
Bisher gab es keine einfache Möglichkeit zu sagen "Dieses Element ist jetzt für den Nutzer sichtbar"
oder "Dieses Element ist nun ganz oben". Gelöst wurde dieses Problem dadurch, dass für jeden Pixel den der Nutzer bereits gescrollt hat, überprüft wird, ob die Top-Position der Elemente den gewünschten Wert erreicht haben oder nicht.
Das diese Art nicht unbedingt effizient ist sollte klar sein, aber wie löst man das ganze besser?
Unser Retter kommt in Form der [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), einer zurzeit noch experimentellen API und der CSS-Position 'sticky'. Moderne Browser unterstützen diese API bereits, Safari hat noch nichts diesbezüglich implementiert. Jedes mal wenn eine unserer Teilüberschriften 'sticky' ist, also am oberen Rand klebt, möchten wir diese optisch Hevorheben - durch einen Schatten zum Beispiel und zusätzlich soll diese Überschrift in unserem Seiten-Menü markiert werden. // Das sieht so aus //.

## Vorbereitungen und Dummy-Content
Um den Beispiel-"Blog" mit etwas Leben zu füllen und Dinge zu vereinfachen, wird dessen Inhalt dynamisch anhand einer Liste von Bezeichnern gefüllt, welche normalisiert in den Templates ausgegeben werden.
```
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
```
Daraus ergeben sich:
- Teilüberschriften
- Bildpfade
- IDs und Links zu diesen

Einheitliche IDs zu haben ist deswegen wichtig, da wir später die aktuelle Überschrift im Seitenmenü markieren wollen und die IDs irgendwie referenzieren müssen.

## Klebt's?

Wann ist ein Element sticky? Leider gibt es kein Event welches ausgelöst wird, wenn ein Element diesen Zustand erreicht hat.
Kein Problem, wir schreiben uns einfach unser eigenes Event und binden dieses als Event an das document. Diese Elemente sind auch nicht mehr Teil des Layouts, Berechnungen mit top und ähnlichem fallen also auch flach. Um ein eigenes Event zu schreiben, können wir das CustomEvent-Interface nutzen welches einen Bezeichner erwartet und optional über 'detail' die Möglichkeit bietet, zusätzliche Daten mitzugeben. Wir geben über details mit ob und welches Element sticky sein wird.

```
/**
 * Custom event w/ additional properties
 *
 * @param {boolean} sticky True if element is sticky
 * @param {HTML} target Target element.
 */
function callCustomStickyEvent(sticky, target) {
    const stickyCustomEvent = new CustomEvent('sticky-state', {
        detail: {
            sticky,
            target
        }}
    );

    document.dispatchEvent(stickyCustomEvent);
}
```
Stattdessen nutzen wir für den Nutzer nicht sichtbare Container die jeweils vor und nach diesem hängen.
Damit fangen wir vier Zustände ab während der Nutzer scrollt:
1. ↑ Überschrift ist nicht mehr sticky wenn der obere Container wieder von oben herab in die View gescrollt wird.
2. ↑ Überschrift wird sticky wenn dessen unterer Container von oben herab in die View kommt
3. ↓ Überschrift wird sticky wenn dessen oberer Container die obere Kante des Blog-Beitrags erreicht
4. ↓ Überschrift ist nicht mehr sticky wenn es die untere Kante des Blogs erreicht hat

Um diese Container zu überwachen, benötigen wir den Intersection-Observer

## Intersection-Observer
Wie bereits erwähnt, müssen wir jeweils zwei Container überwachen, brauchen demnach auch zwei Observer.
Hier exemplarisch der Observer für die unteren Container.

```
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

            // unsticky
            if (
                ELEMENT_COORDINATES.top < ENTRY_ROOTBOUNDS.top &&
                ELEMENT_COORDINATES.bottom < ENTRY_ROOTBOUNDS.bottom
            ) {
                callCustomStickyEvent(false, TARGET_ELEMENT);
            }

            // sticky
            if (ELEMENT_COORDINATES.bottom > ENTRY_ROOTBOUNDS.top && INTERSECTION_RATIO === 1) {
                callCustomStickyEvent(true, TARGET_ELEMENT);
            }
        }
    }, {
        root: container,
        threshold: [1]
    });

    const BOTTOM_AREAS = attachIntersectionArea(container, 'intersection_area--bottom');
    BOTTOM_AREAS.forEach(bottomArea => OBSERVER.observe(bottomArea));
}
```
Hier interessant:
- boundingClientRect: Größe und Position des Containers
- rootBounds: Größe und Position des umliegenden Dokuments
- intersectionRatio: Wert zwischen 0 & 1 der angibt wie viel von einem Objekt zu sehen ist
- root: Das Root-Element welches als Bezugspunkt dient
- threshold: Gibt an, wieviel von einem Objket sichtbar sein muss, damit es als sichtbar gilt, 1 bedeutet "komplette höhe"

## Weitere Anwendungsfälle

Abschließend noch weitere Anwendungsfälle:
- Lazy-loading um Bilder zu verzögert nachzuladen
- Infinite-Scroll um weitere Produkte (oder Blogbeiträge) nachzuladen
- Genaurere Abrechnung von tatsächlich gesehener Werbung

Viel Spaß, der ganze Code befindet sich hier:
