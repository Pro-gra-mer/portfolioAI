import HeroSection from '@/components/sections/HeroSection';
import FeaturedProjectSection from '@/components/sections/FeaturedProjectSection';
import ServicesSection from '@/components/sections/ServicesSection';
import CTASection from '@/components/sections/CTASection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <HeroSection />
      <ServicesSection />
      <FeaturedProjectSection />      
      <CTASection />
    </div>
  );
}