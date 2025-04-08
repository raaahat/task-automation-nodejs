import * as fs from 'fs';
import axios from 'axios';

// API configuration
const model = 'mistral:7b'; // Change this to the model you want to use
const url = 'http://127.0.0.1:11434/api/generate'; // Adjust if your Ollama server is on a different host/port

// Function to send the prompt to the Ollama API and get the response
async function generateText(prompt: string): Promise<string> {
  try {
    const response = await axios.post(
      url,
      {
        model,
        prompt,
        stream: false,
        max_tokens: 4000,
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('API response:', response.data); // Log the full response for debugging
    return response.data.response; // Adjust this if the API response structure differs
  } catch (error) {
    console.error('Error generating text:', error);
    throw error;
  }
}

// Main function to read input, generate text, and write output
async function main() {
  try {
    // Read the prompt from input.txt
    const prompt = fs.readFileSync('input.txt', 'utf-8').trim();
    if (!prompt) {
      throw new Error('Input prompt is empty');
    }

    // Generate text using the Ollama API
    const generatedText = await generateText(prompt);
    // console.log(generatedText);
    // Write the response to output.md
    await fs.promises.appendFile('output-ollama.md', generatedText, 'utf-8');
    console.log('Output saved to output.md');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Run the script
main();
