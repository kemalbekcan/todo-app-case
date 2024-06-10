const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require('cors')
const connectDB = require("./lib/connect");
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const logRequest = require('./middlewares/logger');
const app = express();
const port = 3000;

connectDB();

app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(logRequest);

app.use('/user', userRouter);
app.use('/task', taskRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
