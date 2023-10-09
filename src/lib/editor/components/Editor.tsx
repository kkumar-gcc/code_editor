"use client"

import React, {useCallback, useEffect, useRef, useState} from 'react';
import EditorProps from './EditorProps';
import styles from "./styles";
import "./Editor.css";
import contentEditableDiv from "../utils/contentEditableDiv";
import gutterDiv from "../utils/gutterDiv";
import Loading from "../components/Loading";

export default function Editor({
                                   defaultValue,
                                   defaultLanguage,
                                   value,
                                   language,
                                   theme,
                                   loading = "Loading...",
                                   width,
                                   height,
                                   className,
                                   readOnly = false,
                                   onChange,
                                   onSave,
                                   onFind,
                                   onReplace,
                                   onMount
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
    const valueRef = useRef(value);
    const languageRef = useRef(language);
    const themeRef = useRef(theme);
    const gutterRef = useRef<any>(null)
    const lineNumbersRef = useRef<number[]>([]);


    useEffect(() => {
        onMountRef.current = onMount;
        onChangeRef.current = onChange;
        onSaveRef.current = onSave;
        onFindRef.current = onFind;
        onReplaceRef.current = onReplace;
    }, [onMount, onChange, onSave, onFind, onReplace]);

    useEffect(() => {
        createEditor();
    }, []);

    // Updated updateLineNumbers function
    const updateLineNumbers = useCallback(() => {
        if (!editorRef.current || !gutterRef.current || !valueRef.current) return;

        const lines = valueRef.current.split('\n');
        lineNumbersRef.current = Array.from({length: lines.length}, (_, index) => index + 1);

        // Render line numbers in the gutter using <div> elements with a class
        gutterRef.current.innerHTML = lineNumbersRef.current.map((lineNumber) => {
            return `<div class="line-number">${lineNumber}</div>`;
        }).join('');
    }, []);

    const handleChange = useCallback(() => {
        if (isEditorReady && onChangeRef.current) {
            const newContent = editorRef.current.innerText;
            valueRef.current = newContent;
            onChangeRef.current(newContent);
        }
        updateLineNumbers();
    }, [isEditorReady, updateLineNumbers])

    const createEditor = useCallback(() => {
        if (!containerRef.current || !gutterRef.current) return;
        setIsEditorMounting(true);

        const tempDiv = contentEditableDiv(value || defaultValue || '');
        containerRef.current.appendChild(tempDiv);
        editorRef.current = tempDiv;

        if (readOnly) {
            editorRef.current.setAttribute('contenteditable', 'false');
        }

        // Add gutter and initialize line numbers
        gutterRef.current.appendChild(gutterDiv());
        updateLineNumbers();

        setIsEditorMounting(false)
        setIsEditorReady(true);
        if (onMountRef.current) {
            onMountRef.current()
        }
    }, [defaultValue, value, updateLineNumbers, readOnly]);

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
        if (readOnly) {
            editorRef.current.setAttribute('contenteditable', 'false');
        } else {
            editorRef.current.setAttribute('contenteditable', 'true');
        }
    }, [readOnly, isEditorReady])

    return (
        <section className={"border-1 border-gray-400 rounded-b-lg "} style={{...styles.wrapper, width, height}}>
            <div className="flex flex-row overflow-x-scroll w-full">
                {!isEditorReady && <Loading>{loading}</Loading> }
                <div
                    ref={gutterRef}
                    className={"gutter"}
                    style={{...(!isEditorReady && styles.hide)}}
                />
                <div
                    ref={containerRef}
                    className={className}
                    style={{...styles.container, ...styles.fullWidth, ...(!isEditorReady && styles.hide)}}
                />
            </div>
        </section>
    );
}
