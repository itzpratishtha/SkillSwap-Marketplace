import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import Layout
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

// Import Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import CheckInbox from "./pages/auth/CheckInbox";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/profile/Profile";
import Explore from "./pages/explore/Explore";
import MentorProfile from "./pages/mentor/MentorProfile";
import Requests from "./pages/requests/Requests";
import Sessions from "./pages/sessions/Sessions";
import MessagePage from "./pages/messages/MessagePage";
import Wallet from "./pages/wallet/Wallet";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public / Landing Route */}
        <Route path="/" element={<div>Landing Page</div>} />

        {/* 🔐 Auth Nested Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />}/>
          <Route path="/check-inbox" element={<CheckInbox />} />
        </Route>
        <Route element={<ProtectedRoute />}>

    <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/profile" element={<Profile />} />
        <Route path="/explore" element={<Explore/>} />
        <Route path="/user/:id" element={<MentorProfile/>}/>
        <Route path="/requests" element={<Requests />} />
        <Route path="/sessions" element={<Sessions/>}/>
        <Route path="/messages/:requestId" element={<MessagePage />}/>
        <Route path="/wallet" element={<Wallet />}/>
    </Route>

</Route>

        {/* Fallback 404 Route */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}