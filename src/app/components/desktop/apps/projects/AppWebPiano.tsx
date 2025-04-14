import { Flex, Image, Heading, Text, Link, SimpleGrid, Box, List, AspectRatio } from "@chakra-ui/react";
import { SiJavascript, SiEjs, SiCss3 } from "react-icons/si"
import { FaMusic } from "react-icons/fa"
import StackIcon from "../layout/StackIcon";
import { GoLinkExternal as ExternalLinkIcon } from "react-icons/go";

export default function AppProjcetWebPiano() {
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
                        <Text>WebPiano — A Browser-Based Interactive Instrument</Text>
                    </Heading>

                    <Image
                        src="/icons/webpiano.png"
                        alt="project WebPiano logo image"
                        boxSize="250px"
                        fit="cover"
                        h="auto"
                        className="mb-4"
                    />
                    <Link
                        href="https://play-piano-project.onrender.com"
                        textDecor="underline"
                        mb={4}
                        target="_blank"
                    >
                        Play Piano on WebPiano<ExternalLinkIcon />
                    </Link>
                    <Flex maxW="700px" flexDir="column" className="ml-1 mr-1">
                        <Box className="mb-6">
                            <Heading size="md" className="font-semibold text-xl text-gray-800">
                                Overview
                            </Heading>
                            <Text mt={2}>
                                A web-based piano application that lets users play music directly from their keyboard. It offers adjustable tuning controls and even supports uploading MP3 files to turn any sound into playable notes.
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
                                    <strong>Keyboard-Based Play:</strong> Users can perform melodies using their computer keyboard, with keys mapped to corresponding musical notes.
                                </List.Item>
                                <List.Item>
                                    <strong>Pitch & Tuning Control:</strong> Offers fine-grained tuning options, allowing users to adjust the pitch of each note for a customized sound experience.
                                </List.Item>
                                <List.Item>
                                    <strong>MP3 Sound Mapping:</strong> Users can upload their own MP3 files and convert them into playable instruments within the piano interface.
                                </List.Item>
                                <List.Item>
                                    <strong>Membrane Sound Support:</strong> Includes an alternative membrane synth mode to create deeper, more ambient tones.
                                </List.Item>
                            </List.Root>
                        </Box>

                        <Box
                            width="100%"
                            borderTop="1px solid #ccc"
                            margin="0 auto"
                        />

                        <Box className="mb-6 mt-6">
                            <Heading size="md" className="font-semibold text-xl text-gray-800">
                                Tech Stack
                            </Heading>

                            <SimpleGrid columns={3} gap={5} mt={4} mb={6}>
                                <StackIcon label="JavaScript" icon={SiJavascript} color="#f7df1e" />
                                <StackIcon label="EJS" icon={SiEjs} color="#A91E50" />
                                <StackIcon label="CSS3" icon={SiCss3} color="#264de4" />
                                <StackIcon label="Tone.js" icon={FaMusic} color="#888" />
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
                            <Text mt={2} mb={2}>
                                Watch how to play piano on web with various ways.
                            </Text>
                            <AspectRatio>
                                <video controls>
                                    <source src="videos/webpiano-walkthrough.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </AspectRatio>
                        </Box>
                    </Flex>
                </Flex>
            </div>
        </div >
    );
}
