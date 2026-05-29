import { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  poweredBy: string
}

export function FeatureCard({ title, description, icon: Icon, poweredBy }: FeatureCardProps) {
  return (
    <div className="glass rounded-xl p-6 hover:scale-[1.02] transition-all duration-300 group">
      <div className="p-3 rounded-lg bg-primary/20 w-fit mb-4 group-hover:bg-primary/30 transition-colors">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      <p className="text-xs text-accent">Powered by {poweredBy}</p>
    </div>
  )
}
