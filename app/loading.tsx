import React from 'react'
import { Sparkles, Crown, Zap, Star } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 royal-gradient rounded-full opacity-10 animate-royal-float blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-royal-blue/20 to-royal-gold/20 rounded-full opacity-20 animate-royal-float blur-2xl" style={{ animationDelay: '2s' }} />
      </div>

      <div className="text-center relative z-10 animate-royal-fade-in">
        {/* Royal Loading Spinner */}
        <div className="relative mb-12">
          {/* Outermost ring */}
          <div className="w-32 h-32 border-4 border-royal-purple/20 border-t-royal-purple rounded-full animate-royal-spin relative">
            {/* Middle ring */}
            <div className="absolute inset-2 border-3 border-royal-blue/30 border-r-royal-blue rounded-full animate-royal-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
              {/* Inner ring */}
              <div className="absolute inset-2 border-2 border-royal-gold/40 border-b-royal-gold rounded-full animate-royal-spin" style={{ animationDuration: '1.5s' }}>
                {/* Center element */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 royal-gradient rounded-full flex items-center justify-center animate-royal-glow">
                    <Sparkles className="h-6 w-6 text-white animate-royal-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating Icons */}
          <div className="absolute inset-0 animate-royal-float">
            {/* Top */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <Crown className="h-6 w-6 text-royal-gold animate-royal-pulse" style={{ animationDelay: '0s' }} />
            </div>
            {/* Right */}
            <div className="absolute top-1/2 -right-8 transform -translate-y-1/2">
              <Star className="h-5 w-5 text-royal-purple animate-royal-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            {/* Bottom */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <Zap className="h-6 w-6 text-royal-blue animate-royal-pulse" style={{ animationDelay: '1s' }} />
            </div>
            {/* Left */}
            <div className="absolute top-1/2 -left-8 transform -translate-y-1/2">
              <Sparkles className="h-5 w-5 text-royal-emerald animate-royal-pulse" style={{ animationDelay: '1.5s' }} />
            </div>
          </div>

          {/* Orbiting Elements */}
          <div className="absolute inset-0 animate-royal-spin" style={{ animationDuration: '4s' }}>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="w-3 h-3 bg-royal-gold rounded-full animate-royal-breathe" />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="w-3 h-3 bg-royal-purple rounded-full animate-royal-breathe" style={{ animationDelay: '1s' }} />
            </div>
            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
              <div className="w-3 h-3 bg-royal-blue rounded-full animate-royal-breathe" style={{ animationDelay: '2s' }} />
            </div>
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
              <div className="w-3 h-3 bg-royal-emerald rounded-full animate-royal-breathe" style={{ animationDelay: '3s' }} />
            </div>
          </div>
        </div>

        {/* Royal Loading Text */}
        <div className="space-y-6 animate-royal-slide-in" style={{ animationDelay: '0.5s' }}>
          <div className="royal-card p-6 max-w-md mx-auto">
            <h2 className="text-3xl font-bold royal-gradient-text mb-3">
              Loading...
            </h2>
            <p className="text-royal-silver royal-text-glow text-lg">
              ✨ Consulting the cosmic energies...
            </p>
            <p className="text-royal-gold/80 text-sm mt-2">
              Crafted with royal precision by Claude
            </p>
          </div>
        </div>

        {/* Elegant Progress Indicators */}
        <div className="flex justify-center space-x-3 mt-8 animate-royal-fade-in" style={{ animationDelay: '1s' }}>
          <div className="flex space-x-2">
            <div className="w-3 h-3 royal-gradient rounded-full animate-royal-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 royal-gradient rounded-full animate-royal-pulse" style={{ animationDelay: '200ms' }} />
            <div className="w-3 h-3 royal-gradient rounded-full animate-royal-pulse" style={{ animationDelay: '400ms' }} />
            <div className="w-3 h-3 royal-gradient rounded-full animate-royal-pulse" style={{ animationDelay: '600ms' }} />
            <div className="w-3 h-3 royal-gradient rounded-full animate-royal-pulse" style={{ animationDelay: '800ms' }} />
          </div>
        </div>

        {/* Loading Progress Bar */}
        <div className="mt-8 max-w-sm mx-auto">
          <div className="h-2 royal-card overflow-hidden">
            <div className="h-full royal-gradient animate-royal-shimmer" />
          </div>
        </div>
      </div>
    </div>
  )
}
