import { Flex } from "@chakra-ui/react"
import DesktopMainViewHeader from "./DesktopMainViewHeader"

export default function DesktopMainView() {
    return (
        <Flex
            backgroundImage="url(/images/desktop-bg.jpg)"
            backgroundSize="cover"
            backgroundPosition="center"
            height="100vh"
            width="100%"
        >
            <DesktopMainViewHeader />
        </Flex>
    )
}