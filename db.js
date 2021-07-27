
const mongoose = require("mongoose");

const connectDB = async() => {
  try{
      const conn = await mongoose.connect(process.env.DATABASE_URL,
        {
       useNewUrlParser:true,
       useCreateIndex:true,
       useUnifiedTopology:true

      });
      console.log(`MONGO BD CONNECTED: ${conn.connection.host}`.cyan.underline.bold)

  }catch(err){
      console.log(`THERE IS AN ERROR IN CONNECTING TO MONGO DB: ${err}`.red);
     
  }

}

module.exports = connectDB;