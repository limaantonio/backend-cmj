const Post = require('../models/Post');
const User = require('../models/User');


module.exports = {
   async create (request, response){ 
    try{
      const {id} = request.params;
      const {text} = request.body;
      
      const post = await Post.findById(id);
   
      const user = await User.findById(request.userId);
  
      const comment = {
        author: request.userId,
        text: text,
        nameAuthor: user.name
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