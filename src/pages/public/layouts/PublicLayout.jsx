// src/pages/public/layouts/PublicLayout.jsx
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const PublicLayout = ({ children, currentPage }) => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation currentPage={currentPage} />
      {children}
      <Footer />
    </div>
  );
};

export default PublicLayout;
