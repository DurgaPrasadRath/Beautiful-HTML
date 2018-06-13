import React from 'react';
import Link from 'gatsby-link';

import image_best from '../images/best.png';
import image_impact from '../images/impact.png';
import image_unsolved from '../images/unsolved.png';
import image_food from '../images/food.png';
import image_diversity from '../images/diversity.png';
import image_culture from '../images/culture.png';
import image_balance from '../images/balance.png';

import video_best_mp4 from '../videos/best.mp4';
import video_impact_mp4 from '../videos/impact.mp4';
import video_food_mp4 from '../videos/food.mp4';
import video_diversity_mp4 from '../videos/diversity.mp4';
import video_culture_mp4 from '../videos/culture.mp4';
import video_balance_mp4 from '../videos/balance.mp4';

import video_best_webm from '../videos/best.webm';
import video_impact_webm from '../videos/impact.webm';
import video_food_webm from '../videos/food.webm';
import video_diversity_webm from '../videos/diversity.webm';
import video_culture_webm from '../videos/culture.webm';
import video_balance_webm from '../videos/balance.webm';

import Header from '../components/Header';
import AboutHeader from '../components/AboutHeader';
import Footer from '../components/Footer';
import TeamMember from '../components/TeamMember';
import AboutSectionBox from '../components/AboutSectionBox';

// blocks for 'Why we like working here'
const whyWeLikeWorkingSections = [{
  title: 'Best of both worlds',
  text: 'As a startup acquired by a huge company, we have a uniquely great situation: the cozy, hands-on work culture of the former with the resources and reach of the latter. We’re a small team, but we can draw on troves of global data and spin up a massive machine to multiply our impact. It’s a dynamic that just doesn’t exist in too many other places. ',
  image: image_best,
  video_mp4: video_best_mp4,
  video_webm: video_best_webm,
}, {
  title: 'Huge impact',
  text: 'As CBRE’s in-house software team, our mission is to use technology to change how the company does business. And because CBRE is the biggest player in its arena, if we succeed, we’ll have reinvented a massive, global industry.',
  image: image_impact,
  video_mp4: video_impact_mp4,
  video_webm: video_impact_webm,
}, {
  title: 'Unsolved problems',
  text: 'Real estate is a tech-starved industry rife with fresh challenges. That means there are interesting, meaty problems to solve. Working here is an opportunity to tackle the fun stuff — not to optimize solutions someone else built.',
  image: image_unsolved
}, {
  title: 'Food & drink',
  text: 'They’re a lynchpin of startup life, and yep, we’ve got em. We do healthy catered lunches twice a week and a snacky, kinda-less-healthy happy hour on Fridays. As for coffee, we roast our own espresso beans right in the office.',
  image: image_food,
  video_mp4: video_food_mp4,
  video_webm: video_food_webm,
}];

// blocks for 'What we care about'
const whatWeCareAboutSections = [{
  title: 'Diversity',
  text: 'When trying to solve hard problems, homogeneity of approach simply doesn’t yield results. So we celebrate our differences as vital tools to our success. We want our team to reflect our city, and we’re doing pretty well: half the team are women (yes, even the engineers)!',
  image: image_diversity,
  video_mp4: video_diversity_mp4,
  video_webm: video_diversity_webm,
}, {
  title: 'Culture',
  text: 'As of this writing, we have two book clubs (fiction and non), a softball team, digital painting club, and a volleyball team; a sales gong (and our top seller’s 4-foot-high head on the wall); outings to Animation Night; and board game night and in-office movie night (with themed cocktails). And that’s just the stuff we’ve organized ourselves, bottom-up, because we genuinely like hanging out. There are work-planned activities too: team trips to escape the room, paint-and-sip or glaze-and-sip, and surf lessons. And as you can imagine, the lightness of mood flows productively into our everyday office spirit.',
  image: image_culture,
  video_mp4: video_culture_mp4,
  video_webm: video_culture_webm,
}, {
  title: 'Work-life balance',
  text: 'You know why you always have your best ideas in the shower? Because when you’re at ease, you can use your brain’s full bandwidth. That’s the guiding principle of our office policies. We’ll let you take care of life so you can do your best work — and we’ll make sure that when you’re working, you’ll love your team and workspace.',
  image: image_balance,
  video_mp4: video_balance_mp4,
  video_webm: video_balance_webm,
}];

export default function Template({ data }) {
  const members = data.allMarkdownRemark.edges;

  return (
    <div>
      <Header />
      <AboutHeader />
      <div className="white-section section-large">
        <div className="section-wrapper">
          <div className="section-head">
            <div className="section-number">01.1&#8198;&#8725;</div>
            <div>Why we like working here</div>
            <div>_______________________</div>
          </div>
          { whyWeLikeWorkingSections.map((section, index) => <AboutSectionBox section={section} key={index} order={index} />)}
        </div>
      </div>

      <div className="grey-section">
        <div className="section-wrapper">
          <div className="section-head">
            <div className="section-number">01.2&#8198;&#8725;</div>
            <div>What we care about</div>
            <div>__________________</div>
          </div>
          { whatWeCareAboutSections.map((section, index) => <AboutSectionBox section={section} key={index} order={index} />)}
        </div>
      </div>

      <div className="dark-grey-section">
        <div className="section-wrapper">
          <div className="section-head">
            <div className="section-number">01.3&#8198;&#8725;</div>
            <div>Meet the Builders</div>
            <div>____________</div>
          </div>
          <div className="row">
            {members.map(member => <TeamMember member={member.node} key={member.id} />)}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export const pageQuery = graphql`
  query allTeamMembers{
    allMarkdownRemark(filter: { fileAbsolutePath: {regex : "\/members/"} },) {
      edges{
          node {
            id
            html
            frontmatter {
              name
              job
              order
              image
            }
          }
      }
    }
  }
`;
