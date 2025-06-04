import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  BarChart3,
  MessageSquare,
  DollarSign,
  Target,
  CheckCircle,
  ArrowRight,
  Clock,
  Shield,
  Zap,
  TrendingUp,
  Sparkles,
  Star,
  Activity,
  Database,
  Globe,
  Play,
  ChevronRight,
  Building2,
  FileText,
  Calendar,
  Mail,
  Phone,
  Video,
  BarChart2,
  PieChart,
  Settings,
  UserCheck,
  Award,
  Workflow,
  Plus,
  Minus,
} from "lucide-react";

const ProductsPage = () => {
  const [activeProduct, setActiveProduct] = useState(0);
  const [expandedFeature, setExpandedFeature] = useState(null);

  const products = [
    {
      icon: Users,
      title: "BET HRMS",
      subtitle: "Complete Human Resource Management",
      description:
        "End-to-end employee lifecycle management with intelligent automation, compliance tracking, and advanced analytics for modern healthcare teams.",
      price: "₹299/user/month",
      color: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-900/20 to-blue-800/20",
      features: [
        {
          title: "Smart Onboarding",
          desc: "Automated digital onboarding with e-signatures, document collection, and workflow automation",
          icon: UserCheck,
        },
        {
          title: "Attendance & Time Tracking",
          desc: "GPS-enabled attendance, shift management, overtime calculations, and real-time reporting",
          icon: Clock,
        },
        {
          title: "Payroll Automation",
          desc: "Multi-country payroll processing (India & US) with tax calculations and compliance",
          icon: BarChart2,
        },
        {
          title: "Performance Management",
          desc: "360-degree reviews, goal tracking, and performance analytics with automated workflows",
          icon: TrendingUp,
        },
        {
          title: "Employee Self-Service",
          desc: "Mobile-first portal for leave requests, document access, and profile management",
          icon: Phone,
        },
        {
          title: "Compliance Dashboard",
          desc: "HIPAA, labor law compliance tracking with automated alerts and reporting",
          icon: Shield,
        },
      ],
      benefits: [
        "85% reduction in HR administrative tasks",
        "99.9% payroll accuracy with automated calculations",
        "50% faster onboarding process",
        "100% compliance with healthcare regulations",
      ],
      integrations: ["ADP", "QuickBooks", "Slack", "Microsoft Teams"],
      testimonial: {
        quote:
          "BET HRMS transformed our HR operations completely. We've saved 20+ hours per week on administrative tasks.",
        author: "Sarah Johnson, HR Director at MedCare Solutions",
      },
    },
    {
      icon: Target,
      title: "BET PMS",
      subtitle: "Performance Management System",
      description:
        "AI-powered performance tracking with goal management, KPI monitoring, and automated review cycles designed for high-performing healthcare teams.",
      price: "₹199/user/month",
      color: "from-green-500 to-green-600",
      bgGradient: "from-green-900/20 to-green-800/20",
      features: [
        {
          title: "Goal Management",
          desc: "SMART goal setting, tracking, and achievement analytics with automated progress updates",
          icon: Target,
        },
        {
          title: "KPI Dashboard",
          desc: "Real-time performance metrics, custom KPIs, and intelligent insights for decision-making",
          icon: BarChart3,
        },
        {
          title: "Task Automation",
          desc: "Intelligent task assignment, priority management, and workflow optimization",
          icon: Workflow,
        },
        {
          title: "Review Cycles",
          desc: "Automated performance reviews, 360-degree feedback, and development planning",
          icon: Award,
        },
        {
          title: "Team Collaboration",
          desc: "Cross-functional project management with real-time communication and file sharing",
          icon: Users,
        },
        {
          title: "Performance Analytics",
          desc: "Advanced reporting, trend analysis, and predictive performance insights",
          icon: TrendingUp,
        },
      ],
      benefits: [
        "300% increase in team productivity",
        "90% faster goal achievement tracking",
        "75% reduction in manual performance reviews",
        "Real-time visibility into team performance",
      ],
      integrations: ["Asana", "Trello", "Jira", "Monday.com"],
      testimonial: {
        quote:
          "Our team productivity increased by 300% after implementing BET PMS. The automation is incredible.",
        author: "Michael Chen, Operations Manager at HealthTech Pro",
      },
    },
    {
      icon: DollarSign,
      title: "BET CRM",
      subtitle: "Customer Relationship Management",
      description:
        "Intelligent lead management with AI-powered insights, automated nurturing sequences, and revenue optimization for healthcare service providers.",
      price: "₹399/user/month",
      color: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-900/20 to-purple-800/20",
      features: [
        {
          title: "Lead Intelligence",
          desc: "AI-powered lead scoring, qualification, and automated follow-up sequences",
          icon: Zap,
        },
        {
          title: "Pipeline Management",
          desc: "Visual sales pipeline with drag-and-drop functionality and conversion tracking",
          icon: BarChart3,
        },
        {
          title: "Revenue Forecasting",
          desc: "Predictive analytics for revenue projection and business growth planning",
          icon: TrendingUp,
        },
        {
          title: "Customer Journey",
          desc: "Complete customer lifecycle tracking from lead to long-term relationship",
          icon: Users,
        },
        {
          title: "Communication Hub",
          desc: "Integrated email, SMS, and call management with conversation history",
          icon: MessageSquare,
        },
        {
          title: "Mobile CRM",
          desc: "Full-featured mobile app for on-the-go customer management and updates",
          icon: Phone,
        },
      ],
      benefits: [
        "45% increase in lead conversion rates",
        "60% faster sales cycle completion",
        "Real-time revenue visibility and forecasting",
        "Automated lead nurturing sequences",
      ],
      integrations: ["Salesforce", "HubSpot", "Mailchimp", "Zapier"],
      testimonial: {
        quote:
          "BET CRM helped us increase our conversion rates by 45%. The AI insights are game-changing.",
        author: "Jennifer Lee, Sales Director at Premier Healthcare",
      },
    },
    {
      icon: MessageSquare,
      title: "BET Chat",
      subtitle: "Internal Communication Platform",
      description:
        "Secure team communication with advanced file sharing, task integration, and role-based access controls built for healthcare compliance.",
      price: "₹99/user/month",
      color: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-900/20 to-orange-800/20",
      features: [
        {
          title: "Secure Messaging",
          desc: "End-to-end encrypted channels and direct messaging with HIPAA compliance",
          icon: Shield,
        },
        {
          title: "File Collaboration",
          desc: "Advanced file sharing with version control, comments, and approval workflows",
          icon: FileText,
        },
        {
          title: "Video Conferencing",
          desc: "Built-in HD video calls, screen sharing, and meeting recordings",
          icon: Video,
        },
        {
          title: "Task Integration",
          desc: "Link conversations to tasks, projects, and deadlines with automated updates",
          icon: CheckCircle,
        },
        {
          title: "Role-Based Access",
          desc: "Granular permissions, channel management, and administrative controls",
          icon: Settings,
        },
        {
          title: "Mobile-First Design",
          desc: "Native mobile apps with offline message sync and push notifications",
          icon: Phone,
        },
      ],
      benefits: [
        "8-12 hours/week saved on coordination",
        "90% reduction in email clutter",
        "Real-time team collaboration across locations",
        "100% HIPAA compliant communication",
      ],
      integrations: ["Slack", "Microsoft Teams", "Zoom", "Google Workspace"],
      testimonial: {
        quote:
          "BET Chat eliminated our email chaos and saved us 12 hours per week on coordination.",
        author: "David Rodriguez, IT Manager at Regional Medical Group",
      },
    },
    {
      icon: BarChart3,
      title: "BET Analytics",
      subtitle: "Revenue Cycle Management Analytics",
      description:
        "Advanced healthcare revenue analytics with real-time DSO tracking, denial management, and comprehensive payer analysis for optimal cash flow.",
      price: "₹599/user/month",
      color: "from-indigo-500 to-indigo-600",
      bgGradient: "from-indigo-900/20 to-indigo-800/20",
      features: [
        {
          title: "DSO Tracking",
          desc: "Real-time Days Sales Outstanding monitoring with automated alerts and trends",
          icon: Clock,
        },
        {
          title: "Denial Management",
          desc: "Automated denial tracking, root cause analysis, and workflow optimization",
          icon: Activity,
        },
        {
          title: "Payer Analytics",
          desc: "Comprehensive payer performance analysis with aging reports and insights",
          icon: PieChart,
        },
        {
          title: "Claims Intelligence",
          desc: "AI-powered claims processing insights with efficiency metrics and optimization",
          icon: Zap,
        },
        {
          title: "Revenue Leakage Detection",
          desc: "Identify and prevent revenue loss with predictive analytics and alerts",
          icon: TrendingUp,
        },
        {
          title: "Compliance Reporting",
          desc: "Automated regulatory reporting with audit trails and documentation",
          icon: Shield,
        },
      ],
      benefits: [
        "92% claims processing automation",
        "40-60% reduction in denial rates",
        "25-35% improvement in cash flow",
        "Real-time revenue cycle visibility",
      ],
      integrations: ["Epic", "Cerner", "AllScripts", "athenahealth"],
      testimonial: {
        quote:
          "BET Analytics reduced our denial rates by 60% and improved cash flow by 35%. Incredible results.",
        author: "Dr. Amanda Foster, CFO at Metro Healthcare Network",
      },
    },
  ];

  const currentProduct = products[activeProduct];
  const CurrentIcon = currentProduct.icon;

  return (
    <>
      {/* Hero Section - Light */}
      <section className="relative pt-24 pb-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-[#5932EA]/20 text-[#5932EA] rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              BET Product Suite
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Choose the Perfect
              <span className="bg-gradient-to-r from-[#5932EA] to-purple-600 bg-clip-text text-transparent">
                {" "}
                Solution for Your Needs
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Each BET product is designed to work independently or as part of
              an integrated suite. Start with what you need most and expand as
              you grow.
            </p>

            {/* Product Selection Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {products.map((product, index) => (
                <button
                  key={index}
                  onClick={() => setActiveProduct(index)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeProduct === index
                      ? `bg-gradient-to-r ${product.color} text-white shadow-lg`
                      : "bg-white/70 text-gray-600 hover:bg-white border border-gray-200"
                  }`}
                >
                  <product.icon className="w-4 h-4" />
                  {product.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Details - Dark */}
      <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float-delay"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Product Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div
                className={`p-4 rounded-2xl bg-gradient-to-r ${currentProduct.color} shadow-lg`}
              >
                <CurrentIcon className="w-12 h-12 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-4xl font-bold text-white">
                  {currentProduct.title}
                </h2>
                <p className="text-xl text-purple-300">
                  {currentProduct.subtitle}
                </p>
              </div>
            </div>

            <p className="text-xl text-white/90 max-w-4xl mx-auto mb-8 leading-relaxed">
              {currentProduct.description}
            </p>

            <div
              className={`inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r ${currentProduct.color} rounded-2xl text-white font-bold text-2xl shadow-xl`}
            >
              <DollarSign className="w-6 h-6" />
              Starting at {currentProduct.price}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {currentProduct.features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              const isExpanded = expandedFeature === index;

              return (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group cursor-pointer"
                  onClick={() => setExpandedFeature(isExpanded ? null : index)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-r ${currentProduct.color} shadow-md`}
                      >
                        <FeatureIcon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-bold text-white text-lg">
                        {feature.title}
                      </h3>
                    </div>
                    {isExpanded ? (
                      <Minus className="w-5 h-5 text-white/60 flex-shrink-0" />
                    ) : (
                      <Plus className="w-5 h-5 text-white/60 flex-shrink-0" />
                    )}
                  </div>

                  <p
                    className={`text-white/80 leading-relaxed transition-all ${
                      isExpanded ? "block" : "line-clamp-2"
                    }`}
                  >
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits & Results - Light */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Proven Results with {currentProduct.title}
              </h2>

              <div className="space-y-6 mb-8">
                {currentProduct.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-r ${currentProduct.color} flex items-center justify-center flex-shrink-0 mt-1`}
                    >
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-700 text-lg font-medium">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              {/* Testimonial */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4 text-lg">
                  "{currentProduct.testimonial.quote}"
                </p>
                <p className="text-gray-600 font-semibold">
                  — {currentProduct.testimonial.author}
                </p>
              </div>
            </div>

            <div>
              <div
                className={`bg-gradient-to-br ${currentProduct.bgGradient} p-8 rounded-3xl border border-gray-200`}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Popular Integrations
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {currentProduct.integrations.map((integration, i) => (
                    <div
                      key={i}
                      className="bg-white/80 p-4 rounded-xl text-center font-semibold text-gray-800 hover:bg-white transition-all"
                    >
                      {integration}
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <Link
                    to="/crm"
                    className={`w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r ${currentProduct.color} text-white rounded-xl font-bold text-lg hover:scale-105 transition-transform`}
                  >
                    Try {currentProduct.title} Free
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-gray-400 transition-all">
                    <Calendar className="w-5 h-5" />
                    Schedule Demo
                  </button>
                </div>

                <p className="text-sm text-gray-600 text-center mt-4">
                  ✓ 14-day free trial • ✓ No credit card required • ✓ Cancel
                  anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Products Overview - Dark */}
      <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Complete Product Comparison
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              See how all BET products work together to transform your business
              operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => {
              const ProductIcon = product.icon;
              return (
                <div
                  key={index}
                  className={`bg-white/5 backdrop-blur-sm p-8 rounded-3xl border transition-all hover:bg-white/10 group ${
                    activeProduct === index
                      ? "border-white/30"
                      : "border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${product.color} shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <ProductIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {product.title}
                      </h3>
                      <p className="text-purple-300 text-sm">
                        {product.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-white/80 mb-6 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`text-2xl font-bold bg-gradient-to-r ${product.color} bg-clip-text text-transparent`}
                    >
                      {product.price}
                    </div>
                    <button
                      onClick={() => setActiveProduct(index)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        activeProduct === index
                          ? `bg-gradient-to-r ${product.color} text-white`
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {activeProduct === index ? "Selected" : "View Details"}
                    </button>
                  </div>

                  <div className="space-y-2">
                    {product.benefits.slice(0, 2).map((benefit, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm text-white/70"
                      >
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
                    <div className="text-sm text-purple-300 font-medium">
                      +{product.benefits.length - 2} more benefits
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - Light */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start with any BET product and scale your solution as your business
            grows
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/crm"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#5932EA] to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-[#5932EA] font-bold text-lg transition-all transform hover:scale-105"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-[#5932EA] hover:bg-[#5932EA]/5 font-bold text-lg transition-all"
            >
              Talk to Sales
              <Phone className="ml-2 w-5 h-5" />
            </Link>
          </div>

          <p className="mt-8 text-gray-500 text-sm">
            ✨ No credit card required • 14-day free trial • Setup in under 5
            minutes
          </p>
        </div>
      </section>
    </>
  );
};

export default ProductsPage;
