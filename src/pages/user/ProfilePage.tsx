import React from "react";
import Profile from "../../components/user/Profile";
import Navbar from "../../components/user/Home/Navbar";




const ProfilePage: React.FC = () => {

    

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
