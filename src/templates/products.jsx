import React from 'react';
import Link from 'gatsby-link';

import image_spacer from '../images/spacer.jpg';
import image_plans from '../images/plans.png';
import image_build3d from '../images/build3d.png';

import video_plans from '../videos/plans.mp4';
import video_build3d from '../videos/build3d.mp4';

import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductSectionBox from '../components/ProductSectionBox';

// blocks
const productSections = [{
  title: 'Spacer',
  text: 'Built in collaboration with CBRE’s Workplace team, Spacer is a tool that helps companies learn how much office space they need, and how to break up that space. By answering a short series of questions about their company’s unique goals and priorities, users match with an office profile that summarizes their company’s characteristics. This profile is the basis for a custom space program with square footage recommendations and a visualization of every desk, office and conference room.',
  image: image_spacer,
  linkText: 'Try Spacer →',
  link: 'https://workplace.cbre.com/'
}, {
  title: 'Plans',
  text: 'Plans makes floor planning easy for everyone, not just architects. Brokers use it to help tenants determine whether they’ll fit in a given space, or to show tenants the different possibilities a space offers for layout and efficiency. When a plan is complete, one click turns it into an interactive 3D walkthrough.',
  image: image_plans,
  video: video_plans,
  linkText: 'Try Plans →' ,
  link: 'https://floored.cbre.io/#plans'
}, {
  title: 'Build 3D',
  text: 'Build 3D is a service wherein our team of artists creates highly customized online models of real estate projects. It allows anyone with a browser (and a reasonably powerful computer) to explore a space in interactive 3D. It’s powered by our homemade 3D engine and a physically-based renderer we built from scratch.',
  image: image_build3d,
  video: video_build3d,
  linkText: 'Try Build →',
  link: 'https://floored.cbre.io/#build'
}];


export default function Template({ data }) {

  return (
    <div className="products">
      <Header />
      <div className="white-section section-large">
        <div className="section-wrapper">
         <div className="section-head section-wrapper">
            <div className="section-number">02 ∕</div>
            <div>Our Products</div>
            <div>____________</div>
          </div>
          { productSections.map((section, index) => <ProductSectionBox section={section} key={index} order={index} />)}
        </div>
      </div>
      <Footer />
    </div>
  );

}