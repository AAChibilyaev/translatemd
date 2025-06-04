export class TranslationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TranslationError';
    }
    toString() {
        return `${this.name}: ${this.message}`;
    }
}
