import { Flex, Image, Heading, Text, Link, SimpleGrid, Box, List, AspectRatio, Icon } from "@chakra-ui/react";
import { SiTypescript, SiExpo, } from "react-icons/si"
import { FaReact, FaCube, FaMobileAlt, FaKeyboard, FaGlobe, FaGithub } from "react-icons/fa"
import { TbBrandThreejs } from "react-icons/tb";
import StackIcon from "../layout/StackIcon";
import { GoLinkExternal as ExternalLinkIcon } from "react-icons/go";

export default function AppProjcetDiceRoller() {
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
                        <Text>DiceRoller - physics engine 3D dice rolling simulation</Text>
                    </Heading>

                    <Image
                        src="/icons/diceroller.png"
                        alt="project WCHMS logo image"
                        boxSize="150px"
                        fit="cover"
                        h="auto"
                        className="mb-4"
                    />
                    <Link
                        href="https://diceroller-jet.vercel.app/"
                        textDecor="underline"
                        mb={4}
                        target="_blank"
                    >
                        See DiceRoller on Web<ExternalLinkIcon />
                    </Link>
                    <Link
                        href="https://github.com/noonnofus/diceRoller"
                        textDecor="underline"
                        mb={4}
                        target="_blank"
                    >
                        <Icon as={FaGithub} boxSize={5} />
                        Source Code <ExternalLinkIcon />
                    </Link>
                    <Flex maxW="700px" flexDir="column" className="ml-1 mr-1">
                        <Box className="mb-6">
                            <Heading size="md" className="font-semibold text-xl text-gray-800">
                                Overview
                            </Heading>
                            <Text mt={1} fontSize="sm" color="gray.600">
                                📌 <b>Project Type:</b> Solo Project
                            </Text>
                            <Text mt={2}>
                                DiceRoller is a cross-platform app I built to deliver a fun and interactive 3D dice-rolling experience across both mobile and web.
                                <Text mt={1}>
                                    On mobile, users can simply shake their phone to roll the dice, while on the web, they can use the WASD keys for keyboard input to move the dice. I built the app using Expo and React Native, and integrated expo-three for real-time 3D rendering and Cannon.js for realistic physics.
                                </Text>
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
                                    <strong>3D Dice Simulation:</strong> Rendered realistic 3D dice using <u>expo-three</u> and applied a physics engine with <u>Cannon.js</u>.
                                </List.Item>
                                <List.Item>
                                    <strong>Cross-Platform Support:</strong> Built with React Native and Expo, supporting both mobile and web platforms.
                                </List.Item>
                                <List.Item>
                                    <strong>Shake Detection on Mobile:</strong> Used <u>react-native-shake</u> to detect device motion and roll the dice by shaking the phone.
                                </List.Item>
                                <List.Item>
                                    <strong>Keyboard Interaction on Web:</strong> Enabled WASD key input to roll the dice in the browser environment.
                                </List.Item>
                                <List.Item>
                                    <strong>Camera Position & Lighting Setup:</strong> Implemented a fixed camera angle and ambient lighting to enhance visibility and realism.
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
                                <StackIcon label="React Native" icon={FaReact} color="#61DAFB" />
                                <StackIcon label="Expo" icon={SiExpo} color="black" />
                                <StackIcon label="TypeScript" icon={SiTypescript} color="#3178C6" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">3D & Interaction</Heading>
                            <SimpleGrid columns={3} gap={5} mb={12}>
                                <StackIcon label="expo-three" icon={TbBrandThreejs} color="black" />
                                <StackIcon label="cannon-es" icon={FaCube} color="#555" />
                                <StackIcon label="react-native-shake" icon={FaMobileAlt} color="#1E88E5" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">Platform</Heading>
                            <SimpleGrid columns={3} gap={5} mb={6}>
                                <StackIcon label="Mobile (Shake)" icon={FaMobileAlt} color="#6C63FF" />
                                <StackIcon label="Web (Keyboard)" icon={FaKeyboard} color="#4A5568" />
                                <StackIcon label="Cross Platform" icon={FaGlobe} color="#2D3748" />
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
                                Watch how users can roll the dice by physically shaking their phone in this mobile walkthrough.
                            </Text>
                            <AspectRatio ratio={9 / 16} maxW="400px" mx="auto">
                                <video controls>
                                    <source src="videos/diceroller-walkthrough-app.mp4" type="video/mp4" />
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
