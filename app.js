const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const app = express();
// For Socket.IO Imports
const { Server } = require("socket.io");
const http = require("http").createServer(app);

app.use(express.json());
app.use(cors());

// Socket IO Methods and configuration
const io = new Server(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (server) => {
  console.log("User connected");
  server.on("msg", (msg) => {
    console.log(" msg is here ", msg);
    io.emit("messages", msg);
  });
});
// ---------------------------------------------------------->

const authRoutes = require("./routes/auth");
const classroomRoutes = require("./routes/classroom");
const courseRoutes = require("./routes/course");
const resourceRoutes = require("./routes/resource");
const forumRoutes = require("./routes/forum");
const browseRoutes = require("./routes/browse");
const UploadFile = require('./routes/uploadFile')

app.use("/auth", authRoutes);
app.use("/classes", classroomRoutes);
app.use("/courses", courseRoutes);
app.use("/resources", resourceRoutes);
app.use("/forum", forumRoutes);
app.use("/browse", browseRoutes);
app.use('/uploadFile',UploadFile)

// Sending Files Or Serving Files API
app.get('/public/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '\Uploads', filename);
  res.download(filePath, (err) => {
    if (err) {
      // Handle file not found or other errors
      res.status(404).send('File not found');
    }
  });
});


app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.statusCode = 404;
  next(err);
});
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message;
  res.status(status).json({ message: message });
});

// Mongoose Connectivity

mongoose
  .connect(
    "mongodb+srv://admin:987654321@cluster0.edmu2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
  .then((result) => {

    http.listen(5000, () => {
      console.log("Server has started on Port ", 5000);
    });
  })
  .catch((err) => {
    console.log(err);
  });
