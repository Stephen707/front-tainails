import serviceAcrylique from "@/assets/service-acrylique.jpg";
import serviceGel from "@/assets/service-gel.jpg";
import servicePedicure from "@/assets/service-pedicure.jpg";
import serviceNailart from "@/assets/service-nailart.jpg";
import serviceRemplissage from "@/assets/service-remplissage.jpg";

export interface LengthOption {
  label: string;
  price: number;
  magnets: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  category: string;
  popular?: boolean;
  lengthOptions?: LengthOption[];
}

export interface Technician {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  whatsapp: string;
}

export const salonPolicies = [
  "Un dépôt de 25$ CAD est requis pour la prise de rendez-vous",
  "La période de grâce est de 10 minutes, ensuite un frais de 15$ est appliqué. À 15 min de retard le rendez-vous sera annulé",
  "Toute annulation doit être effectuée 48hrs à l'avance",
  "Payé en argent comptant",
  "Aucun invité sera permis",
  "Viens avec les ongles nus, sauf si tu réserves un retrait (soak off)",
];

export const acrylicLengths: LengthOption[] = [
  { label: "Short", price: 45, magnets: 1 },
  { label: "Medium", price: 55, magnets: 2 },
  { label: "Long", price: 65, magnets: 3 },
  { label: "XL", price: 75, magnets: 4 },
];

export const freestyleLengths: LengthOption[] = [
  { label: "Short", price: 55, magnets: 1 },
  { label: "Medium", price: 65, magnets: 2 },
  { label: "Long", price: 75, magnets: 3 },
  { label: "XL", price: 85, magnets: 4 },
];

export const services: Service[] = [
  {
    id: "acrylique",
    name: "Pose Acrylique",
    description: "Pose complète d'ongles en acrylique. Forme et longueur au choix. Finition impeccable garantie.",
    price: 45,
    duration: 90,
    image: serviceAcrylique,
    category: "Full Set",
    popular: true,
    lengthOptions: acrylicLengths,
  },
  {
    id: "freestyle",
    name: "Freestyle",
    description: "Design libre et créatif sur pose acrylique. Laissez parler votre imagination avec des designs uniques.",
    price: 55,
    duration: 105,
    image: serviceNailart,
    category: "Full Set",
    popular: true,
    lengthOptions: freestyleLengths,
  },
  {
    id: "acrylic-toes",
    name: "Acrylic Toes",
    description: "Pose acrylique pour les pieds. Finition soignée et durable.",
    price: 50,
    duration: 60,
    image: servicePedicure,
    category: "Pieds",
  },
  {
    id: "vernis-gel-pieds",
    name: "Vernis Gel (Pieds)",
    description: "Application de vernis gel sur les orteils. Brillant et longue tenue.",
    price: 40,
    duration: 45,
    image: servicePedicure,
    category: "Pieds",
  },
  {
    id: "remplissage",
    name: "Remplissage",
    description: "Entretien et remplissage de vos ongles acrylique ou gel. Recommandé toutes les 2-3 semaines.",
    price: 30,
    duration: 45,
    image: serviceRemplissage,
    category: "Refill, Removal, Nail repair",
  },
  {
    id: "combo-mains-pieds",
    name: "Combo Mains + Pieds",
    description: "Pose acrylique mains + acrylic toes. Le combo parfait pour être belle de la tête aux pieds.",
    price: 85,
    duration: 120,
    image: servicePedicure,
    category: "Combos",
    popular: true,
  },
];

export const technicians: Technician[] = [
  { id: "t1", name: "Melissa Taina Michel", specialty: "Tous les services", avatar: "MT", whatsapp: "19057143839" },
];

export const timeSlots = [
  "9:00", "9:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];
