import { motion } from "framer-motion";
import { Gift, Percent, Heart } from "lucide-react";

const promos = [
  {
    icon: Gift,
    title: "Offre Bienvenue",
    description: "15% de rabais sur votre première visite",
    badge: "Nouveau client",
  },
  {
    icon: Heart,
    title: "Combo Mains + Pieds",
    description: "Pose acrylique + pédicure spa à 95$ au lieu de 110$",
    badge: "-15$",
  },
  {
    icon: Percent,
    title: "Fidélité",
    description: "10ème visite offerte avec notre carte fidélité",
    badge: "Gratuit",
  },
];

const PromosSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Offres <span className="text-gradient-rose">spéciales</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promos.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-gradient-rose border border-primary/20 rounded-xl p-6 text-center group hover:border-primary/40 transition-colors"
            >
              <span className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {p.badge}
              </span>
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
                <p.icon size={22} className="text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromosSection;
