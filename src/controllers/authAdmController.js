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
      const user = await Adm.create(request.body);

      user.password = undefined;

      return response.send({
        user,
        token: generateToken({id: user.id})
        })
      
    }catch(err){
      return response.status(400).send({error : 'Registration failed'})
    }
   },

   async authenticate(request, response){
     
      const {email, password} = request.body;

     const user = await Adm.findOne({email}).select('+password');
     

     if(!user){
       return response.status(400).send({error: 'Adm not found'})
     }

     if(!await bcrypt.compare(password, user.password)){
      return response.status(400).send({error: 'Invalid password'})
     }

     user.password = undefined;

     response.send({
       user,
      token: generateToken({id: user.id})
    })
   },

   async forgot_password(request, response){
     const {email} = request.body;

     try{
      const user = await Adm.findOne({email});

      if(!user)
        response.status(400).send({erro: 'Adm not found'});
      
        const token = crypto.randomBytes(20).toString('hex');
        const now = new Date();
        now.setHours(now.getHours() + 1);

        await Adm.findByIdAndUpdate(user.id, {
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
     const {email, token, password} = request.body;

     try{
      const user = await Adm.findOne({email}).select('+passwordResetTokenAdm passwordResetExperis');

      if(!user){
        return response.status(400).send({error: 'Adm not found'})
      }
      if(token !== user.passwordResetToken)
        return response.status(400).send({erros: 'Token invalid.'});

      const now = new Date();

      if(now > user.passwordResetExpires)
        return response.status(400).send({erros: 'Token expired.'});

      user.password = password;

      await user.save();

      response.send();
 
      
     }catch(err){
       response.send({error: 'Cannot reset password, try again.'})
     }
   }

}