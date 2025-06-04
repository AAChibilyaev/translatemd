import fs from 'node:fs';
import path from 'node:path';
import { COMMANDS } from '@cli/commands';
import { parseArgs } from '@cli/parsers';
import { TranslationAgent } from '../../agent';
import { FileProcessor } from '../processing/fileProcessor';
export class CliService {
    agent;
    fileProcessor;
    constructor() {
        this.agent = new TranslationAgent();
        this.fileProcessor = new FileProcessor();
    }
    static async run(args) {
        try {
            const options = parseArgs(args);
            const instance = new CliService();
            await instance.handleCommand(options);
        }
        catch (error) {
            console.error('Error:', error instanceof Error ? error.message : String(error));
            process.exit(1);
        }
    }
    async handleCommand(options) {
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
    async handleTranslate(options) {
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
        }
        else {
            await this.agent.translateFile(options.input, output, lang);
        }
    }
    async handleConfig() {
        const configPath = path.join(process.cwd(), 'translatemd.config.json');
        if (!fs.existsSync(configPath)) {
            await fs.promises.writeFile(configPath, JSON.stringify({
                defaultLang: 'en',
                outputDir: './translated'
            }, null, 2));
            console.log('Config file created at', configPath);
        }
        else {
            const config = JSON.parse(await fs.promises.readFile(configPath, 'utf-8'));
            console.log('Current config:', config);
        }
    }
    async handleHelp() {
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
