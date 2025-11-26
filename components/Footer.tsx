import React from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import Image from "next/image";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import { footerData } from "@/constants";

const socialIcons = {
  Facebook: Facebook,
  Linkedin: Linkedin,
  X: X,
  Instagram: Instagram,
};

const Footer = () => {
  const {
    contactInfo,
    quickLinks,
    candidateLinks,
    employerLinks,
    socialLinks,
    policyLinks,
  } = footerData;

  return (
    <footer className="bg-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo and Contact Section */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center mb-6 gap-4">
              <Image src="/images/logo.jpg" width={60} height={60} alt="logo" />
              <span className="text-2xl font-bold text-indigo-600">Z Jobs</span>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6">{contactInfo.description}</p>

            {/* Contact Info */}
            <div className="space-y-4">
              <Link
                href="tel:9898433707"
                className="flex items-center text-gray-600"
              >
                <Phone className="w-5 h-5 mr-2" />
                <span>{contactInfo.phone}</span>
              </Link>
              <Link
                href="mailto:mail@zjobs.in"
                className="flex items-center text-gray-600"
              >
                <Mail className="w-5 h-5 mr-2" />
                <span>{contactInfo.mail}</span>
              </Link>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{contactInfo.address}</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:border-indigo-500"
                />
                <Button className="px-6 py-2 bg-indigo-600 text-white rounded-r hover:bg-indigo-700 transition-colors">
                  →
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-indigo-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Candidates */}
          <div>
            <h3 className="text-lg font-semibold mb-4">For Candidates</h3>
            <ul className="space-y-3">
              {candidateLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-indigo-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-lg font-semibold mb-4">For Employers</h3>
            <ul className="space-y-3">
              {employerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-indigo-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Social Links on the Left */}
            <div className="flex items-center mb-4 md:mb-0 md:order-1 space-x-4">
              <span className="text-gray-600">Follow Us:</span>
              {socialLinks.map(({ icon, href }) => {
                const IconComponent =
                  socialIcons[icon as keyof typeof socialIcons]; // Type-safe access

                if (!IconComponent) {
                  return null; // Avoid rendering anything if the icon is not found
                }

                return (
                  <Link
                    href={href}
                    key={icon}
                    className="text-gray-600 hover:text-indigo-600"
                    target="_blank"
                  >
                    <IconComponent size={20} />
                  </Link>
                );
              })}
            </div>

            {/* Copyright in the Center */}
            <div className="flex items-center mb-4 md:mb-0 md:order-2">
              <span className="text-gray-600">
                ©2024 Z Jobs. All Rights Reserved.
              </span>
            </div>

            {/* Policy Links on the Right */}
            <div className="flex items-center md:order-3 space-x-4">
              {policyLinks.map((link) => (
                <Link
                  href={link.href}
                  key={link.label}
                  className="text-gray-600 hover:text-indigo-600"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
