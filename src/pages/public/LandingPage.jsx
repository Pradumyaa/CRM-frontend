import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Users,
  BarChart3,
  MessageSquare,
  DollarSign,
  CheckCircle,
  Clock,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Play,
  Star,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

import CoreModules from "./sections/CoreModules";
import BenefitsSection from "./sections/BenefitsSection";
import HeroSection from "./sections/HeroSection";
import IndustriesSection from "./sections/IndustriesSection";
import PricingSection from "./sections/PricingSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import CTASection from "./sections/CTASection";

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Users,
      title: "HRMS",
      subtitle: "Human Resource Management",
      description:
        "Complete employee lifecycle management with onboarding workflows, attendance tracking, and payroll processing (India & US)",
      color: "from-blue-500 to-blue-600",
      stats: "1,240+ Employees Managed",
    },
    {
      icon: Target,
      title: "PMS",
      subtitle: "Performance Management",
      description:
        "Assign tasks, set KPIs, automate reviews, performance scorecards for enhanced team performance",
      color: "from-green-500 to-green-600",
      stats: "28% Productivity Increase",
    },
    {
      icon: DollarSign,
      title: "CRM",
      subtitle: "Customer Relations",
      description:
        "Lead capture, pipeline stages, activity tracking, follow-up automation for revenue growth",
      color: "from-purple-500 to-purple-600",
      stats: "₹5.2M Revenue Tracked",
    },
    {
      icon: MessageSquare,
      title: "Internal Chat",
      subtitle: "Team Communication",
      description:
        "Team channels, file sharing, role-based access, task tagging across departments",
      color: "from-orange-500 to-orange-600",
      stats: "8-12 Hours/Week Saved",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Background Elements */}
      <div className="fixed inset-0 z-[1000] pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#5932EA]/40 to-purple-500/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/50 to-[#5932EA]/30 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <HeroSection features={features} />

      {/* Core Modules ------- Features Section */}
      <CoreModules
        features={features}
        activeFeature={activeFeature}
        setActiveFeature={setActiveFeature}
      />

      {/* Why Choose BET? ------- Benefits Section */}
      <BenefitsSection />

      {/* Who Is BET For? ------- Industries Section */}
      <IndustriesSection />

      {/* Customer Testimonial */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
};

export default LandingPage;