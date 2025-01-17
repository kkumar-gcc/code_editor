import {ReactNode} from "react";

interface EditorProps {
    defaultValue?: string;
    defaultLanguage?: string;
    value?: string;
    language?: string;
    theme?: string;
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    loading?: ReactNode;
    width?: string | number;
    height?: string | number;
    className?: string;
    readOnly?: boolean;
    onChange?: (value: string) => void;
    onSave?: () => void;
    onFind?: () => void;
    onReplace?: () => void;
    onMount?: () => void;
    onValidate?: () => void;
}

export default EditorProps;