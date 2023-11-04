import express from 'express';
import { client } from '../mongodb.mjs'
import { ObjectId } from 'mongodb';
import admin from "firebase-admin";
import multer, { diskStorage } from 'multer';
import fs from "fs";

const db = client.db("weapp")
const col = db.collection("posts")
const chatCol = db.collection("chats")
const userCollection = db.collection("auth")

let router = express.Router()


router.get('/chat', async (req, res, next) => {
    try {
        const projection = { _id: 1, firstName: 1, lastName: 1, email: 1, profileImage: 1, }
        const cursor = userCollection.find({}).sort({ _id: 1 }).project(projection);
        let results = await cursor.toArray();

        console.log(results);
        res.send(results);
    } catch (error) {
        console.error(error);
    }
});

// message

router.post("/message", multer().none(), async (req, res, next) => {

    // console.log("req.body: ", req.body);
    // console.log("req.currentUser: ", req.currentUser);

    // if (!req.body.to_id && !req.body.chatMessage && !req.body.chatImage) {
    //     res.status(403);
    //     res.send(`required parameters missing, 
    //     example request body:
    //     {
    //         to_id: "43532452453565645635345",
    //         messageText: "some post text",
    //         image: "an image
    //     } `);
    //     return;
    // }

    // if (!ObjectId.isValid(req.body.to_id)) {
    //     res.status(403).send(`Invalid user id`);
    //     return;
    // }

    console.log("names" ,req);

    // try {
    //     const insertResponse = await chatCol.insertOne({

    //         fromName: req.currentUser.firstName + " " + req.currentUser.lastName,
    //         fromEamil: req.currentUser.email, // malik@abc.com
    //         from_id: new ObjectId(req.currentUser._id), // 245523423423424234

    //         to_id: new ObjectId(req.body.to_id),

    //         messageText: req.body.messageText,
    //         imgUrl: req.body.imgUrl,

    //         createdOn: new Date()
    //     });
    //     console.log("insertResponse: ", insertResponse);

    //     // io.emit("comeChannel", req.body.messageText);

    //     res.send({ message: 'message sent' });
    // } catch (e) {
    //     console.log("error sending message mongodb: ", e);
    //     res.status(500).send({ message: 'server error, please try later' });
    // }


});

export default router