const config = require("./config/index");
const express = require("express");
const cors = require("cors");
const spotifyRouter = require('./routes/index'); 
const cookieParser = require("cookie-parser");
const exphbs = require('express-handlebars')

const app = express();
app.set("port", config.port || 8888);

app.use(cors());
app.use(cookieParser());
app.use('/', spotifyRouter); 

app.listen(app.get("port"), () => {
  console.log("server on port", app.get("port"));
});
