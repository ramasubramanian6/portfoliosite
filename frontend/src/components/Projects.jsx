import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

const Projects = () => {
  const projects = [
    {
      title: "MERN-Based E-Commerce Application",
      description: "A full-featured e-commerce web application with user authentication, product management, cart functionality, and order processing.",
      tech: ["MongoDB", "Express.js", "React", "Node.js", "Docker"],
      features: [
        "Integrated backend APIs with frontend components",
        "Optimized database queries for better performance",
        "Deployed using Docker and cloud infrastructure"
      ]
    }
  ];

  return (
    <section id="projects" className="py-20 bg-background relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-colors group"
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-muted-foreground mb-6 line-clamp-3">
                  {project.description}
                </p>
                <div className="mb-6 space-y-2">
                  <h4 className="text-sm font-semibold text-white/80">Key Features:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {project.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tech.map((t, i) => (
                    <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a href="#" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                    <Github className="w-4 h-4" /> Code
                  </a>
                  <a href="#" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                    <ExternalLink className="w-4 h-4" /> Live Demo
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
