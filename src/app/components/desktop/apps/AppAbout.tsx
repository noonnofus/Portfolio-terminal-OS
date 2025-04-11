'use client';

import AppDesktopHeader from "./layout/AppDesktopHeader";
import { TbBrandCSharp } from "react-icons/tb";
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaJs, FaGithub } from "react-icons/fa"
import {
    SiTypescript, SiPhp, SiMarkdown, SiNextdotjs,
    SiVuedotjs, SiVite, SiRedux, SiEjs, SiTailwindcss, SiShadcnui, SiChakraui,
    SiExpress, SiHono, SiLaravel, SiDotnet,
    SiReactrouter, SiReactquery, SiZod,
    SiWebrtc, SiSocketdotio,
    SiBun, SiSqlite, SiTurso, SiDrizzle, SiPrisma,
    SiNpm, SiVercel, SiHeroku, SiRender,
    SiGit, SiJira, SiTrello, SiFigma, SiMysql, SiPostgresql, SiMongodb
} from "react-icons/si"
import { Box, Text, Heading, SimpleGrid, VStack, Icon } from "@chakra-ui/react"

export default function AppAbout() {
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
                    <Box className="mb-8">
                        <Heading size="lg" className="font-bold text-3xl text-gray-800">
                            👋 Hi, I’m Kevin!
                        </Heading>
                        <Text mt={2} fontSize="md" color="gray.700">
                            A full-stack web developer based in <b>Vancouver, BC</b> 🇨🇦, originally from <b>South Korea</b> 🇰🇷.
                        </Text>
                        <Text mt={1} fontSize="md" color="gray.600">
                            Currently studying at <b>BCIT</b> — graduating <b>April 2025</b> 🎓
                        </Text>
                    </Box>


                    <Box className="mb-8">
                        <Heading
                            mb={4}
                            className="font-bold text-2xl"
                        >
                            🧑‍💻 Tech Stack
                        </Heading>

                        <Heading mt={6} mb={2} className="text-lg font-semibold">Languages</Heading>
                        <SimpleGrid columns={3} gap={5} mb={12}>
                            <StackIcon label="HTML5" icon={FaHtml5} color="#E34F26" />
                            <StackIcon label="CSS3" icon={FaCss3Alt} color="#1572B6" />
                            <StackIcon label="JavaScript" icon={FaJs} color="#F7DF1E" />
                            <StackIcon label="TypeScript" icon={SiTypescript} color="#3178C6" />
                            <StackIcon label="C#" icon={TbBrandCSharp} color="#8D74E4" />
                            <StackIcon label="PHP" icon={SiPhp} color="#777BB4" />
                            <StackIcon label="Markdown" icon={SiMarkdown} color="#000000" />
                        </SimpleGrid>
                        <Heading mt={6} mb={2} className="text-lg font-semibold">Frontend Frameworks & Libraries</Heading>
                        <SimpleGrid columns={3} gap={1} mb={12}>
                            <StackIcon label="React" icon={FaReact} color="#61DAFB" />
                            <StackIcon label="Next.js" icon={SiNextdotjs} color="black" />
                            <StackIcon label="Vue.js" icon={SiVuedotjs} color="#42b883" />
                            <StackIcon label="Vite" icon={SiVite} color="#646CFF" />
                            <StackIcon label="Redux" icon={SiRedux} color="#764abc" />
                            <StackIcon label="EJS" icon={SiEjs} color="black" />
                            <StackIcon label="TailwindCSS" icon={SiTailwindcss} color="#38B2AC" />
                            <StackIcon label="shadcn/ui" icon={SiShadcnui} color="black" />
                            <StackIcon label="Chakra UI" icon={SiChakraui} color="#4ED1C5" />
                        </SimpleGrid>

                        <Heading mt={6} mb={2} className="text-lg font-semibold">Backend Frameworks & Libraries</Heading>
                        <SimpleGrid columns={3} gap={2} mb={12}>
                            <StackIcon label="Express.js" icon={SiExpress} color="#404d59" />
                            <StackIcon label="Hono" icon={SiHono} color="#FF9859" />
                            <StackIcon label="Laravel" icon={SiLaravel} color="#FF2D20" />
                            <StackIcon label=".NET" icon={SiDotnet} color="#5C2D91" />
                        </SimpleGrid>

                        <Heading mt={6} mb={2} className="text-lg font-semibold">State Management & Utilities</Heading>
                        <SimpleGrid columns={3} gap={2} mb={12}>
                            <StackIcon label="React Router" icon={SiReactrouter} color="#CA4245" />
                            <StackIcon label="React Query" icon={SiReactquery} color="#FF4154" />
                            <StackIcon label="Zod" icon={SiZod} color="#3068b7" />
                        </SimpleGrid>

                        <Heading mt={6} mb={2} className="text-lg font-semibold">Web Technologies</Heading>
                        <SimpleGrid columns={3} gap={2} mb={12}>
                            <StackIcon label="WebRTC" icon={SiWebrtc} color="#333" />
                            <StackIcon label="Socket.IO" icon={SiSocketdotio} color="black" />
                        </SimpleGrid>

                        <Heading mt={6} mb={2} className="text-lg font-semibold">Runtime Environments</Heading>
                        <SimpleGrid columns={3} gap={2} mb={12}>
                            <StackIcon label="Node.js" icon={FaNodeJs} color="#339933" />
                            <StackIcon label="Bun" icon={SiBun} color="black" />
                        </SimpleGrid>

                        <Heading mt={6} mb={2} className="text-lg font-semibold">Databases & ORMs</Heading>
                        <SimpleGrid columns={3} gap={2} mb={12}>
                            <StackIcon label="MySQL" icon={SiMysql} color="#00758F" />
                            <StackIcon label="PostgreSQL" icon={SiPostgresql} color="#336791" />
                            <StackIcon label="MongoDB" icon={SiMongodb} color="#4ea94b" />
                            <StackIcon label="SQLite" icon={SiSqlite} color="#07405e" />
                            <StackIcon label="Turso" icon={SiTurso} color="black" />
                            <StackIcon label="Drizzle" icon={SiDrizzle} color="#C5F74F" />
                            <StackIcon label="Prisma" icon={SiPrisma} color="#3982CE" />
                        </SimpleGrid>

                        <Heading mt={6} mb={2} className="text-lg font-semibold">DevOps & Deployment</Heading>
                        <SimpleGrid columns={3} gap={2} mb={12}>
                            <StackIcon label="NPM" icon={SiNpm} color="#CB3837" />
                            <StackIcon label="Vercel" icon={SiVercel} color="black" />
                            <StackIcon label="Heroku" icon={SiHeroku} color="#430098" />
                            <StackIcon label="Render" icon={SiRender} color="black" />
                            <StackIcon label="GitHub Pages" icon={FaGithub} color="black" />
                        </SimpleGrid>

                        <Heading mt={6} mb={2} className="text-lg font-semibold">Tools & Collaborations</Heading>
                        <SimpleGrid columns={3} gap={2} mb={12}>
                            <StackIcon label="Git" icon={SiGit} color="#F05033" />
                            <StackIcon label="Jira" icon={SiJira} color="#0A0FFF" />
                            <StackIcon label="Trello" icon={SiTrello} color="#026AA7" />
                            <StackIcon label="Figma" icon={SiFigma} color="#F24E1E" />
                        </SimpleGrid>

                    </Box>
                </div>
            </div>
        </>
    );
}

function StackIcon({ label, icon, color }: { label: string; icon: any; color: string }) {
    return (
        <VStack gap={1} align="center">
            <Icon as={icon} boxSize={8} color={color} />
            <Text fontSize="sm">{label}</Text>
        </VStack>
    );
}
