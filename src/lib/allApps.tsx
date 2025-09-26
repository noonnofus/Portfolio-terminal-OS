import DesktopApps from "./apps";
import ProjectsApps from "./projectsApps";
import { Language } from "@/app/store/features/languageSlice";

export default function allApps(language: Language = "ko") {
    return [...DesktopApps(language), ...ProjectsApps(language)];
}
