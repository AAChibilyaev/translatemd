import { Ollama } from '@langchain/community/llms/ollama';
import { PromptTemplate } from '@langchain/core/prompts';
import { LLMChain } from 'langchain/chains';
export class LLMService {
    llm;
    modelName;
    constructor(modelName = 'llama3') {
        this.modelName = modelName;
        this.llm = new Ollama({ model: this.modelName });
    }
    async translateText(text, targetLang) {
        const prompt = PromptTemplate.fromTemplate(`Translate this to ${targetLang}:\n\n{text}`);
        const chain = new LLMChain({ llm: this.llm, prompt });
        const result = await chain.run({ text });
        return result.trim();
    }
    async generateDocumentation(componentCode) {
        const prompt = PromptTemplate.fromTemplate(`You are a professional technical writer. Create detailed documentation for this React/TypeScript component in Russian.
{componentCode}`);
        const chain = new LLMChain({ llm: this.llm, prompt });
        return await chain.run({ componentCode });
    }
    updateModel(modelName) {
        this.modelName = modelName;
        this.llm = new Ollama({ model: this.modelName });
    }
    getCurrentModel() {
        return this.modelName;
    }
}
