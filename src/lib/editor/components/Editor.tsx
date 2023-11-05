"use client"

import React, {useCallback, useEffect, useRef, useState} from 'react';
import EditorProps from './EditorProps';
import contentEditableDiv from "../utils/contentEditableDiv";
import gutterDiv from "../utils/gutterDiv";
import Loading from "../components/Loading";
import 'prismjs/themes/prism.css';
import styles from "./styles";
import "./Editor.css";
import {Button, Input} from "@nextui-org/react";
import {Search as SearchIcon} from "@/components/geist-ui/icons";

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
    const [showFind, setShowFind] = useState(false);
    const [showReplace, setShowReplace] = useState(false);
    const [isEditorMounting, setIsEditorMounting] = useState(true);
    const [findValue, setFindValue] = useState('');
    const [replaceValue, setReplaceValue] = useState('');
    const [_, setFoundCount] = useState(0);
    const [isCaseSensitive, setIsCaseSensitive] = useState(false);
    const [isWholeWords, setIsWholeWords] = useState(false);
    const [ctrlKeyPressed, setCtrlKeyPressed] = useState(false);
    const editorRef = useRef<any>(null);
    const containerRef = useRef<any>(null);
    const onMountRef = useRef(onMount);
    const onChangeRef = useRef(onChange);
    const onSaveRef = useRef(onSave);
    const onFindRef = useRef(onFind);
    const onReplaceRef = useRef(onReplace);
    const valueRef = useRef(value);
    const themeRef = useRef(theme);
    const gutterRef = useRef<any>(null)
    const lineNumbersRef = useRef<number[]>([]);

    const resetHighlight = useCallback(() => {
        const editor = editorRef.current;

        if (editor) {
            const highlightedSpans = editor.querySelectorAll('span.highlighted');

            highlightedSpans.forEach((span: any) => {
                const textNode = document.createTextNode(span.textContent);
                span.parentNode.replaceChild(textNode, span);
            });
        }

    }, []);

    const handleFindReplace = useCallback((replace: boolean = false, replaceAll: boolean = true) => {
        if (!editorRef.current) return;

        const editorContent = editorRef.current.textContent;
        let findNewValue = findValue;
        if (findNewValue) {
            console.log(findNewValue)
            let flags = 'g';
            if (isCaseSensitive) flags = 'g';
            if (isWholeWords) findNewValue = `\\b${findNewValue}\\b`;

            const regex = new RegExp(findNewValue, flags);
            const matches = editorContent.match(regex);
            console.log(matches, regex, findNewValue, flags);
            if (matches) {
                setFoundCount(matches.length);

                if (replace && !readOnly) {
                    editorRef.current.textContent = editorContent.replace(replaceAll ? regex : new RegExp(findNewValue), replaceValue);
                } else {
                    editorRef.current.innerHTML = editorContent.replace(
                        regex,
                        (match: string) => `<span class="highlighted">${match}</span>`
                    );
                }
            } else {
                console.log("insde not no magtch", findValue, findNewValue)
                resetHighlight();
                setFoundCount(0);
            }
        } else {
            console.log("insde not findValue", findValue, findNewValue)
            resetHighlight();
            setFoundCount(0);
        }
    }, [findValue, replaceValue, isCaseSensitive, isWholeWords, resetHighlight, readOnly]);

    const toggleFindReplace = useCallback(() => {
        // setShowFind(!showFind);
        setShowReplace(!showReplace);
        resetHighlight();
    }, [showReplace, resetHighlight]);

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

    const createEditor = useCallback(() => {
        if (!containerRef.current || !gutterRef.current) return;
        setIsEditorMounting(true);

        const tempDiv = contentEditableDiv(value || defaultValue || '', language || defaultLanguage || 'text');
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
    }, [value, defaultValue, language, defaultLanguage, readOnly, updateLineNumbers]);

    const handleChange = useCallback(() => {
        if (isEditorReady && onChangeRef.current) {
            const newContent = editorRef.current.innerText;
            valueRef.current = newContent;
            onChangeRef.current(newContent);

            // Prism.highlightElement(containerRef.current.firstChild)
        }

        updateLineNumbers();
    }, [isEditorReady, updateLineNumbers])

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

    useEffect(() => {
        if (isEditorReady) {
            if (findValue != '') {
                handleFindReplace();
            } else {
                resetHighlight();
            }
        }
    }, [isEditorReady, findValue, resetHighlight, handleFindReplace]);

    useEffect(() => {
        function handleKeyDown(e: any) {
            if (e.key === 'Control') {
                setCtrlKeyPressed(true);
            }
            if (e.key === 'f' && ctrlKeyPressed) {
                setShowFind(true);
            }
        }

        function handleKeyUp(e: any) {
            if (e.key === 'Control') {
                e.preventDefault();
                setCtrlKeyPressed(false);
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [ctrlKeyPressed]);


    return (
        <>
            {showFind ? (
                <div
                    className={'sticky top-0 left-0 w-full border z-10 border-gray-400 shadow-sm bg-white flex flex-row'}>
                    <div className={'p-4 flex items-center justify-center'}>
                        <Button className={'h-8 bg-white border min-w-unit-12 shadow rounded-lg mr-2'}
                                onClick={toggleFindReplace}>
                            <SearchIcon size={'lg'}/>
                        </Button>
                    </div>
                    <div className={'flex-1 p-4 border-r-1'}>
                        <Input
                            autoFocus
                            placeholder="Search"
                            variant="bordered"
                            name="find"
                            value={findValue}
                            onChange={(e) => {
                                setFindValue(e.target.value);
                            }}
                        />
                        {!readOnly && showReplace ? (
                            <div>
                                <Input
                                    className={'mt-2'}
                                    placeholder="Replace"
                                    variant="bordered"
                                    name="replace"
                                    value={replaceValue}
                                    onChange={(e) => setReplaceValue(e.target.value)}
                                />
                                <div className={'mt-2'}>
                                    <Button
                                        className={'h-8 bg-white border min-w-unit-12 shadow rounded-lg mr-2'}
                                        onClick={() => handleFindReplace(true, false)}
                                    >
                                        Replace
                                    </Button>
                                    <Button
                                        className={'h-8 bg-white border min-w-unit-12 shadow rounded-lg mr-2'}
                                        onClick={() => handleFindReplace(true)}
                                    >
                                        Replace All
                                    </Button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <div className={'p-4 flex items-center justify-center'}>
                        <Button
                            className={`h-8 bg-white border min-w-unit-12 shadow rounded-lg mr-2 ${isCaseSensitive ? "border-gray-400" : ""}`}
                            onClick={() => setIsCaseSensitive(!isCaseSensitive)}>
                            Cc
                        </Button>

                        <Button
                            className={`h-8 bg-white border min-w-unit-12 shadow rounded-lg mr-2 ${isWholeWords ? "border-1 border-gray-400" : "bg-white"}`}
                            onClick={() => {
                                setIsWholeWords(!isWholeWords);
                            }}>
                            W
                        </Button>
                        <Button
                            className={`h-8 bg-white border min-w-unit-12 shadow rounded-lg mr-2 ${isWholeWords ? "border-1 border-gray-400" : "bg-white"}`}
                            onClick={() => {
                                setShowFind(false);
                            }}>
                            Close
                        </Button>
                    </div>
                </div>
            ) : null}
            <section className={"border-1 border-gray-400 rounded-b-lg relative"}
                     style={{...styles.wrapper, width, height}}>
                <div className="flex flex-row overflow-x-scroll w-full">
                    {!isEditorReady && <Loading>{loading}</Loading>}
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
        </>
    );
}
