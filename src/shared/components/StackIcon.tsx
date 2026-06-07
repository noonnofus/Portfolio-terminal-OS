import type { LucideIcon } from "lucide-react";

export default function StackIcon({ label, icon: Icon, color }: { label: string; icon: LucideIcon; color: string }) {
    return (
        <div className="flex flex-col items-center gap-1">
            <Icon size={32} color={color} strokeWidth={2} />
            <p className="text-sm">{label}</p>
        </div>
    );
}
