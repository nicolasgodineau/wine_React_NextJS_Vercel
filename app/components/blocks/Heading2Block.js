export function Heading2Block({ block }) {
    // Vérifiez si le bloc contient des rich_text
    const headingText = block.heading_2.rich_text.map((text) => text.plain_text).join('');

    return (
        <h2 className="text-2xl font-bold text-center p-2">
            {headingText}
        </h2>
    );
}