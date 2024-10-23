// backend/index.js

const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { marked } = require('marked');
const hljs = require('highlight.js');

// Configure marked to use highlight.js for code blocks
marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    } else {
      return hljs.highlightAuto(code).value;
    }
  },
  breaks: true, // Enable line breaks as per GitHub Flavored Markdown
});

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust this in production for security
    methods: ['GET', 'POST'],
  },
});

const PORT = 5005;

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for markdown changes from the client
  socket.on('markdown_change', (markdown) => {
    // Convert markdown to HTML
    const html = marked(markdown);
    // Broadcast the HTML to all connected clients except the sender
    io.emit('html_update', html);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
