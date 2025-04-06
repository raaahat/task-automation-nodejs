import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import Anthropic from '@anthropic-ai/sdk';
dotenv.config();

const filePath = path.join(__dirname, 'input.txt');
const basePrompt: string = fs.readFileSync(filePath, 'utf-8');

const anthropic = new Anthropic({
  apiKey: process.env.API_KEY,
});

const prompt =
  'hasscomedical.com, haiqu.ai, gmpcs.com, allglory.gg, clearifiedenergy.com, bericagiochi.com, 5starmobiles.com, desideriusventures.com, hmgroupventures.com, jasmyfoundation.com, vestrian.com, jsrefining.com, chicagopolandventures.com, gdaluma.com, cottoncapitaladvisors.com, xavaavcapital.com, weiavr.com, tegnhuset.no, gcnhub.com, precogn.fr, consilientlabs.io, putifer.nl, candyvc.co, thesupr.co, peindustrial.it, bluskyinnovations.com, zmjcloud.com, starglowmedia.com, emccapital.uk, sebrae-rs.com, baobeimt.com,';

async function askAI(prompt: string): Promise<void> {
  try {
    const msg = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 8000,
      messages: [
        { role: 'assistant', content: basePrompt },
        { role: 'user', content: prompt },
      ],
    });
    //@ts-ignore
    const aiResponse = msg.content?.[0]?.text ?? ''; // Safely access the text

    await fs.promises.appendFile('51-100.md', aiResponse, 'utf-8');
    console.log('File saved!');
    console.log(msg);
  } catch (error) {
    console.error('Error:', error);
  }
}

askAI(prompt);
