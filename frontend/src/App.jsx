import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./router/PrivateRoute";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Home from "./screens/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
