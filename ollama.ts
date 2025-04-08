import * as fs from 'fs';
import axios from 'axios';

// Ollama API config
const model = 'mistral:7b';
const url = 'http://127.0.0.1:11434/v1/completions';
const forbiddenKeywords = [
  'porn',
  'sex',
  'escort',
  'xxx',
  'adult',
  'alcohol',
  'vodka',
  'whiskey',
];

// Prompt template
const basePrompt = `
You are helping with a content generation automation project.

You are given a list of website domains. For each domain:
- Ignore and skip any domain that contains any of the following keywords (case-insensitive): "porn", "sex", "escort", "xxx", "adult", "alcohol", "vodka", "whiskey"
- For valid domains, write a short, professional description in English (20 to 30 words) assuming what kind of business or service the site might offer
- Keep the tone formal, business-like, and clear

Format the output like this:
1. **DomainName.com** – Description goes here in plain English. [DomainName.com](http://DomainName.com)


Each entry should:
- Have a clean blank line between entries
- Show the domain name in bold
- Use an en dash (–) between the domain and description
- Have a full clickable link with anchor text containing domain name after the description
`;

const BATCH_SIZE = 20;
const INPUT_FILE = 'batch/domains.txt';
const OUTPUT_FILE = 'batch/results.md';

function sanitizeDomains(domains: string[]): string[] {
  return domains.filter(
    (domain) =>
      !forbiddenKeywords.some((keyword) =>
        domain.toLowerCase().includes(keyword)
      )
  );
}

async function generateBatch(
  domains: string[],
  startIndex: number
): Promise<string> {
  const numberedDomains = domains.map((d, i) => `${i + 1}. ${d}`).join('\n');
  const prompt = `${basePrompt}\nStart numbering from ${startIndex}.\n\nDomains:\n${numberedDomains}\n`;

  try {
    const response = await axios.post(
      url,
      {
        model,
        prompt,
        max_tokens: 2048,
        temperature: 0.7,
        stream: false,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    return response.data.choices[0].text.trim();
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Failed batch starting from ${startIndex}:`, err.message);
    } else {
      console.error(`Failed batch starting from ${startIndex}:`, err);
    }
    return '';
  }
}

async function main() {
  const input = fs
    .readFileSync(INPUT_FILE, 'utf-8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const cleanedDomains = sanitizeDomains(input);
  let currentIndex = 1;

  for (let i = 0; i < cleanedDomains.length; i += BATCH_SIZE) {
    const batch = cleanedDomains.slice(i, i + BATCH_SIZE);
    const output = await generateBatch(batch, currentIndex);
    if (output) {
      await fs.promises.appendFile(OUTPUT_FILE, output + '\n\n', 'utf-8');
      console.log(
        `✅ Processed domains ${currentIndex} to ${
          currentIndex + batch.length - 1
        }`
      );
    } else {
      console.log(`❌ Skipped batch starting from ${currentIndex}`);
    }
    currentIndex += batch.length;
  }

  console.log('🎉 All done!');
}

main();
