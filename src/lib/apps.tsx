import AppAbout from "@/app/components/desktop/apps/AppAbout";
import AppContact from "@/app/components/desktop/apps/AppContact";

export default function DesktopApps() {
    return [
        {
            iconName: "/main.png",
            appName: "App About Me",
            title: "About Kevin",
            component: <AppAbout />,
        },
        {
            iconName: "/contact.png",
            appName: "App Contacts",
            title: "Contacts",
            component: <AppContact />,
        },
    ];
}