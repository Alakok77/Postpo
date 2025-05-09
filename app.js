const express = require('express')
const app = express()
const hbs = require("hbs")
const generalRouter = require('./routers/general')
const postRouter = require('./routers/post')

app.use(express.urlencoded({ extended: true}))
app.set("view engine", "hbs")
hbs.registerPartials(__dirname + '/views/partials')
app.use('/static', express.static('static'))

app.use('/', generalRouter)

app.use('/post', postRouter)

app.listen(9753, () => {
    console.log("server on leaw jaa")
})