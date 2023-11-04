import express from 'express';
import { client } from '../mongodb.mjs';
import { ObjectId } from 'mongodb';

const db = client.db("weapp");
const userCollection = db.collection("auth");
const chatCol = db.collection("chats");

let router = express.Router();

router.get('/chat', async (req, res, next) => {
  try {
    const projection = { _id: 1, firstName: 1, lastName: 1, email: 1, profileImage: 1 };
    const cursor = userCollection.find({}).sort({ _id: 1 }).project(projection);
    let results = await cursor.toArray();

    console.log(results);
    res.send(results);
  } catch (error) {
    console.error(error);
  }
});

router.post('/message', (req, res, next) => {
  req.decoded = { ...req.body.decoded };
  next();
}, async (req, res, next) => {

  if (!req.body.to_id || !req.body.chatMessage) {
    res.status(403);
    res.send(`Required parameters missing,
    example request body:
    {
        to_id: "43532452453565645635345",
        chatMessage: "some post text"
    } `);
    return;
  }

  if (!ObjectId.isValid(req.body.to_id)) {
    res.status(403).send(`Invalid user id`);
    return;
  }

  try {
    const insertResponse = await chatCol.insertOne({
      fromName: `${req.decoded.firstName} ${req.decoded.lastName}`,
      toName: req.body.toName,
      from_id: new ObjectId(req.decoded._id),
      to_id: new ObjectId(req.body.to_id),
      message: req.body.chatMessage,
      time: new Date(),
    });
    console.log("Message inserted:", insertResponse);

    res.send({ message: 'Message sent' });
  } catch (e) {
    console.log("Error sending message to MongoDB:", e);
    res.status(500).send({ message: 'Server error, please try later' });
  }
});

router.get('/messages/:from_id', (req, res, next) => {
    req.decoded = { ...req.body.decoded };
    next();
  }, async (req, res, next) => {

    if (!req.params.from_id) {
        res.status(403);
        res.send(`required parameters missing, 
        example request body:
        {
            from_id: "43532452453565645635345"
        } `);
    }

    if (!ObjectId.isValid(req.params.from_id)) {
        res.status(403).send(`Invalid user id`);
        return;
    }

    console.log(req.params.from_id);

    const cursor = chatCol.find({
        $or: [
            {
                to_id: new ObjectId(req.decoded._id),
                from_id: new ObjectId(req.params.from_id),
            }
            ,
            {
                from_id: new ObjectId(req.decoded._id),
                to_id: new ObjectId(req.params.from_id)
            }
        ]
    })

        .sort({ _id: 1 })
        .limit(100);

    try {
        let results = await cursor.toArray()
        console.log("results: ", results);
        res.send(results);
    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.status(500).send('server error, please try later');
    }

});

export default router;