const Post = require('../models/Post');
const Comment = require('../models/Comment');


module.exports = {

  async create (request, response){ 
    try{
      const {id} = request.params;
      const {comment} = request.body;
      
      const post = await Post.findOne(id);

      const postComment = new Comment({...comment, post: post._id});

      await postComment.save();
      
      
      post.comments.push(postComment);
        

      await post.save();
      

      return response.status(201);

    }catch(err){
      return response.status(400).send({error: 'Error creating new Post'})
    }
         
  },
}