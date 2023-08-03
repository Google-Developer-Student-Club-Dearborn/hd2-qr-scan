const { google } = require('googleapis');
const { auth } = require("./sheets_auth")

const spreadsheetId = '11TISmfKj5JBBXXAxAaRauEUJJMNNJjY-3foI22Yu5QM';
const sheetId = 1545755281 //taken from url after checking gid path param
const range = "A:ZZ"
const sheets = google.sheets({ version: 'v4', auth });


module.exports.getRegistrants = async function(){
    const registrants = []
    
    try {
        const result = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });
        const numRows = result.data.values ? result.data.values.length : 0;
        // console.log(`${numRows} rows retrieved.`);
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
            registrants.push(obj)
        }
    } catch (err) {
        // TODO (developer) - Handle exception
        throw err;
    }

    return registrants
}