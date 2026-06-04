import DesktopApps from "./apps";
import ProjectsApps from "./projectsApps";
import { Language } from "@/shared/lib/i18n/useLanguageStore";

export default function allApps(language: Language) {
    return [...DesktopApps(language), ...ProjectsApps(language)];
}
