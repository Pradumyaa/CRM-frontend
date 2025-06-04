// src/pages/public/sections/TestimonialsSection.jsx
import React, { useState } from "react";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  Users,
  Building2,
  Activity,
  Stethoscope,
  Cpu,
  Zap,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const TestimonialsSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Dr. Sarah Mitchell",
      title: "Chief Medical Officer",
      company: "MedFlow RCM Solutions",
      industry: "RCM Company",
      avatar:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
      quote:
        "BET transformed our entire revenue cycle. We went from 67% denial rates to just 12% in 6 months. The AI-powered workflows are absolutely game-changing for healthcare operations.",
      stats: {
        metric: "↓ 55%",
        label: "Denial Rates",
        improvement: "In 6 months",
      },
      icon: <Activity className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      title: "Operations Director",
      company: "HealthTech Innovations",
      industry: "Healthcare BPO",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      quote:
        "Our team productivity increased by 300% after implementing BET. The automated credentialing and compliance tracking saved us thousands of hours annually. ROI was immediate.",
      stats: {
        metric: "↑ 300%",
        label: "Productivity",
        improvement: "First quarter",
      },
      icon: <Building2 className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: 3,
      name: "Jessica Chen",
      title: "Practice Administrator",
      company: "Premier Family Clinics",
      industry: "Multi-Clinic Practice",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
      quote:
        "BET's real-time eligibility checks and automated coding reduced our errors by 80%. Collections efficiency improved by 50%, and our staff can focus on patient care instead of paperwork.",
      stats: {
        metric: "↓ 80%",
        label: "Coding Errors",
        improvement: "3 months",
      },
      icon: <Stethoscope className="w-6 h-6" />,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      id: 4,
      name: "David Kumar",
      title: "Chief Technology Officer",
      company: "MedStaff Solutions",
      industry: "Medical Staffing",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      quote:
        "The AI-powered shift optimization and automated payroll sync has revolutionized our staffing operations. We reduced time-to-fill by 55% while maintaining 99.9% compliance.",
      stats: {
        metric: "↓ 55%",
        label: "Time to Fill",
        improvement: "Ongoing",
      },
      icon: <Users className="w-6 h-6" />,
      color: "from-amber-500 to-amber-600",
    },
    {
      id: 5,
      name: "Lisa Thompson",
      title: "IT Director",
      company: "Healthcare IT Pro",
      industry: "IT Services",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      quote:
        "BET's enterprise-grade infrastructure monitoring increased our system uptime by 500%. IT tickets dropped by 70%, and our clients have never been happier with our service reliability.",
      stats: {
        metric: "↑ 500%",
        label: "System Uptime",
        improvement: "Year over year",
      },
      icon: <Cpu className="w-6 h-6" />,
      color: "from-indigo-500 to-indigo-600",
    },
    {
      id: 6,
      name: "Amanda Foster",
      title: "Service Operations Manager",
      company: "Rapid Response Medical",
      industry: "Service Teams",
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
      quote:
        "BET turned our chaotic workflows into streamlined operations. 75% task automation and 40% reduction in manual work means our team can scale without burning out.",
      stats: {
        metric: "↑ 75%",
        label: "Task Automation",
        improvement: "6 months",
      },
      icon: <Zap className="w-6 h-6" />,
      color: "from-rose-500 to-rose-600",
    },
  ];

  const overallStats = [
    {
      icon: <TrendingUp className="w-8 h-8 text-emerald-600" />,
      value: "400%",
      label: "Average ROI",
      subtitle: "Within first year",
    },
    {
      icon: <Award className="w-8 h-8 text-blue-600" />,
      value: "500+",
      label: "Healthcare Businesses",
      subtitle: "Trust BET daily",
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-purple-600" />,
      value: "99.9%",
      label: "Uptime Guarantee",
      subtitle: "Enterprise-grade reliability",
    },
    {
      icon: <Users className="w-8 h-8 text-amber-600" />,
      value: "50K+",
      label: "Healthcare Professionals",
      subtitle: "Using BET worldwide",
    },
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const currentTestimonial = testimonials[activeTestimonial];

  return (
    <section className="relative py-24 bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30 overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200/40 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER SECTION */}
        <div className="text-center mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 rounded-full mb-6">
            <Quote className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700 tracking-wider">
              SUCCESS STORIES
            </span>
          </span>

          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Trusted by Healthcare
              <br />
              Leaders Worldwide
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            See how{" "}
            <span className="font-semibold text-gray-800">
              500+ healthcare businesses
            </span>{" "}
            use BET to{" "}
            <span className="text-blue-600 font-medium">
              automate operations, boost efficiency, and scale faster
            </span>
            .
          </p>

          {/* OVERALL STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {overallStats.map((stat, i) => (
              <div
                key={i}
                className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 hover:border-blue-300/50 hover:shadow-lg hover:shadow-blue-100/50 transition-all group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200/50 mb-4 group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-gray-500">{stat.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN TESTIMONIAL CARD */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-200/50 shadow-2xl shadow-blue-100/20 mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Testimonial Content */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div
                  className={`p-2 rounded-lg bg-gradient-to-r ${currentTestimonial.color} text-white`}
                >
                  {currentTestimonial.icon}
                </div>
                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  {currentTestimonial.industry}
                </span>
              </div>

              <Quote className="w-12 h-12 text-gray-300 mb-6" />

              <blockquote className="text-2xl md:text-3xl font-semibold text-gray-800 leading-relaxed mb-8">
                "{currentTestimonial.quote}"
              </blockquote>

              <div className="flex items-center gap-4 mb-8">
                <img
                  src={currentTestimonial.avatar}
                  alt={currentTestimonial.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div>
                  <div className="font-bold text-gray-800 text-lg">
                    {currentTestimonial.name}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {currentTestimonial.title}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {currentTestimonial.company}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
            </div>

            {/* Stats & Navigation */}
            <div className="text-center lg:text-right">
              <div
                className={`inline-flex items-center gap-4 p-6 bg-gradient-to-r ${currentTestimonial.color} text-white rounded-2xl shadow-lg mb-8`}
              >
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">
                    {currentTestimonial.stats.metric}
                  </div>
                  <div className="text-sm opacity-90 font-medium">
                    {currentTestimonial.stats.label}
                  </div>
                  <div className="text-xs opacity-75">
                    {currentTestimonial.stats.improvement}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-center lg:justify-end gap-4 mb-6">
                <button
                  onClick={prevTestimonial}
                  className="p-3 bg-white border border-gray-300 rounded-full hover:border-blue-400 hover:bg-blue-50 transition-all group"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                </button>
                <span className="text-sm text-gray-500 font-medium">
                  {activeTestimonial + 1} of {testimonials.length}
                </span>
                <button
                  onClick={nextTestimonial}
                  className="p-3 bg-white border border-gray-300 rounded-full hover:border-blue-400 hover:bg-blue-50 transition-all group"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                </button>
              </div>

              {/* Testimonial Indicators */}
              <div className="flex justify-center lg:justify-end gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === activeTestimonial
                        ? `bg-gradient-to-r ${currentTestimonial.color}`
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM CTA SECTION */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-white rounded-full filter blur-[80px]"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white rounded-full filter blur-[80px]"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Join{" "}
              <span className="text-blue-200">
                500+ Successful Healthcare Businesses
              </span>
              ?
            </h3>

            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              See why healthcare leaders choose BET for{" "}
              <span className="font-semibold text-white">
                AI-powered workflows, real-time analytics, and guaranteed ROI
              </span>
              .
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group">
                <span>Get Your Custom Demo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300">
                See All Success Stories
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
