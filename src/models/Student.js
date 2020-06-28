const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const StudentSchema = new mongoose.Schema({
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

  fone: {
    type: String,
    require: true,
   
  },

  // avatar_url: {
  //   type: String,
  //   require: false,
  // },


  createdAt: {
    type: Date,
    default: Date.now()
  },

  

});

StudentSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();

})

module.exports = mongoose.model('Studant', StudentSchema);
