import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, MessageSquare } from 'lucide-react';

const contactItems = [
  {
    icon: <Mail className="w-6 h-6" />,
    label: 'Email',
    value: 'ramasubramanianponni37@gmail.com',
    sub: 'hello@ramasubramanian.in',
    href: 'mailto:ramasubramanianponni37@gmail.com',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <Phone className="w-6 h-6" />,
    label: 'Phone',
    value: '+91 7449085120',
    sub: 'Mon–Fri, 9am–6pm IST',
    href: 'tel:+917449085120',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    label: 'Location',
    value: 'Chennai, Tamil Nadu',
    sub: 'India (Open to Remote)',
    href: 'https://maps.google.com/?q=Chennai,India',
    color: 'from-violet-500 to-purple-500',
  },
];

const socials = [
  {
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>,
    label: 'GitHub',
    href: 'https://github.com/ramasubramanian6',
  },
  {
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/ramasubramanian-fullstack/',
  },
];

const Contact = () => {
  return (
    <section id="contact" className="py-16 sm:py-24 bg-slate-900 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Let's connect</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Get In Touch</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-violet-500 mx-auto rounded-full mb-5 sm:mb-6" />
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
            I'm currently open to new opportunities and collaborations. Whether you have a project in mind, want to hire me, or just want to say hi — I'd love to hear from you!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
          {contactItems.map((item, i) => (
            <motion.a
              key={i}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group flex flex-col items-center p-6 sm:p-8 bg-slate-950/60 border border-white/10 rounded-2xl hover:border-white/20 transition-all hover:-translate-y-2 hover:shadow-2xl text-center"
            >
              <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-5 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">{item.label}</h3>
              <p className="text-slate-300 text-xs sm:text-sm font-medium mb-1 break-all">{item.value}</p>
              <p className="text-slate-500 text-xs">{item.sub}</p>
            </motion.a>
          ))}
        </div>

        {/* CTA box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-blue-500/20 rounded-3xl p-7 sm:p-10 text-center"
        >
          <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Ready to work together?</h3>
          <p className="text-slate-400 mb-5 sm:mb-6 max-w-lg mx-auto text-sm sm:text-base">
            I turn ideas into real, scalable products. Let's build something amazing together.
          </p>
          <a
            href="mailto:ramasubramanianponni37@gmail.com"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/25 text-sm sm:text-base"
          >
            <Send className="w-4 h-4" /> Send me an email
          </a>

          <div className="flex justify-center flex-wrap gap-3 mt-6 sm:mt-8">
            {socials.map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-slate-400 hover:text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-all text-sm font-medium"
              >
                {s.icon} {s.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
