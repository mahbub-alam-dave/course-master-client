import RegisterForm from '@/components/authentication/RegisterForm';
import React from 'react';

const RegisterPage = () => {
    return (
        <div className='grid grid-cols-1 justify-between items-center gap-6 max-w-2xl mx-auto p-4 sm:px-6 lg:px-8 my-16'>
            <div className='background-color rounded-2xl shadow-lg p-6 sm:p-10 lg:p-16'>
                <h2 className='text-2xl md:text-3xl font-bold mb-10 text-color text-center'>
                    Register Now
                </h2>
                <RegisterForm />
            </div>
        </div>
    );
};

export default RegisterPage;