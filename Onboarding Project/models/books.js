const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    required: true
  },
  price: {
    type: Number,
    min: 0,
    required: true
  },
  stock: {
    type: Number,
    min: 0,
    required: true,
    validate : {
        validator : Number.isInteger,
        message   : '{VALUE} is not an integer value'
    }
  }
},
{
    timestamps: true
}
);

bookSchema.index({title: 1, author: 1, price: 1}, {unique: true});

module.exports = mongoose.model('Book', bookSchema);
