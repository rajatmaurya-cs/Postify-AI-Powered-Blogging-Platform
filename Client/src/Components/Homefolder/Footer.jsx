import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { CiShare1 } from "react-icons/ci";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-100 font-sans mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4">
          
          {/* Left - Developer Info */}
          <div className="flex flex-col items-center lg:items-start space-y-2">
            <a
              href="https://portfolio-site-kappa-lilac.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-gray-900 font-semibold tracking-tight hover:text-indigo-600 transition-colors"
            >
              <span>Designed & Developed by Rajat Maurya</span>
              <CiShare1 className="text-gray-400 group-hover:text-indigo-600 transition-colors transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" size={20} />
            </a>
            <p className="text-sm text-gray-400 font-normal tracking-normal">Building premium digital experiences.</p>
          </div>

          {/* Center - Copyright & Links */}
          <div className="flex flex-col items-center flex-1 order-3 lg:order-2 mt-8 lg:mt-0 pt-8 lg:pt-0 border-t lg:border-t-0 border-gray-100 lg:border-none w-full lg:w-auto">
            <p className="text-gray-500 font-normal tracking-normal mb-3">
              © {new Date().getFullYear()} <span className="font-semibold text-gray-900">Postify</span>. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
              <Link to="/privacy-policy" className="hover:text-gray-900 transition-colors">
                Privacy Policy
              </Link>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <Link to="/terms" className="hover:text-gray-900 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Right - Social Links */}
          <div className="flex items-center gap-4 order-2 lg:order-3">
            <a
              href="https://github.com/rajatmaurya-cs"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-900 hover:text-white hover:shadow-lg hover:-translate-y-0.5 transition-all"
              aria-label="GitHub"
            >
              <FaGithub size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/rajat-maurya-3a172331b/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-[#0A66C2] hover:text-white hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={18} />
            </a>
            <a
              href="mailto:rajatmaurya.dev@gmail.com"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20 hover:-translate-y-0.5 transition-all"
              aria-label="Email"
            >
              <MdEmail size={18} />
            </a>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
