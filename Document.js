import { useParams } from "react-router-dom";
import Editor from "../components/Editor";
import Toolbar from "../components/Toolbar";

function Document() {
  const { id } = useParams();

  return (
    <div>
      <h2>Document ID: {id}</h2>
      <Toolbar />
      <Editor />
    </div>
  );
}

export default Document;