const express = require('express')
const dotenv = require('dotenv')
const http=require('http')
const path=require('path')
//Profile Picture Utility
const multer=require('multer')
// const sharp=require('sharp')
const morgan=require('morgan')
var cookieParser = require('cookie-parser');

//Loading config details
dotenv.config({ path : './config/.env'})
require('./Database/mongoose')
const app=express()
const server=http.createServer(app)
app.set('view engine','ejs')
/* middleware and views engine
 * Setup handlebars engine and viesws locations
*/

// const session = require('session')
//Setup static directory to serve
app.use(express.static(path.join(__dirname,'../public')))
app.use(express.json())
app.use(cookieParser());

//Logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//Routes
app.use('',require('./route'))


const PORT = process.env.PORT || 3000

server.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}`)
})