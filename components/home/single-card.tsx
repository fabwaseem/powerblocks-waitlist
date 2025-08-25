'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Star, Play } from 'lucide-react'
import { useState } from 'react'

interface GameCardProps {
  title: string
  subtitle: string
  amount: string
  badges?: Array<{
    text: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }>
  isNew?: boolean
  isHot?: boolean
  image?: string
}

export function GameCard({
  title,
  subtitle,
  amount,
  badges = [],
  isNew = false,
  isHot = false,
  image,
}: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className="relative bg-card text-white overflow-hidden cursor-pointer transition-transform hover:scale-102 px-4 min-h-[18rem]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={image}
        alt="Solana themed items"
        className="absolute inset-0 w-full h-full object-contain object-center"
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent z-10" />
      <CardContent className="flex flex-col justify-between px-2 h-full z-10">
        {/* Header with badges and star */}
        <div className="flex justify-between items-start pb-2">
          <div className="flex gap-2">
            {isNew && (
              <div className="bg-gradient-to-b from-[#6F6BFF] to-[#434099] text-white text-xs px-2 py-1 rounded-md flex items-center justify-center">
                NEW
              </div>
            )}
            {isHot && (
              <div className="bg-gradient-to-b from-[#EE4FFB] to-[#8D2F95] text-white text-xs px-2 py-1 rounded-md flex items-center justify-center">
                HOT
              </div>
            )}
            {badges.map((badge, index) => (
              <Badge
                key={index}
                variant={badge.variant || 'default'}
                className="text-xs px-2 py-1"
              >
                {badge.text}
              </Badge>
            ))}
          </div>
          <Star
            className={`h-6 w-6 transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            stroke="white"
            fill="none"
          />
        </div>

        {/* Footer with amount and play */}
        <div className="flex flex-col pt-0">
          <div className="flex flex-col justify-center mb-2">
            {/* Title */}
            <h3 className="text-3xl font-bold text-white leading-tight">
              {title}
            </h3>

            {/* Subtitle */}
            <p className="text-gray-300 text-base">{subtitle}</p>
          </div>
          <div className="flex justify-between items-center">
            <Badge
              variant="outline"
              className="bg-white text-black border-white hover:bg-gray-100 px-3 py-1"
            >
              {amount}
            </Badge>
            <div className="flex items-center gap-1 text-white font-medium underline">
              <span>Play</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
