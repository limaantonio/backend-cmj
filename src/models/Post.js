const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },

  body: {
    type: String,
    require: true,
  },

  img_url: {
    type: String,
    require: true,
  },

 

  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    require: true,
  },


  likes: {
    type: Number,
    require: true,
   
  },

  comments:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    require: true
  }],


  createdAt: {
    type: Date,
    default: Date.now()
  }

});

module.exports = mongoose.model('Post', PostSchema);
