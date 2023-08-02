const { GoogleAuth } = require('google-auth-library');
const { google } = require('googleapis');
const spreadsheetId = '11TISmfKj5JBBXXAxAaRauEUJJMNNJjY-3foI22Yu5QM';
const sheetId = 1545755281 //taken from url after checking gid path param

const credentials = {
    "type": process.env.SA_TYPE,
    "project_id": process.env.SA_PROJECT_ID,
    "private_key_id": process.env.SA_PRIVATE_KEY_ID,
    "private_key": process.env.SA_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.SA_CLIENT_EMAIL,
    "client_id": process.env.SA_CLIENT_ID,
    "auth_uri": process.env.SA_AUTH_URI,
    "token_uri": process.env.SA_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.SA_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.SA_CLIENT_X509_CERT_URL,
    "universe_domain": process.env.SA_UNIVERSE_DOMAIN,
}

console.log(credentials)

// Authorize and initialize the API client
const auth = new google.auth.GoogleAuth({
    credentials: credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const range = "A:ZZ"

const registrants = {}

async function main(){
    try {
        const result = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });
        const numRows = result.data.values ? result.data.values.length : 0;
        console.log(`${numRows} rows retrieved.`);
        const headers = {
            first_name: 0,
            last_name: 1,
            phone_number: 4,
            token: 37
        }
        for (let row of result.data.values.slice(1)) {
            const obj = {}
            for(let k of Object.keys(headers)) {
                obj[k] = row[headers[k]]
            }
            registrants[obj.token] = obj
        }
    } catch (err) {
        // TODO (developer) - Handle exception
        throw err;
    }
}

main()
setInterval(main, 36 * 1e5)

module.exports = { registrants }