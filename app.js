const MongoConnect = require("./mongodb");
const express = require("express");
const ateneoRouter = require("./routes/universities");
const corsiRouter = require("./routes/courses");

require("dotenv").config();

const app = express();
const mongoConnect = new MongoConnect();

app.use("/", ateneoRouter);
app.use("/", corsiRouter);

app.set("view engine", "ejs");

mongoConnect.on("connect", () => {
  app.listen(process.env.PORT, () => {
    console.log("Server in ascolto sulla porta");
  });
});
mongoConnect.connect();
