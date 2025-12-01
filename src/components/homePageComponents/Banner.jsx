import React from 'react';
// https://i.ibb.co/fYrqFYDK/banner-image-three.jpg
// https://i.ibb.co/gbXLMKWS/banner-image.jpg
// https://i.ibb.co/DfhYV1R1/banner-image-two.jpg
const Banner = () => {
    return (
        <div
  className="hero min-h-[75vh] max-w-[1600px] object-center w-full mx-auto rounded-2xl"
  style={{
    backgroundImage:
      "url(https://i.ibb.co/5hQHBxMP/banner-image-four.jpg)",
  }}
>
  <div className="hero-overlay rounded-2xl"></div>
  <div className="hero-content text-neutral-content text-center">
    <div className="max-w-xl">
      <h1 className="mb-5 text-4xl font-bold">Level Up Your Skills with the New Era of Learning</h1>
      <p className="mb-5 text-lg w-full">
        Master the latest technologies and accelerate your career growth. Start your journey today with Course Master, your gateway to industry-ready skills.
      </p>
      <button className="btn bg-white text-blue-500 text-lg">Get Started</button>
    </div>
  </div>
</div>
    );
};

export default Banner;