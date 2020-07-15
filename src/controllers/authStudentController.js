const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mailer = require('../modules/mailer');

const authConfig = require('../config/authStudent.json');

function generateToken(params = {}){
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

module.exports = {

  async register (request, response){
    const {email} = request.body;

    try{
      if(await Student.findOne({email})){
        return response.status(400).send({error: 'Student already exists'})
      }
      const student = await Student.create(request.body);

      student.password = undefined;

      return response.send({
        student,
        tokenStudent: generateToken({id: student.id})
        })
      
    }catch(err){
      return response.status(400).send({error : 'Registration failed'})
    }
   },

   async authenticate(request, response){
     
      const {email, password} = request.body;

     const student = await Student.findOne({email}).select('+password');
     

     if(!student){
       return response.status(400).send({error: 'Student not found'})
     }

     if(!await bcrypt.compare(password, student.password)){
      return response.status(400).send({error: 'Invalid password'})
     }

     student.password = undefined;

     response.send({
       student,
      tokenStudent: generateToken({id: student.id})
    })
   },

   async forgot_password(request, response){
     const {email} = request.body;

     try{
      const Student = await Student.findOne({email});

      if(!student)
        response.status(400).send({erro: 'Student not found'});
      
        const tokenStudent = crypto.randomBytes(20).toString('hex');
        const now = new Date();
        now.setHours(now.getHours() + 1);

        await Student.findByIdAndUpdate(Student.id, {
          '$set': {
            passwordResetToken: tokenStudent,
            passwordResetExpires: now,
          }, 
        },{new: true, useFindAndModify: false});
        
        mailer.sendMail({
          to: email,
          from: 'antonio@gmail.com',
          template: 'auth/forgot_password',
          context: {tokenStudent},
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
     const {email, tokenStudent, password} = request.body;

     try{
      const student = await Student.findOne({email}).select('+passwordResetToken passwordResetExperis');

      if(!student){
        return response.status(400).send({error: 'Student not found'})
      }
      if(tokenStudent !== student.passwordResetToken)
        return response.status(400).send({erros: 'Token invalid.'});

      const now = new Date();

      if(now > student.passwordResetExpires)
        return response.status(400).send({erros: 'Token expired.'});

      student.password = password;

      await student.save();

      response.send();
 
      
     }catch(err){
       response.send({error: 'Cannot reset password, try again.'})
     }
   }

}