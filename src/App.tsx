import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

// Lazy load pages
const Home = lazy(() => import("@/pages/Home"));
const AboutTrainer = lazy(() => import("@/pages/AboutTrainer"));
const Transformations = lazy(() => import("@/pages/Transformations"));
const Plans = lazy(() => import("@/pages/Plans"));
const AdminLogin = lazy(() => import("@/pages/admin/Login"));
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const Clients = lazy(() => import("@/pages/admin/Clients"));
const Leads = lazy(() => import("@/pages/admin/Leads"));
const Reminders = lazy(() => import("@/pages/admin/Reminders"));
const AdminTransformations = lazy(() => import("@/pages/admin/Transformations"));
const AdminAbout = lazy(() => import("@/pages/admin/About"));
const AdminPlans = lazy(() => import("@/pages/admin/Plans"));
const AdminHero = lazy(() => import("@/pages/admin/Hero"));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
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
            <Route path="hero" element={<AdminHero />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}
