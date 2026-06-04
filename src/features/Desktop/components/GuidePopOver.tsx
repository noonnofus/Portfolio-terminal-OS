'use client'

import { useState } from "react";
import { CircleQuestionMark } from "lucide-react";
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
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-primary bg-primary/85 text-primary-foreground shadow-md transition-colors duration-200 hover:bg-primary"
                    aria-label="Help"
                >
                    <CircleQuestionMark />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 border-panel-border bg-panel text-panel-foreground">
                <div className="flex flex-col gap-3">
                    <h4 className="font-bold text-lg">Quick Guide</h4>
                    <div className="text-sm text-muted-foreground">
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
                        <span className="text-xs text-muted-foreground">
                            Step {step} of {TOTAL_STEPS}
                        </span>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setStep(step - 1)}
                                disabled={step === 1}
                                className="h-8 border-panel-border bg-transparent text-xs text-panel-foreground hover:bg-accent/70 hover:text-panel-foreground"
                            >
                                Prev
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setStep(step + 1)}
                                disabled={step === TOTAL_STEPS}
                                className="h-8 border-panel-border bg-transparent text-xs text-panel-foreground hover:bg-accent/70 hover:text-panel-foreground"
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
