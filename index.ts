import { google } from 'googleapis';

const documentId = '1OdAijhUJUrpklsgR-SbLAT9-xhbxxxLAxPWoOj3rYIQ'; // Replace with your real doc ID
const text = 'Welcome to Google Docs';

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
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text,
            },
          },
        ],
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
