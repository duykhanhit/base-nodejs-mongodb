const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log(`Connected to DB: ${conn.connection.host}`.yellow.bold);
  } catch (err) {
    console.log(`Error connectDB: ${err.message}`.red.bold);
  }
};

module.exports = connectDB;
