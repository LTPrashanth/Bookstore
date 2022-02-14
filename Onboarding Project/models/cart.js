const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CartSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  total: {
      type: Number,
      required: true
  },
  books: [
    {
      product: { type: Schema.Types.ObjectId, required: true, ref: 'Book' },
      quantity: { type: Number, required: true }
    }
  ],
  status: {
    type: String,
    enum: ['OPEN', 'CLOSE'],
    required: true
  }
},
{
    timestamps: true
}
);

module.exports = mongoose.model('Cart', CartSchema);