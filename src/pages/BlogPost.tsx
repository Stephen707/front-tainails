import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  const handleBookClick = () => {
    window.location.href = "/#booking";
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Article introuvable</h1>
          <Link to="/" className="text-primary hover:underline">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onBookClick={handleBookClick} />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            to="/#blog"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> Retour au blog
          </Link>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                <Tag size={10} /> {post.category}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar size={12} />
                {new Date(post.date).toLocaleDateString("fr-CA", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-display font-bold mb-8 text-gradient-rose">
              {post.title}
            </h1>

            <div className="space-y-10">
              {post.sections.map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <p className="text-foreground/90 leading-relaxed mb-4 font-body">
                    {section.text}
                  </p>
                  <div className="rounded-xl overflow-hidden border border-border">
                    <img
                      src={section.image}
                      alt={section.imageAlt}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                      width={800}
                      height={600}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 p-6 rounded-xl bg-gradient-rose border border-border text-center">
              <h3 className="font-display text-xl font-semibold mb-2">Envie d'essayer ces tendances ?</h3>
              <p className="text-sm text-muted-foreground mb-4">Réservez votre rendez-vous chez Taï'Nails dès maintenant</p>
              <Link
                to="/#booking"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-rose"
              >
                Réserver maintenant
              </Link>
            </div>
          </motion.article>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPost;
