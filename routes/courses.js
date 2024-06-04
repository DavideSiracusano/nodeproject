const express = require("express");
const router = express.Router();
const MongoConnect = require("../mongodb");
const { ObjectId } = require("mongodb");

const mongoConnect = new MongoConnect();

router.get("/create-course", async (req, res) => {
  await mongoConnect.connect();
  const { name, type } = req.query;
  const course = { name, type, _id: new ObjectId() };

  try {
    const result = await mongoConnect.newCourses.insertOne(course);
    if (result.acknowledged) {
      res.status(201).send({ message: "Course inserted!", course });
    } else {
      res.status(500).send("Error inserting course");
    }
  } catch (error) {
    console.error("Error inserting course:", error);
    res.status(500).send("Error inserting course");
  }
});

router.get("/modify-course/:id", async (req, res) => {
  await mongoConnect.connect();
  const { id } = req.params;
  const { name, type } = req.query;
  const update = { $set: { name, type } };
  const result = await mongoConnect.newCourses.updateOne(
    { _id: new ObjectId(id) },
    update
  );
  if (result.modifiedCount > 0) {
    res.send({ message: "Course updated!" });
  } else {
    res.status(404).send("Course not found or not updated");
  }
});

router.get("/delete-course/:id", async (req, res) => {
  await mongoConnect.connect();
  const { id } = req.params;
  const result = await mongoConnect.newCourses.deleteOne({
    _id: new ObjectId(id),
  });
  if (result.deletedCount > 0) {
    res.send({ message: "Course deleted!" });
  } else {
    res.status(404).send("Course not found");
  }
});

// Filtro corsi
router.get("/filter-courses", async (req, res) => {
  await mongoConnect.connect();
  const { name, type } = req.query;
  const result = await mongoConnect.newCourses.find({ name, type }).toArray();
  if (result.length === 0) {
    res.status(404).send({ message: "Nessun corso trovato" });
  } else {
    res.send(result);
  }
});

module.exports = router;
