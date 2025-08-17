const express = require('express')
const cors=require('cors')
const songroutes=require('./routes/song.routes')
const app = express()
app.use(cors())
app.use(express.json())
app.use('/',songroutes)
module.exports = app;
