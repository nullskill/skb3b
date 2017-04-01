import _ from 'lodash';

import mongoose from 'mongoose';
const { Schema } = mongoose;

const PetSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  userId: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['cat', 'dog', 'rat'],
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
  // toJSON   : {virtuals : true},
  // toObject : {virtuals : true},
});

// PetSchema.virtual('owner', {
//   ref: 'User',
//   localField: 'userId',
//   foreignField: 'id',
//   justOne: true // Only return one owner (for many-to-1 relationships)
// });

PetSchema.methods.toJSON = function () {
  return _.omit(this.toObject(), [
    '_id', 
    '__v', 
    'updatedAt', 
    'createdAt', 
    // 'owner._id',
    // 'owner.__v',
    // 'owner.updatedAt',
    // 'owner.createdAt',
    ]);
};

export default mongoose.model('Pet', PetSchema);