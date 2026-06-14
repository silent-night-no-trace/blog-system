import { cva } from 'class-variance-authority'

export const cardVariants = cva(
  'rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-zinc-900',
  {
    variants: {
      variant: {
        default: '',
        bordered: 'border border-zinc-100 dark:border-zinc-800',
        elevated: 'shadow-lg hover:shadow-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated'
}

export function Card({ className, variant, ...props }: CardProps) {
  return (
    <div
      className={cardVariants({ variant, className })}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-6 pt-6 ${className}`} {...props} />
  )
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-6 pb-6 ${className}`} {...props} />
  )
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-6 pb-6 pt-4 ${className}`} {...props} />
  )
}
