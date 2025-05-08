const express = require('express')

const router = express.Router()

allPost = [
    {id: 1, title: "test1", from:"me",  createdAt:"14 April 2022", commentsCount:1},
    {id: 2, title: "test2", from:"me",  createdAt:"14 April 2022", commentsCount:1},
    {id: 3, title: "test3", from:"me",  createdAt:"14 April 2022", commentsCount:1},
]

router.get('/', (req, res) => {
    res.render('home', {allPost})
})

module.exports = router