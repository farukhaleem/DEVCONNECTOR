const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');

const router = express.Router();

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  '/',
  [ 
    auth,
    check('text', 'Text is required').not().isEmpty() 
  ], 
  async (req, res) => {

    const error = validationResult(req);

    if(!error.isEmpty()){
      return res.status(400).json({ error: error.array() })
    }

    try {
      
      const user = await User.findById(req.user.id).select('-password');
      
      const newPost = {
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar
      }

      const post = new Post(newPost);
      await post.save();

      res.json(post);
      
    } catch (err) {
      return res.status(500).status('Server Error')  
    }
      
});


// @route   GET api/posts
// @desc    Get all post
// @access  Private
router.get('/', auth, async (req, res) => {

  try {
    
    const post = await Post.find().sort({ date: -1 });
    res.json(post);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');  
  }

})


// @route   GET api/posts/id
// @desc    Get post by id
// @access  Private
router.get('/:id', auth, async (req, res) => {

  try {
    
    const post = await Post.findById(req.params.id);
    
    if(!post){
      return res.status(404).json({msg: 'Post not Found'})
    }
    
    res.json(post);

  } catch (err) {
    console.error(err);
    
    if(err.kind === 'ObjectId'){
      return res.status(404).json({msg: 'Post not Found'})
    }

    res.status(500).send('Server Error');  
  }
})


// @route   DELETE api/posts/id
// @desc    Delete post by id
// @access  Private
router.delete('/:id', auth, async (req, res) => {

  try {
    
    const post = await Post.findById(req.params.id);

    // Check if post exist
    if(!post){
      return res.status(404).json({msg: 'Post not found'})
    }
    // Check user
    if(post.user.toString() !== req.user.id){
      return res.status(400).json({msg: 'User not authorized.'})
    }

    await post.remove();
    res.json({msg: 'Post removed.'})

  } catch (err) {
    console.error(err);
    
    if(err.kind === 'ObjectId'){
      return res.status(404).json({msg: 'Post not Found'})
    }

    res.status(500).send('Server Error');
  }

})


// @route   PUT api/posts/like/id
// @desc    Like a post
// @access  Private
router.put(
  '/like/:id',
  auth,
  async ( req, res ) => {

    try {
      const post = await Post.findById(req.params.id);

      if(!post){
        return res.status(404).json({msg: 'Post not found'})
      }

      // Check if post is already liked by user
      let liked = post.likes.filter( like => like.user.toString() === req.user.id ).length;
      if(liked > 0){
        return res.status(400).json({ msg: 'Post is already liked.' })
      }

      post.likes.unshift({ user: req.user.id });
      await post.save(); 
      
      res.json(post.likes);

    } catch (err) {
      console.error(err.message)

      if(err.kind === 'ObjectId'){
        return res.status(404).json({msg: 'Post not found'})
      }

      res.status(500).send('Server Error');
    }

  }
)

// @route   PUT api/posts/unlike/id
// @desc    Unlike a post
// @access  Private
router.put(
  '/unlike/:id',
  auth,
  async ( req, res ) => {

    try {
      const post = await Post.findById(req.params.id);

      if(!post){
        return res.status(404).json({msg: 'Post not found'})
      }

      // Check if post has not been liked by user
      let liked = post.likes.filter( like => like.user.toString() === req.user.id ).length;
      if(liked === 0){
        return res.status(400).json({ msg: 'Post has not been yet liked.' })
      }

      post.likes = post.likes.filter( like => like.user.toString() !== req.user.id );
      
      await post.save(); 
      res.json(post.likes);

    } catch (err) {
      console.error(err.message)

      if(err.kind === 'ObjectId'){
        return res.status(404).json({msg: 'Post not found'})
      }

      res.status(500).send('Server Error');
    }

  }
)

// @route   POST api/posts/comment/postId
// @desc    Comment on a post
// @access  Private
router.put(
  '/comment/:id',
  [ 
    auth,
    check('text', 'Text is required').not().isEmpty() 
  ], 
  async (req, res) => {

    const error = validationResult(req);

    if(!error.isEmpty()){
      return res.status(400).json({ error: error.array() })
    }

    try {
      
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);
      
      if(!post){
        return res.status(404).json({msg: 'Post not found'})
      }
      
      const newComment = {
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar
      }

      post.comments.unshift(newComment);
      await post.save();

      res.json(post.comments);
      
    } catch (err) {
      console.log(err.message);
      if(err.kind === 'ObjectId'){
        return res.status(404).json({ msg: 'Page not found.' });
      }
      return res.status(500).status('Server Error')
    }
      
});

// @route   DELETE api/posts/comment/postId/comment_id
// @desc    Delete a comment on a post
// @access  Private
router.delete('/comment/:postId/:comment_id', auth, async (req, res) => {

  try {

    // check the post exist
    const post = await Post.findById(req.params.postId);

    // check the comment exist
    targetedComment = post.comments.find( comment => comment.id.toString() === req.params.comment_id);
    if(!targetedComment){
      return res.status(404).json({ msg: 'Comment not found.' });
    }

    // check the user own the comment 
    if(targetedComment.user.toString() !== req.user.id){
      return res.status(401).json({ msg: 'user not authorized.' })
    }

    // remove the targeted comment
    post.comments = post.comments.filter( comment => comment.id.toString() !== req.params.comment_id);
    
    await post.save();
    return res.json(post.comments);
    
  } catch (err) {
    console.log(err.message);
    if(err.kind === 'ObjectId'){
      return res.status(404).json({ msg: 'Post not found.' });
    }

    res.status(500).send('server error');

  }


})


module.exports = router;