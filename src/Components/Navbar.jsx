import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";
  const isSeller = user?.role === "seller";
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md text-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-extrabold text-blue-600 tracking-wide"
        >
          🛒 E-Comm
        </Link>

        <div className="flex space-x-6 items-center text-gray-700 font-medium">
          <Link to="/" className="hover:text-blue-600 transition">
            Home
          </Link>

          {isAdmin && (
            <Link to="/admin" className="hover:text-blue-600 transition">
              Admin Panel
            </Link>
          )}

          {isSeller && (
            <Link to="/seller" className="hover:text-green-600 transition">
              Seller Dashboard
            </Link>
          )}

          {!isAdmin && !isSeller && (
            <>
              <Link to="/products" className="hover:text-blue-600 transition">
                Products
              </Link>
              <Link to="/cart" className="hover:text-blue-600 transition">
                Cart
              </Link>
              <Link to="/wishlist" className="hover:text-pink-600 transition">
                Wishlist
              </Link>
            </>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-600 transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-blue-600 transition">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
