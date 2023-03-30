import express from 'express'
import dotenv from 'dotenv'
import db from './db.js'

import userRoute from './routes/userRoute.js'

dotenv.config()

//creating express app
const app = express()

//middleware
app.use(express.json())


// listen for requests
const port = process.env.PORT || 6000
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})


//initial route
app.get('/', (req, res) => {
    res.send("welcome to api")
})


//routes
app.use('/users', userRoute)