import React from 'react';
import LandingNavbar from '../landing/components/landingNavbar';
import Hero from './components/hero';
import Footer from './components/Footer';

const Landing = () => {
  return (
    <div>
      <LandingNavbar />
      <Hero/>
      <Footer/>
    </div>
  );
};

export default Landing;
