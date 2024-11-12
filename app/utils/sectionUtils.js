export function extractSections(blocks) {
    const sections = [];
    let currentSection = null;

    blocks.forEach((block) => {
        if (block.type === 'heading_1') {
            if (currentSection) {
                sections.push(currentSection);
            }
            currentSection = {
                heading: block,
                content: []
            };
        } else if (currentSection) {
            currentSection.content.push(block);
        }
    });

    if (currentSection) {
        sections.push(currentSection);
    }

    return sections;
}