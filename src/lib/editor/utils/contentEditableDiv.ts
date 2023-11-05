import Prism from "prismjs";
import styles from "@/lib/editor/components/styles";
import 'prismjs/components/index';
import 'prismjs/plugins/autoloader/prism-autoloader';

export default function contentEditableDiv(value: string, language: string = "") {
    Prism.plugins.autoloader.languages_path = `https://unpkg.com/prismjs@latest/components/`;
    Prism.plugins.autoloader.use_minified = true;

    // Check if an existing contentEditableDiv exists and update its content if needed
    const existingDiv = document.querySelector('.code-editor');
    if (existingDiv) {
        existingDiv.textContent = value;
        Prism.highlightElement(existingDiv);
        return existingDiv;
    }

    const contentEditableDiv = document.createElement('div');
    contentEditableDiv.contentEditable = String(true);
    contentEditableDiv.spellcheck = false;
    contentEditableDiv.autocapitalize = 'off';
    contentEditableDiv.textContent = value;
    contentEditableDiv.className = `language-${language} outline-none focus:ring-2 focus:ring-gray-400 code-editor w-full`;

    Object.assign(contentEditableDiv.style, {...styles.container});

    Prism.highlightElement(contentEditableDiv);

    return contentEditableDiv
}
