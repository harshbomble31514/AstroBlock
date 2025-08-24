import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-purple focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 'royal-button text-white shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95',
        destructive:
          'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-red-500/25 transform hover:scale-105 active:scale-95',
        outline:
          'border-2 border-royal-purple/30 bg-transparent text-royal-silver hover:border-royal-gold/50 hover:text-royal-gold hover:bg-royal-purple/10 shadow-sm hover:shadow-lg',
        secondary:
          'bg-gradient-to-r from-royal-silver/20 to-royal-silver/10 text-royal-silver hover:from-royal-silver/30 hover:to-royal-silver/20 border border-royal-silver/20 shadow-md hover:shadow-lg transform hover:scale-105',
        ghost: 'text-royal-silver hover:bg-royal-purple/20 hover:text-royal-gold rounded-lg',
        link: 'text-royal-purple underline-offset-4 hover:underline hover:text-royal-gold transition-colors',
        royal: 'royal-button text-white',
        gold: 'royal-button-gold text-royal-navy',
      },
      size: {
        default: 'h-11 px-6 py-2.5',
        sm: 'h-9 rounded-lg px-4 text-xs',
        lg: 'h-13 rounded-xl px-10 text-base',
        xl: 'h-16 rounded-xl px-12 text-lg',
        icon: 'h-11 w-11 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
