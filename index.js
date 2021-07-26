const express = require("express");
const mongoose = require("mongoose");
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require("./config/config");
const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");
const session = require("express-session");
const redis = require("redis");
let RedisStore = require("connect-redis")(session);
let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT,
});
const app = express();

// mongodb://username:password@host:port/database?options...
// get ip address: - manually from docker inspect [container name]
// - add name of the service - method using dns ( dns is built in docker, applicable just for own created networks )

const mongoURL =  `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connectWithRetry = () => {
    mongoose.connect( mongoURL, 
        { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(() => console.log('connected to DB'))
    .catch((err) => {
        console.log('error connection: ', err)
        setTimeout(connectWithRetry, 5000);
    });
}

connectWithRetry();

// app.use(session({
//     store: new RedisStore({ client: redisClient }),
//     secret: SESSION_SECRET,
//     cookie: {
//         secure: false,
//         // resave: false,
//         // saveUninitialized: false,
//         httpOnly: true,
//         maxAge: 1000 * 60, // 1 hour in miliseconds - 1000 * 60 * 60
//     }
// }));

app.use(express.json());

app.get("/api/v1", (req, res) => {
    res.send("<h2>Hi hello4</h2>");
});

// specify "api" in case that both front-end and back-end are hosted on same domain
// specify version in case that new version is coming/available and you want too run / work with them side by side
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));