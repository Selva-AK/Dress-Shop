'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FacebookIcon, InstagramIcon, TwitterIcon, MailIcon, PhoneIcon, LogoIcon } from '../ui/Icons';
import Button from '../ui/Button';

export default function Footer() {
    const [email, setEmail] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        // Handle newsletter subscription logic here
        console.log('Subscribed:', email);
        setEmail('');
        alert('Thank you for subscribing!');
    };

    return (
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block group">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/25 transition-all">
                                    <LogoIcon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-xl leading-none">DressStore</span>
                                    <span className="text-indigo-400 text-[10px] font-medium tracking-widest uppercase mt-1">Premium Fashion</span>
                                </div>
                            </div>
                        </Link>
                        <p className="text-sm leading-relaxed text-slate-400">
                            Discover the latest trends in fashion with our curated collection of premium dresses. Quality meets style in every piece.
                        </p>
                        <div className="flex items-center gap-4">
                            <SocialLink href="#" icon={<FacebookIcon className="w-5 h-5" />} label="Facebook" />
                            <SocialLink href="#" icon={<InstagramIcon className="w-5 h-5" />} label="Instagram" />
                            <SocialLink href="#" icon={<TwitterIcon className="w-5 h-5" />} label="Twitter" />
                        </div>
                    </div>

                    {/* Quick Liinks */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6">Shop</h3>
                        <ul className="space-y-4 text-sm">
                            <FooterLink href="/products?tag=new">New Arrivals</FooterLink>
                            <FooterLink href="/products?category=party">Party Wear</FooterLink>
                            <FooterLink href="/products?category=casual">Casual Dresses</FooterLink>
                            <FooterLink href="/products?category=formal">Formal Wear</FooterLink>
                            <FooterLink href="/products?category=summer">Summer Collection</FooterLink>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6">Support</h3>
                        <ul className="space-y-4 text-sm">
                            <FooterLink href="/orders">Track Order</FooterLink>
                            <FooterLink href="/returns">Returns & Exchange</FooterLink>
                            <FooterLink href="/shipping">Shipping Policy</FooterLink>
                            <FooterLink href="/contact">Contact Us</FooterLink>
                            <FooterLink href="/faq">FAQs</FooterLink>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6">Stay Updated</h3>
                        <p className="text-sm text-slate-400 mb-4">
                            Subscribe to our newsletter for exclusive offers and style tips.
                        </p>
                        <form onSubmit={handleSubscribe} className="space-y-3">
                            <div className="relative">
                                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-indigo-500/20">
                                Subscribe
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800 bg-slate-950">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                        <p>&copy; {new Date().getFullYear()} DressStore. All rights reserved.</p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                            <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon, label }) {
    return (
        <a
            href={href}
            aria-label={label}
            className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-all transform hover:-translate-y-1"
        >
            {icon}
        </a>
    );
}

function FooterLink({ href, children }) {
    return (
        <li>
            <Link href={href} className="text-slate-400 hover:text-indigo-400 transition-colors inline-block hover:translate-x-1 duration-200">
                {children}
            </Link>
        </li>
    );
}
