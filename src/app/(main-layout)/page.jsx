import CoursesSection from '@/components/courses/CourseSection';
import Banner from '@/components/homePageComponents/Banner';
import React from 'react';

const Home = () => {
    return (
        <div className='min-h-[60vh] w-full'>
            <Banner />
            <CoursesSection />
        </div>
    );
};

export default Home;