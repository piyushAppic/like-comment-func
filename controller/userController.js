const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = require("../model/user")
const postModel = require("../model/posts")
const commentModel = require("../model/comments")

const mongoose = require("mongoose")


const register = async(req, res) => {
    try{
        let {name, email, password} = req.body
        if (!name || !email || !password){
            return res.json({message:"please provide name,email or password"})
        }

        const isUserExist = await userModel.findOne({email})
        if(isUserExist){
            return res.json({message:"user already registered please login !!"})
        }else{
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    // Handle error
                    return res.json({message:err.message})
                }

                bcrypt.hash(password, salt, async(err, hash) => {
                    if (err) {
                    // Handle error
                    return res.json({message:err.message})
                    }

                    // Store the hash in the database or use it as needed
                    console.log('Hashed password:', hash);
                    let newUser = new userModel({name, email, password:hash})
                    await newUser.save()
                    return res.json({message:"user registered successfully"})
                });
                });
            
        }
    }catch(err){
        return res.json({message:err.message})
    }   
}


const login = async (req, res) => {
    try {
      let { email, password } = req.body;
      if (!email || !password) {
        return res.json({ message: "Please provide email and password" });
      }
  
      const isUserExist = await userModel.findOne({ email });
      if (!isUserExist) {
        return res.json({ message: "User is not registered, please sign up first!" });
      }
  
      const isMatch = await bcrypt.compare(password, isUserExist.password);
      console.log(password, isUserExist.password, "userpass, hashedDbpass, passwords");
  
      if (isMatch) {
        // If password matched, create JSON token
        const payload = { email, id: isUserExist._id };
        const secretKey = process.env.json_secret_key;
        const token = jwt.sign(payload, secretKey);
        return res.json({ message: "User logged in successfully", token });
      } else {
        return res.json({ message: "Entered password is not correct!" });
      }
    } catch (err) {
      return res.json({ message: err.message });
    }
};

const addPost = async(req, res) => {
    try{
        // console.log(req.user, "setup in auth middleware")
        const {id} = req.user
        const {content} = req.body
        if (!content) {
            return res.json({message: "please provide post task content !!"})
        }
        let newPost = new postModel({content, user_id: id})
        await newPost.save()
        return res.json({message: "added post", newPost})

    }catch(err){
        return res.json({message: err.message})
    }
}

const getAllPost = async(req, res) => {
    try{
        // console.log(req.user, "setup in auth middleware")
        const {id} = req.user
        let AllPost = await postModel.find({user_id: id}).sort({"createdAt":1})
        return res.json({message: "all Posts", AllPost})

    }catch(err){
        return res.json({message: err.message})
    }
}

const editPost = async(req, res) => {
    try{
        const { content } = req.body
        const id = req.params.id
        const payload = {$set: {"content": content}}
        let editPost = await postModel.findOneAndUpdate({_id: id}, payload)
        return res.json({message: "update post successfully !!", editPost})

    }catch(err){
        return res.json({message: err.message})
    }
}

const deletePost = async(req, res) => {
    try{
        const id = req.params.id
        let deletePost = await postModel.findOneAndDelete({_id: id})
        return res.json({message: "delete post successfully !!", deletePost})

    }catch(err){
        return res.json({message: err.message})
    }
}

const likePost = async(req, res) => {
    try{
        const {id} = req.user
        const postId = req.params.postId
        let findPost = await postModel.findOne({_id: postId})
        console.log(findPost, "find post data ")
        let unlikePost = false
        var likeUser = findPost.likes.filter((sender)=> {
            if(sender.sender_id != id){
                return sender
            }else{
                unlikePost = true
            }
        })
        
        // console.log(likeUser, "likeUser array")
        if(unlikePost){
            // update the likes and likes Count
            let newCount = findPost.likesCount;
            newCount -= 1
            let payload = {$set: {likes: likeUser, likesCount: newCount}}
            // update post
            let postData = await postModel.findOneAndUpdate({_id: postId}, payload)
            return res.json({message: "post unliked successfully", postData})
        }else{
            let newCount = findPost.likesCount;
            newCount += 1
            let newObj = {sender_id: new mongoose.Types.ObjectId(id), ref:"user"}
            let postData = await postModel.findOneAndUpdate({_id: postId}, { $push: { likes: newObj } , $set: {likesCount: newCount} })
            

            // another method
            // likeUser.push({sender_id: new mongoose.Types.ObjectId(id), ref:"user"})
            // let payload = {$set: {likes: likeUser, likesCount: newCount}}      


            // update post
            // let postData = await postModel.findOneAndUpdate({_id: postId}, payload)
            return res.json({message: "post liked successfully", postData})
        }
    }catch(err){
        return res.json({message: err.message})
    }
}

const commentPost = async(req, res) =>{
    try{
        const {id} = req.user
        const {content} = req.body
        const postId = req.params.postId
        const postComment = new commentModel({content})
        await postComment.save()

        const comment_id = postComment._id
        const sender_id = id
        const post_id = postId
        
        let newObj = {post_id: new mongoose.Types.ObjectId(post_id), sender_id: new mongoose.Types.ObjectId(sender_id),comment_id: new mongoose.Types.ObjectId(comment_id)}
        await postModel.findOneAndUpdate({_id: postId}, { $push: { comments:  newObj} })
        return res.json({message: "comment post successfully!!", postComment})

    }catch(err){
        return res.json({message: err.message})
    }
}

const replyOnComment = async(req, res) => {
    try{
        const {content} = req.body
        const commentid = req.params.commentid
        // console.log(content,"content")
        // console.log(commentid,"commentid")


        // create reply 
        let postReply = new commentModel({content})
        await postReply.save()
        let findComment = await commentModel.findOne({_id:commentid})
        findComment.replies.push(postReply._id)
        await findComment.save()
        return res.json({message: "reply post successfully!!", postReply})

    }catch(err){
        return res.json({message: err.message})
    }
}

  

module.exports = { register, login, addPost, getAllPost, editPost, deletePost,likePost, commentPost, replyOnComment }