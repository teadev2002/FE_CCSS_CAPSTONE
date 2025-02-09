import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-solid text-center">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-bold text-black mb-4">
              Cosplay Companion Service System
            </h4>
            <p className="text-sm">
              {" "}
              Bringing your favorite characters to life through professional
              cosplay services.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-black mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin size={18} />
                <span>123 Cosplay Street, District 1, HCMC</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} />
                <span>+84 123 456 789</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} />
                <span>contact@cosplayverse.com</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>&copy; 2025 CosplayVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
