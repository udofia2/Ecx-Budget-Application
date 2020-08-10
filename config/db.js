const mongoose = require("mongoose");
const config = require("./default");

const connectDB = async () => {
  try {
    await mongoose.connect(config.db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("MongoDb is successfully connected");
  } catch (err) {
    console.log(err.message, err.stack);
    //Exit the process with Failure
    process.exit(1);
  }
};

module.exports = connectDB;
