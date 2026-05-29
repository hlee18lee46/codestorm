interface ProgressCardProps {
  title: string
  current: number
  total: number
  label: string
}

export function ProgressCard({ title, current, total, label }: ProgressCardProps) {
  const percentage = Math.round((current / total) * 100)
  
  return (
    <div className="glass rounded-xl p-6">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{label}</p>
      
      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-2 text-sm">
        <span className="text-muted-foreground">{current}/{total} completed</span>
        <span className="gradient-text font-semibold">{percentage}%</span>
      </div>
    </div>
  )
}
