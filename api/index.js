const express = require('express')
const api = express()
const cors = require("cors");
api.use(cors());
api.use(express.json())

api.get("/", (req, res) => {
    res.send({msg: "this is the json api"})
})

module.exports = api