import { Flex, Image, Heading, Text, Link, SimpleGrid, Box, List, Icon } from "@chakra-ui/react";
import { SiVuedotjs, SiInertia, SiTailwindcss, SiPrime, SiVite, SiGit, SiJavascript, SiMysql, SiLaravel, SiAxios, SiPhp } from "react-icons/si"
import { FaGithub, FaWindowRestore, } from "react-icons/fa"
import StackIcon from "../layout/StackIcon";
import { GoLinkExternal as ExternalLinkIcon } from "react-icons/go";
import { useTranslation } from 'react-i18next';
import { Language } from "@/app/store/features/languageSlice";

interface AppProjectPageSsenceProps {
    language: Language;
}

export default function AppProjcetPageSsence({ language }: AppProjectPageSsenceProps) {
    const { t } = useTranslation(['PageSsence', 'common']);
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
                        src="/icons/pagessence.png"
                        alt="project WCHMS logo image"
                        boxSize="150px"
                        fit="cover"
                        h="auto"
                        className="mb-4"
                    />
                    <Link
                        href="/" // need to put it here
                        textDecor="underline"
                        mb={4}
                        target="_blank"
                    >
                        {t('linkAction')} <ExternalLinkIcon />
                    </Link>
                    <Link
                        href="https://github.com/noonnofus/PageSsence"
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
                                    <strong>{t('bookBrowsingSearch')}:</strong> {t('bookBrowsingSearchDesc')}
                                </List.Item>
                                <List.Item>
                                    <strong>{t('interactiveReviewsRatings')}:</strong> {t('interactiveReviewsRatingsDesc')}
                                </List.Item>
                                <List.Item>
                                    <strong>{t('roleBasedAccessControl')}:</strong> {t('roleBasedAccessControlDesc')}
                                </List.Item>
                                <List.Item>
                                    <strong>{t('modernStackUI')}:</strong> {t('modernStackUIDesc')}
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
                                <StackIcon label="Vue.js" icon={SiVuedotjs} color="#42b883" />
                                <StackIcon label="Inertia.js" icon={SiInertia} color="#000000" />
                                <StackIcon label="PrimeVue" icon={SiPrime} color="#4CAF50" />
                                <StackIcon label="Vite" icon={SiVite} color="#646CFF" />
                                <StackIcon label="JavaScript" icon={SiJavascript} color="#f7df1e" />
                                <StackIcon label="TailwindCSS" icon={SiTailwindcss} color="#38B2AC" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">Backend</Heading>
                            <SimpleGrid columns={3} gap={5} mb={12}>
                                <StackIcon label="Laravel" icon={SiLaravel} color="#FF2D20" />
                                <StackIcon label="PHP" icon={SiPhp} color="#777BB4" />
                                <StackIcon label="MySQL" icon={SiMysql} color="#00758F" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">Authentication</Heading>
                            <SimpleGrid columns={3} gap={5} mb={12}>
                                <StackIcon label="Laravel Breeze" icon={SiLaravel} color="#FF2D20" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">Libraries & Services</Heading>
                            <SimpleGrid columns={3} gap={5} mb={12}>
                                <StackIcon label="Axios" icon={SiAxios} color="#5A29E4" />
                                <StackIcon label="Ziggy" icon={SiLaravel} color="#FF2D20" />
                                <StackIcon label="Inertia Modal" icon={FaWindowRestore} color="#4A5568" />
                            </SimpleGrid>

                            <Heading mt={6} mb={2} className="text-lg font-semibold">Other Tools</Heading>
                            <SimpleGrid columns={3} gap={5} mb={6}>
                                <StackIcon label="GitHub" icon={FaGithub} color="black" />
                                <StackIcon label="Git" icon={SiGit} color="#F05033" />
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
                                Watch how users browse books, read and write reviews, and rate their favorite reads.
                            </Text>
                        </Box> */}
                    </Flex>
                </Flex>
            </div>
        </div>
    );
}
