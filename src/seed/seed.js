const { faker } = require("@faker-js/faker");
const { MongoClient, ObjectId } = require("mongodb");

async function seedPosts() {
  const uri =
    "mongodb+srv://sasu7617:DwnBWwZgXH6ftm56@blogdatabase.jje4jrk.mongodb.net/blogApp?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to server for posts seeding");

    const db = client.db("blogApp");
    const usersCollection = db.collection("users");
    const postsCollection = db.collection("posts");
    const likeCollection = db.collection("likes");

    // Fetch all users to pick owners
    const users = await usersCollection.find({}).project({ _id: 1 }).toArray();
    const userIds = users.map((u) => u._id);

    // Optional: clear old posts
    await likeCollection.deleteMany({});
    console.log("success fully deleted likes");

    const posts = [];
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

seedPosts();
