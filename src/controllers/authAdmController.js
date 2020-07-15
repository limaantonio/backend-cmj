const Adm = require('../models/Adm');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mailer = require('../modules/mailer');

const authConfig = require('../config/authAdm.json');

function generateToken(params = {}){
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

module.exports = {

  async register (request, response){
    const {email} = request.body;

    try{
      if(await Adm.findOne({email})){
        return response.status(400).send({error: 'Adm already exists'})
      }
      const adm = await Adm.create(request.body);

      adm.password = undefined;

      return response.send({
        adm,
        token: generateToken({id: adm.id})
        })
      
    }catch(err){
      return response.status(400).send({error : 'Registration failed'})
    }
   },

   async authenticate(request, response){
     
      const {email, password} = request.body;

     const adm = await Adm.findOne({email}).select('+password');
     

     if(!adm){
       return response.status(400).send({error: 'Adm not found'})
     }

     if(!await bcrypt.compare(password, adm.password)){
      return response.status(400).send({error: 'Invalid password'})
     }

     adm.password = undefined;

     response.send({
       adm,
      tokenAdm: generateToken({id: adm.id})
    })
   },

   async forgot_password(request, response){
     const {email} = request.body;

     try{
      const adm = await Adm.findOne({email});

      if(!adm)
        response.status(400).send({erro: 'Adm not found'});
      
        const token = crypto.randomBytes(20).toString('hex');
        const now = new Date();
        now.setHours(now.getHours() + 1);

        await Adm.findByIdAndUpdate(adm.id, {
          '$set': {
            passwordResetToken: token,
            passwordResetExpires: now,
          }, 
        },{new: true, useFindAndModify: false});
        
        mailer.sendMail({
          to: email,
          from: 'antonio@gmail.com',
          template: 'auth/forgot_password',
          context: {token},
        }, (err) => {
          if(err){
            return response.status(400).send({error: 'Cannot send forgot password email.'});
          }
          return response.send();
        })

     }catch(err){
       response.status(400).send({error: 'Erro on forgot password, try again'});
     }
   },

   async reset_password(request, response){
     const {email, tokenAdm, password} = request.body;

     try{
      const adm = await Adm.findOne({email}).select('+passwordResetTokenAdm passwordResetExperis');

      if(!adm){
        return response.status(400).send({error: 'Adm not found'})
      }
      if(token !== adm.passwordResetToken)
        return response.status(400).send({erros: 'Token invalid.'});

      const now = new Date();

      if(now > adm.passwordResetExpires)
        return response.status(400).send({erros: 'Token expired.'});

      adm.password = password;

      await adm.save();

      response.send();
 
      
     }catch(err){
       response.send({error: 'Cannot reset password, try again.'})
     }
   }

}