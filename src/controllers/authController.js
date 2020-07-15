const Teacher = require('../models/Teacher');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mailer = require('../modules/mailer');

const authConfig = require('../config/auth.json');

function generateToken(params = {}){
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

module.exports = {

  async register (request, response){
    const {email} = request.body;

    try{
      if(await Teacher.findOne({email})){
        return response.status(400).send({error: 'Teacher already exists'})
      }
      const teacher = await Teacher.create(request.body);

      teacher.password = undefined;

      return response.send({
        teacher,
        tokenTeacher: generateToken({id: teacher.id})
        })
      
    }catch(err){
      return response.status(400).send({error : 'Registration failed'})
    }
   },

   async authenticate(request, response){
     
      const {email, password} = request.body;

     const teacher = await Teacher.findOne({email}).select('+password');
     

     if(!teacher){
       return response.status(400).send({error: 'Teacher not found'})
     }

     if(!await bcrypt.compare(password, teacher.password)){
      return response.status(400).send({error: 'Invalid password'})
     }

     teacher.password = undefined;

     response.send({
       teacher,
       tokenTeacher: generateToken({id: teacher.id})
    })
   },

   async forgot_password(request, response){
     const {email} = request.body;

     try{
      const teacher = await Teacher.findOne({email});

      if(!teacher)
        response.status(400).send({erro: 'Teacher not found'});
      
        const tokenTeacher = crypto.randomBytes(20).toString('hex');
        const now = new Date();
        now.setHours(now.getHours() + 1);

        await Teacher.findByIdAndUpdate(teacher.id, {
          '$set': {
            passwordResetToken: tokenTeacher,
            passwordResetExpires: now,
          }, 
        },{new: true, useFindAndModify: false});
        
        mailer.sendMail({
          to: email,
          from: 'antonio@gmail.com',
          template: 'auth/forgot_password',
          context: {tokenTeacher},
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
     const {email, tokenTeacher, password} = request.body;

     try{
      const teacher = await Teacher.findOne({email}).select('+passwordResetToken passwordResetExperis');

      if(!teacher){
        return response.status(400).send({error: 'Teacher not found'})
      }
      if(token !== teacher.passwordResetToken)
        return response.status(400).send({erros: 'Token invalid.'});

      const now = new Date();

      if(now > teacher.passwordResetExpires)
        return response.status(400).send({erros: 'Token expired.'});

      teacher.password = password;

      await teacher.save();

      response.send();
 
      
     }catch(err){
       response.send({error: 'Cannot reset password, try again.'})
     }
   }

}