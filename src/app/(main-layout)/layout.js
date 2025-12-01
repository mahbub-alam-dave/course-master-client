import Footer from '@/components/footer/Footer';
import Navbar from '@/components/header/Navbar';
import React from 'react';

const MainLayout = ({children}) => {
    return (
        <div className="">
            <Navbar />
            <div className=''>
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default MainLayout;