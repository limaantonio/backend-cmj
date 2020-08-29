const Post = require('../models/Post');
const User = require('../models/User');


module.exports = {
  async index (request, response){
    try{
      const posts =  await Post.find().populate('teacher')
     
      return response.json(posts);
    }catch(err){
      console.log(err)
      return response.status(400).send({error: 'Error loading Posts.'})
    }
  },

    async indexById (request, response){
    try{
      const {id} = request.params;
      const post =  await Post.findById(id).populate('teacher')
     
      return response.json(post);
    }catch(err){
      console.log(err)
      return response.status(400).send({error: 'Error loading Post.'})
    }
  },

  async delete(request, response){
    const {id} = request.params;
    
    const post = await Post.findById(id);

    const idUser = request.userId;
      
    User.findOne({'_id': idUser}, 'type', async function (err, data){
     if(err) return handleError(err);

     const type = data.type;

     if(type !== 'teacher')
       return response.status(400).send({error: 'Only teachers can delete post.'})
     else

      await post.deleteOne();
      return response.status(204).send();

    });

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

      const id = request.userId;
      

       User.findOne({'_id': id}, 'type', async function (err, data){
        if(err) return handleError(err);

        const type = data.type;

        if(type !== 'teacher'){
      
          return response.status(400).send({error: 'Only teachers can create posts.'})
        }else{
          const post = await  Post.create({
            img_url, 
            title,
            body,
            user: request.userId,
            likes
          });
  
          console.log(img_url);

          return response.status(201).json(post);
        }
      });
    }catch(err){
      console.log(err)
      return response.status(400).send({error: 'Error creating new Post'})
    }
  },

  async like (request, response){ 
    try{
      const {id} = request.params;

      const idUser = request.userId;
      
     User.findOne({'_id': idUser}, 'type', async function (err, data){
     if(err) return handleError(err);

      const type = data.type;

      if(type !== 'student')
        return response.status(400).send({error: 'Only student can like a post.'})
      else{
        const post = await Post.findById(id);

        post.likes++;

        await Post.findByIdAndUpdate(id, post);

        return response.json({"likes" : post.likes});
      }
     });

      

    }catch(err){
      console.log(err);
      return response.status(400).send({error: 'Error like this post'})
    }
         
  }
}