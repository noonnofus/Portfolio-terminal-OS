"use client";

import { Box, Portal, Select } from "@chakra-ui/react";
import { createListCollection } from "@chakra-ui/react/collection";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { setLanguage, Language } from "@/app/store/features/languageSlice";

const languageOptions = [
    { label: "🇰🇷", value: "ko" },
    { label: "🇺🇸", value: "en" },
];

const languageCollection = createListCollection({
    items: languageOptions,
});

export default function LanguageSelector() {
    const currentLanguage = useSelector(
        (state: RootState) => state.language.currentLanguage
    );
    const dispatch = useDispatch();

    const handleLanguageChange = (details: { value: string[] }) => {
        if (details.value.length > 0) {
            dispatch(setLanguage(details.value[0] as Language));
        }
    };

    return (
        <Box>
            <Select.Root
                multiple={false}
                value={[currentLanguage]}
                onValueChange={handleLanguageChange}
                collection={languageCollection}
            >
                <Select.Control>
                    <Select.Trigger
                        background="transparent"
                        border="none"
                        _focus={{ boxShadow: "none" }}
                        _hover={{ bg: "transparent" }}
                        px={0}
                        minW="40px"
                        justifyContent="center"
                        h="20px"
                        minH="unset"
                        lineHeight="1"
                    >
                        <Select.ValueText
                            placeholder={
                                currentLanguage === "ko"
                                    ? "언어를 선택하세요."
                                    : "Select Language"
                            }
                        />
                    </Select.Trigger>
                </Select.Control>

                <Portal>
                    <Select.Positioner>
                        <Select.Content
                            bg="white"
                            border="1px solid"
                            borderColor="gray.200"
                            boxShadow="md"
                            minW="60px"
                        >
                            {languageOptions.map((lang) => (
                                <Select.Item
                                    key={lang.value}
                                    item={lang}
                                    px={2}
                                    py={1}
                                    _hover={{ bg: "gray.100" }}
                                >
                                    {lang.label}
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
            </Select.Root>
        </Box>
    );
}
