import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import PromosSection from "@/components/PromosSection";
import BookingSection from "@/components/BookingSection";
import GallerySection from "@/components/GallerySection";
import BlogSection from "@/components/BlogSection";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import Footer from "@/components/Footer";
import { type Service } from "@/data/services";

const Index = () => {
  const [preselectedService, setPreselectedService] = useState<Service | null>(null);
  const bookingRef = useRef<HTMLDivElement>(null);

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleServiceSelect = (service: Service) => {
    setPreselectedService(service);
    scrollToBooking();
  };

  const handleBookClick = () => {
    setPreselectedService(null);
    scrollToBooking();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onBookClick={handleBookClick} />
      <AnnouncementBanner />
      <HeroSection onBookClick={handleBookClick} />
      <ServicesSection onSelectService={handleServiceSelect} />
      <PromosSection />
      <div ref={bookingRef}>
        <BookingSection key={preselectedService?.id ?? "default"} preselectedService={preselectedService} />
      </div>
      <GallerySection />
      <BlogSection />
      <Footer />
    </div>
  );
};

export default Index;
