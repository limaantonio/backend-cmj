const Student = require('../models/Student');


module.exports = {
  async index (request, response){
    try{
      const students = await Student.find();
      
      return response.send({students})
    }catch(err){
      return response.status(400).send({error: 'Error loading Students.'})
    }
  },

  async deleteById (request, response){
    try{
      const student = await Student.findOneAndRemove(request.params.StudentId);
      
      return response.send();
    }catch(err){
      return response.status(400).send({error: 'Error deleting Student.'})
    }
  },

  async updateById (request, response){
    const {id} = request.params;
    const {name, email, password, fone, user_avatar} = request.body;

    try{
      const student  = await Student.findByIdAndUpdate(id, {
        name: name,
        email: email,
        password: password,
        fone: fone,
        user_avatar: user_avatar,
       
  
      });

      return response.status(204).send();
    }catch(e){
      return response.status(400).json({error: 'No Student found with this ID'});
    }
  },

  async create (request, response){ 
    try{
      //const {location:  avatar_url = ''} = request.file;
      
      const {name, email, password, fone} = request.body;

      const user = await Student.create({
        name,
        email,
        password, 
        fone,
     // avatar_url

      });

      return response.status(201).json(user);

    }catch(err){
      console.log(err);
      return response.status(400).send({error: 'Error creating new Student'})
    }
    
         
  }
}