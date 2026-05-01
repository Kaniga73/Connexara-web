import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CollegeDetails from "./pages/CollegeDetails";
import ViewDetails from "./pages/ViewDetails";
import AddDept from "./pages/AddDept";
import HodDetails from "./pages/HodDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/college-details" element={<CollegeDetails />} />
        <Route path="/view-details/:id" element={<ViewDetails />} />
        <Route path="/add-dept" element={<AddDept />} />
        <Route path="/hod-details" element={<HodDetails />} />
      </Routes>
    </BrowserRouter>
  );
}