
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-academy-gray-dark text-white py-8 mt-auto">
      <div className="academy-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Mpesa Foundation Academy</h3>
            <p className="text-academy-gray-light text-sm">
              Empowering students with entrepreneurial skills through 
              real-world business experience.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-academy-gray-light hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-academy-gray-light hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-academy-gray-light hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-academy-gray-light hover:text-white transition-colors">
                  Login / Register
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="text-academy-gray-light text-sm not-italic">
              <p>Mpesa Foundation Academy</p>
              <p>P.O. Box 7954-01000</p>
              <p>Thika, Kenya</p>
              <p className="mt-2">Email: info@mpesafoundationacademy.ac.ke</p>
              <p>Phone: +254 709 983 000</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-academy-gray-light mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Mpesa Foundation Academy. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link to="/privacy" className="text-xs text-academy-gray-light hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-academy-gray-light hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
