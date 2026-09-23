import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, ShieldCheck, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Brief */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-brand text-white p-1.5 rounded shadow flex items-center justify-center">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                MOUNTREACH
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Mountreach Solution Private Limited is an ISO 9001:2015 certified industrial training provider. We deliver elite, industry-vetted courses and internship programs tailored for Engineering and Polytechnic Diploma graduates.
            </p>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-md border border-slate-700">
                <ShieldCheck className="h-3 w-3 text-brand-light" />
                ISO 9001:2015
              </span>
              <span className="flex items-center gap-1 bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-md border border-slate-700">
                <Award className="h-3 w-3 text-yellow-500" />
                Certified Partner
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Core Programs</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/courses" className="hover:text-white transition-colors duration-200">
                  Full Stack Web Development
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-white transition-colors duration-200">
                  AI & Machine Learning
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-white transition-colors duration-200">
                  Android & Kotlin Apps
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-white transition-colors duration-200">
                  Cyber Security & Pentesting
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Resource Hub</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/courses" className="hover:text-white transition-colors duration-200">
                  Explore Course Catalog
                </Link>
              </li>
              <li>
                <Link to="/internships" className="hover:text-white transition-colors duration-200">
                  Industrial Internship Hub
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors duration-200">
                  Student Portal Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors duration-200">
                  Academic Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Corporate Contact */}
          <div className="space-y-3 text-sm">
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Corporate Office</h3>
            <div className="flex items-start gap-2 text-slate-400">
              <MapPin className="h-5 w-5 text-brand-light flex-shrink-0 mt-0.5" />
              <span>Mountreach Corporate Campus, Sector 62, Noida, Uttar Pradesh, 201301</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Mail className="h-4 w-4 text-brand-light" />
              <a href="mailto:support@mountreach.com" className="hover:text-white transition-colors">
                support@mountreach.com
              </a>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Phone className="h-4 w-4 text-brand-light" />
              <span>+91 98765 43210</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Mountreach Solution Private Limited. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Verify Credentials</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
