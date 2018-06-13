import React from 'react';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';

export default function TeamMember({ member, data }) {
  const { frontmatter } = member;

  return (
    <div className="team-member col-3 col-6-sm">
      <div className="team-member-content">
        <img src={frontmatter.image} alt={frontmatter.title} className="team-member-image" />
        <div className="team-member-profile">
          {frontmatter.name}<br />
          <span className="team-member-job">{frontmatter.job}</span>
        </div>
      </div>
    </div>
  );
}
