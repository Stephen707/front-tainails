import chromeNails from "@/assets/blog/chrome-nails.jpg";
import minimalistNails from "@/assets/blog/minimalist-nails.jpg";
import nudeNails from "@/assets/blog/nude-nails.jpg";
import customNails from "@/assets/blog/custom-nails.jpg";
import trendyConfidence from "@/assets/blog/trendy-confidence.jpg";
import cuticleCare from "@/assets/blog/cuticle-care.jpg";
import glovesProtection from "@/assets/blog/gloves-protection.jpg";
import nailCareTips from "@/assets/blog/nail-care-tips.jpg";
import nailRefill from "@/assets/blog/nail-refill.jpg";
import lastingNails from "@/assets/blog/lasting-nails.jpg";

export interface BlogSection {
  text: string;
  image: string;
  imageAlt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  featuredImage: string;
  sections: BlogSection[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "tendances-ongles-2026",
    slug: "tendances-ongles-2026",
    title: "Les tendances ongles de 2026",
    excerpt: "En 2026, les tendances en matière d'ongles évoluent vers des styles à la fois élégants et expressifs.",
    category: "Tendances",
    date: "2026-04-13",
    featuredImage: chromeNails,
    sections: [
      {
        text: "En 2026, les tendances en matière d'ongles évoluent vers des styles à la fois élégants et expressifs. Les clientes recherchent des designs qui reflètent leur personnalité tout en restant modernes et raffinés.",
        image: chromeNails,
        imageAlt: "Ongles chrome métalliques argent et or",
      },
      {
        text: "Parmi les tendances les plus populaires, on retrouve les effets chrome, qui apportent une touche futuriste et brillante. Les designs minimalistes, quant à eux, séduisent par leur simplicité et leur élégance.",
        image: minimalistNails,
        imageAlt: "Design d'ongles minimaliste avec lignes géométriques",
      },
      {
        text: "Les couleurs neutres comme le nude et le beige restent des incontournables, mais sont souvent combinées avec des détails artistiques pour un rendu unique.",
        image: nudeNails,
        imageAlt: "Vernis à ongles couleurs nude et beige",
      },
      {
        text: "Enfin, les ongles personnalisés gagnent en popularité. Chaque cliente souhaite un style qui lui ressemble, ce qui rend chaque pose unique.",
        image: customNails,
        imageAlt: "Ongles personnalisés avec designs créatifs",
      },
      {
        text: "Adopter ces tendances permet non seulement de rester à la mode, mais aussi d'affirmer son style avec confiance.",
        image: trendyConfidence,
        imageAlt: "Collection de nail art tendance 2026",
      },
    ],
  },
  {
    id: "entretien-ongles",
    slug: "comment-entretenir-ses-ongles",
    title: "Comment bien entretenir ses ongles",
    excerpt: "Avoir une belle pose d'ongles, c'est bien. La faire durer le plus longtemps possible, c'est encore mieux.",
    category: "Conseils",
    date: "2026-04-13",
    featuredImage: cuticleCare,
    sections: [
      {
        text: "Avoir une belle pose d'ongles, c'est bien. La faire durer le plus longtemps possible, c'est encore mieux.",
        image: cuticleCare,
        imageAlt: "Huile pour cuticules et outils de soin des ongles",
      },
      {
        text: "Tout d'abord, il est essentiel d'hydrater régulièrement les cuticules avec une huile adaptée. Cela permet de garder des ongles en bonne santé et d'éviter les décollements.",
        image: nailCareTips,
        imageAlt: "Outils de soin des ongles",
      },
      {
        text: "Ensuite, il est recommandé d'éviter les chocs et de porter des gants lors des tâches ménagères. Les produits chimiques peuvent fragiliser la pose.",
        image: glovesProtection,
        imageAlt: "Protection des ongles avec des gants de ménage",
      },
      {
        text: "Un autre point important est de ne pas utiliser ses ongles comme outils. Cela peut provoquer des fissures ou des cassures.",
        image: nailRefill,
        imageAlt: "Service de remplissage d'ongles en salon",
      },
      {
        text: "Enfin, il est conseillé de faire un remplissage régulier pour maintenir un résultat propre et durable.",
        image: lastingNails,
        imageAlt: "Vernis à ongles durables en salon",
      },
      {
        text: "En suivant ces conseils simples, vous pourrez profiter de vos ongles plus longtemps tout en gardant un look impeccable.",
        image: lastingNails,
        imageAlt: "Résultat d'ongles durables et impeccables",
      },
    ],
  },
];
