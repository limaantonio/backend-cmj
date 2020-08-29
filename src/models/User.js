const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
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

  eAdmin: {
    type: Number,
    default: 0
  },

  type: {
    type: String,
    require: true,
  },
  posts:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    
  }],


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

  fone: {
    type: String,
   
   
  },

  user_avatar: {
    type: String,
  
  },

  createdAt: {
    type: Date,
    default: Date.now()
  },

  

});

UserSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();

})

module.exports = mongoose.model('User', UserSchema);
