import { Flex, Image, Heading, Text, Link, SimpleGrid, Box, List, } from "@chakra-ui/react";
import { SiTypescript, SiJavascript, SiEjs, SiCss3, SiExpress, SiGit, SiPrisma, SiMysql, SiWebrtc, SiGooglecloud, SiRender } from "react-icons/si"
import { FaGithub, FaBrain, FaProjectDiagram, FaNodeJs } from "react-icons/fa"
import StackIcon from "../layout/StackIcon";
import { GoLinkExternal as ExternalLinkIcon } from "react-icons/go";

export default function AppProjcetWeConnect() {
    return (
        <div
            style={{
                overflow: "scroll",
                backgroundColor: "white",
                borderRadius: "0 0 8px 8px",
                color: 'black',
            }}
        >
            <div className="my-8 mx-4 md:mx-36">
                <Flex
                    flexDir="column"
                    alignItems="center"
                    className="mt-8 mb-3"
                >
                    <Heading size="lg" className="font-bold text-3xl text-gray-800 mb-6">
                        <Text>WeConnect - The video conferencing app with a real-time translating</Text>
                    </Heading>

                    <Image
                        src="/images/weconnect-logo.svg"
                        alt="project WCHMS logo image"
                        boxSize="300px"
                        fit="cover"
                        h="auto"
                        className="mb-4"
                    />
                    <Link
                        href="https://idsp-weconnect-1.onrender.com"
                        textDecor="underline"
                        mb={4}
                        target="_blank"
                    >
                        See WeConnect <ExternalLinkIcon />
                    </Link>
                    <Flex maxW="700px" flexDir="column" className="ml-1 mr-1">
                        <Box className="mb-6">
                            <Heading size="md" className="font-semibold text-xl text-gray-800">
                                Overview
                            </Heading>
                            <Text mt={2}>
                                This is a video conferencing app with a <strong>real-time translation</strong> feature. WeConnect&apos;s target audience includes international students who speak different languages and domestic students who work with other students who speak different languages.
                            </Text>
                        </Box>

                        <Box
                            width="100%"
                            borderTop="1px solid #ccc"
                            margin="0 auto"
                        />

                        <Box className="mb-6 mt-6">
                            <Heading size="md" className="font-semibold text-xl text-gray-800">
                                My Role
                            </Heading>
                            <Text mt={2} className="text-gray-700">
                                As a Full-Stack Web Developer, I was responsible for architecting and implementing core features of the WeConnect application.
                            </Text>

                            <List.Root mt={4} ps={4} gap={3} className="text-gray-700">
                                <List.Item>
                                    <strong>Real-Time Translation:</strong> Integrated live speech-to-text and translation services, allowing multilingual participants to communicate seamlessly during video calls.
                                </List.Item>
                                <List.Item>
                                    <strong>Video Chat Infrastructure:</strong> Built a secure and scalable WebRTC-based video chat system that supports group and one-on-one conversations.
                                </List.Item>
                                <List.Item>
                                    <strong>User Interface & UX:</strong> Designed an intuitive frontend for joining meetings, selecting languages, and viewing live translated subtitles, enhancing accessibility and ease of use.
                                </List.Item>
                                <List.Item>
                                    <strong>Authentication & Room Management:</strong> Implemented user login, room creation, and participant tracking to ensure smooth meeting workflows and secure access control.
                                </List.Item>
                            </List.Root>
                        </Box>

                        <Box
                            width="100%"
                            borderTop="1px solid #ccc"
                            margin="0 auto"
                        />

                        <Box className="mb-6 mt-6">
                            <Heading mb={2} size="md" className="font-semibold text-xl text-gray-800">
                                Tech Stack
                            </Heading>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">Frontend</Heading>
                            <SimpleGrid columns={3} gap={5} mb={12}>
                                <StackIcon label="JavaScript" icon={SiJavascript} color="#f7df1e" />
                                <StackIcon label="EJS" icon={SiEjs} color="#A91E50" />
                                <StackIcon label="CSS3" icon={SiCss3} color="#264de4" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">Backend & Database</Heading>
                            <SimpleGrid columns={3} gap={5} mb={12}>
                                <StackIcon label="TypeScript" icon={SiTypescript} color="#3178C6" />
                                <StackIcon label="Node.js" icon={FaNodeJs} color="#339933" />
                                <StackIcon label="Express" icon={SiExpress} color="black" />
                                <StackIcon label="Prisma ORM" icon={SiPrisma} color="#0C344B" />
                                <StackIcon label="MySQL" icon={SiMysql} color="#00758F" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">Real-Time Communication</Heading>
                            <SimpleGrid columns={3} gap={5} mb={12}>
                                <StackIcon label="WebRTC" icon={SiWebrtc} color="#3333cc" />
                                <StackIcon label="WebSocket" icon={FaProjectDiagram} color="#4A5568" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">APIs</Heading>
                            <SimpleGrid columns={3} gap={5} mb={12}>
                                <StackIcon label="OpenAI API" icon={FaBrain} color="#7fdbff" />
                                <StackIcon label="Google Speech-to-Text" icon={SiGooglecloud} color="#4285F4" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">Deployment & Tools</Heading>
                            <SimpleGrid columns={3} gap={5} mb={6}>
                                <StackIcon label="Render" icon={SiRender} color="#46E3B7" />
                                <StackIcon label="GitHub" icon={FaGithub} color="black" />
                                <StackIcon label="Git" icon={SiGit} color="#F05033" />
                            </SimpleGrid>
                        </Box>


                        <Box
                            width="100%"
                            borderTop="1px solid #ccc"
                            margin="0 auto"
                            className="mb-6"
                        />

                        {/* <Box className="mt-6">
                            <Heading size="md" className="font-semibold text-xl text-gray-800">
                                App Walkthrough
                            </Heading>
                            <Text mt={2}>
                                Watch how to create, join the room, and use real-time translation feature.
                            </Text>
                        </Box> */}
                    </Flex>
                </Flex>
            </div>
        </div>
    );
}
