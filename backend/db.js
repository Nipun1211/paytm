const mongoose= require('mongoose');
mongoose.connect('mongodb+srv://nipun1211:Deadshot%40007@cluster0.c9ioewr.mongodb.net/');

const userSchema= mongoose.Schema({
 username: {
   type:String,
   required:true,
   unique:true,
   trim:true,
   lowercase:true,
   minLength:3,
   maxLength:30 
 },
 password: {
    type:String,
    required:true,
    minLength:6
 },
 firstname: {
    type:String,
    required:true,
    trim:true,
    maxLength:50
 },
 lastname: {
    type:String,
    required:true,
    trim:true,
    maxLength:50
 }
})

const accountSchema=mongoose.Schema({
   userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
      required:true,
   },
   balance:{
      type: Number,
      required: true
   }
});

const User= mongoose.model('User', userSchema);
const Account= mongoose.model('Account', accountSchema);

module.exports={
    User, Account
}