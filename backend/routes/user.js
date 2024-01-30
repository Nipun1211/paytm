const express= require ("express");
const zod= require("zod");
const JWT_SECRET = require("./config");
const jwt= require("jsonwebtoken")
const {User, Account} = require("../db");
const { authMiddleware } = require("./middleware");

const router= express.Router();
const signupSchema= zod.object({
    username: zod.string(),
    password: zod.string(),
    firstname: zod.string(),
    lastname: zod.string()
})

const updateSchema= zod.object({
    password: zod.string().optional(),
    firstname: zod.string().optional,
    lastname:zod.string().optional
})

const signinSchema = zod.object({
    username: zod.string().email(),
	password: zod.string()
})


router.post("/signup", async function (req,res){   
    const body= req.body;
 const {success}= signupSchema.safeParse(body);
 if (!success){
    return res.status(411).json({
        message: "Email already taken/ Invalid Inputs"
    })
 }
 const user= User.findOne({
        username: body.username
 })
   if (user._id){
    return res.status(411).json({
        message: "Email already taken"
    })
   } 
   const dbUser= await User.create({
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
   });

   // creating new account
   const userId= dbUser._id;

   await Account.create({
    userId,
    balance: 1+ Math.random()*10000
   })
   const token= jwt.sign({
    userId: dbUser._id
   }, JWT_SECRET);
   res.status(200).json({
    message: "User created successfully"
   })

})


router.post("/signin", async (req, res) => {
    const { success } = signinSchema.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
        console.log("hiii");
        console.log(token);
   
        res.status(200).json({
            token: token
        })
        return;
    }

    
    res.status(411).json({
        message: "Error while logging in"
    })
})

router.put("/", authMiddleware, async(req, res)=>{
    const {success}=updateSchema.safeParse(req.body);
    

    if (!success){
       return res.status(411).json({
            message:"Error while updating information"
        })
    }
    await User.updateOne(req.body,{
        _id:req.userId
    })

    res.json({
        message:"Updated successfully"
    })
})

router.get("/bulk", async (req,res)=>{
    try {
        const filter = req.query.filter || '';
        const users = await User.find({
          $or: [
            { firstname: { $regex: filter, $options: 'i' } },
            { lastname: { $regex: filter, $options: 'i' } }
          ]
        });
    
        res.json({
          users: users.map(user => ({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            id: user._id
          }))
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

module.exports=router;