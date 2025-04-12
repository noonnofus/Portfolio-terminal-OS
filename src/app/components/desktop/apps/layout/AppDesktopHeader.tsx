'use client';

import { Box, Flex, Icon } from "@chakra-ui/react";
import { IoCloseCircle } from "react-icons/io5";
import { BiFullscreen, BiExitFullscreen } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { setFullScreen, closeApp } from "@/app/store/features/desktopSlice";
import { RootState } from "@/app/store/store";
import useIsTouchDevice from "@/lib/isTouchDevice";

export default function AppDesktopHeader({ appName }: { appName: string }) {
    const isTouchDevice = useIsTouchDevice();
    const isFullScreen = useSelector((state: RootState) => state.desktop.fullScreen);
    const dispatch = useDispatch();

    return (
        <div className="relative w-full " style={{
            overflow: 'hidden'
        }}>
            <Flex
                gap="3"
                justify="space-between"
                className="bg-gray-300/70 px-4 py-2"
                borderTopLeftRadius="8px"
                borderTopRightRadius='8px'
            >
                <Box
                    flex="1"
                    display="flex"
                    alignItems="center" justifyContent="flex-start" position="relative"
                >
                    <Box
                        onClick={() => dispatch(closeApp(appName))}
                        cursor="pointer"
                    >
                        <Icon>
                            <IoCloseCircle />
                        </Icon>
                    </Box>
                    <Box
                        className="ml-2"
                        cursor="pointer"
                        onClick={() => dispatch(setFullScreen(!isFullScreen))}
                    >
                        {isTouchDevice ? (
                            <></>
                        ) : (
                            <Icon>
                                {isFullScreen ? (
                                    <BiExitFullscreen />
                                ) : (
                                    <BiFullscreen />
                                )}
                            </Icon>
                        )}
                    </Box>
                </Box>
                <Box
                    flex="1"
                    textAlign="center"
                    className=""
                >
                    {appName}
                </Box>
                <Box
                    flex="1"
                    textAlign="center"
                >
                </Box>
            </Flex>
        </div >
    );
}