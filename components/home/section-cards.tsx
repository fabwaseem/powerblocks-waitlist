import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Gamepad2, ArrowRight } from 'lucide-react'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { GameCard } from './single-card'

export function SectionCards() {
  return (
    <div>
      <div className="flex items-center justify-between w-full gap-2">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-6 h-6" />
          <h5 className="text-2xl font-bold">PWR Originals</h5>
        </div>
        <div className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 p-2 px-3 text-xs rounded-md cursor-pointer">
          View all <ArrowRight className="w-4 h-4" />
        </div>
      </div>
      <div className="grid  md:grid-cols-3 gap-4 my-8">
        <GameCard
          title="The SOl Pot"
          subtitle="Solana Blockchain"
          amount="$2.5"
          isNew={true}
          isHot={true}
          image="/images/cards/sol-card.png"
          // badges={[{ text: 'Trending Up', variant: 'outline' }]}
        />
        <GameCard
          title="Ice-Ice"
          subtitle="Ethereum Blockchain"
          amount="$12.5"
          image="/images/cards/ice-ice.png"
        />
        <GameCard
          title="Doge Treasure"
          subtitle="DOGE Blockchain"
          amount="$12.5"
          isHot={true}
          image="/images/cards/doge.png"
        />
        <GameCard
          title="Lambo Starter Pack"
          subtitle="Solana Blockchain"
          amount="$12.5"
          isNew={true}
          image="/images/cards/lambo.png"
        />
        <GameCard
          title="Phantom Pack"
          subtitle="Ethereum Blockchain"
          amount="$2.5"
          image="/images/cards/phantom.png"
        />
        <GameCard
          title="ETH Madness"
          subtitle="Ethereum Blockchain"
          amount="$2.5"
          isNew={true}
          isHot={true}
          image="/images/cards/eth-madness.png"
        />
      </div>
    </div>
  )
}
