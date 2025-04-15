import { Flex, Image, Heading, Text, Link, SimpleGrid, Box, List } from "@chakra-ui/react";
import { Tooltip as ChakraTooltip } from "@/components/ui/tooltip"
import { SiTypescript, SiNextdotjs, SiTailwindcss, SiShadcnui, SiDrizzle, SiGit, SiJira, SiMysql } from "react-icons/si"
import { FaGithub, FaBrain, FaProjectDiagram, FaKey, FaAws, FaFilePdf } from "react-icons/fa"
import StackIcon from "../layout/StackIcon";
import { GoLinkExternal as ExternalLinkIcon } from "react-icons/go";

export default function AppProjcetWCHMS() {
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
                        <Text>WCHMS - Client Project</Text>
                    </Heading>

                    <Image
                        src="/icons/wchms.png"
                        alt="project WCHMS logo image"
                        boxSize="150px"
                        fit="cover"
                        h="auto"
                        className="mb-4"
                    />
                    <ChakraTooltip
                        content="App may take over 30 seconds to load on first visit."
                        openDelay={100}
                        closeDelay={200}
                        showArrow
                    >
                        <Link
                            href="https://wchms-idsp4.fly.dev/"
                            textDecor="underline"
                            mb={4}
                            target="_blank"
                        >
                            See WCHMS <ExternalLinkIcon />
                        </Link>
                    </ChakraTooltip>
                    <Flex maxW="700px" flexDir="column" className="ml-1 mr-1">
                        <Box className="mb-6">
                            <Heading size="md" className="font-semibold text-xl text-gray-800">
                                Overview
                            </Heading>
                            <Text mt={1} fontSize="sm" color="gray.600">
                                📌 <b>Project Type:</b> Client Group Project
                            </Text>
                            <Text mt={2}>
                                WCHMS is a full-stack web application I built with my team to support dementia prevention for Japanese seniors living in Vancouver. We designed the platform to allow users to register for dementia prevention programs and use AI-powered self-study tools for simple math and reading exercises. We also implemented full Japanese translation throughout the site and added real-time in-app notifications.
                                <Text mt={1}>
                                    On the admin side, I created a management interface that allows admins to generate course materials using AI in PDF format, as well as a dashboard where they can efficiently manage users, staff, courses, and rooms.
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
                                My Role
                            </Heading>

                            <Text mt={2} className="text-gray-700">
                                As a Full-Stack Web Developer, I was responsible for both designing and implementing key features of the WCHMS application.
                            </Text>

                            <List.Root mt={4} ps={4} gap={3} className="text-gray-700">
                                <List.Item>
                                    <strong>AI-Powered Self-Study:</strong> Developed an interactive learning feature that enables seniors to practice basic and intermediate-level math and reading exercises using AI.
                                </List.Item>
                                <List.Item>
                                    <strong>Automated Course Material Generation:</strong> Implemented a system that allows administrators and staff to generate course materials in PDF format, aligned with the same difficulty levels as the self-study module.
                                </List.Item>
                                <List.Item>
                                    <strong>Admin Management System:</strong> Built CRUD functionality for managing participants and staff, ensuring seamless administrative control over users and course management.
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
                                <StackIcon label="TypeScript" icon={SiTypescript} color="#3178C6" />
                                <StackIcon label="Next.js" icon={SiNextdotjs} color="black" />
                                <StackIcon label="TailwindCSS" icon={SiTailwindcss} color="#38B2AC" />
                                <StackIcon label="shadcn/ui" icon={SiShadcnui} color="black" />
                                <StackIcon label="next-i18n" icon={SiNextdotjs} color="black" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">Backend</Heading>
                            <SimpleGrid columns={3} gap={5} mb={12}>
                                <StackIcon label="Drizzle ORM" icon={SiDrizzle} color="#C5F74F" />
                                <StackIcon label="MySQL" icon={SiMysql} color="#00758F" />
                                <StackIcon label="WebSocket" icon={FaProjectDiagram} color="black" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">Authentication</Heading>
                            <SimpleGrid columns={3} gap={5} mb={12}>
                                <StackIcon label="NextAuth" icon={FaKey} color="black" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">Libraries & Services</Heading>
                            <SimpleGrid columns={3} gap={5} mb={12}>
                                <StackIcon label="OpenAI API" icon={FaBrain} color="#7fdbff" />
                                <StackIcon label="AWS S3 Bucket" icon={FaAws} color="#FF9900" />
                                <StackIcon label="react-pdf" icon={FaFilePdf} color="#d32f2f" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">Other Tools</Heading>
                            <SimpleGrid columns={3} gap={5} mb={6}>
                                <StackIcon label="GitHub" icon={FaGithub} color="black" />
                                <StackIcon label="Git" icon={SiGit} color="#F05033" />
                                <StackIcon label="Jira" icon={SiJira} color="#0052CC" />
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
                                Watch how seniors can practice math and reading exercises interactively with AI-generated content.
                            </Text>
                            <Box w="100%">
                                <video controls>
                                    <source src="videos/wchms-walkthrough.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </Box>
                        </Box>
                    </Flex>
                </Flex>
            </div>
        </div>
    );
}
