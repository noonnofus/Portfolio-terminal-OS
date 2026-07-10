import type { LucideIcon } from "lucide-react";
import type { SimpleIcon } from "simple-icons";

type StackIconProps = {
    label: string;
    icon: LucideIcon | SimpleIcon;
    color?: string;
};

function isSimpleIcon(icon: LucideIcon | SimpleIcon): icon is SimpleIcon {
    return "path" in icon;
}

export default function StackIcon({ label, icon, color }: StackIconProps) {
    return (
        <div className="flex min-w-0 flex-col items-center gap-2 text-center">
            {isSimpleIcon(icon) ? (
                <svg
                    aria-hidden="true"
                    className="size-8 shrink-0"
                    fill={color ?? `#${icon.hex}`}
                    viewBox="0 0 24 24"
                >
                    <path d={icon.path} />
                </svg>
            ) : (
                <LucideStackIcon icon={icon} color={color} />
            )}
            <p className="text-[length:var(--gui-text-control)] leading-tight text-[var(--gui-app-surface-text)]">
                {label}
            </p>
        </div>
    );
}

function LucideStackIcon({
    icon: Icon,
    color,
}: {
    icon: LucideIcon;
    color?: string;
}) {
    return (
        <Icon
            aria-hidden="true"
            className="size-8 shrink-0"
            color={color}
            strokeWidth={2}
        />
    );
}
