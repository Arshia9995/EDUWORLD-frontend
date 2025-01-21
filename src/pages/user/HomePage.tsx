import React from "react";
import Navbar from "../../components/user/Home/Navbar";
import HeroSection from "../../components/user/Home/HeroSection";
import Features from "../../components/user/Home/Features";
import Courses from "../../components/user/Home/Courses";
import Testimonials from "../../components/user/Home/Testimonials";
import Footer from "../../components/user/Home/Footer";


const HomePage: React.FC = () => {
    return (
        <div>
            <Navbar />
            <HeroSection />
            <Features />
            <Courses />
            <Testimonials />
            <Footer />
        </div>
    );

};

export default HomePage;