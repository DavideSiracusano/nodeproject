const express = require("express");
const router = express.Router();
const MongoConnect = require("../mongodb");
const { ObjectId } = require("mongodb");

const mongoConnect = new MongoConnect();

router.get("/create-university", async (req, res) => {
  await mongoConnect.connect();
  const { name, phone } = req.query;
  const university = { name, phone, _id: new ObjectId() };

  try {
    const result = await mongoConnect.newUniversities.insertOne(university);
    if (result.acknowledged) {
      res.status(201).send({ message: "University inserted!", university });
    } else {
      res.status(500).send("Error inserting university");
    }
  } catch (error) {
    console.error("Error inserting university:", error);
    res.status(500).send("Error inserting university");
  }
});

// vedere i corsi che offre un`università
router.get("/university/:universityName/courses", async (req, res) => {
  try {
    await mongoConnect.connect();
    const universityName = req.params.universityName;
    const university = await mongoConnect.newUniversities.findOne({
      name: universityName,
    });

    if (!university) {
      return res.status(404).send("University not found");
    }

    const courses = await mongoConnect.newCourses
      .aggregate([
        {
          $lookup: {
            from: "Universities",
            localField: "university_id",
            foreignField: "_id",
            as: "University",
          },
        },
        {
          $unwind: "$University",
        },
        {
          $match: {
            "University.name": universityName,
          },
        },
      ])
      .toArray();

    res.render("courses", { courses, university });
  } catch (error) {
    console.error("Error during aggregation:", error);
    res.status(500).send("Error during aggregation");
  }
});

router.get(
  "/university/:universityName/courses/:courseName",
  async (req, res) => {
    try {
      await mongoConnect.connect();
      const universityName = req.params.universityName;
      const university = await mongoConnect.newUniversities.findOne({
        name: universityName,
      });

      if (!university) {
        return res.status(404).send("University not found");
      }

      // Cerca il corso per nome
      const courseName = req.params.courseName;
      const course = await mongoConnect.newCourses.findOne({
        name: courseName,
      });

      if (!course) {
        return res.status(404).send("Course not found");
      }

      // Associa il corso all'università trovata
      await mongoConnect.newCourses.updateOne(
        { name: courseName },
        {
          $set: {
            university_id: university._id,
            university_name: universityName,
          },
        }
      );

      res.json({ message: "Course associated with university successfully" });
    } catch (error) {
      console.error("Error associating course with university:", error);
      res.status(500).send("Error associating course with university");
    }
  }
);

router.get("/modify-university/:id", async (req, res) => {
  await mongoConnect.connect();
  const { id } = req.params;
  const { name, phone } = req.query;
  const update = {
    $set: { name, phone },
  };
  const result = await mongoConnect.newUniversities.updateOne(
    { _id: new ObjectId(id) },
    update
  );
  if (result.modifiedCount > 0) {
    res.json({ message: "University updated!" });
  } else {
    res.status(404).send("University not found or not updated");
  }
});

router.delete("/delete-university/:id", async (req, res) => {
  await mongoConnect.connect();
  const { id } = req.params;
  const result = await mongoConnect.newUniversities.deleteOne({
    _id: new ObjectId(id),
  });
  if (result.deletedCount > 0) {
    res.json({ message: "University deleted!" });
  } else {
    res.status(404).send("University not found");
  }
});

module.exports = router;
