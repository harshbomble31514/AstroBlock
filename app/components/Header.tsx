'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { WalletConnect } from '@/components/WalletConnect'
import { Menu, X, Star, Sparkles, Crown, MessageCircle, Home, Info, Phone, HelpCircle, FileText, Newspaper, Zap } from 'lucide-react'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Chat', href: '/chat', icon: MessageCircle },
    { name: 'Gurus', href: '/gurus', icon: Crown },
    { name: 'Pricing', href: '/pricing', icon: Star },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Help', href: '/help', icon: HelpCircle },
    { name: 'Blog', href: '/blog', icon: Newspaper },
    { name: 'Contact', href: '/contact', icon: Phone },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out royal-header ${
      scrolled ? 'py-1 sm:py-2' : 'py-2 sm:py-4'
    }`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-4 lg:px-8" aria-label="Global">
        {/* Logo - Responsive */}
        <div className="flex lg:flex-1">
          <Link href="/" className="group -m-1.5 p-1.5 flex items-center space-x-2 sm:space-x-3 transition-all duration-300 hover:scale-105">
            <div className="relative animate-royal-float">
              <Sparkles className="h-6 sm:h-8 w-6 sm:w-8 text-royal-gold animate-royal-glow" />
              <Zap className="absolute top-0.5 sm:top-1 left-0.5 sm:left-1 h-2 sm:h-3 w-2 sm:w-3 text-royal-purple animate-royal-pulse" />
              <div className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 h-2 sm:h-3 w-2 sm:w-3 royal-gradient rounded-full animate-royal-breathe" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-2xl font-bold royal-gradient-text tracking-tight">
                Astroblock
              </span>
              <div className="hidden sm:block text-xs text-royal-silver">
                <span className="royal-text-shine">✨ By Claude</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="group -m-2.5 inline-flex items-center justify-center rounded-lg p-2.5 royal-button transition-all duration-300"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-1 xl:gap-x-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`royal-nav-link group flex items-center space-x-1 xl:space-x-2 px-2 xl:px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive(item.href)
                    ? 'text-royal-gold royal-text-glow bg-royal-purple/20'
                    : 'text-royal-silver hover:text-royal-gold hover:bg-royal-purple/10'
                }`}
              >
                <Icon className={`h-3 xl:h-4 w-3 xl:w-4 transition-all duration-300 ${
                  isActive(item.href) 
                    ? 'animate-royal-pulse' 
                    : 'group-hover:scale-110 group-hover:rotate-12'
                }`} />
                <span className="text-sm xl:text-base font-medium hidden xl:block">{item.name}</span>
                <span className="text-xs font-medium xl:hidden">{item.name.slice(0, 4)}</span>
              </Link>
            )
          })}
        </div>

        {/* Desktop wallet connection */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:space-x-2 xl:space-x-4">
          <Link href="/account">
            <Button 
              variant="outline" 
              size="sm"
              className="royal-card border-royal-purple/30 hover:border-royal-gold/50 text-royal-silver hover:text-royal-gold transition-all duration-300 px-2 xl:px-3"
            >
              <Crown className="h-3 xl:h-4 w-3 xl:w-4 mr-1 xl:mr-2" />
              <span className="hidden xl:inline">My Account</span>
              <span className="xl:hidden text-xs">Account</span>
            </Button>
          </Link>
          <WalletConnect />
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden animate-royal-fade-in">
          <div className="fixed inset-0 z-50 bg-royal-navy/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto royal-backdrop px-6 py-6 sm:max-w-sm border-l border-royal-purple/30 royal-shadow-lg animate-royal-slide-in">
            <div className="flex items-center justify-between">
              <Link href="/" className="group -m-1.5 p-1.5 flex items-center space-x-2">
                <div className="relative">
                  <Sparkles className="h-6 w-6 text-royal-gold animate-royal-glow" />
                  <Zap className="absolute top-1 left-1 h-2 w-2 text-royal-purple animate-royal-pulse" />
                </div>
                <span className="text-lg font-bold royal-gradient-text">AstroProof</span>
              </Link>
              <button
                type="button"
                className="group -m-2.5 rounded-lg p-2.5 royal-button"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-8 flow-root">
              <div className="-my-6 divide-y divide-royal-purple/20">
                <div className="space-y-3 py-6">
                  {navigation.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group -mx-3 flex items-center space-x-4 rounded-xl px-4 py-3 text-base font-semibold transition-all duration-300 royal-card ${
                          isActive(item.href)
                            ? 'bg-royal-purple/20 text-royal-gold royal-text-glow border-royal-gold/30'
                            : 'text-royal-silver hover:text-royal-gold hover:bg-royal-purple/10 border-transparent'
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className={`h-5 w-5 transition-all duration-300 ${
                          isActive(item.href) 
                            ? 'animate-royal-pulse' 
                            : 'group-hover:scale-110 group-hover:rotate-12'
                        }`} />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
                <div className="py-6 space-y-4">
                  <Link
                    href="/account"
                    className="group block -mx-3 rounded-xl px-4 py-3 text-base font-semibold royal-card text-royal-silver hover:text-royal-gold hover:bg-royal-purple/10 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <Crown className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                      <span>My Account</span>
                    </div>
                  </Link>
                  <div className="px-3">
                    <WalletConnect />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
