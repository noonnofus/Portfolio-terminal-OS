'use client'

import { useState } from "react";
import { MdOutlineQuestionMark } from "react-icons/md";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/shared/ui/shadcn-popover";
import { Button } from "@/shared/ui/shadcn-button";

export default function GuidePopOver() {
    const [step, setStep] = useState(1);
    const TOTAL_STEPS = 4;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    className="h-8 w-8 rounded-full flex items-center justify-center text-lg shadow-md text-white
                    bg-[#5488c0] border-[#4776a6] border hover:bg-[#4776a6] hover:border-[#365d85] transition-colors duration-200"
                    aria-label="Help"
                >
                    <MdOutlineQuestionMark />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-zinc-950 border-zinc-800 text-white p-4">
                <div className="flex flex-col gap-3">
                    <h4 className="font-bold text-lg">Quick Guide</h4>
                    <div className="text-sm text-zinc-300">
                        {step === 1 && (
                            <>
                                <p className="mb-2">🖱 Double-click an icon or click an icon and press enter to open an app.</p>
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
                            <p>📁 Not sure where to start? Try opening the &quot;Projects&quot; app to explore everything I&apos;ve worked on.</p>
                        )}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-zinc-500">
                            Step {step} of {TOTAL_STEPS}
                        </span>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setStep(step - 1)}
                                disabled={step === 1}
                                className="h-8 text-xs border-zinc-700"
                            >
                                Prev
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setStep(step + 1)}
                                disabled={step === TOTAL_STEPS}
                                className="h-8 text-xs border-zinc-700"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
