const Teacher = require('../models/Teacher');


module.exports = {
  async index (request, response){
    try{
      const teachers = await Teacher.find();
      
      return response.send({teachers})
    }catch(err){
      return response.status(400).send({error: 'Error loading Teachers.'})
    }
  },

  async deleteById (request, response){
    try{
      const teacher = await Teacher.findOneAndRemove(request.params.teacherId);
      
      return response.send();
    }catch(err){
      return response.status(400).send({error: 'Error deleting Teacher.'})
    }
  },

  async updateById (request, response){
    const {id} = request.params;
    const {name, fone, board, model} = request.body;

    try{
      const teacher  = await Teacher.findByIdAndUpdate(id, {
        name: name,
        fone: fone,
        board: board,
        model: model,
       
  
      });

      return response.status(204).send();
    }catch(e){
      return response.status(400).json({error: 'No Teacher found with this ID'});
    }
  },

  async create (request, response){ 
    try{
      const user = await Teacher.create(request.body);

      return response.status(201);
    }catch(err){
      return response.status(400).send({error: 'Error creating new Teacher'})
    }
         
  }
}