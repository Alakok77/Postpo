const express = require('express')
const db = require('../db/db')
const dayjs = require('dayjs')

const router = express.Router()

router.get('/', async (req, res) => {

    let allPost = [] 
    try {
        allPost = await db
                .select('post.id', 'title', 'post.from', 'post.created_at')
                .count('comment.post_id as commentsCount')
                .from('post')
                .leftJoin('comment', 'post.id', 'comment.post_id')
                .groupBy('post.id')

        allPost = allPost.map(post => {
            const created_at_text = dayjs(post.created_at).format('D MMM YYYY - HH:mm')
            return {...post, created_at_text}
        })

    } catch (err){
        console.error(err)
    }

    res.render('home', {allPost})
})

module.exports = router