import { motion } from 'framer-motion';
import { Code2, Database, Layout, Server } from 'lucide-react';

const About = () => {
  const skills = [
    { title: "Frontend", icon: <Layout className="w-6 h-6 text-primary" />, desc: "React, Redux, HTML, CSS, Tailwind CSS" },
    { title: "Backend", icon: <Server className="w-6 h-6 text-primary" />, desc: "Node.js, Express.js, REST APIs, JWT" },
    { title: "Database", icon: <Database className="w-6 h-6 text-primary" />, desc: "MongoDB, MySQL, PostgreSQL" },
    { title: "Other", icon: <Code2 className="w-6 h-6 text-primary" />, desc: "JavaScript (ES6+), Java, AWS, Docker, Git" }
  ];

  return (
    <section id="about" className="py-20 bg-background relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex-1 space-y-6 text-lg text-muted-foreground leading-relaxed"
          >
            <p>
              I am a results-driven MERN Stack Developer with over 2.6 years of hands-on experience in building scalable web applications. My expertise lies in designing clean architectures, solving complex problems, and employing Agile methodologies.
            </p>
            <p>
              I specialize in creating production-ready applications with strong emphasis on frontend performance optimization, RESTful API development, cloud deployment, and CI/CD automation. My competitive background as a two-time District Chess Champion and State Runner-Up translates into strong analytical and strategic thinking in software development.
            </p>
          </motion.div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {skills.map((skill, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-white/10 p-6 rounded-2xl hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  {skill.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
                <p className="text-sm text-muted-foreground">{skill.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
