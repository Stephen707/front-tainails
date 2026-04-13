import { motion } from "framer-motion";
import { Clock, DollarSign } from "lucide-react";
import { services, type Service } from "@/data/services";

interface ServicesSectionProps {
  onSelectService: (service: Service) => void;
}

const ServicesSection = ({ onSelectService }: ServicesSectionProps) => {
  const categories = Array.from(new Set(services.map(s => s.category)));

  return (
    <section id="services" className="py-24 bg-gradient-dark">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Nos <span className="text-gradient-rose">Services</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Des soins d'exception pour sublimer vos ongles
          </p>
        </motion.div>

        {categories.map((cat) => (
          <div key={cat} className="mb-12">
            <h3 className="text-lg font-display font-semibold text-muted-foreground uppercase tracking-wider mb-6 text-center">{cat}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.filter(s => s.category === cat).map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => onSelectService(service)}
                  className="group cursor-pointer relative rounded-xl overflow-hidden bg-card border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-rose"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      loading="lazy"
                      width={640}
                      height={640}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {service.popular && (
                      <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-semibold">
                        Populaire
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-display font-semibold text-foreground">{service.name}</h3>
                      <span className="text-primary font-bold text-lg">
                        {service.lengthOptions ? `${service.lengthOptions[0].price}$+` : `${service.price}$`}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{service.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock size={13} /> {service.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign size={13} /> Dépôt 25$ CAD
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
