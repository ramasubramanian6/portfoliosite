import { motion } from 'framer-motion';
import { ExternalLink, Tag } from 'lucide-react';

const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const projects = [
  {
    title: 'MERN E-Commerce Platform',
    description: 'A full-featured e-commerce web application with user authentication, product management, cart functionality, order processing, and admin dashboard.',
    tech: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Docker', 'JWT'],
    features: [
      'JWT-based authentication with role-based access control',
      'Real-time cart and order management',
      'Dockerized and deployed on AWS EC2',
      'MongoDB aggregation pipelines for analytics',
    ],
    gradient: 'from-blue-600 to-cyan-600',
    github: '#',
    live: '#',
  },
  {
    title: 'HIG AI Automation Portal',
    description: 'Enterprise workflow automation portal supporting real-world business processes, built with MERN stack and deployed on Google Cloud Platform.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'GCP', 'CI/CD', 'GitHub Actions'],
    features: [
      'RESTful APIs with Express.js and JWT security',
      'PostgreSQL data models for high query efficiency',
      'Automated CI/CD pipeline reducing deployment time',
      'Responsive React UI with performance optimization',
    ],
    gradient: 'from-violet-600 to-purple-600',
    github: '#',
    live: '#',
  },
  {
    title: 'Portfolio & Friend Vault',
    description: 'This very website — a professional portfolio with a secure Friend Vault for managing personal contacts, documents (PDF storage), and emergency alerts.',
    tech: ['React', 'Node.js', 'MongoDB', 'JWT', 'Nodemailer', 'Multer'],
    features: [
      'Email OTP-based registration & verification',
      'Secure friend vault with PDF document storage',
      'Emergency alert email notification system',
      'Full admin dashboard for portfolio management',
    ],
    gradient: 'from-emerald-600 to-teal-600',
    github: '#',
    live: '#',
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-16 sm:py-24 bg-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">What I've built</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Featured Projects</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-violet-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-slate-950/60 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all hover:-translate-y-2 hover:shadow-2xl flex flex-col"
            >
              {/* Top gradient bar */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${project.gradient}`} />

              <div className="p-5 sm:p-7 flex flex-col flex-1">
                {/* Icon badge */}
                <div className={`w-12 h-12 bg-gradient-to-br ${project.gradient} rounded-xl flex items-center justify-center mb-4 sm:mb-5 shadow-lg`}>
                  <Tag className="w-5 h-5 text-white" />
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-blue-300 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5">{project.description}</p>

                <ul className="space-y-1.5 mb-4 sm:mb-5 flex-1">
                  {project.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-400">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 sm:mb-6">
                  {project.tech.map((t, i) => (
                    <span key={i} className="px-2 sm:px-2.5 py-1 bg-slate-800 text-slate-400 text-xs rounded-lg border border-white/5">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-4 pt-4 border-t border-white/10">
                  <a href={project.github} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors">
                    <GithubIcon className="w-4 h-4" /> Code
                  </a>
                  <a href={project.live} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-400 transition-colors">
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
