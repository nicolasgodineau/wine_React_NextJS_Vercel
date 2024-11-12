export function extractSections(blocks) {
    const sections = [];
    let currentSection = null;
    let currentSubsection = null;

    blocks.forEach((block) => {
        if (block.type === 'heading_1') {
            // Finaliser la section précédente si elle existe
            if (currentSection) {
                sections.push(currentSection);
            }
            // Créer une nouvelle section principale
            currentSection = {
                heading: block,
                content: [],
                subsections: []
            };
            currentSubsection = null; // Réinitialiser la sous-section courante
        } else if (block.type === 'heading_2' && currentSection) {
            // Finaliser la sous-section précédente si elle existe
            if (currentSubsection) {
                currentSection.subsections.push(currentSubsection);
            }
            // Créer une nouvelle sous-section
            currentSubsection = {
                heading: block,
                content: []
            };
        } else if (currentSubsection) {
            // Ajouter le bloc au contenu de la sous-section courante
            currentSubsection.content.push(block);
        } else if (currentSection) {
            // Ajouter le bloc au contenu principal de la section si pas de sous-section en cours
            currentSection.content.push(block);
        }
    });

    // Finaliser la dernière sous-section si elle existe
    if (currentSubsection && currentSection) {
        currentSection.subsections.push(currentSubsection);
    }

    // Finaliser la dernière section si elle existe
    if (currentSection) {
        sections.push(currentSection);
    }

    return sections;
}