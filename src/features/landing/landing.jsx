import React from 'react';
import LandingNavbar from '../landing/components/landingNavbar';
import Hero from './components/hero';
import Footer from './components/footer';

const Landing = () => {
  return (
    <div>
      <LandingNavbar />
      <div>
        <Hero />
        <Footer />
      </div>

    </div>
  );
};

export default Landing;
