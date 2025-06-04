import React from "react";
import {
  CheckCircle,
  Star,
  Zap,
  Crown,
  Sparkles,
  ArrowRight,
  Shield,
  Headphones,
  Globe,
  Server,
  BarChart2,
  Users,
} from "lucide-react";

const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      tagline: "Perfect for small teams getting started",
      price: "Free",
      period: "for up to 5 users",
      originalPrice: null,
      badge: null,
      color: "from-slate-600 to-slate-700",
      bgGradient: "from-slate-800/50 to-slate-900/50",
      borderColor: "border-slate-700/50",
      buttonStyle: "bg-slate-700 hover:bg-slate-600 text-white",
      icon: <Sparkles className="w-5 h-5" />,
      features: [
        "Basic HRMS module (employee database, leave management)",
        "Task Management system with basic workflows",
        "Email support (48h response time)",
        "5 user limit with role-based access",
        "Standard reporting templates",
        "Mobile app for iOS & Android",
        "100GB secure cloud storage",
      ],
      limitations: [
        "No API access",
        "Limited to 3 integrations",
        "Basic security features",
      ],
      buttonText: "Get Started Free",
      popular: false,
    },
    {
      name: "Professional",
      tagline: "For growing healthcare businesses",
      price: "₹499",
      period: "per user/month billed annually",
      originalPrice: "₹799",
      badge: "Most Popular",
      color: "from-blue-500 to-purple-600",
      bgGradient: "from-blue-900/20 to-purple-900/20",
      borderColor: "border-blue-500/50",
      buttonStyle:
        "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white",
      icon: <Zap className="w-5 h-5" />,
      features: [
        "Complete HRMS & Performance Management",
        "Advanced CRM with patient management",
        "Real-time internal chat & video calls",
        "Custom analytics dashboard with 50+ metrics",
        "Priority support (24h response) with chat",
        "Unlimited integrations (EMR, billing software)",
        "Advanced reporting with export options",
        "API access for custom workflows",
        "500GB secure storage + audit logs",
      ],
      limitations: ["Limited to 100 users", "No dedicated account manager"],
      buttonText: "Start 30-Day Free Trial",
      popular: true,
      savings: "Save 38% vs monthly billing",
    },
    {
      name: "Enterprise",
      tagline: "For large healthcare organizations",
      price: "Custom",
      period: "tailored to your needs",
      originalPrice: null,
      badge: "Best Value",
      color: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-900/20 to-orange-900/20",
      borderColor: "border-amber-500/50",
      buttonStyle:
        "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white",
      icon: <Crown className="w-5 h-5" />,
      features: [
        "All Professional features plus:",
        "Advanced RCM analytics with predictive modeling",
        "Enterprise EHR/EMR integrations",
        "Dedicated customer success manager",
        "Custom workflow automation builder",
        "White-label portal & mobile app",
        "99.9% SLA uptime guarantee",
        "On-premise or private cloud deployment",
        "Unlimited storage with advanced encryption",
        "Compliance dashboard for HIPAA/GDPR",
        "Quarterly business reviews",
      ],
      limitations: ["Minimum 100 user commitment"],
      buttonText: "Get Custom Quote",
      popular: false,
    },
  ];

  const enterpriseBenefits = [
    {
      icon: <Shield className="w-6 h-6 text-green-400" />,
      title: "Enterprise Security",
      description: "SOC 2 Type II certified with advanced threat detection",
    },
    {
      icon: <Headphones className="w-6 h-6 text-blue-400" />,
      title: "24/7 Support",
      description: "Dedicated support team with 1-hour response SLA",
    },
    {
      icon: <Globe className="w-6 h-6 text-purple-400" />,
      title: "Global Infrastructure",
      description: "Multi-region deployment with data residency options",
    },
    {
      icon: <Server className="w-6 h-6 text-amber-400" />,
      title: "High Availability",
      description: "99.99% uptime with automatic failover",
    },
  ];

  return (
    <section
      className="relative py-24 bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden"
      id="pricing"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
            <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
            <span className="text-sm font-semibold text-white/90 tracking-wider">
              TRANSPARENT PRICING
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Pricing Built for
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Healthcare Growth
              </span>
            </span>
          </h2>

          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Whether you're a small clinic or a large hospital network, BET
            scales with your needs.
            <span className="font-semibold text-white">
              {" "}
              1,200+ healthcare providers
            </span>{" "}
            trust our platform for their critical operations.
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-8 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>No hidden fees</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>HIPAA compliant by design</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>30-day money-back guarantee</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative group ${
                plan.popular ? "lg:scale-105 lg:-mt-4" : ""
              }`}
            >
              {/* Popular Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div
                    className={`px-4 py-1.5 rounded-full text-sm font-bold text-white bg-gradient-to-r ${plan.color} shadow-lg flex items-center gap-2`}
                  >
                    {plan.popular && (
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    )}
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Card */}
              <div
                className={`relative h-full bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border ${
                  plan.borderColor
                } hover:border-opacity-100 transition-all duration-300 group-hover:shadow-2xl ${
                  plan.popular ? "shadow-xl shadow-blue-500/20" : ""
                }`}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${plan.bgGradient} rounded-2xl opacity-50`}
                ></div>

                <div className="relative z-10">
                  {/* Plan Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-r ${plan.color} text-white`}
                    >
                      {plan.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {plan.name}
                      </h3>
                      <p className="text-white/70 text-sm">{plan.tagline}</p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold text-white">
                        {plan.price}
                      </span>
                      {plan.originalPrice && (
                        <span className="text-lg text-white/50 line-through">
                          {plan.originalPrice}
                        </span>
                      )}
                    </div>
                    <p className="text-white/70">{plan.period}</p>
                    {plan.savings && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium mt-2">
                        <span>{plan.savings}</span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-white/90 font-medium mb-3">
                      Key Features:
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-white/90">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations */}
                  {plan.limitations && plan.limitations.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-white/70 font-medium mb-3">
                        Limitations:
                      </h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, limitationIndex) => (
                          <li
                            key={limitationIndex}
                            className="flex items-start gap-3"
                          >
                            <svg
                              className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            <span className="text-white/70">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA Button */}
                  <button
                    className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 group ${plan.buttonStyle}`}
                  >
                    <span>{plan.buttonText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {plan.popular && (
                    <p className="text-center text-white/60 text-xs mt-3 flex items-center justify-center gap-1">
                      <Users className="w-4 h-4" /> Chosen by 68% of healthcare
                      businesses
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise Benefits */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {enterpriseBenefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-blue-400/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-white/10">{benefit.icon}</div>
                <div>
                  <h4 className="text-lg font-semibold text-white">
                    {benefit.title}
                  </h4>
                  <p className="text-white/70 text-sm">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-900/40 to-purple-900/40 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-white mb-4">
              Not sure which plan is right for you?
            </h3>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Our healthcare technology experts can help you choose the perfect
              solution based on your practice size, specialty, and workflow
              needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 group">
                <span>Talk to an Expert</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2">
                <span>Compare All Features</span>
                <BarChart2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Teaser */}
        <div className="text-center mt-16">
          <p className="text-white/60 text-sm">
            Need more details? Visit our{" "}
            <a
              href="support"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              comprehensive pricing FAQ
            </a>{" "}
            or{" "}
            <a
              href="contact"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              request a personalized demo
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
