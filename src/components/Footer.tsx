import { MapPin, Phone, Clock, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="py-16 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-display text-2xl font-bold text-gradient-rose mb-4">Taï'Nails</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Votre salon de manucure à Montréal. Beauté, qualité et passion.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-display font-semibold text-foreground mb-4">Contact</h4>
            <p className="flex items-center gap-3 text-sm text-muted-foreground">
              <MapPin size={16} className="text-primary shrink-0" /> Jarry, Montréal, QC
            </p>
            <p className="flex items-center gap-3 text-sm text-muted-foreground">
              <Phone size={16} className="text-primary shrink-0" /> +1 (905) 714-3839
            </p>
            <p className="flex items-center gap-3 text-sm text-muted-foreground">
              <Instagram size={16} className="text-primary shrink-0" /> @tainails_mtl
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-display font-semibold text-foreground mb-4">Horaires</h4>
            <p className="flex items-center gap-3 text-sm text-muted-foreground">
              <Clock size={16} className="text-primary shrink-0" /> Lun - Sam : 9h - 18h
            </p>
            <p className="text-sm text-muted-foreground ml-7">Dimanche : Fermé</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Taï'Nails Montréal. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
