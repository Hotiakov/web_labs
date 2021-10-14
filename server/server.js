const express = require("express");

const path = require("path");
const routerIndex = require("./routes/routerIndex"); 
const routerBooks = require("./routes/routerBooks");
const routerBookItem = require('./routes/routerBookItem');


const app = express();
app.use('/public', express.static(__dirname + '/public'));
app.set("view engine", "pug");
app.set("views", __dirname + `/views`);
app.use(express.json());


app.use('/', routerIndex);
app.use('/booksList', routerBooks);
app.use('/booksList', routerBookItem);

app.listen(3000);