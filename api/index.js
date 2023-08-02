const express = require('express')
const api = express()
const cors = require("cors");

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const { registrants } = require('./routine.js');

require("./routine.js")

api.use(cors());
api.use(express.json())

api.get("/registrants", (req, res) => {
    res.send({ registrants })
})

module.exports = api