import { Flex } from "@chakra-ui/react"
import DesktopMainViewHeader from "./DesktopMainViewHeader"
import DesktopMainTouchArea from "./DesktopMainTouchArea"
import "../styles/appLayout.css";

export default function DesktopMainView() {
    return (
        <Flex
            backgroundImage="url(/images/desktop-bg.jpg)"
            backgroundSize="cover"
            backgroundPosition="center"
            height="100vh"
            width="100%"
            flexDirection="column"
        >
            <DesktopMainViewHeader />
            <DesktopMainTouchArea />
        </Flex>
    )
}