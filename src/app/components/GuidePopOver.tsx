import { Popover, Button, Portal, Box, Group } from "@chakra-ui/react"
import { useState, useRef } from "react";
import { MdOutlineQuestionMark } from "react-icons/md";

export default function GuidePopOver() {
    const [step, setStep] = useState(1);
    const TOTAL_STEPS = 4;
    const ref = useRef<HTMLButtonElement | null>(null)

    return (
        <Popover.Root initialFocusEl={() => ref.current}>
            <Popover.Trigger asChild>
                <Button
                    variant="outline"
                    padding="0"
                    minW="0"
                    height="2rem"
                    width="2rem"
                    className="rounded-full flex items-center justify-center text-lg shadow-md text-white
                    bg-[#5488c0] border-[#4776a6] hover:bg-[#4776a6] hover:border-[#365d85] transition-colors duration-200"
                >
                    <MdOutlineQuestionMark />
                </Button>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content>
                        <Popover.Header>Quick Guide</Popover.Header>
                        <Popover.Arrow />
                        <Popover.Body>
                            {step === 1 && (
                                <>
                                    <p>🖱 Double-click an icon or click an icon and press enter to open an app.</p>
                                    <p>📱 On tablet or phone, simply tap an icon to open the app.</p>
                                </>
                            )}
                            {step === 2 && (
                                <p>🖥️ Use the top bar of the app to minimize or close it.</p>
                            )}
                            {step === 3 && (
                                <p>🧩 Feel free to drag icons around — it works on both mobile and desktop, just like a real OS.</p>
                            )}
                            {step === 4 && (
                                <p>📁 Not sure where to start? Try opening the "Projects" app to explore everything I've worked on.</p>
                            )}
                        </Popover.Body>
                        <Popover.Footer className="flex justify-between items-center">
                            <Box fontSize="sm">
                                Step {step} of {TOTAL_STEPS}
                            </Box>
                            <Group>
                                <Button size="sm" ref={ref} onClick={() => setStep(step - 1)} disabled={step === 1}>
                                    Prev
                                </Button>
                                <Button size="sm" onClick={() => setStep(step + 1)} disabled={step === TOTAL_STEPS}>
                                    Next
                                </Button>
                            </Group>
                        </Popover.Footer>
                        <Popover.CloseTrigger />
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    );
}