const mongoose = require("mongoose");
require("dotenv").config();
const password = process.env.MONGOOSE_PASSWORD;
const connectDB = async () => {
  await mongoose.connect(
    `mongodb+srv://prajeetshahlac:mHgkISJddgd0MuvW@nodejs.6cpxm.mongodb.net/devTinder?retryWrites=true&w=majority&appName=Nodejs`
  );
};

module.exports = connectDB;
