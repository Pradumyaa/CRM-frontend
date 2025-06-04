import { ArrowRight, Sparkles, Users, Zap } from "lucide-react";

const CTASection = () => {
  return (
    <section className="relative py-24 bg-gradient-to-br from-[#5932EA] via-purple-600 to-indigo-700 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-300/5 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Sparkles
          className="absolute top-16 left-1/4 w-6 h-6 text-white/20 animate-bounce"
          style={{ animationDelay: "0s" }}
        />
        <Zap
          className="absolute top-32 right-1/3 w-5 h-5 text-yellow-300/30 animate-bounce"
          style={{ animationDelay: "0.7s" }}
        />
        <Users
          className="absolute bottom-24 left-1/3 w-5 h-5 text-blue-200/25 animate-bounce"
          style={{ animationDelay: "1.4s" }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8 border border-white/20">
          <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
          <span>Join Growing Businesses</span>
        </div>

        {/* Main Heading */}
        <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
          Ready to{" "}
          <span className="relative">
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              revolutionize
            </span>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
          </span>{" "}
          your business?
        </h2>

        {/* Subheading */}
        <p className="text-xl sm:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
          Join the <strong className="text-white">healthcare revolution</strong>{" "}
          with BET's integrated platform.
          <br className="hidden sm:block" />
          Start your transformation today.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <a
            href="/crm"
            className="group px-10 py-5 bg-white text-[#5932EA] rounded-2xl hover:bg-gray-50 font-bold text-lg inline-flex items-center justify-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/25 min-w-[200px]"
          >
            <span>Get Early Access</span>
            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </a>

          <button className="group px-10 py-5 border-2 border-white/30 bg-white/5 backdrop-blur-sm text-white rounded-2xl hover:bg-white hover:text-[#5932EA] font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl min-w-[200px]">
            <span>Schedule a Demo</span>
          </button>
        </div>

        {/* Trust Indicator */}
        <p className="mt-8 text-white/60 text-sm">
          ✨ No credit card required • Free 14-day trial • Setup in under 5
          minutes
        </p>
      </div>
    </section>
  );
};

export default CTASection;
