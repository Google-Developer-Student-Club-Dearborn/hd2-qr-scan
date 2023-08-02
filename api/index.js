if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const cors = require("cors");
const api = express()

const { registrants } = require('./routine.js');

api.use(cors());
api.use(express.json())

api.get("/registrant", (req, res) => {
    console.log(req.query.phone_number)

    let result = null
    for(let reg of registrants) {
        if (reg.phone_number && reg.phone_number === req.query.phone_number) {
            result = reg
        }
    }

    if(result) {    
        res.send(result)
    } else {
        res.status(404).send()
    }
})

module.exports = api