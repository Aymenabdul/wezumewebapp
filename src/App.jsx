import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import BaseLayout from "./layouts/BaseLayout";
import Dashboard from "./pages/Dashboard";
import Videos from "./pages/Videos";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<BaseLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="videos" element={<Videos />} />
          {/* <Route index element={<Navigate to="dashboard" replace />} /> */}
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}