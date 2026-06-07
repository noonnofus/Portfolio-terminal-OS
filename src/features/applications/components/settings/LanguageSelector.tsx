"use client";

import { useLanguageStore, Language } from "@/shared/lib/i18n/useLanguageStore";

const languageOptions = [
    { label: "🇰🇷", value: "ko" },
    { label: "🇺🇸", value: "en" },
];

export default function LanguageSelector() {
    const currentLanguage = useLanguageStore((state) => state.currentLanguage);
    const setLanguage = useLanguageStore((state) => state.setLanguage);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value as Language);
    };

    return (
        <div className="flex items-center">
            <select
                value={currentLanguage}
                onChange={handleLanguageChange}
                className="bg-transparent border-none focus:outline-none cursor-pointer text-lg appearance-none px-2"
                aria-label="Select Language"
            >
                {languageOptions.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                        {lang.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
