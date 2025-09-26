"use client";

import { FaReact, FaTerminal, FaGithub } from "react-icons/fa";
import {
    SiTypescript,
    SiFramer,
    SiNextdotjs,
    SiChakraui,
    SiVercel,
} from "react-icons/si";
import StackIcon from "./layout/StackIcon";
import { Box, Text, Heading, SimpleGrid, Link, Icon } from "@chakra-ui/react";
import { GoLinkExternal as ExternalLinkIcon } from "react-icons/go";
import { useTranslation } from 'react-i18next';
import { Language } from "@/app/store/features/languageSlice";

interface AppAboutSiteProps {
    language: Language;
}

export default function AppAboutSite({ language }: AppAboutSiteProps) {
    const { t } = useTranslation(['AboutSite', 'common']);
    return (
        <div className="my-8 mx-4 md:mx-36">
            <Box className="mb-8">
                <Heading size="lg" className="font-bold text-3xl text-gray-800">
                    {t('title')}
                </Heading>
                <Text mt={3} fontSize="md" color="gray.700">
                    {t('description')}
                </Text>
            </Box>

            <Box className="mb-8">
                <Heading mb={4} className="font-bold text-2xl text-black">
                    {t('sourceCodeTitle')}
                </Heading>
                <Link
                    href="https://github.com/noonnofus/Portfolio-terminal-OS"
                    textDecor="underline"
                    mb={4}
                    target="_blank"
                    color="black"
                >
                    <Icon as={FaGithub} boxSize={5} />
                    {t('sourceCodeTitle')} <ExternalLinkIcon />
                </Link>
            </Box>
            <Box className="mb-8">
                <Heading mb={4} className="font-bold text-2xl text-black">
                    {t('techStackTitle')}
                </Heading>

                <Heading
                    mt={6}
                    mb={2}
                    className="text-lg font-semibold text-black"
                >
                    {t('coreStack')}
                </Heading>
                <SimpleGrid columns={3} gap={5} mb={12} color="black">
                    <StackIcon
                        label="TypeScript"
                        icon={SiTypescript}
                        color="#3178C6"
                    />
                    <StackIcon label="ReactJS" icon={FaReact} color="#61DAFB" />
                    <StackIcon
                        label="Next.js"
                        icon={SiNextdotjs}
                        color="black"
                    />
                </SimpleGrid>

                <Heading
                    mt={6}
                    mb={2}
                    className="text-lg font-semibold text-black"
                >
                    {t('uiAnimation')}
                </Heading>
                <SimpleGrid columns={3} gap={5} mb={12} color="black">
                    <StackIcon
                        label="Chakra UI"
                        icon={SiChakraui}
                        color="#4ED1C5"
                    />
                    <StackIcon
                        label="Framer Motion"
                        icon={SiFramer}
                        color="black"
                    />
                </SimpleGrid>

                <Heading
                    mt={6}
                    mb={2}
                    className="text-lg font-semibold text-black"
                >
                    {t('terminalInterface')}
                </Heading>
                <SimpleGrid columns={3} gap={5} mb={12} color="black">
                    <StackIcon
                        label="xterm.js"
                        icon={FaTerminal}
                        color="#0F4C81"
                    />
                </SimpleGrid>

                <Heading
                    mt={6}
                    mb={2}
                    className="text-lg font-semibold text-black"
                >
                    {t('deployment')}
                </Heading>
                <SimpleGrid columns={3} gap={5} mb={12} color="black">
                    <StackIcon label="Vercel" icon={SiVercel} color="black" />
                </SimpleGrid>
            </Box>
            <Box className="mb-8">
                <Heading mb={4} className="font-bold text-2xl text-black">
                    {t('iconsBackgroundCredits')}
                </Heading>
                <Text mt={2} fontSize="md" color="gray.700">
                    <b>{t('iconsCredit')}</b> <br />
                    {t('iconsProvidedBy')}{" "}
                    <Link
                        href="https://www.flaticon.com/"
                        textDecor="underline"
                        color="teal.500"
                        fontWeight="medium"
                    >
                        Flaticon <ExternalLinkIcon />
                    </Link>{" "}
                    {t('iconsCreatedBy')}{" "}
                    <Link
                        href="https://www.flaticon.com/authors/mattbadal"
                        textDecor="underline"
                        color="teal.500"
                    >
                        mattbadal <ExternalLinkIcon />
                    </Link>
                    ,{" "}
                    <Link
                        href="https://www.flaticon.com/authors/freepik"
                        textDecor="underline"
                        color="teal.500"
                    >
                        Freepik <ExternalLinkIcon />
                    </Link>
                    ,{" "}
                    <Link
                        href="https://www.flaticon.com/authors/ilham-fitrotul-hayat"
                        textDecor="underline"
                        color="teal.500"
                    >
                        Ilham Fitrotul Hayat <ExternalLinkIcon />
                    </Link>
                    , and{" "}
                    <Link
                        href="https://www.flaticon.com/authors/riajulislam"
                        textDecor="underline"
                        color="teal.500"
                    >
                        riajulislam <ExternalLinkIcon />
                    </Link>
                    .
                </Text>

                <Text mt={4} fontSize="md" color="gray.700">
                    <b>{t('backgroundCredit')}</b> <br />
                    {t('backgroundFrom')}{" "}
                    <Link
                        href="https://4kwallpapers.com/abstract/macos-sonoma-11573.html"
                        textDecor="underline"
                        color="teal.500"
                    >
                        4kwallpapers <ExternalLinkIcon />
                    </Link>
                    .
                </Text>
            </Box>
        </div>
    );
}