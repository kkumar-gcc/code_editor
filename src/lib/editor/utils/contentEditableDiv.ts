
export default function contentEditableDiv(value: string) {
    // Check if an existing contentEditableDiv exists and update its content if needed
    const existingDiv = document.querySelector('.code-editor');
    if (existingDiv) {
        existingDiv.textContent = value;
        return existingDiv;
    }

    const contentEditableDiv = document.createElement('div');
    contentEditableDiv.contentEditable = String(true);
    contentEditableDiv.spellcheck = false;
    contentEditableDiv.autocapitalize = 'off';
    contentEditableDiv.innerText = value;
    contentEditableDiv.className = "outline-none focus:ring-2 focus:ring-gray-400 code-editor w-full";
    contentEditableDiv.style.whiteSpace = 'pre';
    contentEditableDiv.style.display = "inline-block";

    return contentEditableDiv
}
