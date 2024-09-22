import mongoose from 'mongoose';

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://Shivam_Yadav:1234567890@cluster0.qxde9.mongodb.net/');
}

const userSchema = new mongoose.Schema({
  firstName : {
    type: String,
    required : "true",
    min: 1,
  },
  lastName : {
    type: String,
    required : "true",
    min: 1,
  },
  password : {
    type: String,
    required : "true",
    min: 6,
  },
  username : {
    type: String,
    required : "true",
  },
  amount : {
    type: Number,
  }
});

const User = mongoose.model('User', userSchema);

module.exports = {
  User
}