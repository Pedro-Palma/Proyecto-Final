'use strict'

const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const cors = require("cors")

const user_route = require("./src/routes/user.route")


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(cors())

app.use('/api', user_route)


module.exports= app;