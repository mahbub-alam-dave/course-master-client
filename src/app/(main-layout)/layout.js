import Footer from '@/components/footer/Footer';
import Navbar from '@/components/header/Navbar';
import { AuthProvider } from '@/contexts/AuthContext';
import React from 'react';

const MainLayout = ({children}) => {
    return (
        <div className="">
            <Navbar />
            <div className='pt-[100px]'>
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default MainLayout;