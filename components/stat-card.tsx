import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
}

export function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="glass rounded-xl p-6 hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2 gradient-text">{value}</p>
          {trend && (
            <p className="text-accent text-sm mt-1 flex items-center gap-1">
              <span className="text-accent">↑</span> {trend}
            </p>
          )}
        </div>
        <div className="p-3 rounded-lg bg-primary/20">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  )
}
