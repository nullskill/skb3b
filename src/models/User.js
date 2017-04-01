import _ from 'lodash';

import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  values: {
    money: {
      type: String,
      required: true,
    },
    origin: {
      type: String,
      required: true,
    },
  },
}, {
  timestamps: true
});

UserSchema.methods.toJSON = function () {
  return _.omit(this.toObject(), ['_id', '__v', 'updatedAt', 'createdAt']);
};

export default mongoose.model('User', UserSchema);