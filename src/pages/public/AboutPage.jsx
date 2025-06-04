import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Target,
  Award,
  Globe,
  TrendingUp,
  Shield,
  Zap,
  Heart,
  Rocket,
  Star,
  CheckCircle,
  ArrowRight,
  Building2,
  Clock,
  Sparkles,
  Activity,
  BarChart3,
  Lightbulb,
  Coffee,
  Code,
  Headphones,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Twitter,
} from "lucide-react";

const AboutPage = () => {
  const stats = [
    {
      icon: Users,
      value: "500+",
      label: "Healthcare Businesses",
      desc: "Trust BET daily",
    },
    {
      icon: Globe,
      value: "30+",
      label: "Countries Supported",
      desc: "Global presence",
    },
    {
      icon: Activity,
      value: "99.9%",
      label: "Uptime Guarantee",
      desc: "Enterprise reliability",
    },
    {
      icon: TrendingUp,
      value: "400%",
      label: "Average ROI",
      desc: "Within first year",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description:
        "Every decision we make starts with our customers' success in mind.",
      color: "from-red-500 to-pink-600",
    },
    {
      icon: Rocket,
      title: "Innovation Driven",
      description:
        "We continuously push boundaries to deliver cutting-edge solutions.",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Shield,
      title: "Security Obsessed",
      description: "Your data security and privacy are our highest priorities.",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Star,
      title: "Excellence Standard",
      description:
        "We maintain the highest standards in everything we deliver.",
      color: "from-amber-500 to-orange-600",
    },
  ];

  const team = [
    {
      name: "Sriram Raghavan",
      role: "Chief Executive Officer",
      bio: "Visionary leader driving innovation in healthcare technology and RCM solutions.",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Pradumya Gaurav",
      role: "MERN/Full Stack Intern",
      bio: "Owns frontend architecture and implementation of user interfaces for enterprise healthcare applications.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Gaurav Shukla",
      role: "MERN/Full Stack Intern",
      bio: "Leads backend services development and cloud infrastructure for scalable healthcare systems.",
      image:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop&crop=face",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Siddharth",
      role: "Frontend Intern",
      bio: "Creative frontend developer focused on building intuitive and responsive user interfaces.",
      image:
        "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=400&h=400&fit=crop&crop=face",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Lokesh",
      role: "Python Developer",
      bio: "Backend specialist with expertise in Python, API development, and data processing solutions.",
      image:
        "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&h=400&fit=crop&crop=face",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Sarvanan",
      role: "Cloud Engineer",
      bio: "Infrastructure expert specializing in cloud architecture, DevOps, and scalable deployments.",
      image:
        "https://images.unsplash.com/photo-1546820389-44d77e1f3b31?w=400&h=400&fit=crop&crop=face",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Bharthy",
      role: "Sales",
      bio: "Results-driven sales professional building strong client relationships and driving business growth.",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
      linkedin: "#",
      twitter: "#",
    },
  ];

  const milestones = [
    {
      year: "2022",
      title: "Company Founded",
      description: "Started with a vision to simplify healthcare operations",
      icon: Rocket,
    },
    {
      year: "2023",
      title: "First 100 Customers",
      description: "Reached our first major milestone with enterprise clients",
      icon: Users,
    },
    {
      year: "2024",
      title: "Global Expansion",
      description: "Expanded to 30+ countries with localized compliance",
      icon: Globe,
    },
    {
      year: "2025",
      title: "AI Integration",
      description: "Launched advanced AI features for predictive analytics",
      icon: Zap,
    },
  ];

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
              <Sparkles className="w-4 h-4 mr-2" />
              About GetMax Solutions
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Empowering Healthcare with
              <span className="bg-gradient-to-r from-[#5932EA] to-purple-600 bg-clip-text text-transparent">
                {" "}
                Intelligent Technology
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              We're on a mission to transform healthcare operations through
              innovative SaaS solutions. BET combines the power of HRMS, PMS,
              CRM, Internal Chat, and RCM Analytics into one unified platform
              that scales with your business.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all group"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-[#5932EA]/10 to-purple-100 mb-4 group-hover:scale-110 transition-transform">
                      <stat.icon className="w-8 h-8 text-[#5932EA]" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm font-semibold text-gray-700 mb-1">
                      {stat.label}
                    </div>
                    <div className="text-xs text-gray-500">{stat.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-6">
                <Target className="w-4 h-4 mr-2" />
                Our Mission
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Simplifying Healthcare Operations Through Innovation
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We believe healthcare professionals should focus on what they do
                best - caring for patients. That's why we've built BET to handle
                the complex operational tasks, from HR management to revenue
                cycle analytics, so healthcare teams can concentrate on
                delivering exceptional care.
              </p>
              <div className="space-y-4">
                {[
                  "Reduce administrative burden by 75%",
                  "Improve operational efficiency by 300%",
                  "Ensure 100% compliance with healthcare regulations",
                  "Provide real-time insights for better decisions",
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-r from-[#5932EA] to-purple-600 rounded-3xl p-8 text-white">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Lightbulb className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Our Vision</h3>
                    <p className="text-blue-100">
                      For the future of healthcare
                    </p>
                  </div>
                </div>
                <p className="text-lg leading-relaxed mb-6">
                  To become the global standard for healthcare operations
                  management, enabling healthcare organizations worldwide to
                  operate at peak efficiency while maintaining the highest
                  standards of patient care and compliance.
                </p>
                <div className="flex items-center gap-2 text-blue-200">
                  <Globe className="w-5 h-5" />
                  <span className="font-medium">
                    Serving 30+ countries worldwide
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These values guide every decision we make and every solution we
              build
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all group"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From startup to serving 500+ healthcare businesses worldwide
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#5932EA] to-purple-600 rounded-full"></div>

            <div className="space-y-12">
              {milestones.map((milestone, i) => {
                const Icon = milestone.icon;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-8 ${
                      i % 2 === 0 ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`flex-1 ${
                        i % 2 === 0 ? "text-right" : "text-left"
                      }`}
                    >
                      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                        <div className="text-[#5932EA] font-bold text-lg mb-2">
                          {milestone.year}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {milestone.title}
                        </h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </div>

                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#5932EA] to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    <div className="flex-1"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Meet Our Leadership Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experienced professionals dedicated to transforming healthcare
              operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all group"
              >
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-2xl object-cover mx-auto group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#5932EA] to-purple-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-[#5932EA] font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {member.bio}
                  </p>

                  <div className="flex justify-center gap-3">
                    <a
                      href={member.linkedin}
                      className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a
                      href={member.twitter}
                      className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Ready to transform your healthcare operations? Let's talk.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#5932EA]/10 rounded-2xl flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-[#5932EA]" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">contact@getmaxsolutions.com</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                <Phone className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">+91-XXXXXXXXXX</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600">Velachery, Chennai, India</p>
            </div>
          </div>

          <Link
            to="/crm"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#5932EA] to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-[#5932EA] font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Try BET Tool Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
