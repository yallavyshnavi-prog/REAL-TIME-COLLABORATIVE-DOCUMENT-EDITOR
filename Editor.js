import { useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:5000";
const socket = io(SERVER_URL);

function Editor() {
  const [quill, setQuill] = useState();

  useEffect(() => {
    const editor = document.createElement("div");
    editor.style.height = "500px";
    document.getElementById("container").append(editor);

    const q = new Quill(editor, { theme: "snow" });

    q.disable();
    q.setText("Loading...");
    setQuill(q);
  }, []);

  useEffect(() => {
    if (!quill) return;

    const docId = "demo-doc";
    socket.emit("get-document", docId);

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });
  }, [quill]);

  useEffect(() => {
    if (!quill) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", handler);

    return () => quill.off("text-change", handler);
  }, [quill]);

  useEffect(() => {
    if (!quill) return;

    socket.on("receive-changes", (delta) => {
      quill.updateContents(delta);
    });
  }, [quill]);

  useEffect(() => {
    if (!quill) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, 2000);

    return () => clearInterval(interval);
  }, [quill]);

  return <div id="container"></div>;
}

export default Editor;