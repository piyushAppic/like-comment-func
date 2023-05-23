const express = require('express')
const app= express()

// for env variables
require('dotenv').config()
// db conection
require("./db")

// Middleware to parse JSON-encoded bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000

const userRouter = require("./router/userRouter")

app.use("/api/v1/user", userRouter)

app.use("*", (req, res) => {
    res.send("404 page not found !!")
})


app.listen(port, () => {
    console.log(`server created successfully on port ${port}`)
})