import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
const documentId = '1OdAijhUJUrpklsgR-SbLAT9-xhbxxxLAxPWoOj3rYIQ'; // Replace with your real doc ID
const filePath = path.join(__dirname, 'output.md');
const text = fs.readFileSync(filePath, 'utf-8');

interface ProcessedItem {
  plainText: string;
  boldText: string;
  linkText: string;
  linkUrl: string;
  boldStart: number;
  boldEnd: number;
  linkStart: number;
  linkEnd: number;
}
// Process each list item
const processItems = (markdown: string): ProcessedItem[] => {
  return markdown
    .split('\n')
    .filter((item) => item.trim())
    .map((item) => {
      const content = item.replace(/^\d+\.\s*/, '');

      // Extract bold text (first occurrence)
      const boldMatch = content.match(/\*\*(.*?)\*\*/);
      const boldText = boldMatch?.[1] || '';

      // Extract link (last occurrence to handle multiple links)
      const linkMatches = [...content.matchAll(/\[(.*?)\]\((.*?)\)/g)];
      const lastLink = linkMatches[linkMatches.length - 1];
      const linkText = lastLink?.[1] || '';
      const linkUrl = lastLink?.[2] || '';

      // Build plaintext with proper replacements
      let plainText = content
        .replace(/\*\*(.*?)\*\*/, '$1')
        .replace(/\[(.*?)\]\(.*?\)/g, (match, p1) => p1);

      // Calculate positions
      const boldStart = plainText.indexOf(boldText);
      const boldEnd = boldStart + boldText.length;

      // Find last occurrence of link text
      const linkStart = plainText.lastIndexOf(linkText);
      const linkEnd = linkStart + linkText.length;

      return {
        plainText,
        boldText,
        linkText,
        linkUrl,
        boldStart,
        boldEnd,
        linkStart,
        linkEnd,
      };
    });
};
const processedItems = processItems(text);

// Build requests with corrected positions
const requests: any[] = [];
let cumulativePosition = 1;

processedItems.forEach((item) => {
  // Insert each paragraph separately for accurate indexing
  requests.push({
    insertText: {
      location: { index: cumulativePosition },
      text: item.plainText + '\n',
    },
  });

  // Apply bold styling
  requests.push({
    updateTextStyle: {
      range: {
        startIndex: cumulativePosition + item.boldStart,
        endIndex: cumulativePosition + item.boldEnd,
      },
      textStyle: { bold: true },
      fields: 'bold',
    },
  });

  // Apply hyperlink if URL exists
  if (item.linkUrl && item.linkStart !== -1) {
    requests.push({
      updateTextStyle: {
        range: {
          startIndex: cumulativePosition + item.linkStart,
          endIndex: cumulativePosition + item.linkEnd,
        },
        textStyle: { link: { url: item.linkUrl } },
        fields: 'link',
      },
    });
  }

  cumulativePosition += item.plainText.length + 1; // +1 for newline
});

// Add list formatting after all text is inserted
requests.push({
  createParagraphBullets: {
    range: {
      startIndex: 1,
      endIndex: cumulativePosition - 1, // Exclude final newline
    },
    bulletPreset: 'NUMBERED_DECIMAL_NESTED',
  },
});
async function writeTextToDoc() {
  const auth = new google.auth.GoogleAuth({
    keyFile: './creds.json', // Replace with the path to your service account JSON
    scopes: ['https://www.googleapis.com/auth/documents'],
  });

  const docs = google.docs({ version: 'v1', auth });
  try {
    await docs.documents.batchUpdate({
      documentId,
      requestBody: {
        requests,
      },
    });

    const docUrl = `https://docs.google.com/document/d/${documentId}/edit`;
    console.log('✅ Text inserted successfully!');
    console.log('📄 Open your document here:', docUrl);
  } catch (error) {
    console.error('❌ Failed to insert text:', error);
  }
}

writeTextToDoc();
