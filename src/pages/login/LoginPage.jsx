import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";

const LoginPage = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmployeeId = localStorage.getItem("employeeId");
    if (savedEmployeeId) {
      navigate("/", { state: { selectedItem: "profile" } });
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        "https://crm-backend-6gcl.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employeeId, password }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("employeeId", data.employee.employeeId);
      localStorage.setItem("token", data.token);

      console.log("Login successful!");

      // Reload the page after successful login
      window.location.href = "/"; // This will cause a full page reload
    } catch (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-gray-600 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-between min-h-screen bg-gray-200">
      <div className="flex-grow flex items-center justify-center mb-60">
        <div className="p-8 w-full max-w-md">
          <h1 className="font-poppins text-2xl font-bold text-center">
            Welcome!
          </h1>
          <p className="text-gray-600 text-center mt-2 mb-6">
            Manage your company's data seamlessly and efficiently for better
            records.
          </p>

          <div className="max-w-md mx-auto bg-white p-6 mt-4 shadow-2xl rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mt-6 text-center">Login</h2>
            <form onSubmit={handleLogin} className="mt-4">
              <div className="pb-4">
                <label className="block text-gray-700 z-10 text-sm font-medium">
                  User ID
                </label>
                <input
                  type="text"
                  placeholder="Your user ID"
                  className="w-full p-2 overflow-hidden mt-1 text-xs font-light bg-gray-200 rounded-2xl border border-gray-300 shadow-lg focus:shadow-2xl focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 z-10 text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Your password"
                  className="w-full p-2 overflow-hidden mt-1 text-xs font-light bg-gray-200 rounded-2xl border border-gray-300 shadow-lg focus:shadow-2xl focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Remember Me Toggle */}
              <div
                className="flex gap-2 max-w-[140px] rounded-full mt-4 cursor-pointer select-none"
                onClick={() => !isSubmitting && setRememberMe(!rememberMe)}
              >
                <button
                  type="button"
                  className={`flex flex-col justify-center items-start self-start relative w-6 h-2 mt-1 py-1.5 px-0.5 rounded-full transition-all duration-300 ${
                    rememberMe ? "bg-[#5932EA]" : "bg-gray-400"
                  }`}
                  aria-label="Toggle remember me"
                  role="switch"
                  aria-checked={rememberMe}
                  disabled={isSubmitting}
                >
                  <div
                    className={`absolute w-2 h-2 bg-white rounded-full shadow transition-all duration-300 ${
                      rememberMe ? "translate-x-3" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-xs font-light text-black mt-1">
                  Remember me
                </span>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="text-red-500 text-center mt-2">
                  {errorMessage}
                </div>
              )}

              <div
                className={`flex justify-center items-center w-[250px] h-[40px] bg-[#5932EA] rounded-lg mt-6 transition-all duration-300 ease-in-out shadow-md hover:shadow-xl hover:bg-[#4526B5] focus:outline-none focus:ring-2 focus:ring-[#3A1E91] mx-auto ${
                  isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                <button
                  type="submit"
                  className="text-white font-semibold tracking-wide w-full h-full flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      LOGGING IN...
                    </>
                  ) : (
                    "LOGIN"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;
