const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("aircnc server running !!!");
});

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.1hzognu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    client.connect();
    const database = client.db("aircnc");
    const hotels = database.collection("hotels");
    const homes = database.collection("homes");
    app.get("/hotels", async (req, res) => {
      const query = {};
      const data = await hotels.find(query).limit(10).toArray();
      res.status(200).send(data);
    });
    app.get("/homes", async (req, res) => {
      const query = {};
      const data = await homes.find(query).limit(10).toArray();
      res.status(200).send(data);
    });
    app.get("/hotel/:id", async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const data = await hotels.findOne(query);
      res.status(200).send(data);
    });
    app.get("/home/:id", async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const data = await homes.findOne(query);
      res.status(200).send(data);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
