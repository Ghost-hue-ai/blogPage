const { faker } = require("@faker-js/faker");
const { MongoClient, ObjectId } = require("mongodb");

async function seedLikes(maxLikesPerPost = 10) {
  const uri =
    "mongodb+srv://sasu7617:DwnBWwZgXH6ftm56@blogdatabase.jje4jrk.mongodb.net/blogApp?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to server for likes seeding");

    const db = client.db("test");
    const usersCollection = db.collection("users");
    const postsCollection = db.collection("posts");
    const likesCollection = db.collection("likes");

    // Fetch all user and post IDs
    const users = await usersCollection.find({}).project({ _id: 1 }).toArray();
    const userIds = users.map((u) => u._id);

    const posts = await postsCollection.find({}).project({ _id: 1 }).toArray();

    // Optional: clear old likes
    await likesCollection.deleteMany({});

    const likes = [];

    for (const post of posts) {
      // Random number of likes for this post
      const numLikes = faker.number.int({ min: 0, max: maxLikesPerPost });

      // Pick random unique users for likes
      const likers = faker.helpers.arrayElements(userIds, numLikes);

      for (const userId of likers) {
        likes.push({
          postId: post._id,
          owner: userId,
          isLiked: true,
        });
      }
    }

    if (likes.length > 0) {
      const result = await likesCollection.insertMany(likes);
      console.log(`Inserted ${result.insertedCount} likes successfully.`);
    } else {
      console.log("No likes to insert.");
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

seedLikes();
