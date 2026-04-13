import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Clock, ChevronLeft, Check, User, Upload, X, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { services, technicians, timeSlots, salonPolicies, type Service, type LengthOption } from "@/data/services";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BookingSectionProps {
  preselectedService?: Service | null;
}

type Step = "policies" | "service" | "options" | "technician" | "datetime" | "details" | "confirm";

const BookingSection = ({ preselectedService }: BookingSectionProps) => {
  const [step, setStep] = useState<Step>("policies");
  const [selectedService, setSelectedService] = useState<Service | null>(preselectedService ?? null);
  const [selectedLength, setSelectedLength] = useState<LengthOption | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [designImage, setDesignImage] = useState<File | null>(null);
  const [designPreview, setDesignPreview] = useState<string | null>(null);
  const [depositPaid, setDepositPaid] = useState<boolean>(false);
  const [bookedSlots, setBookedSlots] = useState<Record<string, string[]>>({});
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch booked slots when technician and date change
  useEffect(() => {
    if (!selectedTech || !selectedDate) return;
    const fetchBooked = async () => {
      setLoadingSlots(true);
      const dateStr = selectedDate.toISOString().split("T")[0];
      const { data } = await supabase
        .from("bookings")
        .select("booking_time")
        .eq("technician_id", selectedTech)
        .eq("booking_date", dateStr);
      const slots: Record<string, string[]> = {};
      slots[dateStr] = (data ?? []).map((b: any) => b.booking_time);
      setBookedSlots(slots);
      setLoadingSlots(false);
    };
    fetchBooked();
  }, [selectedTech, selectedDate]);

  const allSteps: { key: Step; label: string }[] = [
    { key: "policies", label: "Politiques" },
    { key: "service", label: "Service" },
    { key: "options", label: "Options" },
    { key: "technician", label: "Technicienne" },
    { key: "datetime", label: "Date & Heure" },
    { key: "details", label: "Détails" },
    { key: "confirm", label: "Confirmation" },
  ];

  // Skip options step if service has no length options
  const activeSteps = allSteps.filter(s => {
    if (s.key === "options" && selectedService && !selectedService.lengthOptions) return false;
    return true;
  });

  const currentStepIndex = activeSteps.findIndex(s => s.key === step);

  const getFinalPrice = () => {
    if (selectedLength) return selectedLength.price;
    return selectedService?.price ?? 0;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDesignImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => setDesignPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setDesignImage(null);
    setDesignPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleConfirm = async () => {
    if (!clientName.trim()) {
      toast.error("Veuillez entrer votre nom complet", { style: { background: 'hsl(0 84% 60%)', color: 'white', border: 'none' } });
      return;
    }
    if (!whatsappNumber.trim()) {
      toast.error("Veuillez entrer votre numéro WhatsApp", { style: { background: 'hsl(0 84% 60%)', color: 'white', border: 'none' } });
      return;
    }
    if (!depositPaid) {
      toast.error("Veuillez confirmer le paiement du dépôt de 25$ CAD", { style: { background: 'hsl(0 84% 60%)', color: 'white', border: 'none' } });
      return;
    }

    setSaving(true);

    const tech = technicians.find(t => t.id === selectedTech) ?? technicians[0];
    const dateStr = selectedDate?.toLocaleDateString("fr-CA", { weekday: "long", day: "numeric", month: "long" });
    const dateISO = selectedDate?.toISOString().split("T")[0];
    const lengthInfo = selectedLength ? ` (${selectedLength.label})` : "";
    const paymentStatus = depositPaid ? "✅ Dépôt de 25$ CAD payé" : "❌ Dépôt non payé";

    // Upload design image to storage if present
    let publicImageUrl: string | null = null;
    if (designImage) {
      const fileExt = designImage.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("design-images")
        .upload(fileName, designImage, { contentType: designImage.type });

      if (uploadError) {
        toast.error("Erreur lors de l'upload de l'image. Réessayez.", { style: { background: 'hsl(0 84% 60%)', color: 'white', border: 'none' } });
        setSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage.from("design-images").getPublicUrl(uploadData.path);
      publicImageUrl = urlData.publicUrl;
    }

    // Save booking to database
    const { error } = await supabase.from("bookings").insert({
      service_id: selectedService?.id ?? "",
      service_name: selectedService?.name ?? "",
      length_option: selectedLength?.label ?? null,
      technician_id: tech.id,
      technician_name: tech.name,
      booking_date: dateISO!,
      booking_time: selectedTime!,
      client_name: clientName,
      client_whatsapp: whatsappNumber,
      price: getFinalPrice(),
      deposit_paid: depositPaid,
      design_image_url: publicImageUrl,
    });

    if (error) {
      toast.error("Erreur lors de la sauvegarde. Réessayez.", { style: { background: 'hsl(0 84% 60%)', color: 'white', border: 'none' } });
      setSaving(false);
      return;
    }

    let message = 
      `🔔 *Nouvelle réservation Taï'Nails*\n\n` +
      `👤 *Nom:* ${clientName}\n` +
      `📋 *Service:* ${selectedService?.name}${lengthInfo}\n` +
      `💰 *Prix:* ${getFinalPrice()}$ CAD\n` +
      `📅 *Date:* ${dateStr}\n` +
      `🕐 *Heure:* ${selectedTime}\n` +
      `📞 *WhatsApp client:* ${whatsappNumber}\n` +
      `\n💳 *Paiement:* ${paymentStatus}\n` +
      `\n_Réservation effectuée via tainails.lovable.app_`;

    if (publicImageUrl) {
      message += `\n\n📸 *Modèle désiré:* ${publicImageUrl}`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${tech.whatsapp}?text=${encodedMessage}`, "_blank");

    toast.success("Réservation confirmée ! 🎉", {
      description: `${selectedService?.name} le ${dateStr} à ${selectedTime}`,
    });

    setSaving(false);

    // Reset
    setStep("policies");
    setSelectedService(null);
    setSelectedLength(null);
    setSelectedTech(null);
    setSelectedDate(undefined);
    setSelectedTime(null);
    setClientName("");
    setWhatsappNumber("");
    setDesignImage(null);
    setDesignPreview(null);
    setDepositPaid(false);
  };

  const goBack = () => {
    const idx = activeSteps.findIndex(s => s.key === step);
    if (idx > 0) setStep(activeSteps[idx - 1].key);
  };

  const goNext = (nextStep?: Step) => {
    if (nextStep) {
      // Skip options if no length options
      if (nextStep === "options" && selectedService && !selectedService.lengthOptions) {
        setStep("technician");
        return;
      }
      setStep(nextStep);
    }
  };

  // Group services by category
  const categories = Array.from(new Set(services.map(s => s.category)));

  return (
    <section id="booking" className="py-24">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="text-gradient-rose">Réservez</span> votre moment
          </h2>
          <p className="text-muted-foreground">En quelques clics, c'est fait</p>
        </motion.div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-1 mb-10 flex-wrap">
          {activeSteps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                  i <= currentStepIndex
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i < currentStepIndex ? <Check size={12} /> : i + 1}
              </div>
              {i < activeSteps.length - 1 && (
                <div className={`w-5 h-0.5 ${i < currentStepIndex ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl p-6 md:p-8 min-h-[400px]">
          {step !== "policies" && (
            <button onClick={goBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ChevronLeft size={16} /> Retour
            </button>
          )}

          <AnimatePresence mode="wait">
            {/* Step: Policies */}
            {step === "policies" && (
              <motion.div key="policies" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="font-display text-xl font-semibold mb-6">Politiques du salon</h3>
                <div className="space-y-3 mb-8">
                  {salonPolicies.map((policy, i) => (
                    <div key={i} className="p-4 rounded-lg bg-muted/50 border border-border text-sm text-foreground">
                      {policy}
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => setStep("service")}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-rose"
                >
                  J'accepte — Continuer
                </Button>
              </motion.div>
            )}

            {/* Step: Service by category */}
            {step === "service" && (
              <motion.div key="service" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="font-display text-xl font-semibold mb-6">Choisissez votre service</h3>
                {categories.map((cat) => (
                  <div key={cat} className="mb-6">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{cat}</h4>
                    <div className="grid gap-3">
                      {services.filter(s => s.category === cat).map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            setSelectedService(s);
                            setSelectedLength(null);
                            if (s.lengthOptions) {
                              setStep("options");
                            } else {
                              setStep("technician");
                            }
                          }}
                          className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/50 transition-all text-left"
                        >
                          <img src={s.image} alt={s.name} className="w-14 h-14 rounded-lg object-cover" loading="lazy" width={56} height={56} />
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">{s.name}</p>
                            <p className="text-sm text-muted-foreground">{s.duration} min</p>
                          </div>
                          <span className="text-primary font-bold">
                            {s.lengthOptions ? `${s.lengthOptions[0].price}$+` : `${s.price}$`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Step: Length options */}
            {step === "options" && selectedService?.lengthOptions && (
              <motion.div key="options" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="font-display text-xl font-semibold mb-2">Choisissez la longueur</h3>
                <p className="text-sm text-muted-foreground mb-6">{selectedService.name}</p>
                <div className="grid gap-3">
                  {selectedService.lengthOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => { setSelectedLength(opt); setStep("technician"); }}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/50 transition-all text-left"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{opt.label}</p>
                        <p className="text-sm text-muted-foreground">{opt.magnets} magnet{opt.magnets > 1 ? "s" : ""}</p>
                      </div>
                      <span className="text-primary font-bold text-lg">{opt.price}$ CAD</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step: Technician */}
            {step === "technician" && (
              <motion.div key="tech" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="font-display text-xl font-semibold mb-6">Choisissez votre technicienne</h3>
                <div className="grid gap-3">
                  {technicians.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { setSelectedTech(t.id); setStep("datetime"); }}
                      className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/50 transition-all text-left"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center text-primary font-display font-bold text-sm">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{t.name}</p>
                        <p className="text-sm text-muted-foreground">{t.specialty}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step: Date & Time */}
            {step === "datetime" && (
              <motion.div key="datetime" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="font-display text-xl font-semibold mb-6">Choisissez la date et l'heure</h3>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      locale={fr}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="rounded-lg border border-border"
                    />
                  </div>
                  {selectedDate && (
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                        <CalendarDays size={14} />
                        {selectedDate.toLocaleDateString("fr-CA", { weekday: "long", day: "numeric", month: "long" })}
                      </p>
                      {loadingSlots ? (
                        <div className="col-span-3 flex justify-center py-4">
                          <Loader2 className="animate-spin text-primary" size={24} />
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.map((time) => {
                            const dateKey = selectedDate.toISOString().split("T")[0];
                            const isBooked = bookedSlots[dateKey]?.includes(time);
                            return (
                              <button
                                key={time}
                                disabled={isBooked}
                                onClick={() => !isBooked && setSelectedTime(time)}
                                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                                  isBooked
                                    ? "bg-muted/40 text-muted-foreground/40 cursor-not-allowed line-through"
                                    : selectedTime === time
                                      ? "bg-primary text-primary-foreground shadow-rose"
                                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                                }`}
                              >
                                {time}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      {selectedTime && (
                        <Button
                          onClick={() => setStep("details")}
                          className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-rose"
                        >
                          Continuer
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step: Client Details */}
            {step === "details" && (
              <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="font-display text-xl font-semibold mb-6">Vos informations</h3>

                {/* Full name */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <User size={16} className="text-primary" />
                    Nom complet *
                  </label>
                  <Input
                    type="text"
                    placeholder="Prénom et Nom"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Pour la validation du paiement Interac</p>
                </div>

                {/* WhatsApp number */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <MessageCircle size={16} className="text-primary" />
                    Numéro WhatsApp *
                  </label>
                  <Input
                    type="tel"
                    placeholder="+1 (514) 000-0000"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Pour recevoir la confirmation de votre rendez-vous</p>
                </div>

                {/* Upload design */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Upload size={16} className="text-primary" />
                    Modèle désiré (optionnel)
                  </label>
                  <div className="mt-2">
                    {designPreview ? (
                      <div className="relative inline-block">
                        <img src={designPreview} alt="Modèle choisi" className="w-32 h-32 object-cover rounded-lg border border-border" />
                        <button
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full p-6 border-2 border-dashed border-border rounded-lg hover:border-primary/40 transition-colors text-center"
                      >
                        <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Cliquez pour uploader une photo du design voulu</p>
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>

                {/* Deposit payment */}
                <div className="mb-6 bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm font-medium text-foreground mb-2">💰 Dépôt de 25$ CAD requis</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Envoyez 25$ par Interac au <strong className="text-foreground">905-714-3839</strong> pour confirmer votre réservation.
                  </p>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={depositPaid}
                      onChange={(e) => setDepositPaid(e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-foreground">J'ai envoyé le dépôt de 25$ CAD par Interac</span>
                  </label>
                </div>

                <Button
                  onClick={() => {
                    if (!clientName.trim()) {
                      toast.error("Veuillez entrer votre nom complet", { style: { background: 'hsl(0 84% 60%)', color: 'white', border: 'none' } });
                      return;
                    }
                    if (!whatsappNumber.trim()) {
                      toast.error("Veuillez entrer votre numéro WhatsApp", { style: { background: 'hsl(0 84% 60%)', color: 'white', border: 'none' } });
                      return;
                    }
                    if (!depositPaid) {
                      toast.error("Veuillez confirmer le paiement du dépôt de 25$ CAD", { style: { background: 'hsl(0 84% 60%)', color: 'white', border: 'none' } });
                      return;
                    }
                    setStep("confirm");
                  }}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-rose"
                >
                  Voir le résumé
                </Button>
              </motion.div>
            )}

            {/* Step: Confirmation */}
            {step === "confirm" && selectedService && selectedDate && selectedTime && (
              <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="font-display text-xl font-semibold mb-6">Confirmez votre réservation</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-semibold text-foreground">
                      {selectedService.name}
                      {selectedLength && ` — ${selectedLength.label}`}
                    </span>
                  </div>
                  {selectedLength && (
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Magnets</span>
                      <span className="font-semibold text-foreground">{selectedLength.magnets}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Technicienne</span>
                    <span className="font-semibold text-foreground">
                      {technicians.find((t) => t.id === selectedTech)?.name ?? "Melissa Taina Michel"}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-semibold text-foreground">
                      {selectedDate.toLocaleDateString("fr-CA", { weekday: "long", day: "numeric", month: "long" })}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Heure</span>
                    <span className="font-semibold text-foreground">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Nom</span>
                    <span className="font-semibold text-foreground">{clientName}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">WhatsApp</span>
                    <span className="font-semibold text-foreground">{whatsappNumber}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Dépôt Interac</span>
                    <span className={`font-semibold ${depositPaid ? "text-green-500" : "text-destructive"}`}>
                      {depositPaid ? "Payé — 25$ CAD" : "Non payé"}
                    </span>
                  </div>
                  {designPreview && (
                    <div className="py-3 border-b border-border">
                      <span className="text-muted-foreground text-sm">Modèle désiré</span>
                      <img src={designPreview} alt="Modèle" className="w-20 h-20 object-cover rounded-lg mt-2" />
                    </div>
                  )}
                  <div className="flex justify-between py-3">
                    <span className="text-muted-foreground">Prix total</span>
                    <span className="text-2xl font-display font-bold text-gradient-rose">{getFinalPrice()}$ CAD</span>
                  </div>
                </div>

                <Button
                  onClick={handleConfirm}
                  disabled={saving}
                  size="lg"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-rose text-base"
                >
                  {saving ? <><Loader2 className="animate-spin mr-2" size={18} /> Envoi en cours...</> : "Confirmer et envoyer via WhatsApp"}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Un résumé sera envoyé à Melissa via WhatsApp
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
