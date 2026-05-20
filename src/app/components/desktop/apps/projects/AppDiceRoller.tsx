import { Flex, Image, Heading, Text, Link, SimpleGrid, Box, List, AspectRatio, Icon } from "@chakra-ui/react";
import { SiTypescript, SiExpo, } from "react-icons/si"
import { FaReact, FaCube, FaMobileAlt, FaKeyboard, FaGlobe, FaGithub } from "react-icons/fa"
import { TbBrandThreejs } from "react-icons/tb";
import StackIcon from "../layout/StackIcon";
import { GoLinkExternal as ExternalLinkIcon } from "react-icons/go";
import { useTranslation } from 'react-i18next';
import { Language } from "@/app/store/features/languageSlice";

interface AppProjectDiceRollerProps {
    language: Language;
}

export default function AppProjcetDiceRoller({}: AppProjectDiceRollerProps) {
    const { t } = useTranslation(['DiceRoller', 'common']);
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
                        {t('linkAction')}<ExternalLinkIcon />
                    </Link>
                    <Link
                        href="https://github.com/noonnofus/diceRoller"
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
                                <Text mt={1}>
                                    {t('descriptionContinued')}
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
                                {t('common:keyFeatures')}
                            </Heading>

                            <List.Root mt={4} ps={4} gap={3} className="text-gray-700">
                                <List.Item>
                                    <strong>{t('threeDDiceSimulation')}:</strong> {t('threeDDiceSimulationDesc')}
                                </List.Item>
                                <List.Item>
                                    <strong>{t('crossPlatformSupport')}:</strong> {t('crossPlatformSupportDesc')}
                                </List.Item>
                                <List.Item>
                                    <strong>{t('shakeDetectionMobile')}:</strong> {t('shakeDetectionMobileDesc')}
                                </List.Item>
                                <List.Item>
                                    <strong>{t('keyboardInteractionWeb')}:</strong> {t('keyboardInteractionWebDesc')}
                                </List.Item>
                                <List.Item>
                                    <strong>{t('cameraPositionLighting')}:</strong> {t('cameraPositionLightingDesc')}
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

                            <Heading mt={6} mb={2} className="text-lg font-semibold">{t('threeDInteraction')}</Heading>
                            <SimpleGrid columns={3} gap={5} mb={12}>
                                <StackIcon label="expo-three" icon={TbBrandThreejs} color="black" />
                                <StackIcon label="cannon-es" icon={FaCube} color="#555" />
                                <StackIcon label="react-native-shake" icon={FaMobileAlt} color="#1E88E5" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">{t('platform')}</Heading>
                            <SimpleGrid columns={3} gap={5} mb={6}>
                                <StackIcon label={t('mobileShake')} icon={FaMobileAlt} color="#6C63FF" />
                                <StackIcon label={t('webKeyboard')} icon={FaKeyboard} color="#4A5568" />
                                <StackIcon label={t('crossPlatform')} icon={FaGlobe} color="#2D3748" />
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
                            <AspectRatio ratio={9 / 16} maxW="400px" mx="auto">
                                <video controls>
                                    <source src="videos/diceroller-walkthrough-app.mp4" type="video/mp4" />
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
