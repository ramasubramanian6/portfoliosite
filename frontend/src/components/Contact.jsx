import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-background relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.a 
            href="mailto:hello@ramasubramanian.in"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center p-8 bg-card border border-white/10 rounded-2xl hover:border-primary/50 transition-colors group"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Email</h3>
            <p className="text-muted-foreground">hello@ramasubramanian.in</p>
            <p className="text-muted-foreground text-sm">(ramasubramanianponni37@gmail.com)</p>
          </motion.a>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center p-8 bg-card border border-white/10 rounded-2xl hover:border-primary/50 transition-colors group"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Phone</h3>
            <p className="text-muted-foreground">+91-7449085120</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center p-8 bg-card border border-white/10 rounded-2xl hover:border-primary/50 transition-colors group"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Location</h3>
            <p className="text-muted-foreground">Chennai, Tamil Nadu, India</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
