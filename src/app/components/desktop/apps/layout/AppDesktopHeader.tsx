import { Box, Flex, Icon } from "@chakra-ui/react";
import { IoCloseCircle } from "react-icons/io5";
import { BiFullscreen } from "react-icons/bi";

export default function AppDesktopHeader({ title }: { title: string }) {
    return (
        <div className="relative w-full bg-">
            <Flex
                gap="3"
                justify="space-between"
                className="bg-yellow-600/60 px-4 py-2"
            >
                <Box
                    flex="1"
                    display="flex"
                    alignItems="center" justifyContent="flex-start" position="relative">
                    <Box>
                        <Icon>
                            <IoCloseCircle />
                        </Icon>
                    </Box>
                    <Box
                        className="ml-2"
                    >
                        <Icon>
                            <BiFullscreen />
                        </Icon>
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