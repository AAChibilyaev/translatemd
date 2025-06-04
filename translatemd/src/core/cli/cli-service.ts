import fs from 'node:fs';
import path from 'node:path';
import { COMMANDS } from '@cli/commands';
import { parseArgs, CliOptions } from '@cli/parsers';
import { TranslationAgent } from '../../agent';
import { FileProcessor } from '../processing/fileProcessor';

export class CliService {
  private agent: TranslationAgent;
  private fileProcessor: FileProcessor;

  constructor() {
    this.agent = new TranslationAgent();
    this.fileProcessor = new FileProcessor();
  }

  static async run(args: string[]): Promise<void> {
    try {
      const options = parseArgs(args);
      const instance = new CliService();
      await instance.handleCommand(options);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  }

  private async handleCommand(options: CliOptions): Promise<void> {
    switch (options.command) {
      case COMMANDS.TRANSLATE:
        return this.handleTranslate(options);
      case COMMANDS.CONFIG:
        return this.handleConfig();
      case COMMANDS.HELP:
        return this.handleHelp();
      default:
        throw new Error(`Unknown command: ${options.command}`);
    }
  }

  private async handleTranslate(options: CliOptions): Promise<void> {
    if (!options.input) {
      throw new Error('Input file/directory not specified');
    }

    const output = options.output || `${options.input}.translated`;
    const lang = options.lang || 'en';

    if (fs.lstatSync(options.input).isDirectory()) {
      const files = fs.readdirSync(options.input)
        .filter(f => f.endsWith('.md'))
        .map(f => ({
          input: path.join(options.input, f),
          output: path.join(output, f)
        }));
      await this.agent.batchTranslate(files, lang);
    } else {
      await this.agent.translateFile(options.input, output, lang);
    }
  }

  private async handleConfig(): Promise<void> {
    const configPath = path.join(process.cwd(), 'translatemd.config.json');
    if (!fs.existsSync(configPath)) {
      await fs.promises.writeFile(configPath, JSON.stringify({
        defaultLang: 'en',
        outputDir: './translated'
      }, null, 2));
      console.log('Config file created at', configPath);
    } else {
      const config = JSON.parse(await fs.promises.readFile(configPath, 'utf-8'));
      console.log('Current config:', config);
    }
  }

  private async handleHelp(): Promise<void> {
    console.log(`
Usage: translatemd [command] [options]

Commands:
  translate <input>   Translate markdown file/directory
  config              Manage configuration
  help                Show this help

Options:
  --output <path>     Output path (default: [input].translated)
  --lang <code>       Target language (default: en)
`);
  }
}