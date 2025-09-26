import {
    Box,
    VStack,
    HStack,
    Text,
    Link,
    Icon,
    Heading,
} from "@chakra-ui/react";
import { LuExternalLink } from "react-icons/lu";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Language } from "@/app/store/features/languageSlice";

interface AppContactProps {
    language: Language;
}

export default function AppContact({ language }: AppContactProps) {
    const { t } = useTranslation(["Contact", "common"]);
    return (
        <div
            style={{
                width: "100%",
                height: "95%",
                overflow: "scroll",
                backgroundColor: "white",
                borderRadius: "0 0 8px 8px",
                color: "black",
            }}
        >
            <div className="my-8 mx-4 md:mx-36">
                <Box px={6} py={4}>
                    <Heading size="xl" mb={4} className="font-bold text-2xl">
                        {t("title")}
                    </Heading>

                    <Text mt={2} mb={4} fontSize="md" color="gray.700">
                        {t("description")}
                    </Text>

                    <VStack gap={4} align="start">
                        <HStack gap={3}>
                            <Icon as={FaEnvelope} boxSize={5} />
                            <Link
                                href="mailto:kevinvancouver02@gmail.com"
                                className="underline"
                            >
                                kevinvancouver02@gmail.com <LuExternalLink />
                            </Link>
                        </HStack>

                        <HStack gap={3}>
                            <Icon as={FaGithub} boxSize={5} />
                            <Link
                                href="https://github.com/noonnofus"
                                className="underline"
                            >
                                github.com/noonnofus <LuExternalLink />
                            </Link>
                        </HStack>

                        <HStack gap={3}>
                            <Icon as={FaLinkedin} boxSize={5} />
                            <Link
                                href="https://www.linkedin.com/in/kevin-hyun-ho-kim/"
                                className="underline"
                            >
                                linkedin.com/in/kevin-hyun-ho-kim{" "}
                                <LuExternalLink />
                            </Link>
                        </HStack>
                    </VStack>
                </Box>
            </div>
        </div>
    );
}
