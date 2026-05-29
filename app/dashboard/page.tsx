import Link from "next/link"
import { 
  BookOpen, 
  Clock, 
  Flame, 
  Award, 
  Sparkles,
  ArrowLeft,
  Code,
  Database,
  Network,
  Cpu
} from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { ProgressCard } from "@/components/progress-card"
import { ChatPanel } from "@/components/chat-panel"
import { AchievementBadge } from "@/components/achievement-badge"

const recentTopics = [
  { name: "Binary Search Trees", time: "2 hours ago", icon: Code },
  { name: "Hash Tables", time: "Yesterday", icon: Database },
  { name: "Graph Algorithms", time: "2 days ago", icon: Network },
  { name: "Dynamic Programming", time: "3 days ago", icon: Cpu },
]

const achievements = [
  {
    title: "Algorithms Apprentice",
    description: "Complete 10 algorithm challenges",
    unlocked: true,
    icon: "🧮"
  },
  {
    title: "Data Structures Explorer",
    description: "Master 5 different data structures",
    unlocked: false,
    icon: "🏗️"
  },
  {
    title: "Quiz Master",
    description: "Score 100% on 10 quizzes",
    unlocked: false,
    icon: "🏆"
  }
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-radial">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">StudyChain AI</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 text-accent text-sm">
                <Flame className="w-4 h-4" />
                <span>7 day streak!</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-semibold">
                SC
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Welcome back, <span className="gradient-text">Scholar</span>
            </h1>
            <p className="text-muted-foreground">
              Keep up the great work! You&apos;re making excellent progress.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              icon={BookOpen} 
              title="Topics Learned" 
              value={24} 
              trend="+3 this week"
            />
            <StatCard 
              icon={Clock} 
              title="Study Sessions" 
              value={47} 
              trend="+12 this week"
            />
            <StatCard 
              icon={Flame} 
              title="Current Streak" 
              value="7 days" 
            />
            <StatCard 
              icon={Award} 
              title="NFTs Earned" 
              value={1} 
              trend="1 pending"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Chat Panel - takes 2 columns */}
            <div className="lg:col-span-2">
              <ChatPanel />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Progress */}
              <ProgressCard 
                title="Next Achievement"
                label="Data Structures Explorer NFT"
                current={3}
                total={5}
              />

              {/* Recent Topics */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-semibold mb-4">Recent Study Topics</h3>
                <div className="space-y-3">
                  {recentTopics.map((topic, i) => (
                    <div 
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                    >
                      <div className="p-2 rounded-lg bg-primary/20">
                        <topic.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{topic.name}</p>
                        <p className="text-xs text-muted-foreground">{topic.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">NFT Achievements</h2>
              <span className="text-sm text-muted-foreground">1 of 3 unlocked</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement, i) => (
                <AchievementBadge key={i} {...achievement} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
