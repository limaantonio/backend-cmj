const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const TeacherSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },

  email: {
    type: String,
    require: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    require: true,
    select: false
  },

  passwordResetToken: {
    type: String,
    select: false
  },

  passwordResetExpires: {
    type: Date,
    select: false
  },

  adm: {
    type: Boolean,
    require: true
  },


  fone: {
    type: String,
    require: true,
   
  },

  user_avatar: {
    type: String,
    require: true,
  },

  createdAt: {
    type: Date,
    default: Date.now()
  },

  

});

TeacherSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();

})

module.exports = mongoose.model('Teacher', TeacherSchema);
