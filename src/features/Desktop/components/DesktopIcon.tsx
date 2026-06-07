import { motion } from "framer-motion";
import { KeyboardEvent, MutableRefObject } from "react";

type Props = {
    iconSrc: string;
    dragConstraintRef?: MutableRefObject<HTMLDivElement>;
    onClick?: () => void;
    onDoubleClick?: () => void;
    isFocused?: boolean;
    title: string;
};

export function DesktopIcon({
    iconSrc,
    dragConstraintRef,
    onClick,
    onDoubleClick,
    isFocused = false,
    title,
}: Props) {
    const isDraggable = dragConstraintRef ? true : false;
    const isMobileIcon = !isDraggable;
    const bgColor = isFocused ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0)";
    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (onDoubleClick) {
                onDoubleClick();
                return;
            }
            onClick?.();
        }
    };

    return (
        <motion.button
            type="button"
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
            onKeyDown={handleKeyDown}
            aria-label={title}
            style={{
                cursor: 'pointer',
                backgroundColor: `${bgColor}`
            }}
            className="rounded-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
            <div
                className={`w-[55px] h-[55px] p-[5px] ${isMobileIcon ? 'm-[5px]' : 'm-0'}`}
                aria-hidden="true"
                style={{
                    backgroundImage: `url(${iconSrc})`,
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
        </motion.button>
    );
}
