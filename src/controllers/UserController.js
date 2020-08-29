const User = require('../models/User');


module.exports = {
  async index (request, response){
    try{
      const users = await User.find();
      
      return response.send({Users})
    }catch(err){
      return response.status(400).send({error: 'Error loading Users.'})
    }
  },

  async deleteById (request, response){
    try{
      const user = await User.findOneAndRemove(request.params.UserId);
      
      return response.send();
    }catch(err){
      return response.status(400).send({error: 'Error deleting User.'})
    }
  },

  async updateById (request, response){
    const {id} = request.params;
    const {name, fone, board, model} = request.body;

    try{
      const user  = await User.findByIdAndUpdate(id, {
        name: name,
        fone: fone,
        board: board,
        model: model,
       
  
      });

      return response.status(204).send();
    }catch(e){
      return response.status(400).json({error: 'No User found with this ID'});
    }
  },

  async createAdm(request, response){
    try{
      const user = await User.create(request.body);
        
      console.log(user);
      return response.status(201).json(user);
    }catch{
      return response.status(400).send({error: 'Error creating Admin'})
    }
  },

  async create (request, response){ 

    const {type} = request.body;

    try{

      
      if(type === 'teacher'){
        const idUser = request.userId;

        User.findOne({'_id': idUser}, 'type', async function (err, data){
        if(err) return handleError(err);


      if(type !== 'teacher')
          return response.status(400).send({error: 'Only admin can create new teacher.'})
        else{
          const user = await User.create(request.body);
        
          console.log(user);
          return response.status(201).json(user);
        }

        });
      }

      const user = await User.create(request.body);
    
      console.log(user);
      return response.status(201).json(user);
    }catch(err){
      console.log(err);
      return response.status(400).send({error: 'Error creating new User'})
    }
         
  }
}