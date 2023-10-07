import React, { useState, useRef } from 'react';

export default function Editor (){
  const [content, setContent] = useState();
  const contentEditableRef = useRef(null);
  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);

  const handleUndo = () => {
    if (undoStackRef.current.length > 0) {
      const previousContent = undoStackRef.current.pop();
      redoStackRef.current.push(content);
      setContent(previousContent);
    }
  };

  const handleRedo = () => {
    if (redoStackRef.current.length > 0) {
      const nextContent = redoStackRef.current.pop();
      undoStackRef.current.push(content);
      setContent(nextContent);
    }
  };

  const handleSave = () => {
    // You can replace this logic with saving the content to a file or a database.
    console.log('Saving content:', content);
  };

  const handleContentChange = () => {
    const newContent = contentEditableRef.current.innerHTML;
    if (content !== newContent) {
      undoStackRef.current.push(content);
      redoStackRef.current = [];
      setContent(newContent);
    }
  };

  return (
    <div className={styles.textEditor}>
      <div className={styles.toolbar}>
        <button onClick={handleUndo} className={styles.toolbarButton}>
          Undo
        </button>
        <button onClick={handleRedo} className={styles.toolbarButton}>
          Redo
        </button>
        <button onClick={handleSave} className={styles.toolbarButton}>
          Save
        </button>
      </div>
      <div
        ref={contentEditableRef}
        className={styles.contentEditable}
        contentEditable
        onInput={handleContentChange}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}