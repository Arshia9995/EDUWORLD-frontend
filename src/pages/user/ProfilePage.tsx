import React, {useEffect} from "react";
import { useDispatch } from "react-redux";
import Profile from "../../components/user/Profile";
import Navbar from "../../components/user/Home/Navbar";
import { getallInstructors } from "../../redux/actions/adminActions";
import { AppDispatch } from "../../redux/store";



const ProfilePage: React.FC = () => {

    const dispatch =useDispatch<AppDispatch>();

    // useEffect(() => {
    //     dispatch(getallInstructors());
    //   }, [dispatch]);

    return (
        <div className="min-h-screen bg-gray-50">
         <Navbar />
          <Profile /> 
        </div>
    );

};

export default ProfilePage;
