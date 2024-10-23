

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { marked } = require("marked");
const hljs = require("highlight.js");


marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    } else {
      return hljs.highlightAuto(code).value;
    }
  },
  breaks: true, 
});

const app = express();
app.use(cors());
app.use(express.json()); 

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  },
});

const PORT = 5005;

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  
  socket.on("markdown_change", (markdown) => {
    
    const html = marked(markdown);
    
    io.emit("html_update", html);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


app.post("/render", (req, res) => {
  const { markdown } = req.body;
  if (typeof markdown !== "string") {
    return res.status(400).json({ error: "Invalid markdown data" });
  }

  
  const html = marked(markdown);

  res.json({ html });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
