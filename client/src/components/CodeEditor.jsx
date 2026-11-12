import React, { useRef } from 'react';

const LineNumbers = React.memo(({ lineCount }) => (
  <div className="line-numbers" aria-hidden="true">
    {Array.from({ length: lineCount }, (_, index) => (
      <div key={index} className="line-num">
        {index + 1}
      </div>
    ))}
  </div>
));

export const CodeEditor = ({
  value = '',
  onChange,
  language = 'javascript',
  placeholder = '// Paste or type your code here...',
  disabled = false,
  minHeight = '360px'
}) => {
  const textareaRef = useRef(null);

  let lineCount = 1;
  for (let index = 0; index < value.length; index += 1) {
    if (value.charCodeAt(index) === 10) lineCount += 1;
  }
  const charCount = value.length;

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;

      // Insert 2 spaces
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);

      // Reposition cursor
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  return (
    <div className="custom-code-editor glass-card">
      {/* Editor Toolbar */}
      <div className="editor-toolbar">
        <div className="toolbar-left">
          <span className="window-dots">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </span>
          <span className="editor-lang-pill">{language}</span>
        </div>
        <div className="toolbar-right">
          <span className="counter-item">
            <strong>{lineCount}</strong> {lineCount === 1 ? 'line' : 'lines'}
          </span>
          <span className="counter-sep">|</span>
          <span className="counter-item">
            <strong>{charCount}</strong> chars
          </span>
        </div>
      </div>

      {/* Editor Area with Line Numbers */}
      <div className="editor-body" style={{ minHeight }}>
        {/* Line Numbers Column */}
        <LineNumbers lineCount={lineCount} />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          spellCheck="false"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="code-textarea"
          aria-label="Source code input editor"
        />
      </div>

      <style>{`
        .custom-code-editor {
          display: flex;
          flex-direction: column;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #060a12;
          border: 1px solid var(--border-subtle);
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.6);
        }
        .editor-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 1rem;
          background: rgba(15, 23, 42, 0.95);
          border-bottom: 1px solid var(--border-subtle);
        }
        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .window-dots {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .window-dots .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .window-dots .dot.red { background: #ef4444; }
        .window-dots .dot.yellow { background: #f59e0b; }
        .window-dots .dot.green { background: #10b981; }

        .editor-lang-pill {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-sm);
          background: rgba(99, 102, 241, 0.15);
          color: #818cf8;
          text-transform: lowercase;
          font-weight: 600;
        }
        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--text-dim);
          font-family: var(--font-mono);
        }
        .counter-item strong {
          color: var(--text-muted);
        }
        .counter-sep {
          opacity: 0.3;
        }
        .editor-body {
          display: flex;
          position: relative;
          background: transparent;
        }
        .line-numbers {
          user-select: none;
          padding: 1rem 0.5rem 1rem 0.75rem;
          background: rgba(11, 17, 32, 0.7);
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          text-align: right;
          color: var(--text-dim);
          font-family: var(--font-mono);
          font-size: 0.875rem;
          line-height: 1.6;
          min-width: 44px;
        }
        .line-num {
          height: 22.4px;
        }
        .code-textarea {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 1rem;
          color: #e2e8f0;
          font-family: var(--font-mono);
          font-size: 0.875rem;
          line-height: 1.6;
          resize: vertical;
          white-space: pre;
          overflow-wrap: normal;
          overflow-x: auto;
          tab-size: 2;
        }
        .code-textarea:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default CodeEditor;
