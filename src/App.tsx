import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import AboutTrainer from "@/pages/AboutTrainer";
import Transformations from "@/pages/Transformations";
import Plans from "@/pages/Plans";
import AdminLogin from "@/pages/admin/Login";
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Clients from "@/pages/admin/Clients";
import Leads from "@/pages/admin/Leads";
import Reminders from "@/pages/admin/Reminders";
import AdminTransformations from "@/pages/admin/Transformations";
import AdminAbout from "@/pages/admin/About";
import AdminPlans from "@/pages/admin/Plans";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-trainer" element={<AboutTrainer />} />
        <Route path="/transformations" element={<Transformations />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="leads" element={<Leads />} />
          <Route path="reminders" element={<Reminders />} />
          <Route path="transformations" element={<AdminTransformations />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="plans" element={<AdminPlans />} />
        </Route>
      </Routes>
    </Router>
  );
}
