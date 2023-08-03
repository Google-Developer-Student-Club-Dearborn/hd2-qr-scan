const { google } = require('googleapis');

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

// Authorize and initialize the API client
module.exports.auth = new google.auth.GoogleAuth({
    credentials: credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});