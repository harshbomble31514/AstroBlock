'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ArrowLeft, Send, MessageCircle, Crown, Star, Users, Clock, AlertTriangle, Image, Camera, Upload } from 'lucide-react'
import { generateChatResponse } from '@/lib/ai'
import { deriveEffectiveTier, canAccessGuru, canStartNewChat } from '@/lib/access'
import { incrementFreeUsage } from '@/lib/usage'
import { WalletConnect } from '@/components/WalletConnect'
import { Spinner } from '@/components/Spinner'
import { toast } from '@/components/Toast'
import gurusData from '@/data/gurus.json'
import type { EffectiveAccess } from '@/lib/access'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  persona: string
  error?: boolean
  image?: string
  imageType?: 'palm' | 'kundali' | 'general'
}

interface ExpertType {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  supportsImages: boolean
  imageTypes?: string[]
}

const expertTypes: ExpertType[] = [
  {
    id: 'general',
    name: 'General Spiritual Guide',
    description: 'General spiritual guidance and life advice',
    icon: MessageCircle,
    supportsImages: false
  },
  {
    id: 'palmistry',
    name: 'Palm Reader',
    description: 'Palm reading and hand analysis',
    icon: Upload,
    supportsImages: true,
    imageTypes: ['palm']
  },
  {
    id: 'kundali',
    name: 'Kundali Expert',
    description: 'Birth chart and kundali analysis',
    icon: Star,
    supportsImages: true,
    imageTypes: ['kundali']
  },
  {
    id: 'face-reading',
    name: 'Face Reader',
    description: 'Facial features and personality analysis',
    icon: Camera,
    supportsImages: true,
    imageTypes: ['face']
  }
]

export default function ChatPage() {
  const { connected, account } = useWallet()
  const searchParams = useSearchParams()
  const initialGuru = searchParams.get('guru') || null
  
  const [access, setAccess] = useState<EffectiveAccess | null>(null)
  const [selectedExpertType, setSelectedExpertType] = useState<string | null>(null)
  const [currentGuru, setCurrentGuru] = useState(initialGuru)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [typingMessage, setTypingMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [accessLoading, setAccessLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (connected && account?.address) {
      loadAccess()
    } else if (connected) {
      // Set default free access if connected but no address
      setAccess({
        tier: 'FREE',
        freeChatsUsed: 0,
        freeChatsRemaining: 3,
      })
    }
  }, [connected, account])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Focus input when guru changes
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [currentGuru])

  const loadAccess = async () => {
    if (!account?.address) return
    
    try {
      setAccessLoading(true)
      const effectiveAccess = await deriveEffectiveTier({ owner: account.address })
      setAccess(effectiveAccess)
    } catch (error) {
      console.error('Failed to load access:', error)
      
      // Fallback to free tier for demo
      setAccess({
        tier: 'FREE',
        freeChatsUsed: 0,
        freeChatsRemaining: 3,
      })
      
      toast({
        title: 'Demo Mode',
        description: 'Running in demo mode with free tier access',
      })
    } finally {
      setAccessLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Human-like typing animation
  const typeMessage = async (content: string, callback: (fullMessage: Message) => void) => {
    setIsTyping(true)
    setTypingMessage('')
    
    const words = content.split(' ')
    let currentText = ''
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i]
      setTypingMessage(currentText)
      
      // Variable typing speed - faster for short words, slower for longer words
      const delay = Math.max(100, Math.min(300, words[i].length * 50))
      await new Promise(resolve => setTimeout(resolve, delay))
    }
    
    // Add final message
    const finalMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: content,
      timestamp: new Date(),
      persona: currentGuru || selectedExpertType || 'general',
    }
    
    setIsTyping(false)
    setTypingMessage('')
    callback(finalMessage)
  }

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB',
        variant: 'destructive',
      })
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file',
        variant: 'destructive',
      })
      return
    }

    setSelectedImage(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const canUserAccessGuru = (guruSlug: string): boolean => {
    if (!access) return false
    return canAccessGuru(access, guruSlug)
  }

  const getAvailableGurus = () => {
    if (!access) return []
    
    switch (access.tier) {
      case 'ALL_GURUS':
        return gurusData
      case 'ONE_GURU':
        return gurusData.filter(g => 
          g.slug === 'astro-chatbot' || g.slug === access.guruSlug
        )
      case 'FREE':
        return gurusData.filter(g => g.slug === 'astro-chatbot')
      default:
        return []
    }
  }

  const handleSendMessage = async () => {
    if ((!inputMessage.trim() && !selectedImage) || isLoading || !access) return

    const activePersona = currentGuru || selectedExpertType || 'general'

    // Check if user can start new chat
    if (!canStartNewChat(access)) {
      toast({
        title: 'Daily Limit Reached',
        description: 'You\'ve reached your daily free chat limit. Please upgrade to continue.',
        variant: 'destructive',
      })
      return
    }

    // Check if user can access current guru
    if (currentGuru && !canUserAccessGuru(currentGuru)) {
      toast({
        title: 'Access Required',
        description: 'You need to purchase access to chat with this guru.',
        variant: 'destructive',
      })
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim() || (selectedImage ? `[Uploaded ${selectedImage.name}]` : ''),
      timestamp: new Date(),
      persona: activePersona,
      image: imagePreview || undefined,
      imageType: selectedImage ? 'general' : undefined,
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    removeImage()
    setIsLoading(true)

    try {
      // Increment usage for free tier
      if (access.tier === 'FREE' && account?.address) {
        await incrementFreeUsage(account.address)
        // Reload access to update remaining chats
        loadAccess()
      }

      // Get conversation history for context
      const conversationHistory = messages
        .filter(m => m.persona === activePersona)
        .slice(-6) // Last 6 messages for context
        .map(m => ({
          role: m.role,
          content: m.content,
        }))

      // Generate AI response based on expert type and image
      let response
      try {
        let prompt = userMessage.content
        if (userMessage.image) {
          const expertType = expertTypes.find(e => e.id === selectedExpertType)
          if (expertType?.id === 'palmistry') {
            prompt += '\n\n[User has uploaded a palm image for reading. Provide detailed palm reading based on major lines, mounts, and overall hand structure.]'
          } else if (expertType?.id === 'kundali') {
            prompt += '\n\n[User has uploaded a kundali/birth chart image. Provide detailed analysis of planetary positions and their meanings.]'
          } else if (expertType?.id === 'face-reading') {
            prompt += '\n\n[User has uploaded a face image for reading. Provide personality analysis based on facial features.]'
          }
        }

        response = await generateChatResponse(
          prompt,
          activePersona,
          conversationHistory
        )
      } catch (aiError) {
        console.error('AI response failed:', aiError)
        // Specialized fallback responses
        let fallbackContent = ''
        if (userMessage.image) {
          const expertType = expertTypes.find(e => e.id === selectedExpertType)
          if (expertType?.id === 'palmistry') {
            fallbackContent = 'I can see the image you\'ve shared. Palm reading is a profound art that reveals insights about your life path, relationships, and potential. The major lines in your palm - the heart line, head line, and life line - each tell a unique story. While I\'m providing a simplified reading due to technical limitations, I encourage you to explore the deeper meanings of palmistry. Remember, your hands show potential, not fixed destiny.'
          } else if (expertType?.id === 'kundali') {
            fallbackContent = 'Thank you for sharing your kundali chart. Birth charts are sacred maps of cosmic energies at the moment of your birth. Each planetary position and house carries deep significance for your life journey. While I\'m providing simplified guidance, I encourage you to meditate on how these cosmic patterns might resonate with your inner truth. Remember, the stars guide but do not control your destiny.'
          } else {
            fallbackContent = 'I can see the image you\'ve shared. Visual analysis in spiritual practice requires deep intuition and understanding. While I\'m providing simplified guidance due to technical limitations, I encourage you to reflect on what this image means to you personally in your spiritual journey.'
          }
        } else {
          fallbackContent = `Thank you for your question. I'm here to provide spiritual guidance and support. Due to technical limitations, I'm currently providing simplified responses. This guidance is for entertainment and spiritual reflection only.`
        }
        
        response = {
          content: fallbackContent,
          model: 'fallback',
          fallback: true,
          persona: activePersona
        }
      }

      // Use typing animation for the response
      await typeMessage(response.content, (finalMessage) => {
        setMessages(prev => [...prev, finalMessage])
      })

      // Show fallback notice if using deterministic response
      if (response.fallback) {
        toast({
          title: 'Offline Mode',
          description: 'Using offline responses. Connect OpenAI for enhanced responses.',
        })
      }

    } catch (error) {
      console.error('Failed to generate response:', error)
      
      await typeMessage(
        'I apologize, but I\'m having trouble responding right now. Please try again in a moment.',
        (errorMessage) => {
          setMessages(prev => [...prev, { ...errorMessage, error: true }])
        }
      )
      
      toast({
        title: 'Response Error',
        description: 'Failed to generate response. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const currentGuruData = gurusData.find(g => g.slug === currentGuru)
  const availableGurus = getAvailableGurus()

  if (!connected) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 royal-gradient-bg">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="royal-card text-center">
              <CardContent className="p-8">
                <MessageCircle className="h-12 w-12 text-royal-gold mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4 royal-gradient-text">Connect Your Wallet</h2>
                <p className="text-royal-silver mb-6">
                  Connect your Aptos wallet to start chatting with our spiritual experts and gurus.
                </p>
                <WalletConnect />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (accessLoading) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 royal-gradient-bg">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="royal-card text-center">
              <CardContent className="p-8">
                <Spinner className="mx-auto mb-4" />
                <p className="text-royal-silver">Loading your access permissions...</p>
                <Button 
                  onClick={() => {
                    setAccess({
                      tier: 'FREE',
                      freeChatsUsed: 0,
                      freeChatsRemaining: 3,
                    })
                    setAccessLoading(false)
                  }}
                  className="mt-4 royal-button"
                  variant="outline"
                >
                  Continue in Demo Mode
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Expert type selection screen (only for free users who haven't selected an expert)
  if (!selectedExpertType && !currentGuru && access?.tier === 'FREE') {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 royal-gradient-bg">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold royal-gradient-text mb-4">
                Choose Your Spiritual Expert
              </h1>
              <p className="text-royal-silver text-lg">
                Select the type of guidance you're seeking today
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {expertTypes.map((expert) => {
                const Icon = expert.icon
                return (
                  <Card 
                    key={expert.id}
                    className="royal-card cursor-pointer group hover:scale-105 transition-all duration-300"
                    onClick={() => setSelectedExpertType(expert.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 royal-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-royal-pulse">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold royal-gradient-text mb-2">
                        {expert.name}
                      </h3>
                      <p className="text-royal-silver mb-4">
                        {expert.description}
                      </p>
                      {expert.supportsImages && (
                        <Badge variant="outline" className="text-royal-gold border-royal-gold/50">
                          <Image className="h-3 w-3 mr-1" />
                          Image Analysis
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="text-center mt-8">
              <p className="text-royal-silver/80 text-sm">
                Free tier: 3 chats per day • 
                <Link href="/pricing" className="text-royal-gold hover:underline ml-1">
                  Upgrade for premium gurus
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 royal-gradient-bg">
      <div className="container mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href={currentGuru ? "/gurus" : "/"}>
            <Button variant="ghost" className="text-royal-silver hover:text-royal-gold">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {currentGuru ? 'Back to Gurus' : 'Back to Home'}
            </Button>
          </Link>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 royal-gradient rounded-full flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold royal-gradient-text">
              {currentGuru ? 'Guru Chat' : 'Spiritual Chat'}
            </h1>
          </div>

          <div className="w-24" /> {/* Spacer */}
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Guru Selection */}
          <div className="lg:col-span-1">
            <Card className="royal-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Available Gurus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {availableGurus.map((guru) => {
                  const isActive = guru.slug === currentGuru
                  const hasAccess = canUserAccessGuru(guru.slug)
                  
                  return (
                    <button
                      key={guru.slug}
                      onClick={() => hasAccess && setCurrentGuru(guru.slug)}
                      disabled={!hasAccess}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-purple-500/20 border border-purple-500/40'
                          : hasAccess
                          ? 'bg-muted/20 hover:bg-muted/40 border border-transparent'
                          : 'bg-muted/10 opacity-50 cursor-not-allowed border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{guru.name}</span>
                        {!hasAccess && guru.slug !== 'astro-chatbot' && (
                          <Crown className="h-3 w-3 text-yellow-400" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {guru.category}
                      </p>
                    </button>
                  )
                })}
              </CardContent>
            </Card>

            {/* Access Status */}
            {access && (
              <Card className="astro-card mt-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Your Access</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    {access.tier === 'FREE' && <Users className="h-4 w-4 text-blue-400" />}
                    {access.tier === 'ONE_GURU' && <Crown className="h-4 w-4 text-purple-400" />}
                    {access.tier === 'ALL_GURUS' && <Star className="h-4 w-4 text-yellow-400" />}
                    <Badge variant="outline" className="text-xs">
                      {access.tier === 'FREE' ? 'Free Tier' : 
                       access.tier === 'ONE_GURU' ? 'One Guru Pass' : 'All Gurus Pass'}
                    </Badge>
                  </div>
                  
                  {access.tier === 'FREE' && (
                    <div className="text-xs text-muted-foreground">
                      {access.freeChatsRemaining} chats remaining today
                    </div>
                  )}
                  
                  {(access.tier === 'ONE_GURU' || access.tier === 'ALL_GURUS') && access.expiresAt && (
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Expires {new Date(access.expiresAt).toLocaleString()}</span>
                    </div>
                  )}

                  <Link href="/pricing" className="block">
                    <Button size="sm" variant="outline" className="w-full text-xs">
                      Upgrade Access
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="astro-card h-[calc(100vh-200px)] flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b border-muted/20 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <MessageCircle className="h-4 w-4 text-white" />
                      </div>
                      <span>{currentGuruData?.name || 'Unknown Guru'}</span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {currentGuruData?.title || 'Spiritual Guide'}
                    </p>
                  </div>
                  
                  {currentGuruData?.category && (
                    <Badge variant="outline">
                      {currentGuruData.category}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Start a conversation</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ask {currentGuruData?.name} anything about {currentGuruData?.category} and spiritual guidance.
                    </p>
                    {currentGuruData?.sample_prompts && (
                      <div className="space-y-2 max-w-md mx-auto">
                        <p className="text-xs text-muted-foreground">Try asking:</p>
                        {currentGuruData.sample_prompts.slice(0, 2).map((prompt, idx) => (
                          <button
                            key={idx}
                            onClick={() => setInputMessage(prompt)}
                            className="block w-full text-left text-xs p-2 rounded bg-purple-500/10 hover:bg-purple-500/20 transition-colors"
                          >
                            "{prompt}"
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'royal-gradient text-white'
                          : message.error
                          ? 'bg-red-500/20 border border-red-500/40'
                          : 'royal-card'
                      }`}
                    >
                      {message.image && (
                        <div className="mb-3">
                          <img 
                            src={message.image} 
                            alt="Uploaded image" 
                            className="max-w-full h-auto rounded-lg max-h-48 object-cover"
                          />
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Typing animation */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="royal-card max-w-[80%] p-3 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{typingMessage}</p>
                      <div className="flex items-center mt-2">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {isLoading && !isTyping && (
                  <div className="flex justify-start">
                    <div className="royal-card p-3 rounded-lg">
                      <Spinner size="sm" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input Area */}
              <div className="border-t border-royal-purple/20 p-4">
                {access && !canStartNewChat(access) && (
                  <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                      <p className="text-sm text-amber-300">
                        Daily free chat limit reached. 
                        <Link href="/pricing" className="underline ml-1">
                          Upgrade for unlimited access
                        </Link>
                      </p>
                    </div>
                  </div>
                )}

                {/* Image preview */}
                {imagePreview && (
                  <div className="mb-4 relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-w-32 h-auto rounded-lg border border-royal-purple/30"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white"
                    >
                      ✕
                    </Button>
                  </div>
                )}

                <div className="flex space-x-2">
                  {/* Image upload button */}
                  {selectedExpertType && expertTypes.find(e => e.id === selectedExpertType)?.supportsImages && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading || !access || !canStartNewChat(access)}
                        variant="outline"
                        size="sm"
                        className="px-3"
                      >
                        <Image className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Ask ${currentGuruData?.name || expertTypes.find(e => e.id === selectedExpertType)?.name || 'the expert'} anything...`}
                    disabled={isLoading || !access || !canStartNewChat(access)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={(!inputMessage.trim() && !selectedImage) || isLoading || !access || !canStartNewChat(access)}
                    className="royal-button px-4"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-xs text-royal-silver/80 mt-2 text-center">
                  All guidance is for entertainment and spiritual reflection only.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

