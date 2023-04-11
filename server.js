import express from 'express'
import dotenv from 'dotenv'
import db from './src/db.js'

import authRoute from './src/routes/authRoute.js'
import userRoute from './src/routes/userRoute.js'
import articleRoute from './src/routes/articleRoute.js'
import tagRoute from './src/routes/tagRoute.js'
import commentRouter from './src/routes/commentRoute.js'
import favouriteRoute from './src/routes/favouriteRoute.js'
import profileRoute from './src/routes/profileRoute.js'

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
app.use('/users', authRoute)
app.use('/user', userRoute)
app.use('/articles', articleRoute)
app.use('/tags', tagRoute)
app.use('/articles', commentRouter)
app.use('/articles', favouriteRoute)
app.use('/profiles', profileRoute)