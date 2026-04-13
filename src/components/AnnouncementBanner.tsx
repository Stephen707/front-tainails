import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Megaphone, Sparkles, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
}

const typeConfig: Record<string, { icon: React.ElementType; classes: string }> = {
  info: { icon: Megaphone, classes: "bg-primary/10 border-primary/30 text-foreground" },
  promo: { icon: Sparkles, classes: "bg-accent/10 border-accent/30 text-foreground" },
  urgent: { icon: AlertTriangle, classes: "bg-destructive/10 border-destructive/30 text-foreground" },
};

const AnnouncementBanner = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });
      if (data) setAnnouncements(data as Announcement[]);
    };
    fetch();
  }, []);

  const visible = announcements.filter((a) => !dismissed.has(a.id));
  if (visible.length === 0) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-40 space-y-1">
      <AnimatePresence>
        {visible.map((ann) => {
          const cfg = typeConfig[ann.type] || typeConfig.info;
          const Icon = cfg.icon;
          return (
            <motion.div
              key={ann.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`border-b ${cfg.classes}`}
            >
              <div className="container mx-auto px-4 py-2 flex items-center gap-3">
                <Icon size={16} className="shrink-0" />
                <div className="flex-1 text-sm">
                  <span className="font-semibold">{ann.title}</span>
                  {" — "}
                  <span className="text-muted-foreground">{ann.content}</span>
                </div>
                <button
                  onClick={() => setDismissed((prev) => new Set(prev).add(ann.id))}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default AnnouncementBanner;
