import commands from "../command";
import type { TerminalCommand } from "../command";

export type CommandAction = 'clear' | 'reboot' | 'shutdown' | 'startx' | 'none';

export interface ParseResult {
  action: CommandAction;
  output?: string;
  lines?: string[];
}

export const executeCommand = (cmd: string, pathname: string): ParseResult => {
  const trimmed = cmd.trim().toLowerCase();
  
  if (trimmed === "help") {
    const lines = commands.map((command: TerminalCommand) => `   ${command.name.padEnd(15)} ${command.description}`);
    return { action: 'none', lines: [" Available commands:", ...lines] };
  } 
  
  if (trimmed === "clear") return { action: 'clear' };
  if (trimmed === "reboot") return { action: 'reboot' };
  if (trimmed === "shutdown") return { action: 'shutdown' };
  
  if (trimmed === "startx") {
    if (pathname.includes("gui")) {
      return { action: 'none', output: " You are already accessed to gui" };
    }
    return { action: 'startx' };
  }
  
  if (trimmed === "") return { action: 'none' };

  return { action: 'none', output: ` command not found: ${trimmed}` };
};
