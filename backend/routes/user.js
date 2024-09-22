import express from "express";
import zod from "zod";
import jwt from "jsonwebtoken";
import User from "./db.js";
import JWT_SECRET from "../config";

const router = express.Router();

const signupSchema = zod.object({
  username : zod.string().email(),
  password : zod.string(),
  firstName: zod.string(),
  password: zod.string(),
});

router.post("/signup", async (req, res, next) => {
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

  if(user._id){
    return res.status(411).json({
      message: "Email already used!"
    })
  }

  const dbUser = await User.create(body);
  const token = jwt.sign({
    userId: dbUser._id
  }, JWT_SECRET);

  res.json({
    message: "User created successfully",
    token: token
  })

});

const signinSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
})

router.post("/signin", async (req, res, next) => {
  const body = req.body;
  const {success} = signinSchema.safeParse(req.body);
  if(!success){
    return res.status(411).json({
      message : "Error while login, invalid inputs"
    })
  }

  const user = await User.findOne({
    username : body.username,
    password : body.password,
  })

  if(!user._id){
    return res.status(411).json({
      message : "user doesn't exist, try to signup"
    })
  }

  if(user.password != password){
    return res.status(411).json({
      message : "invalid credentials"
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


module.exports = router;

