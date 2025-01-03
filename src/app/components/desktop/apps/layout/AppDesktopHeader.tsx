'use client';

import { Box, Flex, Icon } from "@chakra-ui/react";
import { IoCloseCircle } from "react-icons/io5";
import { BiFullscreen, BiExitFullscreen } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { setActiveApp, setFullScreen } from "@/app/store/features/desktopSlice";
import { RootState } from "@/app/store/store";
import useIsTouchDevice from "@/lib/isTouchDevice";

export default function AppDesktopHeader({ title }: { title: string }) {
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
                className="bg-yellow-600/60 px-4 py-2"
            >
                <Box
                    flex="1"
                    display="flex"
                    alignItems="center" justifyContent="flex-start" position="relative"
                >
                    <Box
                        onClick={() => dispatch(setActiveApp(''))}
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
                    className="text-white"
                >
                    {title}
                </Box>
                <Box
                    flex="1"
                    textAlign="center"
                >
                </Box>
            </Flex>
        </div>
    );
}