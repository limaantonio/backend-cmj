const Post = require('../models/Post');
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

      await post.find().populate('Student');

      return response.status(201).json(post);

    }catch(err){
      console.log(err);
      return response.status(400).send({error: 'Error creating new Comment'})
    }
         
  },
}