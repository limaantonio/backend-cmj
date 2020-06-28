const Teacher = require('../models/Adm');
const Adm = require('../models/Adm');


module.exports = {
  async index (request, response){
    try{
      const adm = await Adm.find();
      
      return response.send({adm})
    }catch(err){
      return response.status(400).send({error: 'Error loading Adms.'})
    }
  },
  async create (request, response){ 
    try{
      const adm = await Adm.create(request.body);

      return response.status(201).json(adm);
    }catch(err){
      return response.status(400).send({error: 'Error creating new Adm'})
    }   
  }
}