import { Flex, Image, Heading, Text, Link, SimpleGrid, Box, List, AspectRatio, Icon } from "@chakra-ui/react";
import { SiTypescript, SiNextdotjs, SiTailwindcss, SiDrizzle, SiPostgresql, SiFirebase } from "react-icons/si"
import { FaSpider, FaBrain, FaProjectDiagram, FaBell, FaAws, FaReact, FaGithub } from "react-icons/fa"
import { GoLinkExternal as ExternalLinkIcon } from "react-icons/go";
import StackIcon from "../layout/StackIcon";
import { useTranslation } from 'react-i18next';
import { Language } from "@/app/store/features/languageSlice";

interface AppProjectFlareProps {
    language: Language;
}

export default function AppProjcetFlare({ language }: AppProjectFlareProps) {
    const { t } = useTranslation(['Flare', 'common']);
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
                        <Text>{t('title')}</Text>
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
                        {t('linkAction')} <ExternalLinkIcon />
                    </Link>
                    <Link
                        href="https://github.com/noonnofus/Flare_IDSP"
                        textDecor="underline"
                        mb={4}
                        target="_blank"
                    >
                        <Icon as={FaGithub} boxSize={5} />
                        {t('common:sourceCode')} <ExternalLinkIcon />
                    </Link>
                    <Flex maxW="700px" flexDir="column" className="ml-1 mr-1">
                        <Box className="mb-6">
                            <Heading size="md" className="font-semibold text-xl text-gray-800">
                                {t('common:overview')}
                            </Heading>
                            <Text mt={1} fontSize="sm" color="gray.600">
                                📌 <b>{t('common:projectType')}:</b> {t('common:groupProject')}
                            </Text>
                            <Text mt={2}>
                                {t('description')}
                            </Text>
                        </Box>

                        <Box
                            width="100%"
                            borderTop="1px solid #ccc"
                            margin="0 auto"
                        />

                        <Box className="mb-6 mt-6">
                            <Heading size="md" className="font-semibold text-xl text-gray-800">
                                {t('common:myRole')}
                            </Heading>

                            <Text mt={2} className="text-gray-700">
                                {t('myRoleDescription')}
                            </Text>

                            <List.Root mt={4} ps={4} gap={3} className="text-gray-700">
                                <List.Item>
                                    <strong>{t('pwaIntegration')}:</strong> {t('pwaIntegrationDesc')}
                                </List.Item>
                                <List.Item>
                                    <strong>{t('chatbotDevelopment')}:</strong> {t('chatbotDevelopmentDesc')}
                                </List.Item>
                                <List.Item>
                                    <strong>{t('realtimeNotifications')}:</strong> {t('realtimeNotificationsDesc')}
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

                            <Heading mt={6} mb={2} className="text-lg font-semibold">{t('backendDatabase')}</Heading>
                            <SimpleGrid columns={3} gap={5} mb={12}>
                                <StackIcon label="PostgreSQL" icon={SiPostgresql} color="#336791" />
                                <StackIcon label="Drizzle ORM" icon={SiDrizzle} color="#C5F74F" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">{t('cloudAPIs')}</Heading>
                            <SimpleGrid columns={3} gap={5} mb={12}>
                                <StackIcon label="AWS S3" icon={FaAws} color="#FF9900" />
                                <StackIcon label="OpenAI API" icon={FaBrain} color="#7fdbff" />
                                <StackIcon label="Bing News API" icon={FaProjectDiagram} color="#008272" />
                                <StackIcon label="Firebase" icon={SiFirebase} color="#FFCA28" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">{t('pwaRealtime')}</Heading>
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
                                {t('appWalkthroughDescription')}
                            </Text>
                            <AspectRatio ratio={2 / 1}>
                                <video controls>
                                    <source src="videos/flare-walkthrough-web.mp4" type="video/mp4" />
                                    {t('common:videoNotSupported')}
                                </video>
                            </AspectRatio>
                            <AspectRatio ratio={2 / 1}>
                                <video controls>
                                    <source src="videos/flare-walkthrough-app.mp4" type="video/mp4" />
                                    {t('common:videoNotSupported')}
                                </video>
                            </AspectRatio>
                        </Box>
                    </Flex>
                </Flex>
            </div>
        </div>
    );
}
