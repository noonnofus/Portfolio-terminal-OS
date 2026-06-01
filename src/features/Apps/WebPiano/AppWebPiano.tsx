import { Flex, Image, Heading, Text, Link, SimpleGrid, Box, List, AspectRatio, Icon } from "@chakra-ui/react";
import { Tooltip as ChakraTooltip } from "@/shared/ui/tooltip"
import { SiJavascript, SiEjs, SiCss3 } from "react-icons/si"
import { FaMusic, FaGithub } from "react-icons/fa"
import StackIcon from "@/shared/components/StackIcon";
import { GoLinkExternal as ExternalLinkIcon } from "react-icons/go";
import { useTranslation } from 'react-i18next';
import { Language } from "@/shared/lib/i18n/useLanguageStore";

interface AppProjectWebPianoProps {
    language: Language;
}

export default function AppProjcetWebPiano({}: AppProjectWebPianoProps) {
    const { t } = useTranslation(['WebPiano', 'common']);
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
                        src="/icons/webpiano.png"
                        alt="project WebPiano logo image"
                        boxSize="250px"
                        fit="cover"
                        h="auto"
                        className="mb-4"
                    />
                    <ChakraTooltip
                        content={t('common:tooltipContent')}
                        openDelay={100}
                        closeDelay={200}
                        showArrow
                    >
                        <Link
                            href="https://play-piano-project.onrender.com"
                            textDecor="underline"
                            mb={4}
                            target="_blank"
                        >
                            {t('linkAction')}<ExternalLinkIcon />
                        </Link>
                    </ChakraTooltip>
                    <Link
                        href="https://github.com/noonnofus/play_piano_project"
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
                                    <strong>{t('keyboardBasedPlay')}:</strong> {t('keyboardBasedPlayDesc')}
                                </List.Item>
                                <List.Item>
                                    <strong>{t('pitchTuningControl')}:</strong> {t('pitchTuningControlDesc')}
                                </List.Item>
                                <List.Item>
                                    <strong>{t('mp3SoundMapping')}:</strong> {t('mp3SoundMappingDesc')}
                                </List.Item>
                                <List.Item>
                                    <strong>{t('membraneSoundSupport')}:</strong> {t('membraneSoundSupportDesc')}
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
                                {t('common:techStack')}
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
                                {t('common:appWalkthrough')}
                            </Heading>
                            <Text mt={2} mb={2}>
                                {t('appWalkthroughDescription')}
                            </Text>
                            <AspectRatio>
                                <video controls>
                                    <source src="videos/webpiano-walkthrough.mp4" type="video/mp4" />
                                    {t('common:videoNotSupported')}
                                </video>
                            </AspectRatio>
                        </Box>
                    </Flex>
                </Flex>
            </div>
        </div >
    );
}
