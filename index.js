const config = require("./config/index");
const express = require("express");
const cors = require("cors");
const path = require('path'); 
const spotifyRouter = require('./routes/index'); 
const cookieParser = require("cookie-parser");
const exphbs = require('express-handlebars')


const app = express();


app.set('views', path.join(__dirname, 'views')); 
app.use(express.static(path.resolve(__dirname, 'public'))); 
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
})); 
app.set('view engine', '.hbs'); 

app.set("port", config.port || 8888);
app.use(cors());
app.use(cookieParser());
app.use('/', spotifyRouter); 


app.listen(app.get("port"), () => {
  console.log("server on port", app.get("port"));
});
