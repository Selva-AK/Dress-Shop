const webpush = require('web-push');
const fs = require('fs');
const path = require('path');

const vapidKeys = webpush.generateVAPIDKeys();
const envContent = `
# VAPID Keys for Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}
VAPID_PRIVATE_KEY=${vapidKeys.privateKey}
VAPID_SUBJECT=mailto:admin@dressshop.com
`;

const envPath = path.join(__dirname, '..', '.env.local');

fs.appendFileSync(envPath, envContent);
console.log('Appended VAPID keys to .env.local');
