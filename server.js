const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");

const Document = require("./models/Document");

const app = express();
app.use(cors());

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// ✅ MongoDB Connection (FIXED)
mongoose.connect("mongodb://127.0.0.1:27017/docs")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

// 🔄 Socket.IO Logic
io.on("connection", (socket) => {
  console.log("🟢 New user connected");

  socket.on("get-document", async (docId) => {
    // Get or create document
    let document = await findOrCreateDocument(docId);

    // Join room
    socket.join(docId);

    // Send document to client
    socket.emit("load-document", document.data);

    // Receive changes and broadcast
    socket.on("send-changes", (delta) => {
      socket.to(docId).emit("receive-changes", delta);
    });

    // Save document
    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(docId, { data });
    });
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected");
  });
});

// 📌 Helper function
async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await Document.findById(id);
  if (document) return document;

  return await Document.create({ _id: id, data: "" });
}

// Start server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});