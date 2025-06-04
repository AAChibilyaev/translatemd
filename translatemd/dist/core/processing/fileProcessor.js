import fs from 'node:fs';
import path from 'node:path';
import { TranslationError } from '../errors/translationError.js';
export class FileProcessor {
    async readFile(filePath) {
        try {
            return await fs.promises.readFile(filePath, 'utf-8');
        }
        catch (error) {
            if (error instanceof Error) {
                throw new TranslationError(`File read error: ${error.message}`);
            }
            else {
                throw new TranslationError(`File read error: ${String(error)}`);
            }
        }
    }
    async writeFile(filePath, content) {
        try {
            await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
            return await fs.promises.writeFile(filePath, content);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new TranslationError(`File write error: ${error.message}`);
            }
            else {
                throw new TranslationError(`File write error: ${String(error)}`);
            }
        }
    }
}
