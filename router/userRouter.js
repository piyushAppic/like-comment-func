const express = require('express')

const router = express.Router()

const {register, login,  addPost, getAllPost, editPost, deletePost, likePost, commentPost, replyOnComment } = require("../controller/userController")
const {auth} = require("../middlewares/auth")

router.post("/signup", register)
router.post("/login", login)
// router.post("/logout", logout)


// todo list router
router.post("/addPost", auth, addPost)
router.post("/getAllPost", getAllPost)
router.put("/editPost/:id", auth, editPost)
router.delete("/deletePost/:id", auth, deletePost)

// feat like, comment
router.post("/likePost/:postId", auth, likePost)
router.post("/commentPost/:postId", auth, commentPost)
router.post("/replyoncomment/:commentid", auth, replyOnComment)

// router.post("/share/:id", auth, deletePost)


module.exports = router