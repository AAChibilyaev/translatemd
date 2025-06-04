import { COMMANDS } from '../commands';
export const parseArgs = (args) => {
    if (args.length === 0) {
        return { command: COMMANDS.HELP, input: '' };
    }
    const command = args[0];
    if (!Object.values(COMMANDS).includes(command)) {
        throw new Error(`Invalid command: ${command}`);
    }
    const options = { command, input: '' };
    for (let i = 1; i < args.length; i++) {
        const arg = args[i];
        if (arg.startsWith('--')) {
            const [key, value] = arg.slice(2).split('=');
            if (key === 'output' || key === 'lang' || key === 'input') {
                options[key] = value || args[++i];
            }
        }
        else if (!options.input) {
            options.input = arg;
        }
    }
    return options;
};
