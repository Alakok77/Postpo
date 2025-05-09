const express = require('express')
const db = require('../db/db')
const dayjs = require('dayjs')

const router = express.Router()

async function getPostAndComments(id) {
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
    return {onePost, postComment, customTitle}
}

router.get('/new', (req, res) => {
    res.render('newpost')
})

router.post('/new', async (req, res) => {
    const {title, content, from, accepted} = req.body

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
    
    const postData = await getPostAndComments(id)
    
    res.render('post', postData)
})

router.get('/new/done', (req, res) => {
    res.render('postDone')
})

router.post('/:id/comment', async (req, res) => {
    const {id} = req.params
    const {content, from, accepted} = req.body

    try {
        
        if (!content || !from){
            throw new Error('no text')
        } else if (accepted != 'on'){
            throw new Error('no accepted')
        }

        await db.insert({content, from, post_id: +id}).into('comment')
    
    } catch (err) {
        console.error(err)

        let errorMessage = 'error something'

        if (err.message === 'no text'){
            errorMessage = 'กรุณากรอกข้อมูลให้ครบ'
        } else if (err.message === 'no accepted'){
            errorMessage = 'กดติ๊กถูกก่อนจ้า'
        } 

        const postData = await getPostAndComments(id)
        return res.render('post', {...postData ,errorMessage, values: {content, from}})
    }

    res.redirect(`/post/${id}`)
})

module.exports = router