import { Flex, Image, Heading, Text, Link, SimpleGrid, Box, List, } from "@chakra-ui/react";
import { SiJavascript, SiDiscord, SiMongodb, SiPubg, } from "react-icons/si"
import { FaPlayCircle, FaMicrophoneAlt, FaGithub } from "react-icons/fa"
import StackIcon from "../layout/StackIcon";
import { GoLinkExternal as ExternalLinkIcon } from "react-icons/go";

export default function AppProjcetMejubot() {
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
                        <Text>MejuBot — Music, Stats, and More in One Discord Bot</Text>
                    </Heading>

                    <Image
                        src="/icons/mejubot.png"
                        alt="project WCHMS logo image"
                        boxSize="150px"
                        fit="cover"
                        h="auto"
                        className="mb-4"
                    />
                    <Link
                        href="https://discord.com/oauth2/authorize?client_id=1263899843055583254&permissions=8&integration_type=0&scope=bot"
                        textDecor="underline"
                        mb={4}
                        target="_blank"
                    >
                        Add Mejubot on your Discord server<ExternalLinkIcon />
                    </Link>
                    <Flex maxW="700px" flexDir="column" className="ml-1 mr-1">
                        <Box className="mb-6">
                            <Heading size="md" className="font-semibold text-xl text-gray-800">
                                Overview
                            </Heading>
                            <Text mt={2}>
                                Officially verified by Discord, MejuBot is your all-in-one server companion — stream music, check PUBG stats, or dive into mini-games like stock market simulations. With powerful features and seamless integration, it makes your server more interactive, engaging, and fun.
                            </Text>
                        </Box>

                        <Box
                            width="100%"
                            borderTop="1px solid #ccc"
                            margin="0 auto"
                        />

                        <Box className="mb-6 mt-6">
                            <Heading size="md" className="font-semibold text-xl text-gray-800">
                                Key Features
                            </Heading>

                            <List.Root mt={4} ps={4} gap={3} className="text-gray-700">
                                <List.Item>
                                    <strong>YouTube Music Playback:</strong> Stream music from YouTube directly into your voice channels using <u>discord-player</u> and <u>@discordjs/opus</u>.
                                </List.Item>
                                <List.Item>
                                    <strong>PUBG Stats Integration:</strong> Fetch and display real-time PUBG player statistics through external APIs.
                                </List.Item>
                                <List.Item>
                                    <strong>Virtual Stock Market Game:</strong> Engage users with a simulated stock trading game, complete with real-time updates and leaderboard tracking.
                                </List.Item>
                                <List.Item>
                                    <strong>Multi-language Support:</strong> Users can set their preferred language, and all commands and responses adapt dynamically.
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

                            <Heading mt={6} mb={2} className="text-lg font-semibold">Bot Framework</Heading>
                            <SimpleGrid columns={3} gap={5} mb={12}>
                                <StackIcon label="Discord.js" icon={SiDiscord} color="#5865F2" />
                                <StackIcon label="discord-player" icon={FaPlayCircle} color="#FF5722" />
                                <StackIcon label="discordjs/opus" icon={FaMicrophoneAlt} color="#2D3748" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">APIs & Features</Heading>
                            <SimpleGrid columns={3} gap={5} mb={12}>
                                <StackIcon label="PUBG API" icon={SiPubg} color="black" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">Frontend</Heading>
                            <SimpleGrid columns={3} gap={5} mb={12}>
                                <StackIcon label="JavaScript" icon={SiJavascript} color="#f7df1e" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">Database & Auth</Heading>
                            <SimpleGrid columns={3} gap={5} mb={12}>
                                <StackIcon label="MongoDB" icon={SiMongodb} color="#47A248" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">Deployment & Tools</Heading>
                            <SimpleGrid columns={3} gap={5} mb={6}>
                                <StackIcon label="GitHub" icon={FaGithub} color="black" />
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
                                Watch how users/gamers interact with Mejubot.
                            </Text>
                        </Box> */}
                    </Flex>
                </Flex>
            </div>
        </div>
    );
}
