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
  'bromeepartners.se, shis.com.sa, gdalternativeliving.net, darthkitchens.com, sipoonkiinteistohuolto.fi, implement.io, khlcap.com, janakbalan.com, loyaltycaravan.com, fixer-app.co, secureyou24.com, professionalsitesllc.com, brickstreetfund.com, sigmaengineparts.com, outpostventures.vc, swishapp.me, ivy-x.com, sxjg-sps.com, hssystem.cn, monarchbio.com, treat.io, idhdentalacquisitions.co.uk, sienzausa.com, rentflyscooters.com, spinach-vanilla-w88g.squarespace.com, kometgames.com, swhais.com, totalsanitation.com, interlakentx.com, meloaudio.com.cn, machine.healthcare, blackstar.capital, flightlevellakeland.com, discoverylabservices.com, extremedivers.net, nationalcreditacceptance.net, dwaynehayes.com, mmvinvestments.com, optiquexr.com, networkventures.com, 3bodygame.com, averybio.com, devcapfund.com, evergreenvc.co, kivid.com.br, asicflag.com, earshotmp.com, sgbiojv.com.br, homepreviewchannel.com, poplarsnursery.co.uk';

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

    await fs.promises.writeFile('51-100.md', aiResponse, 'utf-8');
    console.log('File saved!');
    console.log(msg);
  } catch (error) {
    console.error('Error:', error);
  }
}

askAI(prompt);
