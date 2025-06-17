
// import React from "react";
// import logo from "../../../assets/home/logo.png";
// import { Link ,useNavigate} from "react-router-dom";
// import {useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../../../redux/store";
// import { getInstructorById, userLogout } from "../../../redux/actions/userActions";
// import toast from "react-hot-toast";



// const Navbar: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const { user } = useSelector((state: any) => state.user)
//   const { instructors } = useSelector((state: RootState) => state.admin || { instructors: [] });
//   console.log("User from Navbar:", user);
//   console.log("Instructors from Navbar:", instructors);

//   //  useEffect(() => {
//   //     dispatch(getallInstructors());
//   //   }, [dispatch]);

   

//   const handleLogout = async () => {
//     try {
//       await dispatch(userLogout()).then(() => {
//         toast.success("Logged out successfully!");
//         navigate("/login");
//       })
//     } catch (err: any) {
//       console.error("Logout Error:", err);
//       toast.error("Logout failed. Please try again.");
      
//     }
//   };

//   const handleDashboardClick = async () => {
//     if (user?.role === "instructor") {
//       try {
//         console.log(user)
//         const instructor = await dispatch(getInstructorById(user._id)).unwrap();
//         console.log("haaaaaaaaaaaaai",instructor);
        
//         if (instructor.isApproved) {
//           toast.success("Your request is Approved");
//           navigate("/instructordashboard");
//         } else if (instructor.isRequested) {
//           toast.error("Your request is processing");
//         } else if (instructor.isRejected) {
//           toast.error("Your request is rejected");
//         } else {
//           toast.error("Instructor data not found");
//         }
//       } catch (error) {
//         console.error("Error fetching instructor data:", error);
//         toast.error("Failed to fetch instructor status");
//       }
//     } else {
//       toast.error("You are not authorized to access the dashboard");
//     }
//   };

//   // const handleDashboardClick = () => {
//   //   console.log("Dashboard Click - User:", user, "Instructors:", instructors);
//   //   console.log("User ID:", user?._id, "User Email:", user?.email);
    
//   //   if (user?.role === "instructor") {
//   //     // First log all instructor emails to ensure they match the format expected
//   //     console.log("Available instructor emails:", instructors.map(inst => inst.email));
      
//   //     // Find the current user in the instructors array (using _id or email)
//   //     const currentInstructor = instructors.find(
//   //       (instructor) => 
//   //         (user._id && instructor._id === user._id) || 
//   //         (user.email && instructor.email === user.email)
//   //     );
      
//   //     console.log("Found instructor:", currentInstructor);
      
//   //     if (currentInstructor?.isApproved) {
//   //       toast.success("Your request is Approved")
//   //       navigate("/instructordashboard"); // Navigate to dashboard if approved
//   //     } else if (currentInstructor?.isRequested) {
//   //       toast.error("Your request is processing"); // Show error only if isRequested is true
//   //     } else if (currentInstructor?.isRejected) {
//   //       toast.error("Your request is rejected"); // Show error if rejected
//   //     } else {
//   //       toast.error("Instructor data not found");
//   //     }
//   //   } else {
//   //     toast.error("You are not authorized to access the dashboard");
//   //   }
//   // };

//   const handleStudentDashboardClick = () => {
//     if (user?.role === "student") {
//       navigate("/studentdashboard");
//     } else {
//       toast.error("You are not authorized to access the student dashboard");
//     }
//   };

//   return (
//     <div className="bg-white shadow-md">
    
//       <div className="flex justify-between items-center px-6 py-4">
//         <div className="text-2xl font-bold text-blue-900 flex items-center space-x-2">
//           <img
//             src={logo}
//             alt="Logo"
//             className="h-10 w-16"
//           />
//           <span>EduWorld</span>
//         </div>
//         <ul className="flex space-x-6 text-sm font-semibold text-gray-700">
//         <li className="hover:text-yellow-400 cursor-pointer">
//   <Link to="/">HOME</Link>
// </li>
//           {/* <li className="hover:text-yellow-400 cursor-pointer">PAGES</li> */}
//           {/* <li className="hover:text-yellow-400 cursor-pointer">COURSES</li> */}
//           {/* <li className="hover:text-yellow-400 cursor-pointer">EVENTS</li> */}
//           {/* <li className="hover:text-yellow-400 cursor-pointer">TEACHERS</li>
//           <li className="hover:text-yellow-400 cursor-pointer">PRICING</li> */}
//           {/* <li className="hover:text-yellow-400 cursor-pointer">BLOG</li> */} 
//           {/* <li className="hover:text-yellow-400 cursor-pointer">CONTACT</li> */}
//         </ul>
//         <div className="flex space-x-4">
        

//         {user ? (

          
//             <>
//             {/* Show Dashboard button if user is an instructor */}
//             {user.role === "instructor" && (
//                 <button
//                 onClick={handleDashboardClick}
//                   className="bg-blue-900 px-4 py-2 text-white font-semibold rounded hover:bg-blue-950"
//                 >
//                   Dashboard
//                 </button>
//               )}
//               {/* Show Student Dashboard button if user is a student */}
//               {user.role === "student" && (
//                 <button
//                   onClick={handleStudentDashboardClick}
//                   className="bg-blue-900 px-4 py-2 text-white font-semibold rounded hover:bg-blue-950"
//                 >
//                   Student Dashboard
//                 </button>
//               )}

//               {/* Show Profile and Logout buttons if user is authenticated */}
//               <button
//                 onClick={() => navigate("/profile")}
//                 className="bg-yellow-400 px-4 py-2 text-black font-semibold rounded hover:bg-yellow-500"
//               >
//                 Profile
//               </button>
//               <button onClick={handleLogout}
                
//                 className="bg-red-500 px-4 py-2 text-white font-semibold rounded hover:bg-red-600"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//           <button className="bg-yellow-400 px-4 py-2 text-black font-semibold rounded hover:bg-yellow-500">
//              <Link to="/login">Login</Link>
//           </button>
//           <button className="bg-gray-300 px-4 py-2 text-black font-semibold rounded hover:bg-gray-400">
//           <Link to="/signup">Register</Link>
//           </button>
//           </>
//         )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;




import React from "react";
import logo from "../../../assets/home/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { getInstructorById, userLogout } from "../../../redux/actions/userActions";
import toast from "react-hot-toast";

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.user);
  const { instructors } = useSelector((state: RootState) => state.admin || { instructors: [] });
  console.log("User from Navbar:", user);
  console.log("Instructors from Navbar:", instructors);

  const handleLogout = async () => {
    try {
      await dispatch(userLogout()).then(() => {
        toast.success("Logged out successfully!");
        navigate("/login");
      });
    } catch (err: any) {
      console.error("Logout Error:", err);
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleDashboardClick = async () => {
    if (user?.role === "instructor") {
      try {
        console.log(user);
        const instructor = await dispatch(getInstructorById(user._id)).unwrap();
        console.log("haaaaaaaaaaaaai", instructor);
        
        if (instructor.isApproved) {
          toast.success("Your request is Approved");
          navigate("/instructordashboard");
        } else if (instructor.isRequested) {
          toast.error("Your request is processing");
        } else if (instructor.isRejected) {
          toast.error("Your request is rejected");
        } else {
          toast.error("Instructor data not found");
        }
      } catch (error) {
        console.error("Error fetching instructor data:", error);
        toast.error("Failed to fetch instructor status");
      }
    } else {
      toast.error("You are not authorized to access the dashboard");
    }
  };

  const handleStudentDashboardClick = () => {
    if (user?.role === "student") {
      navigate("/studentdashboard");
    } else {
      toast.error("You are not authorized to access the student dashboard");
    }
  };

  return (
    <div className="bg-white shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="text-2xl font-bold text-blue-900 flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-10 w-16" />
          <span>EduWorld</span>
        </div>
        <div className="flex space-x-4 items-center">
          <Link
            to="/"
            className="text-sm font-semibold text-gray-700 hover:text-yellow-400 cursor-pointer"
          >
            HOME
          </Link>
          {user ? (
            <>
              {user.role === "instructor" && (
                <button
                  onClick={handleDashboardClick}
                  className="bg-blue-900 px-4 py-2 text-white font-semibold rounded hover:bg-blue-950"
                >
                  Dashboard
                </button>
              )}
              {user.role === "student" && (
                <button
                  onClick={handleStudentDashboardClick}
                  className="bg-blue-900 px-4 py-2 text-white font-semibold rounded hover:bg-blue-950"
                >
                  Student Dashboard
                </button>
              )}
              <button
                onClick={() => navigate("/profile")}
                className="bg-yellow-400 px-4 py-2 text-black font-semibold rounded hover:bg-yellow-500"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
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