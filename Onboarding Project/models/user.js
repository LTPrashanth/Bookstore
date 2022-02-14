const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  email: {
      type: String,
      required: true,
      unique: true,
      match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  password: {
      type: String,
      required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Blocked'],
    required: true
  },
  type: {
    type: String,
    enum: ['Admin', 'User'],
    required: true
  }
},
{
    timestamps: true
}
);

module.exports = mongoose.model('User', userSchema);