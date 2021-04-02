const shortid = require('shortid')
var express = require('express');
var app = express();
const morgan = require('morgan');
const Utils = require('./utils');
const PORT = process.env.PORT || 3000
app.use(morgan('dev'))

const ohmRoute = require('./routes/ohms');

app.use(express.json())

// routes
app.use('/ohms', ohmsRoute);

app.get("*", (req,res)=>{
    res.status(404).send("Something went wrong, please go back")
})


app.listen(PORT, () => console.log(`listening on port ${PORT}`));