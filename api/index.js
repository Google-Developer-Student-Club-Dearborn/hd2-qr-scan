if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const cors = require("cors");
const api = express()

const { getRegistrants, setRowBackgroundColor } = require('./registrants_sheet.js');
const { getAttendance, registerAttendance } = require('./attendance_sheet.js');
const { addRaffle } = require('./raffle_sheet.js');

api.use(cors());
api.use(express.json())

function findPhoneNumber(people, phone_number) {
    if(!phone_number) return undefined
    
    l = phone_number.length
    return people.find(r => r.phone_number && r.phone_number.slice(l-10, l) === phone_number.slice(l-10, l))
}

api.get("/registrant", async (req, res) => {
    let result = undefined
    try {
        const registrants = await getRegistrants()
        result = findPhoneNumber(registrants, req.query.phone_number)
    } catch {
        res.status(500).end()
        return
    }

    if(result) {    
        res.send(result)
    } else {
        res.status(404).send()
    }
})

// api.post("/attend", async (req, res) => {
//     try {
//         const registrants = await getRegistrants()
//         let registrant = findPhoneNumber(registrants, req.query.phone_number)
//         if (!registrant) {
//             res.status(400).end()
//             return
//         }
    
//         // const attendees = await getAttendance()
//         // const attendee = attendees.find(r => r.phone_number && r.phone_number === req.query.phone_number)

//         setRowBackgroundColor(registrant.rowIndex - 1)
//     } catch {
//         res.status(500).end()
//         return
//     }

//     res.status(200).end()
//     return
// })

api.post("/raffle", async (req, res) => {
    try {
        const attendees = await getAttendance()
        let attendee = findPhoneNumber(attendees, req.query.phone_number)
        if (!attendee) {
            res.status(400).end()
            return
        }
    
        await addRaffle(attendee)
    } catch {
        res.status(500).end()
        return
    }


    res.status(200).end()
    return
})

// api.get("/agenda", (req, res) => {

// })

module.exports = api