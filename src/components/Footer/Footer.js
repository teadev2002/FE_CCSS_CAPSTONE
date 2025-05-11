import React from "react";
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from "lucide-react";
import "../../styles/Footer.scss";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="brand-section">
            <h4 className="title">Cosplay Companion Service System</h4>
            <p className="description">
              Bringing your favorite characters to life through professional cosplay services.
            </p>
            <div className="social-icons">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Facebook size={20} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Twitter size={20} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div className="contact-section">
            <h3 className="title">Contact Info</h3>
            <div className="contact-info">
              <div className="info-item">
                <MapPin size={18} />
                <span>123 Cosplay Street, District 1, HCMC</span>
              </div>
              <div className="info-item">
                <Phone size={18} />
                <span>+84 123 456 789</span>
              </div>
              <div className="info-item">
                <Mail size={18} />
                <span>CCSS@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright">
        &copy; 2025 CosplayCompanionServiceSystem. All rights reserved.
      </div>
    </footer>
  );
}