const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

//creating user schema
const myuserSchema=new mongoose.Schema({
    firstname:{
        type: String,
        trim:true,
        required:true,
    },
    lastname:{
        type: String,
        trim:true,
        required:true
    },
    email:{
        type: String,
        trim:true,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email not valid')
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6,
         trim:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('\'Password\' cannot be use as password')
            }
        }
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer,
        default:null
    }
},{
    timestamps:true
})

//Two argument available with midldeware in mongoose
// pre-before event is done
// post-after event is done

//available on USER
//fetching a user by its unique email-id
myuserSchema.statics.findByCredentials = async(email,password)=>{
    const user =await USER.findOne({email})
    if(!user){
        // console.log("no user found")
        throw new Error('Unable to login')
    }
    const ismatch=await bcrypt.compare(password,user.password)
    if(!ismatch){
        // console.log("Incorrect credentals")
        throw new Error('Unable to login')
    }
    return user
}

//available on USER
//fetching a user by its unique email-id
myuserSchema.statics.findByEMAILID = async(email)=>{
    const user =await USER.findOne({email})
    if(!user){
        return true;
    }
    return false;
}


//available on USER
//fetching a user by its unique email-id
myuserSchema.statics.findByCredentialsfb = async(email)=>{
    const user =await USER.findOne({email})
    if(!user){
        // console.log("no user found")
        throw new Error('Unable to login')
    }
    return user
}

//available on user
//Generating JWT-auth token for the user -session
myuserSchema.methods.generateAuthToken=async function(){
    const user=this
    const token = jwt.sign({_id:user.id.toString()},'YouAreAUser')
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}

//removing password and avatars from the public user profile so that userdata is safe even if cookies are compromised
myuserSchema.methods.toJSON=function(){
    const user=this
    const userPublic = user.toObject()
    delete userPublic.password
    delete userPublic.tokens
    delete userPublic.avatar
    return userPublic
}

//hash plain text passowrd before saving
myuserSchema.pre('save',async function(next){
    if(this.isModified('password')){  
        this.password=await bcrypt.hash(this.password,8)
    }
    next()//to be given at the end
})

//delete user tasks before removing user
myuserSchema.pre('remove',async function(next){
    const user = this
    await TASK.deleteMany({'creatorId':user._id})
    next()//to be given at the end
})

//creating user model with above userScehma
const USER=mongoose.model('USERS',myuserSchema)

//exporting user-model created above
module.exports = USER