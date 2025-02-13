import React, { useState } from 'react';
import { StoneTablet } from '../StoneTablet';
import { TextEditor } from '../TextEditor';
import OutputDisplay from '../OutputDisplay/OutputDisplay';
import './QuestLayout.css';

interface QuestLayoutProps {
  questTitle: string;
  questDescription: string;
  initialCode?: string;
  expectedOutput?: string;
  onSubmit?: (code: string) => boolean;
}

const QuestLayout: React.FC<QuestLayoutProps> = ({
  questTitle,
  questDescription,
  initialCode = '',
  expectedOutput = '',
  onSubmit
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = () => {
    if (onSubmit && onSubmit(code)) {
      setIsSuccess(true);
      setOutput(expectedOutput);
    } else {
      setIsSuccess(false);
      setOutput('Incorrect solution. Try again!');
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  return (
    <div className="quest-layout">
      <div className="quest-tablet">
        <StoneTablet
          questTitle={questTitle}
          questDescription={questDescription}
        />
      </div>
      <div className="quest-editor">
        <TextEditor
          value={code}
          language="typescript"
          fileName="solution.ts"
          onChange={handleEditorChange}
          customButtons={[
            {
              label: 'Submit',
              onClick: handleSubmit,
              className: `submit-button ${isSuccess ? 'success' : ''}`
            }
          ]}
        />
      </div>
      <div className="quest-output">
        <OutputDisplay content={output} typing={true} />
      </div>
    </div>
  );
};

export default QuestLayout;
