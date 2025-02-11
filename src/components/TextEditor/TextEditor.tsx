import { StoneTablet } from '../StoneTablet';
import './TextEditor.css';

const INSTRUCTIONS = `
Mortal developer, you stand before the ancient trial of coding wisdom.
Your journey through the digital realm has led you to this sacred place.
Here, you shall prove your worth through the art of programming.

Let your code flow like the rivers of time,
Your algorithms shine like the stars above,
And your solutions be as elegant as the dance of the cosmos.

Begin your trial, and may the Dev Gods guide your keystrokes.
`;

export const TextEditor = () => {
    return (
        <div className="editor-container">
            <div className="editor-section instructions">
                <StoneTablet text={INSTRUCTIONS} />
            </div>
            <div className="editor-section code">
                <div className="text-editor">
                    <div className="editor-header">
                        <div className="editor-title">EDITOR</div>
                    </div>
                    <textarea
                        className="editor-content"
                        autoFocus
                        spellCheck={false}
                        placeholder="Enter your code here..."
                    />
                </div>
            </div>
        </div>
    );
};
