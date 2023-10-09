const { google } = require('googleapis');
const { auth } = require("./sheets_auth")

const spreadsheetId = '11TISmfKj5JBBXXAxAaRauEUJJMNNJjY-3foI22Yu5QM';
const sheetId = 1545755281 //taken from url after checking gid path param
const range = "A:ZZ"
const sheets = google.sheets({ version: 'v4', auth });
const fs = require('fs');

let storedResult = null;
let lastResultTime = new Date()
// days 24*60*60*1000
let storedTTL = 5 * 60 * 1000;

module.exports.getRegistrants = async function () {
    const registrants = []

    try {
        let result = storedResult;
        if (!result || new Date() - lastResultTime > storedTTL) {
            console.log("fetching again")
            result = await sheets.spreadsheets.get({
                spreadsheetId,
                "includeGridData": true,
                "ranges": [range],
            });
            storedResult = result;
        }

        const headers = {
            first_name: 0,
            last_name: 1,
            phone_number: 4,
            email: 5,
            token: 37
        }

        console.log(new Blob([JSON.stringify(result)]).size)
        let rowIndex = 1
        for (const rowData of result?.data?.sheets?.[0]?.data?.[0]?.rowData || []) {
            const rowValues = []
            const obj = {}
            // console.log(rowData)
            if(!rowData?.values){
                console.log(rowIndex)
                console.log(rowData)
                continue
            }

            for (const value of rowData?.values) {
                rowValues.push(value?.userEnteredValue?.stringValue)
            }

            for (let k of Object.keys(headers)) {
                obj[k] = rowValues[headers[k]]
            }

            // check if attended using this magic of a check
            // let attended = true
            // for (const value of rowData?.values) {
            //     const r = (value?.userEnteredFormat?.backgroundColor?.red - 0.8509804) < 0.1
            //     const g = (value?.userEnteredFormat?.backgroundColor?.green - 0.91764706) < 0.1
            //     const b = (value?.userEnteredFormat?.backgroundColor?.blue - 0.827451) < 0.1
            //     if (!(r & g & b)) {
            //         attended = false
            //         break
            //     }
            // }

            obj.rowIndex = rowIndex++
            // obj.attended = attended
            registrants.push(obj)
        }


        // const numRows = result.data.values ? result.data.values.length : 0;
    } catch (err) {
        // TODO (developer) - Handle exception
        console.error(err)
        throw err;
    }

    console.log("Number of registrants: ",registrants.length)
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