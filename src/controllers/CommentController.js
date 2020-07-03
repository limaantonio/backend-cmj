const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Student = require('../models/Student');


module.exports = {
   async create (request, response){ 
    try{
      const {id} = request.params;
      const {text} = request.body;
      
      
      const post = await Post.findOne(id);

      
      const comment = {
        author: request.studentId,
        text: text,
      }

      post.comments.push(comment);

      await post.save();

      return response.status(201).json(comment);

    }catch(err){
      console.log(err);
      return response.status(400).send({error: 'Error creating new Comment'})
    }
         
  },
}