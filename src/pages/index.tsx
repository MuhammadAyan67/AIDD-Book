import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className={clsx("button button--secondary button--lg ", styles.blackText)}
            to="/docs/intro">
            Start Reading the Book 🚀
          </Link>
        </div>
      </div>
    </header>
  );
}

// Custom sections for the homepage
function HomepageContent() {
  return (
    <section className={styles.homepageContent}>
      <div className="container">
        <div className="row">
          <div className={clsx('col col--6')}>
            <Heading as="h2">What You'll Learn</Heading>
            <p>
              Dive deep into the world of Physical AI and Humanoid Robotics.
              This book covers everything from fundamental physics simulations
              to advanced AI-driven navigation and human-robot interaction.
            </p>
            <ul>
              <li>Physics-accurate simulations with Gazebo and Unity.</li>
              <li>AI perception and navigation using NVIDIA Isaac™ and ROS 2.</li>
              <li>Building intelligent RAG chatbots for contextual information retrieval.</li>
              <li>Practical insights for developing autonomous humanoid robots.</li>
            </ul>
          </div>
          <div className={clsx('col col--6')}>
            <Heading as="h2">Who This Book Is For</Heading>
            <p>
              This book is crafted for advanced AI and robotics students,
              researchers, and engineers looking to gain practical, system-level
              understanding and implementation skills in AI-Native development
              for robotics.
            </p>
            <p>
              A solid foundation in programming and basic AI/robotics concepts
              is recommended.
            </p>
          </div>
        </div>
        <div className="margin-top--lg">
          {/* <HomepageFeatures /> This can be adapted or replaced with more custom components */}
        </div>
        <BookModules /> {/* New BookModules component added here */}
      </div>
    </section>
  );
}

type BookModuleItem = {
  title: string;
  description: string;
  link: string;
};

const BookModulesList: BookModuleItem[] = [
  {
    title: 'Module 1: Foundations of Physical AI',
    description: 'Explore the fundamental concepts and principles underlying Physical AI and intelligent robotics systems.',
    link: '/docs/module1/chapter1',
  },
  {
    title: 'Module 2: The Digital Twin (Gazebo & Unity)',
    description: 'Learn to build physics-accurate simulations and high-fidelity human-robot interaction scenarios using Gazebo and Unity.',
    link: '/docs/module2/chapter1',
  },  {
    title: 'Module 3: The AI-Robot Brain (NVIDIA Isaac™)',
    description: 'Dive into advanced perception, navigation, and training for humanoids with NVIDIA Isaac Sim, Isaac ROS Perception, and Nav2.',
    link: '/docs/module3/chapter1',
  },
  {
    title: 'Module 4: Voice-to-Action with LLMs',
    description: 'Discover how to enable robots to understand and execute commands using Large Language Models and voice interfaces.',
    link: '/docs/module4/chapter1',
  },
];

function BookModules() {
  return (
    <section className={styles.bookModules}>
      <div className="container">
        <Heading as="h2" className="text--center">Book Modules</Heading>
        <div className="row">
          {BookModulesList.map((item, idx) => (
            <div key={idx} className={clsx('col col--4', styles.bookModuleItem)}>
              <Link to={item.link}>
                <h3>{item.title}</h3>
              </Link>
              <p>{item.description}</p>
              <Link className={clsx('button button--primary', styles.bookModuleButton)} to={"/docs/intro"}>
                Read Module
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Home from ${siteConfig.title}`}
      description="An AI-Native Book on Physical AI & Humanoid Robotics with RAG Chatbot">
      <HomepageHeader />
      <main>
        <HomepageContent />
      </main>
    </Layout>
  );
}