const { readFileSync } = require('fs');
const envContent = readFileSync('.env.local', 'utf-8');
const match = envContent.match(/FIREBASE_SERVICE_ACCOUNT_JSON="(.+?)"\s*$/m);
const sa = JSON.parse(match[1]);
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();
const ids = ['MRM2mzv5OYqBeWAkzVnu','4JFP4q7AniYUncgxUJGo','B8q5P3wyZTLNwoSGEv6D','F8wTjHq92AaGA9yClgdI','iPH7A3dPpfPP2uBKvqWC'];
async function run() {
  for (const id of ids) {
    await db.collection('zhu_memory').doc(id).delete();
    console.log('deleted:', id);
  }
  process.exit(0);
}
run().catch(e => { console.error(e.message); process.exit(1); });
