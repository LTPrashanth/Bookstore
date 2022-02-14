const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
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
  address: {
      type: String,
      required: true
  },
  books: [
    {
      product: { type: Schema.Types.ObjectId, required: true, ref: 'Book' },
      quantity: { type: Number, required: true }
    }
  ],
  payment: {
    type: String,
    enum: ['PENDING', 'COMPLETED'],
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'COMPLETED'],
    required: true
  }
},
{
    timestamps: true
}
);

module.exports = mongoose.model('Order', orderSchema);