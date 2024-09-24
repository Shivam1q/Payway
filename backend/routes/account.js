import express from "express";
import {authMiddleware} from "../middleware.js";
import { Account } from "../db.js";
import mongoose from "mongoose";


const accountRouter = express.Router();

accountRouter.get("/balance", authMiddleware, async (req, res, next) => {
  const account = await Account.findOne({
    userId: req.userId
  });
  res.json({
    balance: account.balance
  })
});

accountRouter.post("/transfer", authMiddleware, async (req, res, next) =>{
  const session = await mongoose.startSession();

  session.startTransaction();
  const {amount, to} = req.body;

  const account = await Account.findOne({
    userId:req.userId,
  }).session(session);

  if(!account || account.balance < amount){
    await session.abortTransaction();
    return res.status(401).json({
      message : "Insufficient balance"
    });
  }
  const toAccount = await Account.findOne({
    userId: to,
  }).session(session);

  if(!toAccount){
    await session.abortTransaction();
    return res.status(401).json({
      message:"Invalid Account",
    });
  }

  await Account.updateOne({
    userId: req.userId,
  }, {
    $inc: {
      balance: -amount
    }
  }
  ).session(session);
  await Account.updateOne({
    userId:to
  }, {
    $inc: {
      balance: amount
    }
  }).session(session);

  await session.commitTransaction();
  res.json({
    message: "Transfer Successful"
  });
})

export {accountRouter};