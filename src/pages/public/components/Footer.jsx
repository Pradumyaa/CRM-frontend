import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Youtube,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      <div className="relative max-w-8xl mx-auto px-16 sm:px-16 lg:px-20 py-20">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Company Info - Enhanced */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#5932EA] to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                    <span className="text-white font-bold text-lg">G</span>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#5932EA] to-purple-600 rounded-xl opacity-20 blur group-hover:opacity-40 transition-opacity duration-300"></div>
                </div>
                <div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-[#5932EA] to-purple-400 bg-clip-text text-transparent">
                    GetMax BET
                  </span>
                  <div className="text-xs text-purple-300 font-medium tracking-wide">
                    BUSINESS ENABLEMENT TOOL
                  </div>
                </div>
              </div>

              <p className="text-gray-200 leading-relaxed max-w-md text-lg">
                Revolutionizing healthcare and service teams with our integrated
                <span className="text-purple-400 font-medium">
                  {" "}
                  HRMS, PMS, CRM
                </span>
                , Internal Chat, and{" "}
                <span className="text-purple-400 font-medium">
                  RCM Analytics
                </span>{" "}
                platform.
              </p>
            </div>

            {/* Contact Info - Enhanced */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-[#5932EA] to-purple-600 rounded-full mr-3"></div>
                Get in Touch
              </h4>
              <div className="space-y-3 ml-1">
                <a
                  href="mailto:contact@getmaxsolutions.com"
                  className="flex items-center text-gray-200 hover:text-purple-300 transition-colors group"
                >
                  <div className="w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center mr-4 group-hover:bg-purple-600/20 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>contact@getmaxsolutions.com</span>
                </a>
                <a
                  href="tel:+91XXXXXXXXXX"
                  className="flex items-center text-gray-200 hover:text-purple-300 transition-colors group"
                >
                  <div className="w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center mr-4 group-hover:bg-purple-600/20 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>+91-XXXXXXXXXX</span>
                </a>
                <div className="flex items-center text-gray-200 group">
                  <div className="w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>Velachery, Chennai, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-[#5932EA] to-purple-600 rounded-full mr-3"></div>
              Product
            </h3>
            <ul className="space-y-4 text-sm">
              {[
                { href: "/features", label: "Features", hot: true },
                { href: "/products", label: "Products", badge: "New" },
                { href: "/crm", label: "Try BET Tool", popular: "Popular" },
                { href: "#pricing", label: "Pricing" },
                { href: "#", label: "API Documentation", external: true },
                { href: "#", label: "Integrations" },
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="group flex items-center justify-between text-gray-200 hover:text-white transition-all duration-300 py-2"
                  >
                    <div className="flex items-center">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {item.label}
                      </span>
                      {item.hot && (
                        <span className="ml-2 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                          Hot
                        </span>
                      )}
                      {item.popular && (
                        <span className="ml-2 px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                          {item.popular}
                        </span>
                      )}
                      {item.badge && (
                        <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.external && (
                        <ExternalLink className="w-3 h-3 ml-2 opacity-60" />
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links - Enhanced */}
          <div className="space-y-6 text-sm">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-[#5932EA] to-purple-600 rounded-full mr-3"></div>
              Company
            </h3>
            <ul className="space-y-4">
              {[
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
                { href: "/support", label: "Support", badge: "24/7" },
                { href: "#", label: "Privacy Policy" },
                { href: "#", label: "Terms of Service" },
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="group flex items-center justify-between text-gray-200 hover:text-white transition-all duration-300 py-2"
                  >
                    <div className="flex items-center">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup - New Premium Section */}
          <div className="space-y-6 text-sm">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-[#5932EA] to-purple-600 rounded-full mr-3"></div>
              Stay Updated
            </h3>
            <div className="space-y-4">
              <p className="text-gray-300 text-sm leading-relaxed">
                Get the latest updates on new features and industry insights.
              </p>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300"
                  />
                </div>
                <button className="w-full bg-gradient-to-r from-[#5932EA] to-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-[#5932EA] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center">
                No spam, unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section - Enhanced */}
        <div className="border-t border-gray-500/70 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <p className="text-gray-200 text-sm flex items-center">
                © 2024 GetMax Solutions. All rights reserved.
                <span className="ml-2 px-2 py-1 bg-gray-700/50 text-xs text-gray-300 rounded">
                  Made with ❤️ in India
                </span>
              </p>
            </div>

            <div className="flex items-center space-x-6">
              <span className="text-gray-300 text-sm hidden sm:block">
                Follow us
              </span>
              <div className="flex space-x-4">
                {[
                  { Icon: Linkedin, href: "#", color: "hover:text-blue-400" },
                  { Icon: Twitter, href: "#", color: "hover:text-sky-400" },
                  { Icon: Youtube, href: "#", color: "hover:text-red-400" },
                ].map(({ Icon, href, color }, index) => (
                  <a
                    key={index}
                    href={href}
                    className={`w-10 h-10 bg-gray-700/50 rounded-lg flex items-center justify-center text-gray-300 ${color} transition-all duration-300 hover:bg-gray-700/50 hover:scale-110 hover:shadow-lg`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;