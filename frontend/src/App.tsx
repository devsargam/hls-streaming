import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Home from "./screens/home";
import Upload from "./screens/upload";

export default function App() {
  console.log("hello world");
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/uplaod">Upload</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/uplaod" element={<Upload />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}
