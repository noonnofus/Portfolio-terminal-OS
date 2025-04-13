import DesktopApps from "./apps";
import ProjectsApps from "./projectsApps";

export default function allApps() {
    return [...DesktopApps(), ...ProjectsApps()];
}