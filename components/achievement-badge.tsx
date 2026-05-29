"use client"

import { useState } from "react"
import { Lock, Trophy, Loader2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AchievementBadgeProps {
  title: string
  description: string
  unlocked: boolean
  icon: string
}

export function AchievementBadge({ title, description, unlocked, icon }: AchievementBadgeProps) {
  const [isMinting, setIsMinting] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)

  const handleMint = async () => {
    setIsMinting(true)
    // Simulate minting
    await new Promise(resolve => setTimeout(resolve, 2000))
    // Generate fake Solana tx hash
    const fakeTxHash = Array.from({ length: 64 }, () => 
      "0123456789abcdef"[Math.floor(Math.random() * 16)]
    ).join("")
    setTxHash(fakeTxHash)
    setIsMinting(false)
  }

  return (
    <div className={`glass rounded-xl p-6 relative overflow-hidden ${!unlocked ? "opacity-60" : ""}`}>
      {!unlocked && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
      )}
      
      <div className="text-4xl mb-4">{icon}</div>
      
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold">{title}</h3>
        {unlocked && <Trophy className="w-5 h-5 text-chart-3" />}
      </div>
      
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      
      {unlocked && !txHash && (
        <Button 
          onClick={handleMint} 
          disabled={isMinting}
          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
        >
          {isMinting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Minting...
            </>
          ) : (
            "Mint NFT"
          )}
        </Button>
      )}
      
      {txHash && (
        <div className="space-y-2">
          <p className="text-xs text-accent flex items-center gap-1">
            <Trophy className="w-3 h-3" /> NFT Minted!
          </p>
          <a 
            href={`https://solscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 break-all"
          >
            {txHash.slice(0, 20)}...{txHash.slice(-8)}
            <ExternalLink className="w-3 h-3 flex-shrink-0" />
          </a>
        </div>
      )}
    </div>
  )
}
