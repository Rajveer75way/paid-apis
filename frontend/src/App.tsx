import { Route, Routes } from "react-router-dom";
import Basic from "./layouts/Basic";
import LoginPage from "./pages/login";
import Home from "./pages/home";
import SignUpPage from "./pages/signup";
import PlanManagement from "./pages/plan-management";
import ApiManagement from "./components/ApiManagement";
import ApiRequest from "./pages/api-request";
import PlanSubscribeForm from "./pages/plan-subscribe";
import Profile from "./pages/profile";
import User from "./components/User";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route element={<Basic />} >
      <Route path="/" element={<User />} />
      <Route path="/plan" element={<PlanManagement />} />
      <Route path="/api" element={<ApiManagement />} />
      <Route path="/api-request" element={<ApiRequest />} />
      <Route path="/subscription" element={<PlanSubscribeForm />} />
      <Route path="/profile" element={<Profile />} />
      </Route >
    </Routes>
  );
}

export default App;
