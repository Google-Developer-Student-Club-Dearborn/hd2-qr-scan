const { google } = require('googleapis');
const { auth } = require("./sheets_auth")

const sheets = google.sheets({ version: 'v4', auth });

const spreadsheetId = "1UbgqaN4a3RpcOo2i7CT56IJ2YjjTy9pjawGTdldZT9w"
const raffleRange = "Raffle!A:ZZ"
const attendeeRange = "Attend!A:ZZ"

// module.exports.getRaffles = async function () {
//   const attendees = []
//   try {
//     const result = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range,
//     });
//     const numRows = result.data.values ? result.data.values.length : 0;
//     console.log(`${numRows} rows retrieved.`);
//     const headers = {
//       first_name: 0,
//       last_name: 1,
//       phone_number: 2,
//       token: 3
//     }
//     if (numRows) {
//       for (let row of result.data.values) {
//         const obj = {}
//         for (let k of Object.keys(headers)) {
//           obj[k] = row[headers[k]]
//         }
//         attendees.push(obj)
//       }
//     }
//   } catch (err) {
//     // TODO (developer) - Handle exception
//     throw err;
//   }

//   return attendees
// }

module.exports.addRaffle = async function (attendee) {
  const values = [
    [
      attendee.first_name,
      attendee.last_name,
      attendee.phone_number,
      attendee.token
    ],
  ];

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: raffleRange,
      valueInputOption: 'RAW',
      resource: {
        values: values,
      },
    });

    console.log(`${response.data.updates.updatedCells} cells updated.`);
  } catch (err) {
    console.error('The API returned an error:', err.message);
  }
}

module.exports.addAttendee = async function (attendee) {
  const values = [
    [
      attendee.first_name,
      attendee.last_name,
      attendee.phone_number,
      attendee.token
    ],
  ];

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: attendeeRange,
      valueInputOption: 'RAW',
      resource: {
        values: values,
      },
    });

    console.log(`${response.data.updates.updatedCells} cells updated.`);
  } catch (err) {
    console.error('The API returned an error:', err.message);
  }
}