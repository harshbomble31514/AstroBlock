'use client'

import React from 'react'
import Link from 'next/link'
import { Sparkles, Home, Search, MessageCircle, ArrowLeft, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

export default function NotFound() {
  const quickLinks = [
    { href: '/', label: 'Home', icon: Home, description: 'Return to main page' },
    { href: '/chat', label: 'Start Chatting', icon: MessageCircle, description: 'Chat with AI gurus' },
    { href: '/gurus', label: 'Browse Gurus', icon: Star, description: 'Explore our spiritual guides' },
    { href: '/help', label: 'Get Help', icon: Search, description: 'Find answers and support' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Stars */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-2 border-purple-500/20 rounded-full animate-pulse" />
            <div className="absolute w-24 h-24 border-2 border-blue-500/20 rounded-full animate-ping" />
          </div>
          <div className="relative z-10 flex justify-center">
            <Sparkles className="h-24 w-24 text-purple-400 animate-bounce" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h1 className="text-8xl font-bold mb-4">
            <span className="gradient-text">404</span>
          </h1>
          <h2 className="text-3xl font-bold mb-4 text-white">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed mb-2">
            The cosmic path you're seeking seems to have shifted. 
          </p>
          <p className="text-lg text-gray-400">
            This page may have been moved, deleted, or perhaps it never existed in this dimension.
          </p>
        </div>

        {/* Quick Links */}
        <Card className="astro-card mb-8">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-6 gradient-text">
              Let the stars guide you back
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {quickLinks.map((link, index) => {
                const Icon = link.icon
                return (
                  <Link key={index} href={link.href}>
                    <div className="flex items-center space-x-3 p-4 rounded-lg border border-muted/20 hover:bg-muted/20 transition-colors group">
                      <Icon className="h-5 w-5 text-purple-400 group-hover:text-purple-300" />
                      <div className="text-left">
                        <div className="font-medium group-hover:text-purple-300">{link.label}</div>
                        <div className="text-sm text-gray-400">{link.description}</div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            size="lg"
            className="group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            Go Back
          </Button>
          <Link href="/">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Home className="mr-2 h-4 w-4" />
              Take Me Home
            </Button>
          </Link>
        </div>

        {/* Mystical Quote */}
        <div className="mt-12 p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
          <blockquote className="text-purple-300 italic text-lg mb-2">
            "Not all who wander are lost, but some pages definitely are."
          </blockquote>
          <cite className="text-gray-400 text-sm">— Ancient Web Wisdom</cite>
        </div>

        {/* Technical Info */}
        <div className="mt-8 text-xs text-gray-500">
          Error Code: 404 | If this page should exist, please{' '}
          <Link href="/contact" className="text-purple-400 hover:text-purple-300">
            contact our support team
          </Link>
        </div>
      </div>
    </div>
  )
}
