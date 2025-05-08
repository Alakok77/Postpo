const express = require('express')
const db = require('../db/db')
const dayjs = require('dayjs')

const router = express.Router()

router.get('/new', (req, res) => {
    res.render('newpost')
})

router.post('/new', async (req, res) => {
    const {title, content, from, accepted} = req.body

    console.log(from)

    try {
        
        if (!title || !content || !from){
            throw new Error('no text')
        } else if (accepted != 'on'){
            throw new Error('no accepted')
        }

        await db.insert({title, content, from}).into('post')
    
    } catch (err) {
        console.error(err)

        let errorMessage = 'error something'

        if (err.message === 'no text'){
            errorMessage = 'กรุณากรอกข้อมูลให้ครบ'
        } else if (err.message === 'no accepted'){
            errorMessage = 'กดติ๊กถูกก่อนจ้า'
        } 

        return res.render('newpost', {errorMessage, values: {title, content, from, accepted}})
    }

    res.redirect('/post/new/done')
})

router.get('/:id', async (req, res) => {
    const {id} = req.params
    
    let onePost = null
    let postComment = []

    try{
        const tempPost = await db
                    .select('*')
                    .from('post')
                    .where('post.id', +id)
        onePost = tempPost[0]
        onePost.created_at_text = dayjs(onePost.created_at).format('D MMM YYYY - HH:mm')

        postComment = await db
                    .select('*')
                    .from('comment')
                    .where('post_id', +id)
                
        postComment = postComment.map(post => {
                    const created_at_text = dayjs(post.created_at).format('D MMM YYYY - HH:mm')
                    return {...post, created_at_text}
                })

    } catch (err){
        console.error(err)
    }


    const customTitle = !!onePost ? `${onePost.title} | ` : 'ไม่พบโพสต์ | '
    res.render('post', {onePost, customTitle, postComment})
})

router.get('/new/done', (req, res) => {
    res.render('hello')
})

module.exports = router