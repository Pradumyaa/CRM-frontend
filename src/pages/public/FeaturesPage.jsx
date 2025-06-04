import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  BarChart3,
  MessageSquare,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Clock,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Sparkles,
  Star,
  Activity,
  Database,
  Globe,
  Lock,
  Headphones,
  Server,
  Play,
  ChevronRight,
  Building2,
  Cpu,
  FileText,
  Calendar,
  Mail,
  Phone,
  Video,
  BarChart2,
  PieChart,
  LineChart,
  Settings,
  UserCheck,
  Award,
  Workflow,
  CloudLightning,
  Brain,
  Smartphone,
  Eye,
  Layers,
  Palette,
  RefreshCw,
  AlertTriangle,
  Filter,
  Search,
} from "lucide-react";

const FeaturesPage = () => {
  const [activeCategory, setActiveCategory] = useState("automation");
  const [searchTerm, setSearchTerm] = useState("");

  const featureCategories = [
    {
      id: "automation",
      name: "Automation & AI",
      icon: Brain,
      color: "from-purple-500 to-purple-600",
      description:
        "Intelligent automation that learns and adapts to your workflow",
    },
    {
      id: "analytics",
      name: "Analytics & Insights",
      icon: BarChart3,
      color: "from-blue-500 to-blue-600",
      description:
        "Deep insights and predictive analytics for data-driven decisions",
    },
    {
      id: "security",
      name: "Security & Compliance",
      icon: Shield,
      color: "from-emerald-500 to-emerald-600",
      description:
        "Enterprise-grade security with healthcare compliance built-in",
    },
    {
      id: "integration",
      name: "Integration & APIs",
      icon: Layers,
      color: "from-amber-500 to-amber-600",
      description: "Seamless connections with your existing tools and systems",
    },
    {
      id: "mobile",
      name: "Mobile & Accessibility",
      icon: Smartphone,
      color: "from-rose-500 to-rose-600",
      description: "Mobile-first design with accessibility for all users",
    },
    {
      id: "collaboration",
      name: "Team Collaboration",
      icon: Users,
      color: "from-indigo-500 to-indigo-600",
      description: "Enhanced teamwork with real-time collaboration tools",
    },
  ];

  const allFeatures = {
    automation: [
      {
        title: "AI-Powered Task Automation",
        description:
          "Automatically assign tasks based on workload, skills, and availability using machine learning algorithms.",
        icon: Brain,
        tags: ["AI", "Task Management", "Smart Assignment"],
        benefit: "85% reduction in manual task assignment",
      },
      {
        title: "Intelligent Scheduling",
        description:
          "Auto-schedule meetings, reviews, and deadlines based on team availability and priorities.",
        icon: Calendar,
        tags: ["Scheduling", "Calendar", "Optimization"],
        benefit: "60% fewer scheduling conflicts",
      },
      {
        title: "Smart Onboarding Workflows",
        description:
          "Automated employee onboarding with personalized checklists and progress tracking.",
        icon: UserCheck,
        tags: ["HR", "Onboarding", "Workflow"],
        benefit: "50% faster employee onboarding",
      },
      {
        title: "Predictive Analytics Engine",
        description:
          "Forecast trends, identify bottlenecks, and predict outcomes using advanced analytics.",
        icon: TrendingUp,
        tags: ["Prediction", "Analytics", "Forecasting"],
        benefit: "40% improvement in decision accuracy",
      },
      {
        title: "Auto-Report Generation",
        description:
          "Generate comprehensive reports automatically with customizable templates and scheduling.",
        icon: FileText,
        tags: ["Reporting", "Automation", "Templates"],
        benefit: "90% time saved on reporting",
      },
      {
        title: "Smart Notifications",
        description:
          "Contextual notifications that adapt to user behavior and priority levels.",
        icon: AlertTriangle,
        tags: ["Notifications", "Smart Alerts", "Context-Aware"],
        benefit: "70% reduction in notification noise",
      },
    ],
    analytics: [
      {
        title: "Real-Time Dashboard Builder",
        description:
          "Create custom dashboards with drag-and-drop widgets and real-time data updates.",
        icon: BarChart2,
        tags: ["Dashboard", "Real-time", "Customization"],
        benefit: "Instant visibility into key metrics",
      },
      {
        title: "Advanced Revenue Analytics",
        description:
          "Deep dive into revenue patterns, forecasting, and performance optimization.",
        icon: DollarSign,
        tags: ["Revenue", "Forecasting", "Performance"],
        benefit: "25% increase in revenue visibility",
      },
      {
        title: "Performance Heat Maps",
        description:
          "Visual performance indicators across teams, departments, and time periods.",
        icon: Activity,
        tags: ["Performance", "Visualization", "Heat Maps"],
        benefit: "Identify bottlenecks 3x faster",
      },
      {
        title: "Predictive Modeling",
        description:
          "Machine learning models that predict outcomes and recommend actions.",
        icon: Brain,
        tags: ["ML", "Prediction", "Modeling"],
        benefit: "80% accuracy in outcome prediction",
      },
      {
        title: "Custom Report Builder",
        description:
          "Build complex reports with filters, grouping, and automated distribution.",
        icon: FileText,
        tags: ["Reports", "Custom", "Distribution"],
        benefit: "Unlimited report combinations",
      },
      {
        title: "Benchmarking Analytics",
        description:
          "Compare performance against industry standards and best practices.",
        icon: BarChart3,
        tags: ["Benchmarking", "Industry", "Standards"],
        benefit: "Track against 50+ industry metrics",
      },
    ],
    security: [
      {
        title: "Zero-Trust Architecture",
        description:
          "Every user and device is verified before accessing any system resources.",
        icon: Lock,
        tags: ["Security", "Zero-Trust", "Verification"],
        benefit: "99.9% reduction in security breaches",
      },
      {
        title: "HIPAA Compliance Automation",
        description:
          "Automated compliance monitoring with real-time alerts and audit trails.",
        icon: Shield,
        tags: ["HIPAA", "Compliance", "Automation"],
        benefit: "100% compliance tracking",
      },
      {
        title: "End-to-End Encryption",
        description:
          "Military-grade 256-bit AES encryption for all data in transit and at rest.",
        icon: Lock,
        tags: ["Encryption", "Security", "Data Protection"],
        benefit: "Bank-level security standards",
      },
      {
        title: "Multi-Factor Authentication",
        description:
          "Advanced MFA with biometric, SMS, and authenticator app support.",
        icon: UserCheck,
        tags: ["MFA", "Authentication", "Biometric"],
        benefit: "95% reduction in unauthorized access",
      },
      {
        title: "Real-Time Threat Detection",
        description:
          "AI-powered threat detection with automatic response and mitigation.",
        icon: Eye,
        tags: ["Threat Detection", "AI", "Security"],
        benefit: "Detect threats in under 30 seconds",
      },
      {
        title: "Compliance Dashboard",
        description:
          "Centralized view of all compliance requirements with automated tracking.",
        icon: BarChart2,
        tags: ["Compliance", "Dashboard", "Tracking"],
        benefit: "Real-time compliance status",
      },
    ],
    integration: [
      {
        title: "Universal API Gateway",
        description:
          "Connect with 1000+ applications through our comprehensive API gateway.",
        icon: Layers,
        tags: ["API", "Integration", "Gateway"],
        benefit: "Connect with any system",
      },
      {
        title: "No-Code Integrations",
        description:
          "Build integrations without coding using visual workflow builders.",
        icon: Workflow,
        tags: ["No-Code", "Visual", "Workflow"],
        benefit: "90% faster integration setup",
      },
      {
        title: "Real-Time Data Sync",
        description:
          "Bidirectional data synchronization with conflict resolution and versioning.",
        icon: RefreshCw,
        tags: ["Sync", "Real-time", "Data"],
        benefit: "Always up-to-date information",
      },
      {
        title: "Enterprise SSO",
        description:
          "Single Sign-On integration with SAML, OAuth, OpenID Connect, and LDAP.",
        icon: Users,
        tags: ["SSO", "SAML", "Authentication"],
        benefit: "One login for all systems",
      },
      {
        title: "Webhook Automation",
        description:
          "Trigger actions across systems with intelligent webhook management.",
        icon: Zap,
        tags: ["Webhooks", "Automation", "Triggers"],
        benefit: "Instant cross-system updates",
      },
      {
        title: "Data Migration Tools",
        description:
          "Seamlessly migrate data from legacy systems with validation and rollback.",
        icon: Database,
        tags: ["Migration", "Data", "Legacy"],
        benefit: "Zero data loss migration",
      },
    ],
    mobile: [
      {
        title: "Progressive Web App",
        description:
          "Native app experience in the browser with offline capabilities.",
        icon: Smartphone,
        tags: ["PWA", "Mobile", "Offline"],
        benefit: "Works without internet connection",
      },
      {
        title: "Voice Command Interface",
        description:
          "Control BET using voice commands for hands-free operation.",
        icon: MessageSquare,
        tags: ["Voice", "Commands", "Accessibility"],
        benefit: "Hands-free workflow management",
      },
      {
        title: "Biometric Authentication",
        description:
          "Secure access using fingerprint, face recognition, and voice authentication.",
        icon: UserCheck,
        tags: ["Biometric", "Security", "Mobile"],
        benefit: "Ultra-secure mobile access",
      },
      {
        title: "Adaptive UI Design",
        description:
          "Interface automatically adapts to screen size, orientation, and user preferences.",
        icon: Palette,
        tags: ["Responsive", "Adaptive", "UI"],
        benefit: "Perfect experience on any device",
      },
      {
        title: "Offline-First Architecture",
        description:
          "Continue working without internet and sync when connection is restored.",
        icon: CloudLightning,
        tags: ["Offline", "Sync", "Architecture"],
        benefit: "Never lose productivity",
      },
      {
        title: "Accessibility Features",
        description:
          "Full WCAG 2.1 compliance with screen reader and keyboard navigation support.",
        icon: Eye,
        tags: ["Accessibility", "WCAG", "Inclusive"],
        benefit: "Accessible to all users",
      },
    ],
    collaboration: [
      {
        title: "Real-Time Co-Editing",
        description:
          "Multiple users can edit documents, spreadsheets, and forms simultaneously.",
        icon: Users,
        tags: ["Collaboration", "Real-time", "Co-editing"],
        benefit: "50% faster document creation",
      },
      {
        title: "Smart Meeting Assistant",
        description:
          "AI-powered meeting scheduling, note-taking, and action item tracking.",
        icon: Brain,
        tags: ["Meetings", "AI", "Assistant"],
        benefit: "80% more productive meetings",
      },
      {
        title: "Team Pulse Monitoring",
        description:
          "Track team morale, workload, and engagement with sentiment analysis.",
        icon: Activity,
        tags: ["Team Health", "Pulse", "Sentiment"],
        benefit: "Early detection of team issues",
      },
      {
        title: "Knowledge Base AI",
        description:
          "Intelligent knowledge management with automatic categorization and search.",
        icon: Database,
        tags: ["Knowledge", "AI", "Search"],
        benefit: "Find information 10x faster",
      },
      {
        title: "Video Collaboration Hub",
        description:
          "Integrated video calls with screen sharing, recording, and transcription.",
        icon: Video,
        tags: ["Video", "Screen Share", "Recording"],
        benefit: "Seamless remote collaboration",
      },
      {
        title: "Project Timeline Visualization",
        description:
          "Interactive Gantt charts and timeline views for project management.",
        icon: BarChart2,
        tags: ["Timeline", "Gantt", "Project"],
        benefit: "Clear project visibility",
      },
    ],
  };

  const filteredFeatures = allFeatures[activeCategory].filter(
    (feature) =>
      feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feature.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const currentCategory = featureCategories.find(
    (cat) => cat.id === activeCategory
  );

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
              Advanced Features & Capabilities
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Powerful Features That
              <span className="bg-gradient-to-r from-[#5932EA] to-purple-600 bg-clip-text text-transparent">
                {" "}
                Drive Results
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Discover the comprehensive feature set that makes BET the most
              advanced business enablement platform. From AI-powered automation
              to enterprise-grade security.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search features, capabilities, or benefits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#5932EA]/50 focus:border-[#5932EA] transition-all"
              />
            </div>

            {/* Feature Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { icon: Zap, value: "200+", label: "Smart Features" },
                { icon: Globe, value: "100+", label: "Integrations" },
                { icon: Shield, value: "99.9%", label: "Security Score" },
                { icon: TrendingUp, value: "300%", label: "Efficiency Gain" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all group"
                >
                  <div className="flex flex-col items-center">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-[#5932EA]/10 to-purple-100 mb-3 group-hover:scale-110 transition-transform">
                      <stat.icon className="w-6 h-6 text-[#5932EA]" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Categories - Dark */}
      <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float-delay"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <Filter className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-semibold text-white/90 tracking-wider">
                FEATURE CATEGORIES
              </span>
            </span>

            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Explore by Category
              </span>
            </h2>

            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12">
              Browse our comprehensive feature set organized by capability area
            </p>
          </div>

          {/* Category Tabs */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {featureCategories.map((category) => {
              const CategoryIcon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`p-6 rounded-2xl border transition-all text-left ${
                    activeCategory === category.id
                      ? `bg-gradient-to-br ${category.color} text-white border-white/30 shadow-lg`
                      : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div
                      className={`p-2 rounded-lg ${
                        activeCategory === category.id
                          ? "bg-white/20"
                          : "bg-white/10"
                      }`}
                    >
                      <CategoryIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold">{category.name}</h3>
                  </div>
                  <p
                    className={`text-sm ${
                      activeCategory === category.id
                        ? "text-white/90"
                        : "text-white/70"
                    }`}
                  >
                    {category.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Category Header */}
          <div className="text-center mb-12">
            <div
              className={`inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r ${currentCategory.color} rounded-2xl text-white font-semibold text-xl shadow-lg`}
            >
              <currentCategory.icon className="w-6 h-6" />
              {currentCategory.name} Features
            </div>
          </div>
        </div>
      </section>

      {/* Feature Details - Light */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Count */}
          <div className="text-center mb-12">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-semibold">{filteredFeatures.length}</span>{" "}
              features
              {searchTerm && (
                <span>
                  {" "}
                  matching "
                  <span className="font-semibold text-[#5932EA]">
                    {searchTerm}
                  </span>
                  "
                </span>
              )}
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFeatures.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all group"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${currentCategory.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <FeatureIcon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="mb-6">
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${currentCategory.color} text-white rounded-full text-sm font-semibold`}
                    >
                      <TrendingUp className="w-4 h-4" />
                      {feature.benefit}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {feature.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* No Results */}
          {filteredFeatures.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No features found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search terms or browse different categories
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="px-6 py-3 bg-[#5932EA] text-white rounded-xl hover:bg-[#4526B5] transition-all"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Enterprise Features - Dark */}
      <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Enterprise-Grade Capabilities
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Advanced features designed for large-scale healthcare operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Server,
                title: "99.99% Uptime SLA",
                desc: "Enterprise-grade infrastructure with guaranteed availability",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: Globe,
                title: "Multi-Region Deployment",
                desc: "Global deployment with data residency compliance",
                color: "from-green-500 to-green-600",
              },
              {
                icon: Users,
                title: "Unlimited Scalability",
                desc: "Scale from 10 to 10,000+ users without performance impact",
                color: "from-purple-500 to-purple-600",
              },
              {
                icon: Headphones,
                title: "24/7 Priority Support",
                desc: "Dedicated support team with 1-hour response SLA",
                color: "from-amber-500 to-amber-600",
              },
            ].map((item, i) => {
              const ItemIcon = item.icon;
              return (
                <div
                  key={i}
                  className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <ItemIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">{item.desc}</p>
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
            Experience These Features in Action
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            See how BET's advanced features can transform your business
            operations
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/crm"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#5932EA] to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-[#5932EA] font-bold text-lg transition-all transform hover:scale-105"
            >
              Try Features Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-[#5932EA] hover:bg-[#5932EA]/5 font-bold text-lg transition-all"
            >
              View All Products
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </div>

          <p className="mt-8 text-gray-500 text-sm">
            ✨ No credit card required • Full feature access • 14-day free trial
          </p>
        </div>
      </section>
    </>
  );
};

export default FeaturesPage;
