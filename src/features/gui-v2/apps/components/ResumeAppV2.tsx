import type { GuiAppComponentProps } from "@/features/gui-v2/apps/appTypes";

export default function ResumeAppV2({
    language,
}: GuiAppComponentProps<"resume">) {
    return (
        <section aria-labelledby="resume-v2-heading" className="p-6">
            <h2 id="resume-v2-heading" className="text-xl font-semibold">
                {language === "ko" ? "이력서 준비 중" : "Resume in progress"}
            </h2>
        </section>
    );
}
