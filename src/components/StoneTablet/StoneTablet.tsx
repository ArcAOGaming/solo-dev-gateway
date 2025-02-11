import './StoneTablet.css';

interface StoneTabletProps {
    text: string;
}

export const StoneTablet = ({ text }: StoneTabletProps) => {
    return (
        <div className="stone-tablet">
            <div className="tablet-inner">
                <h2 className="tablet-title">Trial of The Dev Gods</h2>
                <div className="tablet-text">{text}</div>
                <div className="tablet-cracks">
                    <div className="crack crack-1" />
                    <div className="crack crack-2" />
                    <div className="crack crack-3" />
                </div>
                <div className="tablet-moss">
                    <div className="moss moss-1" />
                    <div className="moss moss-2" />
                    <div className="moss moss-3" />
                </div>
            </div>
        </div>
    );
};
