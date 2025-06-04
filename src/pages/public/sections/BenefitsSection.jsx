import React, { useState } from "react";
import {
  Clock,
  Zap,
  Shield,
  TrendingUp,
  Sparkles,
  Users,
  Globe,
  FileText,
  BarChart2,
  Server,
  Lock,
  Headphones,
  ArrowRight,
  Star,
  Building2,
} from "lucide-react";

const PremiumBenefitsSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const coreBenefits = [
    {
      icon: Clock,
      title: "Time Efficiency",
      desc: "Automate 85% of tasks with our intelligent workflows, saving 15-25 hours per team weekly",
      metric: "40% Faster Operations",
      color: "from-blue-500 to-blue-600",
      lightColor: "from-blue-50 to-blue-400/70",
      hoverGlow: "shadow-blue-500/40",
      accentColor: "text-blue-600",
      bgAccent: "bg-blue-50",
      features: [
        "One-click report generation",
        "Automated data synchronization",
        "AI-powered task prioritization",
      ],
    },
    {
      icon: Zap,
      title: "Enterprise Scalability",
      desc: "From startup to Fortune 500, our architecture grows seamlessly with your business needs",
      metric: "10x Growth Ready",
      color: "from-purple-500 to-purple-600",
      lightColor: "from-purple-50 to-purple-400/80",
      hoverGlow: "shadow-purple-500/40",
      accentColor: "text-purple-600",
      bgAccent: "bg-purple-50",
      features: [
        "Handles 10M+ monthly transactions",
        "Multi-region deployment",
        "Elastic resource allocation",
      ],
    },
    {
      icon: Shield,
      title: "Bank-Grade Security",
      desc: "HIPAA, GDPR, and DPDP 2023 compliant with military-grade encryption standards",
      metric: "99.99% Uptime SLA",
      color: "from-emerald-500 to-emerald-600",
      lightColor: "from-emerald-50 to-emerald-300/80",
      hoverGlow: "shadow-emerald-500/40",
      accentColor: "text-emerald-600",
      bgAccent: "bg-emerald-50",
      features: [
        "256-bit AES encryption",
        "SOC 2 Type II certified",
        "Real-time threat detection",
      ],
    },
    {
      icon: TrendingUp,
      title: "Performance Boost",
      desc: "Optimized workflows deliver measurable productivity gains across all operations",
      metric: "3x Output Increase",
      color: "from-orange-500 to-orange-600",
      lightColor: "from-orange-50 to-orange-300/80",
      hoverGlow: "shadow-orange-500/40",
      accentColor: "text-orange-600",
      bgAccent: "bg-orange-50",
      features: [
        "Real-time analytics dashboard",
        "Automated KPI tracking",
        "Bottleneck identification",
      ],
    },
    {
      icon: Users,
      title: "Team Empowerment",
      desc: "Intuitive interface reduces training time by 70% while increasing adoption rates",
      metric: "95% User Adoption",
      color: "from-rose-500 to-rose-600",
      lightColor: "from-rose-50 to-rose-400/85",
      hoverGlow: "shadow-rose-500/40",
      accentColor: "text-rose-600",
      bgAccent: "bg-rose-50",
      features: [
        "Role-based access control",
        "Collaboration workflows",
        "Mobile-optimized experience",
      ],
    },
    {
      icon: Globe,
      title: "Global Compliance",
      desc: "Pre-configured for 30+ countries with localized tax and regulatory requirements",
      metric: "50+ Regulations",
      color: "from-indigo-500 to-indigo-600",
      lightColor: "from-indigo-50 to-indigo-400/80",
      hoverGlow: "shadow-indigo-500/40",
      accentColor: "text-indigo-600",
      bgAccent: "bg-indigo-500",
      features: [
        "Automated tax calculations",
        "Regional compliance reporting",
        "Multi-language support",
      ],
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-200/40 to-blue-200/40 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-indigo-200/40 to-purple-200/40 rounded-full blur-3xl animate-float-delay"></div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#000_1px,transparent_1px),linear-gradient(180deg,#000_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Premium Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-[#5932EA]/20 text-[#5932EA] rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4 mr-2" /> Competitive Advantage
          </div>

          <h2 className="text-6xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-[#5932EA] to-purple-600 bg-clip-text text-transparent">
              WHY INDUSTRY LEADERS
              <br />
              CHOOSE BET?
            </span>
          </h2>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The platform engineered for{" "}
            <span className="font-semibold text-gray-800">
              measurable business transformation
            </span>
          </p>

          {/* Stats Bar */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { label: "Enterprise Clients", value: "500+", icon: Building2 },
              { label: "Countries Supported", value: "30+", icon: Globe },
              { label: "Uptime Guarantee", value: "99.99%", icon: Shield },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-gray-300/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200/70 shadow-xl shadow-purple-400/40 hover:shadow-purple-600/50 transition-all duration-300 group"
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 group-hover:scale-110 transition-transform">
                    <stat.icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreBenefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const isHovered = hoveredCard === index;

            return (
              <div
                key={index}
                className="group relative"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className={`
                  relative bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl
                  transition-all duration-500 hover:-translate-y-3 cursor-pointer h-full
                  ${isHovered ? `${benefit.hoverGlow} scale-[1.02]` : ""}
                  flex flex-col overflow-hidden
                `}
                >
                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${benefit.lightColor} opacity-0 group-hover:opacity-50 transition-opacity duration-300`}
                  ></div>

                  {/* Premium Icon */}
                  <div className="relative z-10">
                    <div
                      className={`
                      w-18 h-18 rounded-2xl bg-gradient-to-r ${benefit.color} 
                      flex items-center justify-center mb-6 shadow-xl
                      transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
                      relative overflow-hidden
                    `}
                    >
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <Icon className="w-10 h-10 text-white relative z-10" />
                    </div>
                  </div>

                  {/* Premium Content */}
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                      {benefit.title}
                    </h3>

                    <p className="text-gray-600 mb-6 leading-relaxed text-lg group-hover:text-gray-700 transition-colors">
                      {benefit.desc}
                    </p>

                    {/* Premium Features */}
                    <div className="mt-auto">
                      <div className="mb-8 space-y-4">
                        {benefit.features.map((feature, i) => (
                          <div key={i} className="flex items-start group/item">
                            <div className="flex-shrink-0 mt-2">
                              <div
                                className={`w-3 h-3 rounded-full bg-gradient-to-r ${benefit.color} shadow-sm group-hover/item:scale-125 transition-transform`}
                              ></div>
                            </div>
                            <span className="text-gray-700 ml-4 text-base group-hover/item:text-gray-900 transition-colors">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Metric Badge */}
                      <div
                        className={`inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r ${benefit.color} rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-105`}
                      >
                        <BarChart2 className="w-5 h-5 text-white" />
                        <span className="text-base font-bold text-white">
                          {benefit.metric}
                        </span>
                        <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Premium Enterprise Assurance */}
        <div className="mt-24 text-center bg-gradient-to-br from-white via-gray-50 to-blue-50/50 backdrop-blur-sm rounded-3xl border-2 border-gray-200/50 p-12 max-w-6xl mx-auto shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden">
          {/* Premium Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#6366f1_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full border border-indigo-200/50 mb-8">
              <Shield className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-700">
                ENTERPRISE ASSURANCE
              </span>
            </div>

            <h3 className="text-4xl font-bold text-gray-900 mb-6">
              Enterprise-Grade{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Guarantee
              </span>
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Every BET deployment includes dedicated architecture review, 24/7
              monitoring, and quarterly optimization sessions to ensure{" "}
              <span className="font-semibold text-gray-800">
                continuous value delivery
              </span>
              .
            </p>

            {/* Premium Trust Indicators */}
            <div className="mt-12">
              <h4 className="text-2xl text-gray-700 mb-10 font-semibold">
                Trusted by{" "}
                <span className="text-indigo-600">businesses worldwide</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  {
                    icon: Server,
                    label: "99.95% Uptime",
                    color: "text-purple-600",
                    bg: "bg-purple-50",
                  },
                  {
                    icon: Lock,
                    label: "Enterprise Security",
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                  },
                  {
                    icon: Globe,
                    label: "Global Data Centers",
                    color: "text-emerald-600",
                    bg: "bg-emerald-50",
                  },
                  {
                    icon: Headphones,
                    label: "24/7 Support",
                    color: "text-amber-600",
                    bg: "bg-amber-50",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center group hover:scale-110 transition-all duration-300"
                  >
                    <div
                      className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all`}
                    >
                      <item.icon className={`w-8 h-8 ${item.color}`} />
                    </div>
                    <span className="text-gray-700 font-medium text-center">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumBenefitsSection;
