import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Play } from "lucide-react";
import BETDashboardPreview from "../components/BETDashboardPreview";

const HeroSection = ({ features }) => {
  return (
    <section className="pt-24 pb-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 bg-[#5932EA]/20 text-[#5932EA] rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4 mr-2" /> Business Enablement Tool
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Run Your Business Like a{" "}
              <span className="bg-gradient-to-r from-[#5932EA] to-purple-600 bg-clip-text text-transparent">
                Pro
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Streamline your{" "}
              <span className="font-semibold text-[#5932EA]">Healthcare</span>{" "}
              or{" "}
              <span className="font-semibold text-purple-600">IT services</span>{" "}
              with BET — built for smarter operations, better decisions, and
              faster growth.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                to="/crm"
                className="group px-8 py-4 bg-gradient-to-r from-[#5932EA] to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-[#5932EA] font-semibold text-lg inline-flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              >
                Get Early Access
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="group px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-xl hover:border-[#5932EA] hover:bg-[#5932EA]/5 font-semibold text-lg inline-flex items-center justify-center shadow-lg transition-all">
                <Play className="mr-2 w-5 h-5 text-[#5932EA]" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 px-2 bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-lg">
              {features.map((feature, index) => {
                const [first, ...rest] = feature.stats.split(" ");
                const resText = rest.join(" ");

                return (
                  <div
                    key={index}
                    className="text-center bg-white/80 rounded-xl shadow-md p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-purple-300 border border-gray-100 hover:border-purple-400 cursor-pointer"
                  >
                    <div className="text-2xl font-bold bg-gradient-to-r from-[#5932EA] to-purple-600 text-transparent bg-clip-text mb-1">
                      {first}
                    </div>
                    <div className="text-sm text-gray-600">{resText}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dashboard Preview */}
          <BETDashboardPreview />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
