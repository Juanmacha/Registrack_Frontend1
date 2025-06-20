import React from 'react';
import LandingNavbar from '../landing/components/landingNavbar';
import Hero from './components/hero';
import Specialties from './components/specialties';
import Services from './components/services';
import Footer from './components/Footer';

const Landing = () => {
  return (
    <div>
      <LandingNavbar />
      <Hero/>
      <Specialties/>
      <Services/>
      <Footer/>
    </div>
  );
};

export default Landing;
