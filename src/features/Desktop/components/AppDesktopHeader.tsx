"use client";

import { Box, Flex, Icon } from "@chakra-ui/react";
import { IoCloseCircle } from "react-icons/io5";
import { BiFullscreen, BiExitFullscreen } from "react-icons/bi";
import { useDesktopStore } from "@/features/Desktop/store/useDesktopStore";

export default function AppDesktopHeader({
    appName,
    title,
    isFullScreen,
    setIsFullScreen,
}: {
    appName: string;
    title: string;
    isFullScreen: boolean;
    setIsFullScreen: (val: boolean) => void;
}) {
    const closeApp = useDesktopStore((state) => state.closeApp);

    return (
        <div
            className="relative w-full "
            style={{
                overflow: "hidden",
            }}
        >
            <Flex
                gap="3"
                justify="space-between"
                className="bg-gray-300/70 px-4 py-2"
                borderTopLeftRadius="8px"
                borderTopRightRadius="8px"
            >
                <Box
                    flex="1"
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                    position="relative"
                >
                    <Box
                        onClick={() => {
                            closeApp(appName);
                        }}
                        cursor="pointer"
                    >
                        <Icon>
                            <IoCloseCircle className="text-[#FF605C]" />
                        </Icon>
                    </Box>
                    <Box
                        className="ml-3"
                        cursor="pointer"
                        onClick={() => setIsFullScreen(!isFullScreen)}
                    >
                        <Icon>
                            {isFullScreen ? (
                                <BiExitFullscreen className="text-[#00CA4E]" />
                            ) : (
                                <BiFullscreen className="text-[#00CA4E]" />
                            )}
                        </Icon>
                    </Box>
                </Box>
                <Box flex="1" textAlign="center" color="black">
                    {title}
                </Box>
                <Box flex="1" textAlign="center"></Box>
            </Flex>
        </div>
    );
}
