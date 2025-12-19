
import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HeroSection() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <div className="hero-section">
      <div className="container">
        <Heading as="h1">{siteConfig.title}</Heading>
        <p>{siteConfig.tagline}</p>
        <Link className="button-primary" to="/docs/intro">
          Start Reading →
        </Link>
      </div>
    </div>
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
  },
  {
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
    <section className="modules-section">
      <div className="container">
        <Heading as="h2" className="text--center">Book Modules</Heading>
        <div className="row">
          {BookModulesList.map((item, idx) => (
            <div key={idx} className="col col--6 margin-bottom--lg">
              <div className="module-card">
                <Heading as="h3">{item.title}</Heading>
                <p>{item.description}</p>
                <Link className="button-primary" to={item.link}>
                  Read Module
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Home from ${siteConfig.title}`}
      description="An AI-Native Book on Physical AI & Humanoid Robotics with RAG Chatbot"
    >
      <HeroSection />
      <main>
        <BookModules />
      </main>
    </Layout>
  );
}