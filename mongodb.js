const { EventEmitter } = require("events");
const { MongoClient } = require("mongodb");
require("dotenv").config();

class MongoConnect extends EventEmitter {
  constructor() {
    super();
    const KEY = process.env.DB_KEY;
    this.mongoClient = new MongoClient(KEY);

    this.educationDB;
    this.newCourses;
    this.newUniversities;
  }
  async connect() {
    try {
      await this.mongoClient.connect();
      console.log("Connected");
      this.emit("connect");
      this.educationDB = this.mongoClient.db("Education");
      this.newCourses = this.educationDB.collection("Courses");
      this.newUniversities = this.educationDB.collection("Universities");
    } catch (err) {
      console.error(err);
    }
  }
}
module.exports = MongoConnect;
