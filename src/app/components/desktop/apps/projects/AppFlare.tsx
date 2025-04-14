import { Flex, Image, Heading, Text, Link, SimpleGrid, Box, List, AspectRatio } from "@chakra-ui/react";
import { SiTypescript, SiNextdotjs, SiTailwindcss, SiDrizzle, SiPostgresql, SiFirebase } from "react-icons/si"
import { FaSpider, FaBrain, FaProjectDiagram, FaBell, FaAws, FaReact } from "react-icons/fa"
import { GoLinkExternal as ExternalLinkIcon } from "react-icons/go";
import StackIcon from "../layout/StackIcon";

export default function AppProjcetFlare() {
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
                        <Text>Flare - Real-Time Wildfire Alert System</Text>
                    </Heading>

                    <Image
                        src="/icons/flare.png"
                        alt="project flare logo image"
                        boxSize="150px"
                        fit="cover"
                        h="auto"
                        className="mb-4"
                    />
                    <Link
                        href="https://www.flare-bc.com/"
                        textDecor="underline"
                        mb={4}
                        target="_blank"
                    >
                        See Flare <ExternalLinkIcon />
                    </Link>
                    <Flex maxW="700px" flexDir="column" className="ml-1 mr-1">
                        <Box className="mb-6">
                            <Heading size="md" className="font-semibold text-xl text-gray-800">
                                Overview
                            </Heading>
                            <Text mt={2}>
                                Flare is a progressive web application (PWA) built to help rural communities access real-time wildfire information. It offers an interactive map of current wildfire locations, risk level indicators wildfire-related news, latest, and the chatbot that answers anything related to wildfire questions. The app also supports push notifications to alert users about nearby wildfire threats.
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
                                As a Full-Stack Developer, I designed and implemented key features including:
                            </Text>

                            <List.Root mt={4} ps={4} gap={3} className="text-gray-700">
                                <List.Item>
                                    <strong>PWA Integration:</strong> Enabled the app to be installable from the browser for both android and IOS, supporting offline access and a native-like experience.
                                </List.Item>
                                <List.Item>
                                    <strong>Chatbot Development:</strong> Built an AI-powered chatbot to help users ask wildfire-related questions and get instant responses using OpenAI API.
                                </List.Item>
                                <List.Item>
                                    <strong>Real-time Notifications:</strong>  Implemented push notifications to alert users about nearby wildfire threats in real-time.
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
                                <StackIcon label="Next.js" icon={SiNextdotjs} color="black" />
                                <StackIcon label="React" icon={FaReact} color="#61DAFB" />
                                <StackIcon label="TypeScript" icon={SiTypescript} color="#3178C6" />
                                <StackIcon label="Tailwind CSS" icon={SiTailwindcss} color="#38B2AC" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">Backend & Database</Heading>
                            <SimpleGrid columns={3} gap={5} mb={12}>
                                <StackIcon label="PostgreSQL" icon={SiPostgresql} color="#336791" />
                                <StackIcon label="Drizzle ORM" icon={SiDrizzle} color="#C5F74F" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">Cloud & APIs</Heading>
                            <SimpleGrid columns={3} gap={5} mb={12}>
                                <StackIcon label="AWS S3" icon={FaAws} color="#FF9900" />
                                <StackIcon label="OpenAI API" icon={FaBrain} color="#7fdbff" />
                                <StackIcon label="Bing News API" icon={FaProjectDiagram} color="#008272" />
                                <StackIcon label="Firebase" icon={SiFirebase} color="#FFCA28" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">PWA & Realtime</Heading>
                            <SimpleGrid columns={3} gap={5} mb={12}>
                                <StackIcon label="Next.js PWA" icon={SiNextdotjs} color="black" />
                                <StackIcon label="Push Notifications" icon={FaBell} color="#f59e0b" />
                                <StackIcon label="Web Crawler" icon={FaSpider} color="#9CA3AF" />
                            </SimpleGrid>
                        </Box>

                        <Box
                            width="100%"
                            borderTop="1px solid #ccc"
                            margin="0 auto"
                            className="mb-6"
                        />

                        <Box className="mt-6">
                            <Heading size="md" className="font-semibold text-xl text-gray-800">
                                App Walkthrough
                            </Heading>
                            <Text mt={2}>
                                Watch a full walkthrough of the Flare app, showcasing key features and user interactions.
                            </Text>
                            <AspectRatio ratio={2 / 1}>
                                <video controls>
                                    <source src="videos/flare-walkthrough-web.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </AspectRatio>
                            <AspectRatio ratio={2 / 1}>
                                <video controls>
                                    <source src="videos/flare-walkthrough-app.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </AspectRatio>
                        </Box>
                    </Flex>
                </Flex>
            </div>
        </div>
    );
}
