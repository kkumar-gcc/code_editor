"use client"

import React, {useCallback, useEffect, useRef, useState} from 'react';
import EditorProps from './EditorProps';
import styles from "./styles";
import "./Editor.css";
import contentEditableDiv from "../utils/contentEditableUtils";

export default function Editor({
                                   defaultValue,
                                   defaultLanguage,
                                   value,
                                   language,
                                   theme,
                                   line,
                                   loading = "Loading...",
                                   width,
                                   height,
                                   className,
                                   readOnly = false,
                                   onChange,
                                   onSave,
                                   onFind,
                                   onReplace,
                                   onMount,
                                   onValidate
                               }: EditorProps
) {
    const [isEditorReady, setIsEditorReady] = useState(false);
    const [isEditorMounting, setIsEditorMounting] = useState(true);
    const editorRef = useRef<any>(null);
    const containerRef = useRef<any>(null);
    const onMountRef = useRef(onMount);
    const onChangeRef = useRef(onChange);
    const onSaveRef = useRef(onSave);
    const onFindRef = useRef(onFind);
    const onReplaceRef = useRef(onReplace);
    const onValidateRef = useRef(onValidate);
    const valueRef = useRef(value);
    const languageRef = useRef(language);
    const themeRef = useRef(theme);
    const lineRef = useRef(line);
    const gutterRef = useRef<any>(null)
    
    useEffect(() => {
        onMountRef.current = onMount;
        onChangeRef.current = onChange;
        onSaveRef.current = onSave;
        onFindRef.current = onFind;
        onReplaceRef.current = onReplace;
        onValidateRef.current = onValidate;
    }, [onMount, onChange, onSave, onFind, onReplace, onValidate]);

    useEffect(() => {
        createEditor();
    }, []);

    const handleChange = useCallback(() => {
        console.log(onChangeRef.current, isEditorReady)
        if (isEditorReady && onChangeRef.current) {
            const newContent = editorRef.current.innerText;
            valueRef.current = newContent; // Update the stored value
            onChangeRef.current(newContent);
        }
    }, [isEditorReady])

    const createEditor = useCallback(() => {
        if (!containerRef.current) return;
        setIsEditorMounting(true);

        const tempDiv = contentEditableDiv(value || defaultValue || '');
        containerRef.current.appendChild(tempDiv);
        editorRef.current = tempDiv;
        setIsEditorMounting(false)
        setIsEditorReady(true);
        if (onMountRef.current) {
            onMountRef.current()
        }
    }, [defaultValue, value])

    useEffect(() => {
        // Attach input event listener when the component is mounted
        if (isEditorReady && !readOnly) {
            editorRef.current.addEventListener('input', handleChange);
        }

        // Clean up the event listener when the component is unmounted
        return () => {
            if (isEditorReady && !readOnly) {
                editorRef.current.removeEventListener('input', handleChange);
            }
        };
    }, [isEditorReady, handleChange, readOnly]);

    useEffect(() => {
        !isEditorReady && !isEditorMounting && createEditor();
    }, [isEditorReady, isEditorMounting, createEditor]);


    useEffect(() => {
        if (!isEditorReady) return;
        if (valueRef.current !== value) {
            valueRef.current = value;
            editorRef.current.textContent = value;
        }
    }, [value, isEditorReady])

    useEffect(() => {
        if (!isEditorReady) return;
        if (languageRef.current !== language) {
            languageRef.current = language;
        }
    }, [language, isEditorReady])

    useEffect(() => {
        if (!isEditorReady) return;
        if (themeRef.current !== theme) {
            themeRef.current = theme;
        }
    }, [theme, isEditorReady])

    useEffect(() => {
        if (!isEditorReady) return;
        if (lineRef.current !== line) {
            lineRef.current = line;
        }
    }, [line, isEditorReady])

    useEffect(() => {
        if (!isEditorReady) return;
        if (readOnly) {
            editorRef.current.setAttribute('contenteditable', 'false');
        } else {
            editorRef.current.setAttribute('contenteditable', 'true');
        }
    }, [readOnly, isEditorReady])
    
    return (
        <section style={{...styles.wrapper, width, height}}>
            <div
                className="border-1 border-gray-800 rounded-b-lg p-2 outline-none focus:ring-2 focus:ring-gray-400 w-full flex flex-row">
                {!isEditorReady && loading}
                <div
                    ref={containerRef}
                    className={className}
                    style={{...styles.fullWidth, ...(!isEditorReady && styles.hide)}}
                />
            </div>
        </section>
    );
}
