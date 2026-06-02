import { IconType } from "react-icons";

export default function StackIcon({ label, icon: Icon, color }: { label: string; icon: IconType; color: string }) {
    return (
        <div className="flex flex-col items-center gap-1">
            <Icon size={32} style={{ color }} />
            <p className="text-sm">{label}</p>
        </div>
    );
}