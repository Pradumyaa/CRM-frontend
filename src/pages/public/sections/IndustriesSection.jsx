// src/pages/public/sections/IndustriesSection.jsx
import {
  Rocket,
  Activity,
  Stethoscope,
  Building2,
  Users,
  Zap,
  Cpu,
  BarChart2,
  ShieldCheck,
  CloudLightning as LightningBolt,
  Clock,
  ArrowRight,
} from "lucide-react";

const IndustriesSection = () => {
  const industries = [
    {
      name: "RCM Companies",
      icon: <Activity className="w-10 h-10 text-white" />,
      desc: "Automate 92% of claims processing with AI-powered workflows",
      stats: [
        "↓ 67% denial rates",
        "↑ 45% faster reimbursements",
        "✓ 100% HIPAA compliant",
      ],
      color: "from-blue-600 to-blue-800",
    },
    {
      name: "Clinics & Billing",
      icon: <Stethoscope className="w-10 h-10 text-white" />,
      desc: "End-to-end revenue cycle automation for practices",
      stats: [
        "↑ 50% collections efficiency",
        "↓ 80% coding errors",
        "✓ Real-time eligibility checks",
      ],
      color: "from-purple-600 to-purple-800",
    },
    {
      name: "Healthcare BPOs",
      icon: <Building2 className="w-10 h-10 text-white" />,
      desc: "Process 3X more claims with AI-driven automation",
      stats: [
        "↑ 300% team productivity",
        "↓ 60% operational costs",
        "✓ 99.9% accuracy guarantee",
      ],
      color: "from-emerald-600 to-emerald-800",
    },
    {
      name: "Medical Staffing",
      icon: <Users className="w-10 h-10 text-white" />,
      desc: "AI-powered credentialing & shift optimization",
      stats: [
        "↓ 55% time-to-fill",
        "↑ 90% compliance rate",
        "✓ Automated payroll sync",
      ],
      color: "from-amber-600 to-amber-800",
    },
    {
      name: "Service Teams",
      icon: <Zap className="w-10 h-10 text-white" />,
      desc: "Turn chaos into scalable workflows",
      stats: [
        "↑ 75% task automation",
        "↓ 40% manual work",
        "✓ 24/7 performance tracking",
      ],
      color: "from-rose-600 to-rose-800",
    },
    {
      name: "IT Providers",
      icon: <Cpu className="w-10 h-10 text-white" />,
      desc: "Enterprise-grade healthcare infrastructure",
      stats: [
        "↑ 5X system uptime",
        "↓ 70% IT tickets",
        "✓ Military-grade encryption",
      ],
      color: "from-indigo-600 to-indigo-800",
    },
  ];

  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float-delay"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER WITH IMPACT METRICS */}
        <div className="text-center mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
            <Rocket className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-semibold text-white/90 tracking-wider">
              THE FUTURE OF HEALTHCARE OPERATIONS
            </span>
          </span>

          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Stop Losing Money.
              <br />
              Start Scaling Smart.
            </span>
          </h2>

          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12">
            BET isn't just software—it's your{" "}
            <span className="font-semibold text-white">competitive weapon</span>
            . 500+ healthcare businesses use us to{" "}
            <span className="text-blue-300 font-medium">
              automate, optimize, and dominate
            </span>
            .
          </p>

          {/* PERFORMANCE METRICS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: <BarChart2 className="w-6 h-6 text-green-400" />,
                value: "↑ 300%",
                label: "Productivity",
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
                value: "100%",
                label: "Compliance",
              },
              {
                icon: <LightningBolt className="w-6 h-6 text-purple-400" />,
                value: "92%",
                label: "Automation",
              },
              {
                icon: <Clock className="w-6 h-6 text-amber-400" />,
                value: "↓ 65%",
                label: "Processing Time",
              },
            ].map((metric, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-blue-400/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/10">
                    {metric.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {metric.value}
                    </div>
                    <div className="text-sm text-white/70">{metric.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INDUSTRY CARDS - ULTRA IMPACT VERSION */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {industries.map((industry, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-2xl group border-2 border-hidden p-0.5 hover:border-2`}
            >
              <div className="relative h-full bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-8">
                {/* Icon with glow */}
                <div
                  className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${industry.color} opacity-10 blur-xl`}
                ></div>
                <div
                  className={`mb-6 w-16 h-16 rounded-xl bg-gradient-to-br ${industry.color} flex items-center justify-center shadow-lg`}
                >
                  {industry.icon}
                </div>

                <h3 className="text-2xl font-bold text-white mb-3">
                  {industry.name}
                </h3>
                <p className="text-white/80 mb-6">{industry.desc}</p>

                <ul className="space-y-3">
                  {industry.stats.map((stat, i) => (
                    <li key={i} className="flex items-start">
                      <div
                        className={`flex-shrink-0 mt-1 w-2 h-2 rounded-full bg-gradient-to-r ${industry.color}`}
                      ></div>
                      <span className="ml-3 text-white/90 font-medium">
                        {stat}
                      </span>
                    </li>
                  ))}
                </ul>

                <div
                  className={`mt-6 text-xs font-semibold tracking-wider text-${
                    industry.color.split("to-")[1].split("-")[0]
                  }-600`}
                >
                  ◉ LIVE CASE STUDIES AVAILABLE
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ENTERPRISE-GRADE FOOTER */}
        {/* <div className="relative bg-gradient-radial from-slate-500 via-purple-400/80 to-slate-200 rounded-3xl p-8 md:p-12 border-2 border-white/20 shadow-2xl shadow-purple-900/20 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-600 rounded-full filter blur-[80px]"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600 rounded-full filter blur-[80px]"></div>
          </div>
          <div className="relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  10X Your Efficiency
                </span>
                ?
              </h3>

              <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
                BET delivers{" "}
                <span className="font-semibold text-white">
                  AI-driven workflows, real-time analytics, and bulletproof
                  compliance
                </span>
                .
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 group">
                  <span>Get Custom Demo</span>
                  <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
                </button>

                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300">
                  See ROI Calculator
                </button>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default IndustriesSection;
