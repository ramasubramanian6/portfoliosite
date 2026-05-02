import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import About from '../components/About';
import Experience from '../components/Experience';
import Projects from '../components/Projects';
import Contact from '../components/Contact';

const Home = () => {
  return (
    <div className="w-full">
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Contact />
    </div>
  );
};

export default Home;
