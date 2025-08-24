import OpenAI from 'openai'
import { NormalizedInputs } from './normalize'
import gurusData from '@/data/gurus.json'

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

export interface ReadingResponse {
  content: string
  model: string
  fallback: boolean
}

export interface ChatResponse {
  content: string
  model: string
  fallback: boolean
  persona: string
}

export async function generateReading(inputs: NormalizedInputs): Promise<ReadingResponse> {
  // Try OpenAI first if API key is available
  if (openai) {
    try {
      const prompt = createPrompt(inputs)
      
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a wise, compassionate astrologer who provides thoughtful insights. Write exactly 3 short sections: "Today\'s Focus", "Core Insight", and "Next Step". Keep each section 2-3 sentences. Total response should be 120-180 words. Use a warm, encouraging tone.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 250
      })
      
      const content = response.choices[0]?.message?.content?.trim()
      if (content) {
        return {
          content,
          model: 'gpt-3.5-turbo',
          fallback: false
        }
      }
    } catch (error) {
      console.warn('OpenAI API failed, falling back to deterministic reading:', error)
    }
  }
  
  // Deterministic fallback
  return {
    content: generateDeterministicReading(inputs),
    model: 'deterministic-v1',
    fallback: true
  }
}

function createPrompt(inputs: NormalizedInputs): string {
  const { dob, time, place, question } = inputs
  const name = inputs.name || 'friend'
  
  return `Create an astrology reading for ${name}, born ${dob} at ${time} in ${place}.${
    question ? ` They ask: "${question}"` : ''
  } Provide 3 sections: Today's Focus, Core Insight, and Next Step. Be warm and encouraging.`
}

function generateDeterministicReading(inputs: NormalizedInputs): string {
  const { dob, time, place } = inputs
  const name = inputs.name || 'friend'
  
  // Simple deterministic logic based on birth date and time
  const date = new Date(dob)
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  const [hours] = time.split(':').map(Number)
  
  const focusMessages = [
    "Today brings opportunities for creative expression and personal growth.",
    "Focus on communication and building meaningful connections with others.",
    "Your intuition is heightened - trust your inner wisdom today.",
    "A good day for planning and organizing your future goals.",
    "Pay attention to your emotional well-being and self-care."
  ]
  
  const insightMessages = [
    "Your natural leadership qualities are emerging more strongly.",
    "There's a harmonious balance between your practical and spiritual sides.",
    "Recent challenges have been preparing you for upcoming opportunities.",
    "Your ability to adapt and flow with change is one of your greatest strengths.",
    "The universe is aligning to support your authentic self-expression."
  ]
  
  const nextStepMessages = [
    "Take one small action toward a goal that truly excites you.",
    "Reach out to someone you've been thinking about connecting with.",
    "Create some quiet time for reflection and meditation.",
    "Organize one area of your life that's been feeling chaotic.",
    "Express gratitude for the growth you've experienced recently."
  ]
  
  const focusIndex = (dayOfYear + hours) % focusMessages.length
  const insightIndex = (dayOfYear * 3 + hours) % insightMessages.length
  const stepIndex = (dayOfYear * 7 + hours * 2) % nextStepMessages.length
  
  return `**Today's Focus**
${focusMessages[focusIndex]} Born in ${place}, your connection to this location continues to influence your path in meaningful ways.

**Core Insight**
${insightMessages[insightIndex]} The planetary positions at your birth time of ${time} suggest a natural rhythm that serves you well.

**Next Step**
${nextStepMessages[stepIndex]} Trust the timing of your life, ${name} - everything is unfolding as it should.

*This reading is for entertainment purposes only and not intended as medical, legal, or financial advice.*`
}

// Chat Functions for Personas
export function getSystemPromptForPersona(personaSlug: string): string {
  const guru = gurusData.find(g => g.slug === personaSlug)
  
  if (!guru) {
    return getDefaultSystemPrompt()
  }

  const basePrompt = `You are ${guru.name}, ${guru.title}. ${guru.long_description}

Your specialties include:
${guru.specialties.map(s => `- ${s}`).join('\n')}

Guidelines for responses:
- Stay in character as ${guru.name}
- Use warm, compassionate, and respectful tone
- Draw from your specific expertise in ${guru.category}
- Keep responses concise (2-3 paragraphs max)
- Encourage practical, positive steps
- Always include the disclaimer: "This guidance is for entertainment and spiritual reflection only, not medical, legal, or financial advice."
- Be culturally respectful and honor the traditional wisdom of your practice
- Focus on empowerment and personal growth
- Never make definitive predictions about specific events`

  return basePrompt
}

function getDefaultSystemPrompt(): string {
  return `You are the Astro Chatbot, a friendly AI companion offering general astrological guidance. 

You provide:
- Accessible astrology insights for everyday life
- Gentle cosmic guidance and perspective
- Basic zodiac and planetary information
- Supportive, encouraging responses

Guidelines:
- Keep responses warm and encouraging (2-3 paragraphs max)
- Focus on personal empowerment and growth
- Never make medical, legal, or financial recommendations
- Always include: "This guidance is for entertainment and spiritual reflection only."
- Be inclusive and respectful of all backgrounds`
}

export async function generateChatResponse(
  message: string, 
  personaSlug: string,
  conversationHistory?: Array<{role: 'user' | 'assistant', content: string}>
): Promise<ChatResponse> {
  
  // Try OpenAI first if API key is available
  if (openai) {
    try {
      const systemPrompt = getSystemPromptForPersona(personaSlug)
      
      const messages: any[] = [
        { role: 'system', content: systemPrompt }
      ]
      
      // Add conversation history if provided
      if (conversationHistory) {
        messages.push(...conversationHistory.slice(-6)) // Keep last 6 messages for context
      }
      
      // Add current message
      messages.push({ role: 'user', content: message })
      
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 300,
      })
      
      const content = response.choices[0]?.message?.content?.trim()
      if (content) {
        return {
          content,
          model: 'gpt-3.5-turbo',
          fallback: false,
          persona: personaSlug,
        }
      }
    } catch (error) {
      console.warn('OpenAI API failed, falling back to deterministic response:', error)
    }
  }
  
  // Deterministic fallback
  return {
    content: generateDeterministicChatResponse(message, personaSlug),
    model: 'deterministic-v1',
    fallback: true,
    persona: personaSlug,
  }
}

function generateDeterministicChatResponse(message: string, personaSlug: string): string {
  const guru = gurusData.find(g => g.slug === personaSlug)
  
  if (!guru) {
    return generateDefaultChatResponse(message)
  }

  // Simple keyword-based responses using the guru's sample prompts and specialties
  const messageWords = message.toLowerCase().split(' ')
  
  // Check for keywords related to the guru's specialties
  const specialty = guru.specialties.find(spec => 
    messageWords.some(word => spec.toLowerCase().includes(word))
  )
  
  if (specialty) {
    return `As ${guru.name}, I sense you're asking about ${specialty.toLowerCase()}. This is indeed one of my core areas of expertise. ${guru.short_blurb}

Based on your question, I encourage you to reflect on how this aspect of your life connects to your deeper spiritual journey. Every challenge and opportunity in this area is a chance for growth and understanding.

*This guidance is for entertainment and spiritual reflection only, not medical, legal, or financial advice.*`
  }
  
  // Fallback to a sample prompt response
  const sampleResponse = guru.sample_prompts[Math.floor(Math.random() * guru.sample_prompts.length)]
  
  return `Thank you for reaching out. As ${guru.name}, I'm here to offer guidance in ${guru.category}. Your question reminds me of this important teaching: "${sampleResponse}"

I encourage you to take time for quiet reflection on this matter. The wisdom you seek often lies within, waiting to be awakened through contemplation and spiritual practice.

*This guidance is for entertainment and spiritual reflection only, not medical, legal, or financial advice.*`
}

function generateDefaultChatResponse(message: string): string {
  const responses = [
    "The stars remind us that every moment is an opportunity for growth and new understanding. What aspects of your cosmic journey would you like to explore together?",
    "Your question touches on the beautiful mystery of our connection to the universe. Let's explore how the cosmic energies might be guiding you today.",
    "I sense you're seeking clarity and guidance. The universe has a way of providing exactly what we need when we're open to receiving its wisdom.",
    "Thank you for sharing your thoughts with me. In astrology, we learn that timing and intention are everything. How can I help you navigate this cosmic moment?",
    "Every question you ask is a step toward deeper self-understanding. What would you like to discover about your relationship with the cosmos today?"
  ]
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)]
  
  return `${randomResponse}

*This guidance is for entertainment and spiritual reflection only, not medical, legal, or financial advice.*`
}
