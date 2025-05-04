import DesktopMainView from "../components/DesktopMainView";
import LoginModal from "../components/DesktopLoginModal";

export default function guiPage() {
    let isLogin = false;
    return (
        <>
            {!isLogin ? (
                <LoginModal />
            ) : (
                <DesktopMainView />
            )}
        </>
    );
}