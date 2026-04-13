import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const createNewDoc = () => {
    const id = Date.now().toString();
    navigate(`/doc/${id}`);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>📄 Collaborative Editor</h1>
      <button onClick={createNewDoc}>Create New Document</button>
    </div>
  );
}

export default Home;