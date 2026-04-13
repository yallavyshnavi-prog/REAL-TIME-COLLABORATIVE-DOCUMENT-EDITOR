import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Document from "./pages/Document";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home />} />

          {/* Document Editor Page */}
          <Route path="/doc/:id" element={<Document />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;