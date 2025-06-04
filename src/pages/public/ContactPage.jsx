import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  Headphones,
  MessageCircle,
  Globe,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Star,
  Calendar,
  Video,
  Users,
  Building2,
} from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    teamSize: "",
    message: "",
    serviceType: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      alert("Thank you! We'll get back to you within 24 hours.");
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        teamSize: "",
        message: "",
        serviceType: "",
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get detailed responses within 24 hours",
      contact: "contact@getmaxsolutions.com",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      availability: "24/7 Response",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our specialists",
      contact: "+91-XXXXXXXXXX",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      availability: "Mon-Fri, 9AM-6PM IST",
    },
    {
      icon: Video,
      title: "Video Demo",
      description: "See BET in action with a live demo",
      contact: "Schedule a Demo",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      availability: "30-min sessions",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Instant answers to quick questions",
      contact: "Start Chat",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      availability: "Mon-Fri, 9AM-6PM IST",
    },
  ];

  const officeInfo = {
    address: "Velachery, Chennai, Tamil Nadu, India",
    hours: "Monday - Friday: 9:00 AM - 6:00 PM IST",
    timezone: "Indian Standard Time (UTC +5:30)",
  };

  const faqs = [
    {
      question: "How quickly can we get started?",
      answer:
        "Most teams are up and running within 24-48 hours. We provide guided onboarding and data migration support.",
    },
    {
      question: "Do you offer custom implementations?",
      answer:
        "Yes! Our Enterprise plan includes custom workflows, integrations, and dedicated implementation support.",
    },
    {
      question: "What kind of support do you provide?",
      answer:
        "We offer 24/7 email support, phone support during business hours, live chat, and dedicated success managers for Enterprise clients.",
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
              <Headphones className="w-4 h-4 mr-2" />
              Get in Touch
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Let's Build Something
              <span className="bg-gradient-to-r from-[#5932EA] to-purple-600 bg-clip-text text-transparent">
                {" "}
                Amazing Together
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Whether you're ready to get started or just have questions, our
              team is here to help you transform your business operations.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { icon: Clock, value: "< 24hrs", label: "Response Time" },
                { icon: Users, value: "500+", label: "Happy Clients" },
                { icon: Star, value: "4.9/5", label: "Customer Rating" },
                { icon: Globe, value: "30+", label: "Countries" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all group"
                >
                  <div className="flex flex-col items-center">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-[#5932EA]/10 to-purple-100 mb-2 group-hover:scale-110 transition-transform">
                      <stat.icon className="w-5 h-5 text-[#5932EA]" />
                    </div>
                    <div className="text-xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 text-center">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Choose Your Preferred Way to Connect
            </h2>
            <p className="text-xl text-gray-600">
              Multiple ways to reach us. We're here to help however works best
              for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div
                  key={index}
                  className={`${method.bgColor} p-8 rounded-3xl border border-gray-200/50 hover:shadow-lg transition-all transform hover:-translate-y-2 group cursor-pointer`}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${method.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {method.description}
                  </p>

                  <div className="font-semibold text-gray-900 mb-2">
                    {method.contact}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {method.availability}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-[#5932EA] to-purple-600 rounded-xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Send us a Message
                  </h2>
                  <p className="text-gray-600">We'll respond within 24 hours</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5932EA]/50 focus:border-[#5932EA] transition-all"
                      placeholder="Your Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5932EA]/50 focus:border-[#5932EA] transition-all"
                      placeholder="your@company.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5932EA]/50 focus:border-[#5932EA] transition-all"
                      placeholder="Your Company"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5932EA]/50 focus:border-[#5932EA] transition-all"
                      placeholder="+91 XXXXXXXXXX"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Team Size
                    </label>
                    <select
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5932EA]/50 focus:border-[#5932EA] transition-all"
                    >
                      <option value="">Select team size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-1000">201-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Service Type
                    </label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5932EA]/50 focus:border-[#5932EA] transition-all"
                    >
                      <option value="">Select service type</option>
                      <option value="healthcare">Healthcare/RCM</option>
                      <option value="clinic">Clinic/Medical Practice</option>
                      <option value="bpo">Healthcare BPO</option>
                      <option value="staffing">Medical Staffing</option>
                      <option value="it">IT Services</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5932EA]/50 focus:border-[#5932EA] transition-all resize-none"
                    placeholder="Tell us about your needs, challenges, or questions..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#5932EA] to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-[#5932EA] font-bold text-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-500 text-center">
                  By submitting this form, you agree to our privacy policy.
                  We'll never share your information with third parties.
                </p>
              </form>
            </div>

            {/* Contact Information & Office Details */}
            <div className="space-y-8">
              {/* Office Information */}
              <div className="bg-white p-8 rounded-3xl shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Our Office
                    </h3>
                    <p className="text-gray-600">
                      Visit us or reach out directly
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Address
                      </h4>
                      <p className="text-gray-600">{officeInfo.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Business Hours
                      </h4>
                      <p className="text-gray-600">{officeInfo.hours}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {officeInfo.timezone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Global Support
                      </h4>
                      <p className="text-gray-600">
                        Serving 30+ countries worldwide with localized support
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-[#5932EA]/10 to-purple-100 p-8 rounded-3xl">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  Quick Actions
                </h3>

                <div className="space-y-4">
                  <Link
                    to="/crm"
                    className="flex items-center justify-between w-full p-4 bg-white rounded-xl hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#5932EA]/10 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-[#5932EA]" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          Try BET Tool
                        </div>
                        <div className="text-sm text-gray-600">
                          Get hands-on experience
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#5932EA] group-hover:translate-x-1 transition-all" />
                  </Link>

                  <button className="flex items-center justify-between w-full p-4 bg-white rounded-xl hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          Schedule Demo
                        </div>
                        <div className="text-sm text-gray-600">
                          30-minute live session
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                  </button>

                  <a
                    href="tel:+91-XXXXXXXXXX"
                    className="flex items-center justify-between w-full p-4 bg-white rounded-xl hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          Call Us Now
                        </div>
                        <div className="text-sm text-gray-600">
                          Speak with our team
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                  </a>
                </div>
              </div>

              {/* FAQ Preview */}
              <div className="bg-white p-8 rounded-3xl shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Frequently Asked Questions
                </h3>

                <div className="space-y-6">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-100 pb-4 last:border-b-0"
                    >
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {faq.question}
                      </h4>
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                    </div>
                  ))}
                </div>

                <Link
                  to="/support"
                  className="inline-flex items-center mt-6 text-[#5932EA] font-semibold hover:text-purple-600 transition-colors"
                >
                  View All FAQs
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Join 500+ Happy Customers
            </h2>
            <p className="text-xl text-gray-600">
              See why businesses trust BET for their operations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                company: "MedFlow RCM",
                industry: "Healthcare RCM",
                result: "67% reduction in denial rates",
                quote: "BET transformed our entire revenue cycle process.",
                avatar:
                  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
              },
              {
                company: "Premier Clinics",
                industry: "Multi-location Practice",
                result: "50% faster collections",
                quote:
                  "Our staff can now focus on patient care instead of paperwork.",
                avatar:
                  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
              },
              {
                company: "HealthTech Innovations",
                industry: "Healthcare BPO",
                result: "300% productivity increase",
                quote: "ROI was immediate. Best investment we've made.",
                avatar:
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-gray-50 p-8 rounded-3xl hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.avatar}
                    alt="Customer"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.company}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.industry}
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-semibold text-green-600">
                    {testimonial.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-[#5932EA] via-purple-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Transform your business operations with BET. No credit card required
            for your free trial.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/crm"
              className="inline-flex items-center px-8 py-4 bg-white text-[#5932EA] rounded-xl hover:bg-gray-50 font-bold text-lg transition-all transform hover:scale-105"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <button className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 font-bold text-lg transition-all">
              <Calendar className="mr-2 w-5 h-5" />
              Schedule Demo
            </button>
          </div>

          <p className="mt-8 text-blue-200 text-sm flex items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              No setup fees
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Cancel anytime
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              24/7 support
            </span>
          </p>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
