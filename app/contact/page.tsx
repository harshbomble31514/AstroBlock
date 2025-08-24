'use client'

import React, { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HelpCircle, Bug, Lightbulb, Heart } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
    priority: 'normal'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const categories = [
    { value: 'general', label: 'General Inquiry', icon: MessageCircle },
    { value: 'support', label: 'Technical Support', icon: HelpCircle },
    { value: 'bug', label: 'Bug Report', icon: Bug },
    { value: 'feature', label: 'Feature Request', icon: Lightbulb },
    { value: 'partnership', label: 'Partnership', icon: Heart },
  ]

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help from our support team',
      contact: 'support@astroblock.app',
      responseTime: '< 24 hours'
    },
    {
      icon: MessageCircle,
      title: 'General Inquiries',
      description: 'Questions about our platform',
      contact: 'hello@astroblock.app',
      responseTime: '< 48 hours'
    },
    {
      icon: Heart,
      title: 'Partnerships',
      description: 'Business development & collaborations',
      contact: 'partnerships@astroblock.app',
      responseTime: '< 72 hours'
    },
    {
      icon: Bug,
      title: 'Bug Reports',
      description: 'Report technical issues',
      contact: 'bugs@astroblock.app',
      responseTime: '< 12 hours'
    },
  ]

  const faqs = [
    {
      question: 'How does blockchain verification work?',
      answer: 'Every reading generates cryptographic hashes that are stored on Aptos blockchain, proving authenticity without exposing personal data.'
    },
    {
      question: 'Is my personal information secure?',
      answer: 'Yes! We use client-side encryption and never store personal information on-chain. Only anonymous proofs are recorded.'
    },
    {
      question: 'Can I get refunds for subscription passes?',
      answer: 'Due to the digital nature of our services, all sales are final. However, we offer trial periods and satisfaction guarantees.'
    },
    {
      question: 'How accurate are the AI guru readings?',
      answer: 'Our AI gurus are designed for guidance and reflection, not prediction. Always consult professionals for serious life decisions.'
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setSubmitted(true)
    setIsSubmitting(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <Card className="royal-card max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Send className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4 royal-gradient-text">Message Sent!</h2>
            <p className="text-gray-300 mb-6">
              Thank you for contacting us. We'll get back to you within 24-48 hours.
            </p>
            <Button 
              onClick={() => setSubmitted(false)}
              className="royal-button"
            >
              Send Another Message
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 royal-gradient-bg">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="royal-gradient-text">Get in Touch</span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Have questions about Astroblock? Need technical support? Want to partner with us? 
            We're here to help and would love to hear from you.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <Card key={index} className="royal-card text-center">
                <CardContent className="p-6">
                  <Icon className="h-8 w-8 text-purple-400 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{method.title}</h3>
                  <p className="text-sm text-gray-300 mb-3">{method.description}</p>
                  <a 
                    href={`mailto:${method.contact}`}
                    className="text-purple-400 hover:text-purple-300 text-sm font-medium block mb-2"
                  >
                    {method.contact}
                  </a>
                  <Badge variant="outline" className="text-xs">
                    Response: {method.responseTime}
                  </Badge>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="royal-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5 text-purple-400" />
                <span>Send us a Message</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-muted border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium mb-2">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-muted border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    placeholder="Please provide as much detail as possible..."
                    className="w-full px-3 py-2 bg-muted border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full royal-button"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <div className="space-y-6">
            <Card className="royal-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5 text-purple-400" />
                  <span>Frequently Asked Questions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-muted/20 pb-4 last:border-b-0 last:pb-0">
                      <h4 className="font-medium mb-2 text-purple-300">{faq.question}</h4>
                      <p className="text-sm text-gray-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Office Info */}
            <Card className="royal-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-purple-400" />
                  <span>Our Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Support Hours</p>
                    <p className="text-sm text-gray-300">Monday - Friday: 9 AM - 6 PM PST</p>
                    <p className="text-sm text-gray-300">Saturday - Sunday: Emergency support only</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Based On</p>
                    <p className="text-sm text-gray-300">Aptos Blockchain (Testnet)</p>
                    <p className="text-sm text-gray-300">Distributed team worldwide</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Emergency Contact</p>
                    <p className="text-sm text-gray-300">For critical issues affecting live services</p>
                    <p className="text-sm text-purple-400">emergency@astroblock.app</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
