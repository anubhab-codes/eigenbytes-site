import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function Home(): ReactNode {
  return (
    <Layout title="Eigenbytes" description="Clarity over Articulation. Always.">
      <header className="heroPro">
        <div className="containerPro">
          <h1 className="brandTitle">Eigenbytes</h1>
          <p className="brandTagline">Clarity over Articulation. Always.</p>
        </div>
      </header>

      <main className="containerPro mainPro">
<section className="sectionPro">
  <div className="grid3">
    <div className="cardProStatic">
      <div className="cardTitle">Who I am</div>
      <div className="cardChips">
        <span className="chip">Identity architect</span>
        <span className="chip">Fast learner</span>
        <span className="chip">Team player</span>
      </div>
    </div>

    <div className="cardProStatic">
      <div className="cardTitle">Working on</div>
      <div className="cardChips">
        <span className="chip">Identity</span>
        <span className="chip">DevOps</span>
        <span className="chip">Data science</span>
      </div>
    </div>

    <div className="cardProStatic">
      <div className="cardTitle">Outside Work</div>
      <div className="cardChips">
        <span className="chip">Family</span>
        <span className="chip">Chess</span>
        <span className="chip">Chelsea</span>
      </div>
    </div>
  </div>
</section>
      </main>
    </Layout>
  );
}
