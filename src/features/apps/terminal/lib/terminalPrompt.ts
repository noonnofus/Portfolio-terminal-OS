import { TERMINAL_PROMPT_SUFFIX } from "./bootSequence";

export type TerminalPromptIdentity =
  | { status: "guest" }
  | { status: "authenticated"; displayName: string };

export function formatTerminalPrompt(
  identity: TerminalPromptIdentity,
): string {
  const name =
    identity.status === "authenticated"
      ? identity.displayName.toLocaleLowerCase("en-US")
      : "guest";

  return `${name}${TERMINAL_PROMPT_SUFFIX}`;
}
