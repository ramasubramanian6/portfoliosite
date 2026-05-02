import { motion } from 'framer-motion';
import { Briefcase, CheckCircle } from 'lucide-react';

const experiences = [
  {
    role: 'Full Stack Developer (Contract)',
    company: 'HIG AI Automation',
    period: 'Jan 2025 – Present',
    type: 'Full-time Contract',
    color: 'from-blue-500 to-cyan-500',
    details: [
      'Developed and maintained MERN stack web applications supporting real-world business workflows.',
      'Built RESTful APIs using Node.js and Express.js with JWT-based authentication and role-based access.',
      'Applied MongoDB and PostgreSQL data models to improve query efficiency and application performance.',
      'Designed and integrated responsive React components, improving user experience.',
      'Containerized applications using Docker and deployed on AWS and Google Cloud Platform.',
      'Automated build and deployment pipelines using CI/CD, reducing manual deployment effort.',
    ],
  },
  {
    role: 'Software Engineer Trainee',
    company: 'Cognizant Technology Solutions',
    period: 'Oct 2022 – Sep 2023',
    type: 'Full-time',
    color: 'from-violet-500 to-purple-500',
    details: [
      'Contributed to enterprise web applications using React and Node.js for logistics platforms.',
      'Executed REST API enhancements reducing response times and improving service reliability.',
      'Optimized frontend performance by refining React rendering logic and component reuse.',
      'Collaborated with cross-functional teams following Agile and Scrum practices.',
      'Strengthened debugging and monitoring processes, reducing production issues significantly.',
    ],
  },
  {
    role: 'Engineering Intern',
    company: 'Cognizant Technology Solutions',
    period: 'Dec 2021 – Jul 2022',
    type: 'Internship',
    color: 'from-emerald-500 to-teal-500',
    details: [
      'Assisted in developing internal tools using JavaScript, React, and backend services.',
      'Enforced version control and code review practices to support team collaboration.',
    ],
  },
];

const Experience = () => {
  return (
    <section id="experience" className="py-16 sm:py-24 bg-slate-950 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">My journey</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Professional Experience</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-violet-500 mx-auto rounded-full" />
        </motion.div>

        <div className="relative">
          {/* Timeline line — left-aligned always on mobile, center on md+ */}
          <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-violet-500 to-emerald-500 opacity-30" />

          <div className="space-y-10 sm:space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative flex flex-col md:flex-row gap-6 md:gap-8 pl-14 md:pl-0"
              >
                {/* Timeline dot */}
                <div className={`absolute left-3 md:left-1/2 top-5 w-5 h-5 rounded-full bg-gradient-to-br ${exp.color} -translate-x-1/2 shadow-lg z-10`} />

                {/* Date - left side on desktop */}
                <div className="md:w-1/2 md:text-right md:pr-12 hidden md:flex md:flex-col md:justify-center">
                  <span className={`inline-flex items-center justify-end gap-2 text-sm font-semibold bg-gradient-to-r ${exp.color} bg-clip-text text-transparent`}>
                    <Briefcase className="w-4 h-4 text-blue-400" />
                    {exp.period}
                  </span>
                  <p className="text-slate-500 text-xs mt-1">{exp.type}</p>
                </div>

                {/* Content card */}
                <div className="md:w-1/2 md:pl-12">
                  {/* Mobile date */}
                  <div className="md:hidden mb-2">
                    <span className="text-blue-400 text-sm font-semibold">{exp.period}</span>
                    <span className="text-slate-500 text-xs ml-2">· {exp.type}</span>
                  </div>

                  <div className="bg-slate-900/80 border border-white/10 p-5 sm:p-6 rounded-2xl hover:border-white/20 transition-all group">
                    <div className={`h-1 w-12 bg-gradient-to-r ${exp.color} rounded-full mb-4`} />
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{exp.role}</h3>
                    <h4 className="text-blue-400 font-medium mb-4 text-sm sm:text-base">{exp.company}</h4>
                    <ul className="space-y-2">
                      {exp.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-400">
                          <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
