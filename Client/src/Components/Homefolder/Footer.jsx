import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { CiShare1 } from "react-icons/ci";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full mt-20">
      <div className="rounded-3xl max-w-7xl mx-auto px-6 py-6 border-t border-gray-200/70 bg-gray-400">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-900">

          {/* Left */}
          <a
            href="https://rajat-dev.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-900 font-medium hover:underline underline-offset-4 transition"
          >
            <span>Designed & Developed by Rajat Maurya</span>
            <CiShare1 className="text-gray-900" size={22} />
          </a>

          {/* Center */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-900">
              © {new Date().getFullYear()} Postify. All rights reserved.
            </p>

            {/* ✅ Required by Google */}
            <div className="flex items-center gap-4 text-sm">
              <Link to="/privacy-policy" className="hover:underline">
                Privacy Policy
              </Link>
              <span className="opacity-50">|</span>
              <Link to="/terms" className="hover:underline">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4 text-gray-900">
            <span className="text-xs uppercase tracking-wide text-gray-900">
              Contact
            </span>

            <a
              href="https://github.com/rajatmaurya-cs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition"
              aria-label="GitHub"
            >
              <FaGithub size={20} />
            </a>

            <a
              href="https://www.linkedin.com/in/rajat-maurya-3a172331b/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={20} />
            </a>

            <a
              href="mailto:rajatmaurya.dev@gmail.com"
              className="hover:text-red-500 transition"
              aria-label="Email"
            >
              <MdEmail size={22} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
