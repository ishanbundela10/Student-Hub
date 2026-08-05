import StudentDashboard from "@/components/dashboards/StudentDashboard";
import OwnerDashboard from "@/components/dashboards/OwnerDashboard";
import TiffinDashboard from "@/components/dashboards/TiffinDashboard";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const auth = useContext(AuthContext);

  if (!auth) {
    return null;
  }
  const { user, loading } = auth

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  switch (user.role) {
    case "student":
      return <StudentDashboard />;
    case "owner":
      return <OwnerDashboard />;
    case "food_service":
      return <TiffinDashboard />;
    default:
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <p className="text-lg text-gray-600">Your role is not recognized. Please contact support.</p>
        </div>
      );
  }
}