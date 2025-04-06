import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
dotenv.config();
const anthropic = new Anthropic({
  apiKey: process.env.API_KEY,
});

// const prompt = 'tell me about yourself.';
const prompt =
  'xiaoxiangmei.com,requantive.com, liveable.squarespace.com, shellbridge.ca, t2ab.vc, material.ventures, gracehallpartners.com, vrai.com.au, ninofood.com, sohotechlab.com, mediafactorymedia.wordpress.com, nordainvest.com, retirementdecisioncoach.com, shusfuss.com, agence-k.fr, eloopz.com, alpinevisionary.com, spaineta.lv, rg-groupe.fr, kapture.vc, archstarcap.com, mondialas.com.tr, faconfection.com, ccgabriel.com, twowaylabs.com, tophat-capital.com, nextclass.ai, incahoot.co.uk, puenteventures.com, spooma.com,mannacappartners.com, shelburneassociates.com, agilerl.com, theboxlog.com, birdievc.com, phoenixbox.co.uk, encosmart.com, avanzit.ma, hopschool.hu, grandferrycapital.com, impactbpo.com sr-financial-systems.com, ezy.fund, tavistock.xyz, merandpharma.com, prathventures.com, xingzheai.com.cn, veritecventures.com, easyonline.za.com, compassbeauty.com, above all websites write 20-30 word about information in english and also create a link of last of description with company name. please complete all 50 sites at once dont ask for continue or need more. if there adult, porn, sex, escort, and  Alcoholic related site remove it from list. Please write in English language.';

async function askChatGPT(prompt: string) {
  try {
    const msg = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    console.log(msg);
  } catch (error) {
    console.error('Error:', error);
  }
}

askChatGPT(prompt);
