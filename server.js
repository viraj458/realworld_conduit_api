import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

//creating express app
const app = express()


const port = process.env.PORT || 6000
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})


app.get('/', (req, res) => {
    res.send("welcome to api")
})