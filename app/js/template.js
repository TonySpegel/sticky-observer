function createSections(section) {
    const SECTION_NORMALIZED = normalizeSectionNames(section);
    let template =
        `<section>
            <div class="sticky bg-color--${SECTION_NORMALIZED}">
                <img src="./img/${SECTION_NORMALIZED}.jpg" alt="${section}" />
                <h2 id="${SECTION_NORMALIZED}">${section}</h2>
            </div>
            <div>
                Show pony churning anomalies we need to dialog around your choice of work attire, so feature creep, nor work. Cannibalize core competencies, for that jerk from finance really threw me under the bus, and pull in ten extra bodies to help roll the tortoise. Going forward sacred cow, so diversify kpis nor clear blue water so please advise soonest shotgun approach, nor draw a line in the sand. Put your feelers out we need more paper but rock Star/Ninja close the loop so please use "solutionise" instead of solution ideas! :). Churning anomalies collaboration through advanced technlogy. Powerpoint Bunny. Goalposts we just need to put these last issues to bed, so new economy or value-added action item reach out. We need more paper out of the loop globalize. Gain traction innovation is hot right now or hit the ground running, for baseline the procedure and samepage your department table the discussion let's unpack that later staff engagement.
            </div>
        </section>`;

    return template;
}

function createSectionList(section) {
    const SECTION_NORMALIZED = normalizeSectionNames(section);
    let template =
        `<li class="section-list-item">
            <a href="#${SECTION_NORMALIZED}">${section}</a>
        </li>`
    ;

    return template;
}
