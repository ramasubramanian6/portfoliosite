import { motion } from 'framer-motion';
import { Download, ArrowRight, Github, Linkedin, Mail } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-4">Hello, I'm</h2>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                Rama <br className="hidden md:block"/> Subramanian
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl">
                A passionate MERN Stack Developer with 2.6+ years of experience building scalable web applications.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <a href="#projects" className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors">
                  View Work <ArrowRight className="w-4 h-4" />
                </a>
                <a href="/api/portfolio/resume" target="_blank" className="bg-secondary text-secondary-foreground border border-white/10 px-8 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-white/5 transition-colors">
                  Download CV <Download className="w-4 h-4" />
                </a>
              </div>

              <div className="flex items-center gap-6 mt-10 justify-center md:justify-start text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors"><Github className="w-6 h-6" /></a>
                <a href="#" className="hover:text-primary transition-colors"><Linkedin className="w-6 h-6" /></a>
                <a href="mailto:ramasubramanianponni37@gmail.com" className="hover:text-primary transition-colors"><Mail className="w-6 h-6" /></a>
              </div>
            </motion.div>
          </div>

          {/* Abstract Image / Illustration */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1 flex justify-center"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-purple-600 rounded-full blur-2xl opacity-40"></div>
              <div className="absolute inset-4 bg-card border border-white/10 rounded-full overflow-hidden flex items-center justify-center">
                <span className="text-8xl font-black text-white/5">RS</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
