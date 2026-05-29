import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FeatureCard } from "@/components/feature-card"
import { Bot, Brain, BarChart3, Award, ChevronRight, Sparkles } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-radial">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">StudyChain AI</span>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="border-primary/50 hover:bg-primary/10">
                Launch App
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Web3 Learning Revolution</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">StudyChain AI</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-muted-foreground mb-4 font-medium">
            Learn. Remember. Earn.
          </p>
          
          <p className="text-lg text-muted-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Your AI-powered study companion that helps you master any subject, 
            tracks your progress with intelligent analytics, and rewards your achievements 
            with collectible NFT badges on Solana.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white px-8 py-6 text-lg">
                Start Studying
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-border hover:bg-secondary px-8 py-6 text-lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Powered by <span className="gradient-text">Cutting-Edge Tech</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with the latest AI and blockchain technologies to deliver 
              a revolutionary learning experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={Bot}
              title="AI Tutor"
              description="Get personalized explanations and guidance on any topic with our intelligent AI assistant."
              poweredBy="DigitalOcean Gradient AI"
            />
            <FeatureCard 
              icon={Brain}
              title="Smart Memory"
              description="Your learning context is preserved across sessions for a continuous study experience."
              poweredBy="Backboard.io"
            />
            <FeatureCard 
              icon={BarChart3}
              title="Study Analytics"
              description="Track your progress with intelligent insights and personalized recommendations."
              poweredBy="Snowflake + Cortex AI"
            />
            <FeatureCard 
              icon={Award}
              title="NFT Achievements"
              description="Earn unique collectible badges as you hit learning milestones."
              poweredBy="Solana"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 sm:p-12 text-center gradient-border">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join thousands of students who are already earning while they learn.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white px-8">
                Get Started Free
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">StudyChain AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built for the future of education
          </p>
        </div>
      </footer>
    </div>
  )
}
