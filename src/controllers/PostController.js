const Post = require('../models/Post');
const Teacher = require('../models/Teacher');


module.exports = {
  async index (request, response){
    try{
      const posts =  await Post.find().populate(['teacher', 'comments']);
     
      return response.send(posts);
    }catch(err){
      return response.status(400).send({error: 'Error loading Posts.'})
    }
  },

  async delete(request, response){
    const {id} = request.params;
    
    const post = await Post.findById(id);

    await post.deleteOne();

    return response.status(204).send();
  },

  async updateById (request, response){
    const {id} = request.params;
    const {title, body, img_url} = request.body;

    try{
      const post  = await Post.findByIdAndUpdate(id, {
        title: title,
        body: body,
        img_url: img_url,
      });

      return response.status(204).send();
    }catch(e){
      return response.status(400).json({error: 'No Post found with this ID'});
    }
  },

  async create (request, response){ 
    try{
      const {location: img_url = ''} = request.file;
      const {title, body, likes} = request.body;

      const post = await Post.create({
          img_url, 
          title,
          body,
          teacher: request.teacherId,
          likes
        });

      return response.status(201).json(post);

    }catch(err){
      return response.status(400).send({error: 'Error creating new Post'})
    }
  },

  async like (request, response){ 
    try{
      const {id} = request.params;

      const post = await Post.findOne(id);

      post.likes++;

      await Post.findOneAndUpdate(id, post);

      return response.json({"likes" : post.likes})

    }catch(err){
      console.log(err);
      return response.status(400).send({error: 'Error like this post'})
    }
         
  }
}