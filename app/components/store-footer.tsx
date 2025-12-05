"use client";

import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

export default function StoreFooter() {
  return (
    <footer className="bg-content1 border-t border-divider pt-16 pb-8">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Zamalek Store</h3>
            <p className="text-default-500 text-sm">
              The official store for Zamalek SC fans. Get your authentic
              jerseys, merchandise, and accessories here.
            </p>
            <div className="flex gap-4">
              <Link href="#" color="foreground" aria-label="Facebook">
                <Facebook size={20} />
              </Link>
              <Link href="#" color="foreground" aria-label="Twitter">
                <Twitter size={20} />
              </Link>
              <Link href="#" color="foreground" aria-label="Instagram">
                <Instagram size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-large">Shop</h4>
            <ul className="space-y-2 text-sm text-default-500">
              <li>
                <Link href="/products" color="foreground">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=jerseys" color="foreground">
                  Jerseys
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" color="foreground">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/products?sort=newest" color="foreground">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-large">Support</h4>
            <ul className="space-y-2 text-sm text-default-500">
              <li>
                <Link href="#" color="foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" color="foreground">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="#" color="foreground">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="#" color="foreground">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-large">Stay Updated</h4>
            <p className="text-default-500 text-sm">
              Subscribe to our newsletter for the latest drops and exclusive
              offers.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your email"
                startContent={<Mail size={16} className="text-default-400" />}
                size="sm"
                variant="bordered"
              />
              <Button color="primary" size="sm">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-divider pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-small text-default-400">
            &copy; {new Date().getFullYear()} Zamalek Store. All rights
            reserved.
          </p>
          <div className="flex gap-6 text-small text-default-400">
            <Link href="#" color="foreground" size="sm">
              Privacy Policy
            </Link>
            <Link href="#" color="foreground" size="sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
