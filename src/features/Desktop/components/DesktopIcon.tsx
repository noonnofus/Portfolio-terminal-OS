import { motion } from "framer-motion";
import { MutableRefObject } from "react";

type Props = {
    iconName: string;
    dragConstraintRef?: MutableRefObject<HTMLDivElement>;
    onClick?: () => void;
    onDoubleClick?: () => void;
    isFocused?: boolean;
    title: string;
};

export function DesktopIcon({
    iconName,
    dragConstraintRef,
    onClick,
    onDoubleClick,
    isFocused = false,
    title,
}: Props) {
    const isDraggable = dragConstraintRef ? true : false;
    const isMobileIcon = !isDraggable;
    const bgColor = isFocused ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0)";

    return (
        <motion.div
            drag={isDraggable}
            dragConstraints={dragConstraintRef}
            dragElastic={0}
            dragTransition={{
                bounceStiffness: 0,
                min: 0,
                max: 0,
                power: 0,
                bounceDamping: 0,
            }}
            onDoubleClick={onDoubleClick}
            onClick={onClick}
            onDragStart={onClick}
            style={{
                cursor: 'pointer',
                borderRadius: '8px',
                backgroundColor: `${bgColor}`
            }}
        >
            <div
                className={`w-[55px] h-[55px] p-[5px] ${isMobileIcon ? 'm-[5px]' : 'm-0'}`}
                style={{
                    backgroundImage: `url(/icons/${iconName})`,
                    backgroundSize: '100%',
                    backgroundRepeat: 'no-repeat',
                }}
            />
            <p
                className="text-[12px] font-semibold text-center text-white w-full"
                style={{
                    textShadow: '1px 1px 1px black',
                }}
            >
                {title}
            </p>
        </motion.div>
    );
}
