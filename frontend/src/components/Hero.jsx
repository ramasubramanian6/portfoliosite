import { motion } from 'framer-motion';
import { Download, ArrowRight, Mail, MapPin, Briefcase } from 'lucide-react';

const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const stats = [
  { label: 'Years Experience', value: '2.8+' },
  { label: 'Projects Delivered', value: '15+' },
  { label: 'Tech Stack Items', value: '20+' },
  { label: 'Chess Champion', value: '2×' },
];

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 sm:pt-20 overflow-hidden bg-slate-950">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-20 w-72 sm:w-96 h-72 sm:h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-72 sm:w-96 h-72 sm:h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMTIxMjEiIGZpbGwtb3BhY2l0eT0iMC4zIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0wLTZoLTJWMTZoMnY2em0tNiA2aC00di0yaDR2MnptNiAwaDR2LTJoLTR2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-10 sm:py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16">

          {/* Left - Text */}
          <div className="flex-1 text-center lg:text-left w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-blue-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Available for opportunities
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-3 sm:mb-4 leading-tight">
                <span className="text-white">Rama</span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  Subramanian
                </span>
              </h1>

              <div className="flex items-center gap-2 mb-4 sm:mb-6 justify-center lg:justify-start flex-wrap">
                <Briefcase className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <p className="text-base sm:text-lg md:text-xl text-slate-300 font-medium">
                  Full Stack Developer (MERN) · 2.8+ Years
                </p>
              </div>

              <p className="text-slate-400 text-sm sm:text-base md:text-lg mb-7 sm:mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                I build scalable, production-ready web applications with clean architecture. Passionate about creating exceptional digital experiences using modern technologies.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-center lg:justify-start mb-7 sm:mb-10">
                <a
                  href="#projects"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold flex items-center gap-2 justify-center transition-all hover:shadow-lg hover:shadow-blue-500/25 active:scale-95 text-sm sm:text-base"
                >
                  View My Work <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="/api/portfolio/resume"
                  target="_blank"
                  className="border border-white/20 hover:border-white/40 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold flex items-center gap-2 justify-center transition-all hover:bg-white/5 active:scale-95 text-sm sm:text-base"
                >
                  Download CV <Download className="w-4 h-4" />
                </a>
              </div>

              <div className="flex items-center gap-3 sm:gap-5 justify-center lg:justify-start flex-wrap">
                <a href="https://github.com/" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
                  <GithubIcon className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com/" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-blue-400 transition-colors p-2 hover:bg-blue-500/10 rounded-lg">
                  <LinkedinIcon className="w-5 h-5" />
                </a>
                <a href="mailto:ramasubramanianponni37@gmail.com" className="text-slate-500 hover:text-violet-400 transition-colors p-2 hover:bg-violet-500/10 rounded-lg">
                  <Mail className="w-5 h-5" />
                </a>
                <span className="text-slate-600">·</span>
                <div className="flex items-center gap-1.5 text-slate-500 text-xs sm:text-sm">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Chennai, India
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right - Avatar + Stats */}
          <div className="flex-1 flex flex-col items-center gap-6 sm:gap-8 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              {/* Glow rings */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-violet-500 blur-3xl opacity-30 scale-110" />
              <div className="relative w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-white/10 flex items-center justify-center shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-violet-600/20" />
                <span className="relative text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-violet-400 select-none">
                  RS
                </span>
              </div>
              {/* Floating badges */}
              <div className="absolute -top-2 -right-3 bg-green-500 text-white text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                Open to Work
              </div>
              <div className="absolute -bottom-2 -left-3 bg-blue-600 text-white text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                MERN Stack
              </div>
            </motion.div>

            {/* Stats grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 gap-3 w-full max-w-[260px] sm:max-w-xs"
            >
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-slate-900/80 border border-white/10 rounded-2xl p-3 sm:p-4 text-center hover:border-blue-500/40 transition-colors"
                >
                  <div className="text-xl sm:text-2xl font-extrabold text-blue-400 mb-1">{stat.value}</div>
                  <div className="text-xs text-slate-500 font-medium leading-tight">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator — hidden on small screens */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-slate-600"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-slate-600 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
