// src/pages/public/sections/CoreModules.jsx
import React from "react";
import {
  Sparkles,
  TrendingUp,
  BarChart2,
  ShieldCheck,
  CloudLightning as LightningBolt,
  Clock,
  Database,
  Server,
  Globe,
  Rocket,
} from "lucide-react";

const CoreModules = ({ features, activeFeature, setActiveFeature }) => {
  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float-delay"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER WITH IMPACT METRICS */}
        <div className="text-center mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-semibold text-white/90 tracking-wider">
              CORE MODULES SUITE
            </span>
          </span>

          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Master Your Business
              <br />
              with GetMax BET
            </span>
          </h2>

          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12">
            All-in-one SaaS platform with{" "}
            <span className="font-semibold text-white">integrated modules</span>{" "}
            for complete business management and{" "}
            <span className="text-purple-300 font-medium">
              maximum efficiency
            </span>
            .
          </p>

          {/* PERFORMANCE METRICS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: <BarChart2 className="w-6 h-6 text-green-400" />,
                value: "↑ 400%",
                label: "Business Growth",
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
                value: "100%",
                label: "Data Security",
              },
              {
                icon: <LightningBolt className="w-6 h-6 text-purple-400" />,
                value: "95%",
                label: "Process Automation",
              },
              {
                icon: <Clock className="w-6 h-6 text-amber-400" />,
                value: "↓ 75%",
                label: "Manual Work",
              },
            ].map((metric, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-purple-400/30 transition-all"
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

        {/* CORE MODULES CARDS - DARK THEME VERSION */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = activeFeature === index;

            return (
              <div
                key={index}
                className={`relative overflow-hidden rounded-2xl group p-0.5 transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-br from-purple-600/20 to-blue-600/10 hover:shadow-xl hover:shadow-purple-500/20 border border-purple-400/30"
                    : "bg-gradient-to-br from-white/5 to-white/0 hover:shadow-xl hover:shadow-purple-500/10 border border-white/10 hover:border-purple-400/30"
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="relative h-full bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-8">
                  {/* Glow effect */}
                  <div
                    className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-xl ${
                      isActive
                        ? "bg-gradient-to-br from-purple-500 to-blue-500"
                        : "bg-gradient-to-br from-white to-gray-300"
                    }`}
                  ></div>

                  <div className="flex items-start space-x-6">
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br ${
                        feature.color || "from-purple-600 to-blue-600"
                      }`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-purple-300 font-semibold mb-3 tracking-wide uppercase">
                        {feature.subtitle}
                      </p>
                      <p className="text-white/80 leading-relaxed mb-6">
                        {feature.description}
                      </p>

                      <div className="flex items-center text-green-400 font-semibold">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        <span>{feature.stats}</span>
                      </div>

                      <div className="mt-4 text-xs font-semibold tracking-wider text-purple-400">
                        ◉ LIVE MODULE AVAILABLE
                      </div>
                    </div>
                  </div>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CoreModules;
