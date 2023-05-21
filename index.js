const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");

const app = express();
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.j1jxfgc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

app.use(cors());
app.use(express.json());

async function run() {
  try {
    await client.connect();
    const toysCollection = client.db("toysDB").collection("toys");

    app.get("/toys", async (req, res) => {
      const cursor = toysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/toys/add", async (req, res) => {
      const toys = req.body;
      const result = await toysCollection.insertOne(toys);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.send(result);
    });

    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const toy = await toysCollection.findOne(query);
      res.send(toy);
    });
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
