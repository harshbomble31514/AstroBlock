'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Sparkles } from 'lucide-react'
import { RawInputs } from '@/lib/normalize'

const readingSchema = z.object({
  name: z.string().optional(),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter date in YYYY-MM-DD format'),
  time: z.string().regex(/^\d{1,2}:\d{2}$/, 'Please enter time in HH:MM format'),
  place: z.string().min(2, 'Please enter your birth city and country'),
  question: z.string().optional(),
})

type ReadingFormData = z.infer<typeof readingSchema>

interface ReadingFormProps {
  onSubmit: (data: RawInputs) => void
  loading?: boolean
}

export function ReadingForm({ onSubmit, loading = false }: ReadingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ReadingFormData>({
    resolver: zodResolver(readingSchema),
  })

  const handleFormSubmit = (data: ReadingFormData) => {
    onSubmit({
      name: data.name || '',
      dob: data.dob,
      time: data.time,
      place: data.place,
      question: data.question || '',
    })
  }

  return (
    <Card className="astro-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-purple-400" />
          <span className="gradient-text">Get Your Reading</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Name (optional)
            </label>
            <Input
              {...register('name')}
              placeholder="Your name"
              disabled={loading}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Date of Birth <span className="text-red-400">*</span>
            </label>
            <Input
              {...register('dob')}
              type="date"
              placeholder="YYYY-MM-DD"
              disabled={loading}
            />
            {errors.dob && (
              <p className="text-red-400 text-sm mt-1">{errors.dob.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Time of Birth <span className="text-red-400">*</span>
            </label>
            <Input
              {...register('time')}
              type="time"
              placeholder="HH:MM"
              disabled={loading}
            />
            {errors.time && (
              <p className="text-red-400 text-sm mt-1">{errors.time.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Birth Place <span className="text-red-400">*</span>
            </label>
            <Input
              {...register('place')}
              placeholder="City, Country"
              disabled={loading}
            />
            {errors.place && (
              <p className="text-red-400 text-sm mt-1">{errors.place.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Question (optional)
            </label>
            <Input
              {...register('question')}
              placeholder="What would you like guidance on?"
              disabled={loading}
            />
            {errors.question && (
              <p className="text-red-400 text-sm mt-1">{errors.question.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {loading ? 'Creating Reading...' : 'Generate Reading'}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Public proof, private details. Only anonymous fingerprints go on-chain.
            Full report is encrypted and only you can unlock it.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
