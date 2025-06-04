import { Ollama } from '@langchain/community/llms/ollama';
import { PromptTemplate } from '@langchain/core/prompts';
import { LLMChain } from 'langchain/chains';

export class LLMService {
  private llm: Ollama;
  private modelName: string;
  
  constructor(modelName = 'llama3') {
    this.modelName = modelName;
    this.llm = new Ollama({ model: this.modelName });
  }

  async translateText(text: string, targetLang: string): Promise<string> {
    const prompt = PromptTemplate.fromTemplate(
      `Translate this to ${targetLang}:\n\n{text}`
    );
    const chain = new LLMChain({ llm: this.llm, prompt });
    const result = await chain.run({ text });
    return result.trim();
  }

  async generateDocumentation(componentCode: string): Promise<string> {
    const prompt = PromptTemplate.fromTemplate(
      `You are a professional technical writer. Create detailed documentation for this React/TypeScript component in Russian.
{componentCode}`
    );
    const chain = new LLMChain({ llm: this.llm, prompt });
    return await chain.run({ componentCode });
  }

  updateModel(modelName: string): void {
    this.modelName = modelName;
    this.llm = new Ollama({ model: this.modelName });
  }

  getCurrentModel(): string {
    return this.modelName;
  }
}