const express = require('express')

const router = express.Router()

allPost = [
    {id: 1, title: "test1", from:"me",  createdAt:"14 April 2022", commentsCount:1},
    {id: 2, title: "test2", from:"me",  createdAt:"14 April 2022", commentsCount:1},
    {id: 3, title: "test3", from:"me",  createdAt:"14 April 2022", commentsCount:1},
]

router.get('/new', (req, res) => {
    res.render('newpost')
})

router.post('/new', (req, res) => {
    
})

router.get('/:id', (req, res) => {
    const {id} = req.params
    const onePost = allPost.find(post => post.id === +id)
    const customTitle = !!onePost ? `${onePost.title} | ` : 'ไม่พบเนื้อหา | '
    res.render('post', {onePost, customTitle})
})

module.exports = router