const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    require: true,
  },

  post:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    require: true,
  
  },

  createdAt: {
    type: Date,
    default: Date.now()
  },

 
});

module.exports = mongoose.model('Comment', CommentSchema);
