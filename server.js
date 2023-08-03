////////////////////////////
// IMPORT OUR DEPENDENCIES
////////////////////////////
// read our .env file and create environmental variables
require("dotenv").config();
// pull PORT from .env, give default value
// const PORT = process.env.PORT || 8000
// const DATABASE_URL = process.env.DATABASE_URL
const { PORT = 8000, DATABASE_URL } = process.env;
// import express
const express = require("express");
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose");
// import cors
const cors = require("cors");
// import morgan
const morgan = require("morgan");

///////////////////////////
// DATABASE CONNECTION
///////////////////////////
// Establish Connection
mongoose.connect(DATABASE_URL);

// Connection Events
mongoose.connection
  .on("open", () => console.log("You are connected to mongoose"))
  .on("close", () => console.log("You are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

////////////////////////////
// Models
////////////////////////////
// models = PascalCase, singular "People"
// collections, tables =snake_case, plural "peoples"

const peopleSchema = new mongoose.Schema({
  name: String,
  image: String,
  title: String,
});

const People = mongoose.model("People", peopleSchema);

//////////////////////////////
// Middleware
//////////////////////////////
// cors for preventing cors errors (allows all requests from other origins)
app.use(cors());
// morgan for logging requests
app.use(morgan("dev"));
// express functionality to recognize incoming request objects as JSON objects
app.use(express.json());

////////////////////////////
// ROUTES
////////////////////////////

// "/people"
// INDUCES - INDEX, xNEWx, DELETE, UPDATE, CREATE, xEDITx, SHOW
// IDUCS - INDEX, DESTROY, UPDATE, CREATE, SHOW (FOR AN JSON API)

// INDEX - GET - /people - gets all people
app.get("/people", async (req, res) => {
  try {
    // fetch all people from database
    const people = await People.find({});
    // send json of all people
    res.json(people);
  } catch (error) {
    // send error as JSON
    res.status(400).json({ error });
  }
});

// CREATE - POST - /people - create a new person
app.post("/people", async (req, res) => {
  try {
    // create the new person
    const person = await People.create(req.body);
    // send newly created person as JSON
    res.json(person);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// SHOW - GET - /people/:id - get a single person
app.get("/people/:id", async (req, res) => {
  try {
    // get a person from the database
    const person = await People.findById(req.params.id);
    // return the person as json
    res.json(person);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// UPDATE - PUT - /people/:id - update a single person
app.put("/people/:id", async (req, res) => {
  try {
    // update the person
    const person = await People.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    // send the updated person as json
    res.json(person);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// DESTROY - DELETE - /people/:id - delete a single person
app.delete("/people/:id", async (req, res) => {
    try {
        // delete the person
        const person = await People.findByIdAndDelete(req.params.id)
        // send deleted person as json
        res.status(204).json(person)
    } catch(error){
        res.status(400).json({error})
    }
})

// create a test route
app.get("/", (req, res) => {
  res.json({ hello: "world" });
});

////////////////////////////
// LISTENER
////////////////////////////
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
