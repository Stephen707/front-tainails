import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Camille R.",
    text: "Mon salon préféré à Montréal ! Le nail art est toujours impeccable et l'ambiance est tellement relaxante.",
    rating: 5,
    service: "Nail Art",
  },
  {
    name: "Aïcha M.",
    text: "Pose acrylique parfaite, tenue incroyable. Je recommande les yeux fermés. L'équipe est adorable !",
    rating: 5,
    service: "Pose Acrylique",
  },
  {
    name: "Léa T.",
    text: "La pédicure spa est un vrai moment de détente. Mes pieds n'ont jamais été aussi beaux. Merci Taï'Nails ✨",
    rating: 5,
    service: "Pédicure Spa",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-gradient-dark">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Ce que disent <span className="text-gradient-gold">nos clientes</span>
          </h2>
          <p className="text-muted-foreground">Des centaines de clientes satisfaites</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-card border border-border rounded-xl p-6 relative"
            >
              <Quote size={24} className="text-primary/20 absolute top-4 right-4" />
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="fill-gold text-gold" />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-4 italic">"{t.text}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.service}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
