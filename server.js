const express = require("express");
const connectDB = require("./config/db");
const xss = require("xss-clean");
const hpp = require("hpp");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const config = require('./config/default')

const app = express();

connectDB();
app.use(express.json({ extended: false }));

const PORT = config.port


const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Tooo many requests from this IP, Please try again",
});

app.use("/api", limiter);

app.use(mongoSanitize());
//Data sanitization against XSS
app.use(xss());
//Protects parameter pollution and solves the error
app.use(hpp({})); //You can use whitelist to use properties that dont wanna use this
//Deine Routes
app.use("/api/v1/user", require("./routes/api/users"));
app.use("/api/v1/auth", require("./routes/api/auth"));
app.use("/api/v1/profile", require("./routes/api/profile"));
app.use("/api/v1/transaction", require("./routes/api/transactions"));

//Serve Static assets in prod

if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () =>
  console.log(`Server Started on port ${PORT} `)
);
