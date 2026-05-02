import { motion } from 'framer-motion';
import { Code2, Database, Layout, Server, Trophy, GraduationCap, Heart } from 'lucide-react';

const skills = [
  { title: 'Frontend', icon: <Layout className="w-6 h-6" />, desc: 'React, Redux, Next.js, HTML5, CSS3, Tailwind CSS', color: 'from-blue-500 to-cyan-500' },
  { title: 'Backend', icon: <Server className="w-6 h-6" />, desc: 'Node.js, Express.js, REST APIs, JWT, WebSockets', color: 'from-violet-500 to-purple-500' },
  { title: 'Database', icon: <Database className="w-6 h-6" />, desc: 'MongoDB, MySQL, PostgreSQL, Redis', color: 'from-emerald-500 to-teal-500' },
  { title: 'DevOps & Cloud', icon: <Code2 className="w-6 h-6" />, desc: 'Docker, AWS, GCP, CI/CD, Git, GitHub Actions', color: 'from-orange-500 to-amber-500' },
];

const highlights = [
  { icon: <Trophy className="w-5 h-5 text-amber-400" />, text: 'Two-time District Chess Champion & State Runner-Up' },
  { icon: <GraduationCap className="w-5 h-5 text-blue-400" />, text: 'B.E Computer Science Engineer' },
  { icon: <Heart className="w-5 h-5 text-red-400" />, text: 'Passionate about clean code & Agile practices' },
];

const About = () => {
  return (
    <section id="about" className="py-16 sm:py-24 bg-slate-950 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Get to know me</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">About Me</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-violet-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-16 items-center mb-16 sm:mb-20">
          {/* Left - Bio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-5 sm:mb-6">
              Full Stack Developer & Problem Solver
            </h3>
            <div className="space-y-4 text-slate-400 leading-relaxed text-sm sm:text-base">
              <p>
                I am a results-driven <span className="text-white font-medium">MERN Stack Developer</span> with over 2.8 years of hands-on experience in building scalable web applications. My expertise lies in designing clean architectures, solving complex problems, and employing Agile methodologies.
              </p>
              <p>
                I specialize in creating <span className="text-white font-medium">production-ready applications</span> with strong emphasis on frontend performance optimization, RESTful API development, cloud deployment, and CI/CD automation.
              </p>
              <p>
                My competitive background as a chess champion translates into strong <span className="text-white font-medium">analytical and strategic thinking</span> in software development.
              </p>
            </div>

            {/* Highlights */}
            <div className="mt-6 sm:mt-8 space-y-3">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-xl border border-white/5">
                  {h.icon}
                  <span className="text-slate-300 text-xs sm:text-sm">{h.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="#contact"
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-all hover:shadow-lg hover:shadow-blue-500/25 text-center"
              >
                Get In Touch
              </a>
              <a
                href="/api/portfolio/resume"
                target="_blank"
                className="border border-white/20 hover:border-white/40 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-all hover:bg-white/5 text-center"
              >
                View Resume
              </a>
            </div>
          </motion.div>

          {/* Right - Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {skills.map((skill, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-slate-900/60 border border-white/10 p-5 sm:p-6 rounded-2xl hover:border-white/20 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${skill.color} rounded-xl flex items-center justify-center mb-4 text-white shadow-lg`}>
                  {skill.icon}
                </div>
                <h3 className="text-white font-bold text-base sm:text-lg mb-2">{skill.title}</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{skill.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tech Badge Cloud */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          id="skills"
          className="text-center"
        >
          <h3 className="text-lg sm:text-xl font-bold text-white mb-6 sm:mb-8">Tech Stack & Tools</h3>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {[
              'JavaScript (ES6+)', 'TypeScript', 'React.js', 'Node.js', 'Express.js',
              'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'AWS', 'GCP',
              'Git', 'GitHub Actions', 'JWT', 'REST APIs', 'Next.js', 'Tailwind CSS',
              'Java', 'Python (basics)', 'Linux', 'Nginx'
            ].map((tech, i) => (
              <span
                key={i}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-900/80 border border-white/10 text-slate-300 text-xs sm:text-sm rounded-xl hover:border-blue-500/40 hover:text-blue-300 transition-all cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
