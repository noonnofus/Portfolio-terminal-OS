import type { TerminalActionUri } from "./terminalActions";

const ESC = "\x1b";
const STRING_TERMINATOR = `${ESC}\\`;

export function formatTerminalLink(
  label: string,
  uri: TerminalActionUri,
): string {
  return `${ESC}]8;;${uri}${STRING_TERMINATOR}${ESC}[4m${label}${ESC}[24m${ESC}]8;;${STRING_TERMINATOR}`;
}
