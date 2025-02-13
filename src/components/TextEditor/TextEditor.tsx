import React, { useState } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import { OutputDisplay } from '../OutputDisplay';
import './TextEditor.css';

interface CustomButton {
  label: string;
  onClick: () => void;
  className?: string;
}

interface TextEditorProps {
  value: string;
  fileName?: string;
  filePath?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  customButtons?: CustomButton[];
  onSubmit?: (text: string) => void;
}

loader.init().then(monaco => {
  monaco.editor.defineTheme('solo-leveling', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#000000',
    }
  });
});

export const TextEditor: React.FC<TextEditorProps> = ({
  value,
  fileName = 'untitled',
  filePath = '',
  onChange,
  readOnly = false,
  customButtons = [],
  onSubmit
}) => {
  const [text, setText] = useState(value);
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && onChange) {
      onChange(value);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(text);
    }
  };

  return (
    <div className="text-editor-container">
      <div className="editor-header">
        <div className="file-info">
          <span className="file-name">{fileName}</span>
          {filePath && <span className="file-path">{filePath}</span>}
        </div>
        <div className="editor-actions">
          {customButtons.map((button, index) => (
            <button
              key={index}
              className={button.className || 'action-button'}
              onClick={button.onClick}
            >
              {button.label}
            </button>
          ))}
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
      <div className="editor-content">
        <div className="monaco-container">
          <Editor
            height="100%"
            defaultLanguage="typescript"
            value={value}
            theme="solo-leveling"
            onChange={handleEditorChange}
            options={{
              fontSize: 14,
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              readOnly: readOnly,
              padding: { top: 16 },
            }}
          />
        </div>
        <div className="output-container">
          <OutputDisplay 
            content="// Output will appear here..."
            typing={false}
          />
        </div>
      </div>
    </div>
  );
};
