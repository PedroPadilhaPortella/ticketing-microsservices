import mongoose from 'mongoose';

import { PasswordService } from '../services/password-service';

interface UserProps {
  email: string
  password: string
}

interface UserDoc extends mongoose.Document {
  email: string
  password: string
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(props: UserProps): UserDoc
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;
    }
  }
});

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await PasswordService.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (props: UserProps) => new User(props);
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };