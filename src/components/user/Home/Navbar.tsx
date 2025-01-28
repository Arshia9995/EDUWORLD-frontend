
import React from "react";
import logo from "../../../assets/home/logo.png";
import { Link ,useNavigate} from "react-router-dom";
import {useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { userLogout } from "../../../redux/actions/userActions";
import toast from "react-hot-toast";

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.user)

  const handleLogout = async () => {
    try {
      await dispatch(userLogout()).unwrap();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (err: any) {
      console.error("Logout Error:", err);
      toast.error("Logout failed. Please try again.");
      
    }
  };

  return (
    <div className="bg-white shadow-md">
      {/* Navbar section */}
      <div className="flex justify-between items-center px-6 py-4">
        <div className="text-2xl font-bold text-blue-900 flex items-center space-x-2">
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-16"
          />
          <span>EduWorld</span>
        </div>
        <ul className="flex space-x-6 text-sm font-semibold text-gray-700">
          <li className="hover:text-yellow-400 cursor-pointer">HOME</li>
          {/* <li className="hover:text-yellow-400 cursor-pointer">PAGES</li> */}
          <li className="hover:text-yellow-400 cursor-pointer">COURSES</li>
          {/* <li className="hover:text-yellow-400 cursor-pointer">EVENTS</li> */}
          <li className="hover:text-yellow-400 cursor-pointer">TEACHERS</li>
          <li className="hover:text-yellow-400 cursor-pointer">PRICING</li>
          {/* <li className="hover:text-yellow-400 cursor-pointer">BLOG</li> */} 
          <li className="hover:text-yellow-400 cursor-pointer">CONTACT</li>
        </ul>
        <div className="flex space-x-4">
        

        {user ? (
            <>
              {/* Show Profile and Logout buttons if user is authenticated */}
              {/* <button
                onClick={() => navigate("/profile")}
                className="bg-yellow-400 px-4 py-2 text-black font-semibold rounded hover:bg-yellow-500"
              >
                Profile
              </button> */}
              <button onClick={handleLogout}
                
                className="bg-red-500 px-4 py-2 text-white font-semibold rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
          <button className="bg-yellow-400 px-4 py-2 text-black font-semibold rounded hover:bg-yellow-500">
             <Link to="/login">Login</Link>
          </button>
          <button className="bg-gray-300 px-4 py-2 text-black font-semibold rounded hover:bg-gray-400">
          <Link to="/signup">Register</Link>
          </button>
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

