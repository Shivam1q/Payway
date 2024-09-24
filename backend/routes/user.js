import express from "express";
import zod from "zod";
import jwt from "jsonwebtoken";
import { User, Account } from "../db.js";
import {JWT_SECRET} from "../config.js";
import {authMiddleware} from "../middleware.js";

const userRouter = express.Router();

/* --------------------------------------------------------------------------------------------------------------------------*/

const signupSchema = zod.object({
  username : zod.string().email(),
  password : zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});

userRouter.post("/signup", async (req, res, next) => {
  const body = req.body;
  const {success} = signupSchema.safeParse(req.body);
  if(!success) {
    return res.status(411).json({
      message: "invalid inputs"
    })
  }

  const user = await User.findOne({
    username: body.username
  })

  if(user){
    return res.status(411).json({
      message: "Email already used!"
    })
  }

  const dbUser = await User.create(body);

  const userId = dbUser._id;

  await Account.create({
    userId,
    balance: 1 + Math.random()*10000,
  })

  const token = jwt.sign({
    userId: dbUser._id
  }, JWT_SECRET);

  res.json({
    message: "User created successfully",
    token: token
  })

});

/* --------------------------------------------------------------------------------------------------------------------------*/

const signinSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
})

userRouter.post("/signin", async (req, res, next) => {
  const {success} = signinSchema.safeParse(req.body);
  if(!success){
    return res.status(411).json({
      message : "Invalid inputs"
    })
  }

  const user = await User.findOne({
    username : req.body.username,
    password : req.body.password,
  })

  if(!user){
    return res.status(411).json({
      message : "user doesn't exist, try to signup"
    })
  }

  const token = jwt.sign({
    userId: user._id
  }, JWT_SECRET);

  res.status(200).json({
    message: "signin successfully",
    token: token
  })
});

/* --------------------------------------------------------------------------------------------------------------------------*/

const updateSchema = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
})

userRouter.put('/', authMiddleware, async (req, res, next) => {
  const {success} = updateSchema.safeParse(req.body);
  if(!success){
    return res.status(411).json({
      message: "Error while updating information maybe invalid inputs"
    })
  }

  await User.updateOne({_id:req.userId}, req.body);

  res.json({
    message:"Updated Successfully"
  })
})

/* --------------------------------------------------------------------------------------------------------------------------*/

userRouter.get("/bulk", async(req,res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or : [{
      firstName: {
        "$regex": filter
      }
    }, {
      lastname: {
        "$regex": filter
      }
    }]
  })

  res.json({
    user: users.map(user => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id
    }))
  })
})


export {userRouter};

