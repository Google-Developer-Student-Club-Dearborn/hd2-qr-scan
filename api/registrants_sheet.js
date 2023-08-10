const { google } = require('googleapis');
const { auth } = require("./sheets_auth")

const spreadsheetId = '11TISmfKj5JBBXXAxAaRauEUJJMNNJjY-3foI22Yu5QM';
const sheetId = 1545755281 //taken from url after checking gid path param
const range = "A:ZZ"
const sheets = google.sheets({ version: 'v4', auth });
const fs = require('fs');


console.log(Object.keys(sheets.spreadsheets))

module.exports.getRegistrants = async function () {
    const registrants = []

    try {
        const result = await sheets.spreadsheets.get({
            spreadsheetId,
            "includeGridData": true,
            "ranges": [range],
        });

        const headers = {
            first_name: 0,
            last_name: 1,
            phone_number: 4,
            token: 37
        }

        let rowIndex = 2
        for (const rowData of result?.data?.sheets?.[0]?.data?.[0]?.rowData?.slice(1) || []) {
            const rowValues = []
            const obj = {}
            for (const value of rowData?.values) {
                rowValues.push(value?.userEnteredValue?.stringValue)
            }
            for (let k of Object.keys(headers)) {
                obj[k] = rowValues[headers[k]]
            }

            // check if attended using this magic of a check
            let attended = true
            for (const value of rowData?.values) {
                const r = (value?.userEnteredFormat?.backgroundColor?.red - 0.8509804) < 0.1
                const g = (value?.userEnteredFormat?.backgroundColor?.green - 0.91764706) < 0.1
                const b = (value?.userEnteredFormat?.backgroundColor?.blue - 0.827451) < 0.1
                if (!(r & g & b)) {
                    attended = false
                    break
                }
            }

            obj.rowIndex = rowIndex++
            obj.attended = attended
            registrants.push(obj)
        }


        const numRows = result.data.values ? result.data.values.length : 0;

    } catch (err) {
        // TODO (developer) - Handle exception
        console.error(err)
        throw err;
    }

    return registrants
}

module.exports.setRowBackgroundColor = async (rowIndex) => {
    try {
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            resource: {
                requests: [
                    {
                        repeatCell: {
                            fields: 'userEnteredFormat.backgroundColor',
                            range: {
                                sheetId: 1545755281,
                                startRowIndex: rowIndex,
                                endRowIndex: rowIndex + 1,
                                startColumnIndex: 0, // start at first column
                                //   endColumnIndex: 4
                            },
                            cell: {
                                userEnteredFormat: {
                                    backgroundColor: { red: 0.8509804, green: 0.91764706, blue: 0.827451 }
                                }

                            }

                        }
                    }
                ]
            }
        });

        console.log(`Background color of row ${rowIndex} set successfully.`);
    } catch (err) {
        console.error('Error setting background color:', err);
    }
}