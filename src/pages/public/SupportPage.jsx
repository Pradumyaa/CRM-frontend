import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  Book,
  MessageCircle,
  Mail,
  Phone,
  Video,
  Search,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle,
  Star,
  Headphones,
  FileText,
  Monitor,
  Settings,
  Users,
  Shield,
  Zap,
  ArrowRight,
  Download,
  Play,
  Calendar,
  Globe,
  Award,
} from "lucide-react";

const SupportPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openFAQ, setOpenFAQ] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const supportChannels = [
    {
      icon: Book,
      title: "Knowledge Base",
      description:
        "Comprehensive guides, tutorials, and documentation to get you started quickly",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      link: "#knowledge-base",
      availability: "Available 24/7",
      responseTime: "Instant access",
    },
    {
      icon: MessageCircle,
      title: "Live Chat Support",
      description:
        "Get instant help from our support team for quick questions and guidance",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      link: "#chat",
      availability: "Mon-Fri, 9AM-6PM IST",
      responseTime: "< 2 minutes",
    },
    {
      icon: Mail,
      title: "Email Support",
      description:
        "Detailed technical support and comprehensive solutions via email",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      link: "mailto:support@getmaxsolutions.com",
      availability: "24/7 submission",
      responseTime: "< 24 hours",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description:
        "Speak directly with our specialists for complex issues and urgent matters",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      link: "tel:+91-XXXXXXXXXX",
      availability: "Mon-Fri, 9AM-6PM IST",
      responseTime: "Immediate",
    },
    {
      icon: Video,
      title: "Screen Share Support",
      description:
        "Get personalized help with screen sharing for complex configurations",
      color: "from-rose-500 to-rose-600",
      bgColor: "bg-rose-50",
      link: "#screen-share",
      availability: "By appointment",
      responseTime: "Same day",
    },
    {
      icon: Users,
      title: "Dedicated Success Manager",
      description:
        "Enterprise customers get a dedicated success manager for ongoing support",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      link: "#enterprise",
      availability: "Enterprise only",
      responseTime: "< 1 hour",
    },
  ];

  const faqs = [
    {
      category: "getting-started",
      question: "How do I get started with BET?",
      answer:
        "Getting started is simple! Sign up for a free account, choose your modules, and our guided onboarding will walk you through setup. Most teams are operational within 24-48 hours.",
    },
    {
      category: "getting-started",
      question: "Is BET only for healthcare companies?",
      answer:
        "While BET is optimized for healthcare and RCM companies, our modular design works for any service-based business. We support IT services, consulting firms, and other professional services.",
    },
    {
      category: "features",
      question: "Can I integrate BET with my existing tools?",
      answer:
        "Yes! BET offers 100+ integrations including popular EMR systems, accounting software, and productivity tools. We also provide open APIs for custom integrations.",
    },
    {
      category: "features",
      question: "What modules are included in each plan?",
      answer:
        "Our Starter plan includes basic HRMS and task management. Professional adds CRM, analytics, and advanced features. Enterprise includes all modules plus custom workflows and dedicated support.",
    },
    {
      category: "security",
      question: "How secure is my data with BET?",
      answer:
        "We take security seriously. BET is HIPAA and GDPR compliant, uses 256-bit AES encryption, maintains SOC 2 Type II certification, and includes real-time threat monitoring.",
    },
    {
      category: "security",
      question: "Where is my data stored?",
      answer:
        "Data is stored in secure, enterprise-grade data centers with 99.9% uptime SLA. We offer multi-region deployment and can accommodate data residency requirements.",
    },
    {
      category: "billing",
      question: "How does billing work?",
      answer:
        "We offer flexible billing options including monthly and annual plans. Annual plans save 38%. Enterprise customers can negotiate custom pricing based on their needs.",
    },
    {
      category: "billing",
      question: "Can I change or cancel my plan?",
      answer:
        "Yes, you can upgrade, downgrade, or cancel anytime. Changes take effect at your next billing cycle. We also offer a 30-day money-back guarantee.",
    },
    {
      category: "technical",
      question: "What are the system requirements?",
      answer:
        "BET is cloud-based and works on any modern web browser. We also provide mobile apps for iOS and Android. No special hardware or software installation required.",
    },
    {
      category: "technical",
      question: "Do you provide data migration services?",
      answer:
        "Yes! Our team provides free data migration assistance for Professional and Enterprise plans. We support imports from Excel, CSV, and most common business software.",
    },
  ];

  const categories = [
    { id: "all", name: "All Topics", icon: Book },
    { id: "getting-started", name: "Getting Started", icon: Play },
    { id: "features", name: "Features & Usage", icon: Settings },
    { id: "security", name: "Security & Compliance", icon: Shield },
    { id: "billing", name: "Billing & Plans", icon: FileText },
    { id: "technical", name: "Technical Support", icon: Monitor },
  ];

  const resources = [
    {
      title: "Quick Start Guide",
      description: "Get up and running with BET in under 30 minutes",
      icon: Play,
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "#guide",
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides for all BET features",
      icon: Video,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      link: "#videos",
    },
    {
      title: "API Documentation",
      description: "Complete API reference for developers and integrations",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "#api",
    },
    {
      title: "Best Practices",
      description: "Learn how top customers optimize their BET usage",
      icon: Award,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      link: "#practices",
    },
  ];

  const filteredFAQs =
    selectedCategory === "all"
      ? faqs
      : faqs.filter((faq) => faq.category === selectedCategory);

  const searchFilteredFAQs = filteredFAQs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Hero Section */}
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
              <Headphones className="w-4 h-4 mr-2" />
              We're Here to Help
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Get the Support
              <span className="bg-gradient-to-r from-[#5932EA] to-purple-600 bg-clip-text text-transparent">
                {" "}
                You Deserve
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              From quick answers to complex technical support, our team is
              committed to your success. Find help through multiple channels
              designed for your convenience.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help topics, features, or questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#5932EA]/50 focus:border-[#5932EA] transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Multiple Ways to Get Help
            </h2>
            <p className="text-xl text-gray-600">
              Choose the support channel that works best for your situation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {supportChannels.map((channel, index) => {
              const Icon = channel.icon;
              return (
                <div
                  key={index}
                  className={`${channel.bgColor} p-8 rounded-3xl border border-gray-200/50 hover:shadow-lg transition-all transform hover:-translate-y-2 group`}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${channel.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {channel.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {channel.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        {channel.availability}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        Response: {channel.responseTime}
                      </span>
                    </div>
                  </div>

                  <a
                    href={channel.link}
                    className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${channel.color} text-white rounded-xl font-semibold hover:scale-105 transition-transform`}
                  >
                    Get Help
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Knowledge Base & Resources */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Self-Service Resources
            </h2>
            <p className="text-xl text-gray-600">
              Find instant answers with our comprehensive knowledge base
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <div
                  key={index}
                  className={`${resource.bgColor} p-6 rounded-2xl hover:shadow-lg transition-all transform hover:-translate-y-1 group cursor-pointer`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`w-12 h-12 rounded-xl ${resource.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`w-6 h-6 ${resource.color}`} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {resource.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white" id="faqs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Find quick answers to common questions about BET
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    selectedCategory === category.id
                      ? "bg-[#5932EA] text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {searchFilteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-md transition-all"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  {openFAQ === index ? (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>

                {openFAQ === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {searchFilteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No matching questions found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search terms or browse different categories
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="px-6 py-3 bg-[#5932EA] text-white rounded-xl hover:bg-[#4526B5] transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Status & Updates */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* System Status */}
            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    System Status
                  </h3>
                  <p className="text-green-600 font-medium">
                    All systems operational
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    service: "BET Platform",
                    status: "Operational",
                    uptime: "99.98%",
                  },
                  {
                    service: "API Services",
                    status: "Operational",
                    uptime: "99.97%",
                  },
                  {
                    service: "Mobile Apps",
                    status: "Operational",
                    uptime: "99.99%",
                  },
                  {
                    service: "Data Processing",
                    status: "Operational",
                    uptime: "99.96%",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-gray-900">
                        {item.service}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">
                        {item.status}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.uptime} uptime
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="#status"
                className="inline-flex items-center gap-2 mt-6 text-[#5932EA] font-semibold hover:text-purple-600 transition-colors"
              >
                View Detailed Status
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Product Updates */}
            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Latest Updates
                  </h3>
                  <p className="text-gray-600">New features and improvements</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    date: "Jan 15, 2025",
                    title: "Enhanced RCM Analytics",
                    description:
                      "New predictive insights and automated denial management",
                    type: "Feature",
                  },
                  {
                    date: "Jan 10, 2025",
                    title: "Mobile App 2.0",
                    description:
                      "Redesigned interface with offline capabilities",
                    type: "Update",
                  },
                  {
                    date: "Jan 5, 2025",
                    title: "API Rate Limits Increased",
                    description: "Higher API limits for enterprise customers",
                    type: "Improvement",
                  },
                ].map((update, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          update.type === "Feature"
                            ? "bg-green-100 text-green-600"
                            : update.type === "Update"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-purple-100 text-purple-600"
                        }`}
                      >
                        {update.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {update.date}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {update.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {update.description}
                    </p>
                  </div>
                ))}
              </div>

              <a
                href="#updates"
                className="inline-flex items-center gap-2 mt-6 text-[#5932EA] font-semibold hover:text-purple-600 transition-colors"
              >
                View All Updates
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support CTA */}
      <section className="py-24 bg-gradient-to-br from-[#5932EA] via-purple-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-full text-sm font-semibold mb-6">
            <Headphones className="w-4 h-4 mr-2" />
            Still Need Help?
          </div>

          <h2 className="text-4xl font-bold text-white mb-6">
            Our Support Team is Here for You
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Can't find what you're looking for? Our friendly support team is
            ready to help with personalized assistance.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-[#5932EA] rounded-xl hover:bg-gray-50 font-bold text-lg transition-all transform hover:scale-105"
            >
              <Mail className="mr-2 w-5 h-5" />
              Contact Support
            </Link>
            <button className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 font-bold text-lg transition-all">
              <Calendar className="mr-2 w-5 h-5" />
              Schedule a Call
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              {
                icon: Clock,
                title: "24/7 Email Support",
                desc: "Get help anytime via email",
              },
              {
                icon: Users,
                title: "Expert Team",
                desc: "Healthcare technology specialists",
              },
              {
                icon: Globe,
                title: "Global Coverage",
                desc: "Support across 30+ countries",
              },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-blue-200 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default SupportPage;
