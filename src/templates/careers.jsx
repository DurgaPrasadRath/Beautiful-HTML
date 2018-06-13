import React from 'react';
import Link from 'gatsby-link';

import image from '../videos/recruit.gif';

import Header from '../components/Header';
import Footer from '../components/Footer';
import JobBox from '../components/JobBox';

export default function Template({ data }) {
  const jobs = data.allMarkdownRemark.edges;

  return (
    <div>
      <Header />
      <div className="careers">

        <div className="grid-rectangle careers-header">
          <div className="extra-large-text">
           Let’s build<br/>something together.
          </div>
        </div>
        <div className="white-section section-large">
          <div className="section-head section-wrapper">
            <div className="section-number">04.1 ∕</div>
            <div>Wanna be a builder?</div>
            <div>___________________</div>
          </div>
          <div className="row">
            <div className="careers-image">
              <img src={image} />
            </div>
            <div className="section-content">
              <div className="section-wrapper">
                <p>At CBRE, Builders get the best of both worlds: the cozy, relaxed life of a startup with the resources and reach of a big company. We tackle meaty, unsolved problems that will reshape a global industry, and we do it from a comfortable office with an unusually lovely, familylike culture.</p>
                <p>Sound good?</p>
                <p><Link to="/about">Read more about what it’s like to work here,</Link> or apply below.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grey-section row">
          <div className="section-wrapper">
            <div className="section-head">
              <div className="section-number">04.2 ∕</div>
              <div>Current Openings</div>
              <div>________________</div>
            </div>
            <div className="jobs-section">
              {jobs.map(job => <JobBox job={job.node} key={job.node.id} />)}
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}

export const pageQuery = graphql`
  query allJobs{
    allMarkdownRemark(filter: { fileAbsolutePath: {regex : "\/careers/"} }) {
      edges{
          node {
            id
            html
            frontmatter {
                title
                url
            }
          }
      }
    }
  }
`;
