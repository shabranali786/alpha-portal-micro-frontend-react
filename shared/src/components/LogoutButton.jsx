import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LogoutButton({ className = "" }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <button
      onClick={handleLogout}
      className={`rounded-lg px-3 py-2 text-sm bg-white/10 hover:bg-white/20 border border-white/10 ${className}`}
    >
      Logout
    </button>
  );
}
