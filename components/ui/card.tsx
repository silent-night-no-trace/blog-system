import { cva } from 'class-variance-authority'

export const cardVariants = cva(
  'rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-zinc-900'
)

export type CardProps = React.HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cardVariants({ className })}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-6 pb-6 ${className}`} {...props} />
  )
}
