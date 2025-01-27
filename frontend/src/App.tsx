import { Route, Routes } from "react-router-dom";
import Basic from "./layouts/Basic";
import LoginPage from "./pages/login";
import Home from "./pages/home";
import SignUpPage from "./pages/signup";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route element={<Basic />} >
      <Route path="/" element={<Home />} />

      </Route >
    </Routes>
  );
}

export default App;
