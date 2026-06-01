import { Flex, Image, Heading, Text, Link, SimpleGrid, Box, List, } from "@chakra-ui/react";
import { SiJavascript, SiDiscord, SiMongodb, SiPubg, } from "react-icons/si"
import { FaPlayCircle, FaMicrophoneAlt, FaGithub } from "react-icons/fa"
import StackIcon from "@/shared/components/StackIcon";
import { GoLinkExternal as ExternalLinkIcon } from "react-icons/go";
import { useTranslation } from 'react-i18next';
import { Language } from "@/shared/lib/i18n/useLanguageStore";

interface AppProjectMejubotProps {
    language: Language;
}

export default function AppProjcetMejubot({}: AppProjectMejubotProps) {
    const { t } = useTranslation(['Mejubot', 'common']);
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
                        {t('linkAction')}<ExternalLinkIcon />
                    </Link>
                    <Flex maxW="700px" flexDir="column" className="ml-1 mr-1">
                        <Box className="mb-6">
                            <Heading size="md" className="font-semibold text-xl text-gray-800">
                                {t('common:overview')}
                            </Heading>
                            <Text mt={1} fontSize="sm" color="gray.600">
                                📌 <b>{t('common:projectType')}:</b> {t('common:soloProject')}
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
                                {t('common:keyFeatures')}
                            </Heading>

                            <List.Root mt={4} ps={4} gap={3} className="text-gray-700">
                                <List.Item>
                                    <strong>{t('youtubeMusicPlayback')}:</strong> {t('youtubeMusicPlaybackDesc')}
                                </List.Item>
                                <List.Item>
                                    <strong>{t('pubgStatsIntegration')}:</strong> {t('pubgStatsIntegrationDesc')}
                                </List.Item>
                                <List.Item>
                                    <strong>{t('virtualStockMarketGame')}:</strong> {t('virtualStockMarketGameDesc')}
                                </List.Item>
                                <List.Item>
                                    <strong>{t('multiLanguageSupport')}:</strong> {t('multiLanguageSupportDesc')}
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

                            <Heading mt={6} mb={2} className="text-lg font-semibold">{t('botFramework')}</Heading>
                            <SimpleGrid columns={3} gap={5} mb={12}>
                                <StackIcon label="Discord.js" icon={SiDiscord} color="#5865F2" />
                                <StackIcon label="discord-player" icon={FaPlayCircle} color="#FF5722" />
                                <StackIcon label="discordjs/opus" icon={FaMicrophoneAlt} color="#2D3748" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">{t('apisFeatures')}</Heading>
                            <SimpleGrid columns={3} gap={5} mb={12}>
                                <StackIcon label="PUBG API" icon={SiPubg} color="black" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">Frontend</Heading>
                            <SimpleGrid columns={3} gap={5} mb={12}>
                                <StackIcon label="JavaScript" icon={SiJavascript} color="#f7df1e" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">{t('databaseAuth')}</Heading>
                            <SimpleGrid columns={3} gap={5} mb={12}>
                                <StackIcon label="MongoDB" icon={SiMongodb} color="#47A248" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">{t('deploymentTools')}</Heading>
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
