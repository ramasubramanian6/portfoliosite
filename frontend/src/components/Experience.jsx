import { motion } from 'framer-motion';

const Experience = () => {
  const experiences = [
    {
      role: "Full Stack Developer (Contract)",
      company: "HIG AI Automation",
      period: "Jan 2025 – Present",
      details: [
        "Developed and maintained MERN stack web applications supporting real-world business workflows.",
        "Executed RESTful API development using Node.js and Express.js with JWT-based authentication and role-based access control.",
        "Applied MongoDB and PostgreSQL data models to improve query efficiency and application performance.",
        "Designed and integrated responsive React components, improving user experience and frontend maintainability.",
        "Containerized applications using Docker and deployed services on AWS and Google Cloud Platform.",
        "Automated build and deployment pipelines using CI/CD, reducing manual deployment effort and operational errors."
      ]
    },
    {
      role: "Software Engineer Trainee",
      company: "Cognizant Technology Solutions",
      period: "Oct 2022 – Sep 2023",
      details: [
        "Contributed to enterprise web applications using React and Node.js for logistics and operations platforms.",
        "Executed REST API enhancements for backend services, reducing response times and improving service reliability.",
        "Optimized frontend performance by refining React rendering logic and component reuse.",
        "Collaborated with cross-functional teams while following Agile and Scrum development practices.",
        "Strengthened debugging and monitoring processes, reducing production issues and resolution time."
      ]
    },
    {
      role: "Engineering Intern",
      company: "Cognizant Technology Solutions",
      period: "Dec 2021 – Jul 2022",
      details: [
        "Assisted in developing internal tools using JavaScript, React, and backend services.",
        "Enforced version control and code review practices to support team collaboration and code quality."
      ]
    }
  ];

  return (
    <section id="experience" className="py-20 bg-background relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Experience</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </motion.div>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-8 md:pl-0"
            >
              <div className="md:grid md:grid-cols-4 md:gap-8 border-l-2 md:border-l-0 border-primary/30 md:border-transparent">
                <div className="md:col-span-1 md:text-right pt-2 md:border-r-2 md:border-primary/30 md:pr-8 mb-4 md:mb-0 relative">
                  <div className="absolute top-3 -left-[9px] md:-right-[9px] md:left-auto w-4 h-4 rounded-full bg-primary ring-4 ring-background"></div>
                  <h4 className="text-primary font-medium">{exp.period}</h4>
                </div>
                <div className="md:col-span-3 bg-card border border-white/5 p-6 rounded-2xl shadow-lg">
                  <h3 className="text-2xl font-bold mb-1">{exp.role}</h3>
                  <h4 className="text-lg text-muted-foreground mb-4">{exp.company}</h4>
                  <ul className="list-disc list-outside ml-5 space-y-2 text-muted-foreground">
                    {exp.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
