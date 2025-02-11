import './CyberButton.css';

interface CyberButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

export const CyberButton: React.FC<CyberButtonProps> = ({
    children,
    onClick,
    className = ''
}) => {
    return (
        <button
            className={`cyber-button ${className}`}
            onClick={onClick}
        >
            <div className="cyber-button-icon">!</div>
            <span className="cyber-button-text">{children}</span>
        </button>
    );
};
