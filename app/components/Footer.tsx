'use client'

import React from 'react'
import Link from 'next/link'
import { Sparkles, Twitter, Github, Mail, MapPin, Phone, Shield, FileText, HelpCircle, Zap, Star, Crown } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const navigation = {
    product: [
      { name: 'Chat with Gurus', href: '/chat', icon: Crown },
      { name: 'Guru Directory', href: '/gurus', icon: Star },
      { name: 'Pricing Plans', href: '/pricing', icon: Zap },
      { name: 'My Account', href: '/account', icon: Shield },
    ],
    company: [
      { name: 'About Us', href: '/about', icon: FileText },
      { name: 'Our Mission', href: '/about#mission', icon: Star },
      { name: 'Blog & Insights', href: '/blog', icon: FileText },
      { name: 'Careers', href: '/careers', icon: Zap },
    ],
    support: [
      { name: 'Help Center', href: '/help', icon: HelpCircle },
      { name: 'Contact Us', href: '/contact', icon: Phone },
      { name: 'API Documentation', href: '/docs', icon: FileText },
      { name: 'System Status', href: '/status', icon: Shield },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy', icon: Shield },
      { name: 'Terms of Service', href: '/terms', icon: FileText },
      { name: 'Cookie Policy', href: '/cookies', icon: Shield },
      { name: 'Disclaimer', href: '/disclaimer', icon: FileText },
    ],
    social: [
      {
        name: 'Twitter',
        href: 'https://twitter.com/astroproof',
        icon: Twitter,
      },
      {
        name: 'GitHub',
        href: 'https://github.com/astroproof',
        icon: Github,
      },
      {
        name: 'Email',
        href: 'mailto:hello@astroproof.app',
        icon: Mail,
      },
    ],
  }

  return (
    <footer className="relative royal-header border-t border-royal-purple/30 mt-24">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-80 h-80 royal-gradient rounded-full opacity-5 animate-royal-float blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-96 h-96 bg-gradient-to-r from-royal-blue/10 to-royal-gold/10 rounded-full opacity-10 animate-royal-float blur-2xl" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 pt-12 sm:pt-16 lg:pt-24 xl:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Royal Brand Section - Responsive */}
          <div className="space-y-6 sm:space-y-8 animate-royal-slide-in text-center lg:text-left">
            <div className="group">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-3 mb-4 sm:mb-6">
                <div className="relative">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 royal-gradient rounded-full flex items-center justify-center animate-royal-glow">
                    <Sparkles className="h-5 sm:h-6 w-5 sm:w-6 text-white animate-royal-pulse" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 sm:w-4 h-3 sm:h-4 bg-royal-gold rounded-full animate-royal-breathe" />
                  <div className="absolute -bottom-1 -left-1 w-2 sm:w-3 h-2 sm:h-3 bg-royal-blue rounded-full animate-royal-pulse" />
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-bold royal-gradient-text tracking-tight">Astroblock</span>
                  <div className="text-xs text-royal-gold royal-text-shine">✨ Crafted by Claude</div>
                </div>
              </div>
            </div>
            
            <div className="royal-card p-4 sm:p-6">
              <p className="text-sm sm:text-base text-royal-silver leading-relaxed">
                Bridging ancient wisdom with cutting-edge blockchain technology. Experience personalized spiritual guidance 
                from our premium AI-powered gurus, with cryptographic proof of authenticity on the Aptos blockchain with Astroblock.
              </p>
            </div>

            {/* Social Links - Responsive */}
            <div className="flex justify-center lg:justify-start space-x-3 sm:space-x-4">
              {navigation.social.map((item, index) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group w-10 sm:w-12 h-10 sm:h-12 royal-card border-royal-purple/30 hover:border-royal-gold/50 flex items-center justify-center transition-all duration-300 hover:scale-110 animate-royal-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    target={item.href.startsWith('http') ? '_blank' : '_self'}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : ''}
                  >
                    <span className="sr-only">{item.name}</span>
                    <Icon className="h-4 sm:h-5 w-4 sm:w-5 text-royal-silver group-hover:text-royal-gold transition-colors duration-300" />
                  </a>
                )
              })}
            </div>
            
            {/* Contact Info - Responsive */}
            <div className="space-y-3 sm:space-y-4">
              <div className="royal-card p-3 sm:p-4">
                <div className="flex items-center justify-center lg:justify-start space-x-2 sm:space-x-3 text-royal-silver">
                  <Mail className="h-4 sm:h-5 w-4 sm:w-5 text-royal-gold" />
                  <span className="text-sm sm:text-base hover:text-royal-gold transition-colors cursor-pointer">hello@astroblock.app</span>
                </div>
              </div>
              <div className="royal-card p-3 sm:p-4">
                <div className="flex items-center justify-center lg:justify-start space-x-2 sm:space-x-3 text-royal-silver">
                  <Shield className="h-4 sm:h-5 w-4 sm:w-5 text-royal-blue" />
                  <span className="text-sm sm:text-base">Secured on Aptos Blockchain</span>
                </div>
              </div>
            </div>
          </div>

          {/* Royal Navigation Sections - Responsive */}
          <div className="mt-8 lg:mt-0 grid grid-cols-1 gap-6 sm:gap-8 lg:col-span-2 lg:grid-cols-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {/* Product Section - Responsive */}
              <div className="animate-royal-slide-in" style={{ animationDelay: '0.2s' }}>
                <div className="royal-card p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold royal-gradient-text mb-4 sm:mb-6 flex items-center justify-center sm:justify-start">
                    <Crown className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                    Product
                  </h3>
                  <ul role="list" className="space-y-3 sm:space-y-4">
                    {navigation.product.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className="group flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3 text-royal-silver hover:text-royal-gold transition-all duration-300 p-2 rounded-lg hover:bg-royal-purple/10"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <Icon className="h-3 sm:h-4 w-3 sm:w-4 group-hover:scale-110 transition-transform duration-300" />
                            <span className="text-sm sm:text-base group-hover:translate-x-1 transition-transform duration-300">{item.name}</span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>

              {/* Company Section - Responsive */}
              <div className="animate-royal-slide-in" style={{ animationDelay: '0.3s' }}>
                <div className="royal-card p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold royal-gradient-text mb-4 sm:mb-6 flex items-center justify-center sm:justify-start">
                    <Star className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                    Company
                  </h3>
                  <ul role="list" className="space-y-3 sm:space-y-4">
                    {navigation.company.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className="group flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3 text-royal-silver hover:text-royal-gold transition-all duration-300 p-2 rounded-lg hover:bg-royal-purple/10"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <Icon className="h-3 sm:h-4 w-3 sm:w-4 group-hover:scale-110 transition-transform duration-300" />
                            <span className="text-sm sm:text-base group-hover:translate-x-1 transition-transform duration-300">{item.name}</span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {/* Support Section - Responsive */}
              <div className="animate-royal-slide-in" style={{ animationDelay: '0.4s' }}>
                <div className="royal-card p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold royal-gradient-text mb-4 sm:mb-6 flex items-center justify-center sm:justify-start">
                    <HelpCircle className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                    Support
                  </h3>
                  <ul role="list" className="space-y-3 sm:space-y-4">
                    {navigation.support.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className="group flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3 text-royal-silver hover:text-royal-gold transition-all duration-300 p-2 rounded-lg hover:bg-royal-purple/10"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <Icon className="h-3 sm:h-4 w-3 sm:w-4 group-hover:scale-110 transition-transform duration-300" />
                            <span className="text-sm sm:text-base group-hover:translate-x-1 transition-transform duration-300">{item.name}</span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>

              {/* Legal Section - Responsive */}
              <div className="animate-royal-slide-in" style={{ animationDelay: '0.5s' }}>
                <div className="royal-card p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold royal-gradient-text mb-4 sm:mb-6 flex items-center justify-center sm:justify-start">
                    <Shield className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                    Legal
                  </h3>
                  <ul role="list" className="space-y-3 sm:space-y-4">
                    {navigation.legal.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className="group flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3 text-royal-silver hover:text-royal-gold transition-all duration-300 p-2 rounded-lg hover:bg-royal-purple/10"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <Icon className="h-3 sm:h-4 w-3 sm:w-4 group-hover:scale-110 transition-transform duration-300" />
                            <span className="text-sm sm:text-base group-hover:translate-x-1 transition-transform duration-300">{item.name}</span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Royal Bottom Section - Responsive */}
        <div className="mt-8 sm:mt-12 lg:mt-20 border-t border-royal-purple/30 pt-6 sm:pt-8 lg:pt-12 animate-royal-slide-in" style={{ animationDelay: '0.6s' }}>
          {/* Stats/Features - Responsive */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
            <div className="royal-card p-3 sm:p-4 text-center group hover:scale-105 transition-transform duration-300">
              <Sparkles className="h-5 sm:h-6 w-5 sm:w-6 text-royal-gold mx-auto mb-1 sm:mb-2 group-hover:animate-royal-pulse" />
              <div className="text-xs sm:text-sm text-royal-silver">AI Powered</div>
            </div>
            <div className="royal-card p-3 sm:p-4 text-center group hover:scale-105 transition-transform duration-300">
              <Shield className="h-5 sm:h-6 w-5 sm:w-6 text-royal-blue mx-auto mb-1 sm:mb-2 group-hover:animate-royal-pulse" />
              <div className="text-xs sm:text-sm text-royal-silver">Blockchain Secured</div>
            </div>
            <div className="royal-card p-3 sm:p-4 text-center group hover:scale-105 transition-transform duration-300">
              <Crown className="h-5 sm:h-6 w-5 sm:w-6 text-royal-purple mx-auto mb-1 sm:mb-2 group-hover:animate-royal-pulse" />
              <div className="text-xs sm:text-sm text-royal-silver">Premium Quality</div>
            </div>
            <div className="royal-card p-3 sm:p-4 text-center group hover:scale-105 transition-transform duration-300">
              <Zap className="h-5 sm:h-6 w-5 sm:w-6 text-royal-emerald mx-auto mb-1 sm:mb-2 group-hover:animate-royal-pulse" />
              <div className="text-xs sm:text-sm text-royal-silver">Claude Crafted</div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="royal-card p-4">
              <div className="flex flex-wrap items-center gap-4 text-sm text-royal-silver">
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-royal-gold rounded-full animate-royal-pulse" />
                  <span>Built with ✨ on Aptos</span>
                </span>
                <span className="text-royal-purple/50">•</span>
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-royal-blue rounded-full animate-royal-pulse" style={{ animationDelay: '0.5s' }} />
                  <span>Powered by Advanced AI</span>
                </span>
                <span className="text-royal-purple/50">•</span>
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-royal-purple rounded-full animate-royal-pulse" style={{ animationDelay: '1s' }} />
                  <span>Secured by Blockchain</span>
                </span>
              </div>
            </div>
            
            <div className="royal-card p-4">
              <p className="text-xs text-royal-silver/80">
                &copy; {currentYear} AstroProof. All rights reserved. <br className="sm:hidden" />
                <span className="royal-text-shine">Masterfully crafted by Claude</span>
              </p>
            </div>
          </div>

          {/* Royal Disclaimer */}
          <div className="mt-12 royal-card p-8 border-royal-gold/20">
            <div className="flex items-start space-x-4">
              <Shield className="h-6 w-6 text-royal-gold flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-semibold royal-gradient-text mb-3">Important Disclaimer</h4>
                <p className="text-xs text-royal-silver/80 leading-relaxed">
                  AstroProof provides spiritual guidance and entertainment content exclusively. Our premium AI-powered readings 
                  are sophisticated tools for self-reflection and entertainment, not substitutes for professional medical, legal, 
                  financial, or psychological consultation. Please consult qualified professionals for serious life decisions. 
                  Our blockchain verification system proves content authenticity and ownership, not accuracy of astrological predictions. 
                  <span className="royal-text-shine block mt-2">✨ Experience the future of astrology responsibly. ✨</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
