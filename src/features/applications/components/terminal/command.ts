export interface TerminalCommand {
    name: string;
    description: string;
}

const commands: TerminalCommand[] = [
    {
      name: 'startx',
      description: 'access to GUI'
    },
    {
      name: 'reboot',
      description: 'restart the system'
    },
    {
      name: 'shutdown',
      description: 'shut the system down'
    },
    {
      name: 'clear',
      description: 'clear the terminal'
    }
];

export default commands;
