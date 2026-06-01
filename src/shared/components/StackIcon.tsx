import { Text, VStack, Icon } from "@chakra-ui/react";
import { IconType } from "react-icons";

export default function StackIcon({ label, icon, color }: { label: string; icon: IconType; color: string }) {
    return (
        <VStack gap={1} align="center">
            <Icon as={icon} boxSize={8} color={color} />
            <Text fontSize="sm">{label}</Text>
        </VStack>
    );
}