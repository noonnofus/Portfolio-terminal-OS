import AppDesktopHeader from "./layout/AppDesktopHeader";
import { Box, VStack, HStack, Text, Link, Icon, Heading } from "@chakra-ui/react";
import { LuExternalLink } from "react-icons/lu"
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function AppContact() {

    return (
        <>
            <div style={{
                backgroundColor: "white",
                borderRadius: "8px 8px 0 0",
            }}>
                <AppDesktopHeader title='Projects' />
            </div>
            <div
                style={{
                    width: '100%',
                    height: '95%', // height needs to be fixed later, because of the desktop header, and this shouldn't be the 100%.
                    overflow: "scroll",
                    backgroundColor: "white",
                    borderRadius: "0 0 8px 8px",
                    color: 'black',
                }}
            >
                <div className="my-8 mx-4 md:mx-36">
                    <Box px={6} py={4}>
                        <Heading size="xl" mb={4} className="font-bold text-2xl">
                            📬 Contact Me
                        </Heading>

                        <Text mt={2} mb={4} fontSize="md" color="gray.700">
                            I'm always open to chatting about web development, design, or any exciting opportunities. ✨
                        </Text>

                        <VStack gap={4} align="start">
                            <HStack gap={3}>
                                <Icon as={FaEnvelope} boxSize={5} />
                                <Link href="mailto:kevinhyunhok@gmail.com" className="underline">
                                    kevinhyunhok@gmail.com <LuExternalLink />
                                </Link>
                            </HStack>

                            <HStack gap={3}>
                                <Icon as={FaGithub} boxSize={5} />
                                <Link href="https://github.com/noonnofus" className="underline">
                                    github.com/noonnofus <LuExternalLink />
                                </Link>
                            </HStack>

                            <HStack gap={3}>
                                <Icon as={FaLinkedin} boxSize={5} />
                                <Link href="https://www.linkedin.com/in/kevin-hyun-ho-kim/" className="underline">
                                    linkedin.com/in/kevin-hyun-ho-kim <LuExternalLink />
                                </Link>
                            </HStack>
                        </VStack>
                    </Box>
                </div>
            </div>
        </>
    );
}