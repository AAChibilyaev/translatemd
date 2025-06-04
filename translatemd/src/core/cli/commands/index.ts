// Основные команды CLI
export const COMMANDS = {
  TRANSLATE: 'translate',
  CONFIG: 'config',
  HELP: 'help'
} as const;

export type Command = typeof COMMANDS[keyof typeof COMMANDS];