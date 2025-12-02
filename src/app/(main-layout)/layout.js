import Footer from '@/components/footer/Footer';
import Navbar from '@/components/header/Navbar';
import NextAuthProvider from '@/providers/nextAuthProvider';
import React from 'react';

const MainLayout = ({children}) => {
    return (
        <div className="">
            <NextAuthProvider>
            <Navbar />
            <div className='pt-[100px]'>
                {children}
            </div>
            <Footer />
            </NextAuthProvider>
        </div>
    );
};

export default MainLayout;