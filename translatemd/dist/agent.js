import { LLMService } from './core/llm/llmService.js';
import { FileProcessor } from './core/processing/fileProcessor.js';
import { TranslationError } from './core/errors/translationError.js';
export class TranslationAgent {
    llmService;
    fileProcessor;
    constructor() {
        this.llmService = new LLMService();
        this.fileProcessor = new FileProcessor();
    }
    async translateFile(inputPath, outputPath, targetLang) {
        try {
            const content = await this.fileProcessor.readFile(inputPath);
            const translated = await this.llmService.translateText(content, targetLang);
            await this.fileProcessor.writeFile(outputPath, translated);
        }
        catch (error) {
            if (error instanceof TranslationError) {
                throw error;
            }
            if (error instanceof Error) {
                throw new TranslationError(`Translation failed: ${error.message}`);
            }
            else {
                throw new TranslationError(`Translation failed: ${String(error)}`);
            }
        }
    }
    async batchTranslate(files, targetLang) {
        await Promise.all(files.map(file => this.translateFile(file.input, file.output, targetLang)));
    }
}
