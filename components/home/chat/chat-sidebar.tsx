'use client'

import type React from 'react'

import { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Plus,
  Send,
  Smile,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ChatIcon, DiscordIcon, WinsIcon, XIcon } from '@/components/common/icons'

interface ChatSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

interface Message {
  id: number
  text: string
  username: string
  avatar?: string
  level: number
  timestamp: Date
}

export function ChatSidebar({ isOpen, onToggle }: ChatSidebarProps) {
  const [activeTab, setActiveTab] = useState('chat')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'I cannot believe that I won this thing woww',
      username: 'MA',
      level: 20,
      avatar: 'https://avatars.githubusercontent.com/u/37842853?v=4',
      timestamp: new Date(),
    },
    {
      id: 2,
      text: 'I cannot believe that I won this thing woww',
      username: 'MATT',
      level: 20,
      avatar: 'https://avatars.githubusercontent.com/u/15681499?v=4',
      timestamp: new Date(),
    },
    {
      id: 3,
      text: "make a group on I'll join",
      username: 'User3',
      level: 5,
      timestamp: new Date(),
    },
    {
      id: 4,
      text: 'is there promo code that work ?',
      username: 'User4',
      level: 12,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')

  const sendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      username: 'You',
      level: 15,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <>
      {/* Desktop Sidebar Container - Fixed position */}
      <div className="hidden lg:block">
        {/* Toggle Button - Fixed adjacent to sidebar */}
        <div
          className={`fixed bottom-14 -translate-y-1/2 z-50 transition-all duration-300 ease-in-out ${
            isOpen ? 'right-80' : 'right-0'
          }`}
        >
          <Button
            onClick={onToggle}
            className="rounded-l-md rounded-r-none h-8 w-8 p-0 bg-brand-purple text-white hover:bg-brand-purple/80 shadow-lg cursor-pointer"
          >
            {isOpen ? (
              <ArrowRight className="h-5 w-5" />
            ) : (
              <ArrowLeft className="h-5 w-5" />
            )}
            <span className="sr-only">
              {isOpen ? 'Close chat' : 'Open chat'}
            </span>
          </Button>
        </div>

        {/* Sidebar - Fixed position */}
        <div
          className={`fixed top-16 right-0 h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out z-40 ${
            isOpen ? 'w-80 bg-sidebar shadow-lg' : 'w-0'
          } overflow-hidden`}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 w-full">
              <div className="flex items-center w-full p-1 bg-neutral-800 rounded-md gap-1">
                <Button
                  className={cn(
                    'flex-1  border-gray-700 text-white bg-neutral-800  hover:text-white hover:bg-neutral-700 font-bold',
                    activeTab === 'chat' && 'bg-neutral-700 text-white'
                  )}
                  onClick={() => setActiveTab('chat')}
                >
                  <ChatIcon
                    className="h-4 w-4"
                    id="desktop"
                    active={activeTab === 'chat'}
                  />
                  Chat
                </Button>
                <Button
                  className={cn(
                    'flex-1  border-gray-700 text-gray-400 bg-neutral-800 hover:bg-neutral-700 hover:text-white font-bold',
                    activeTab === 'wins' && 'bg-neutral-700 text-white'
                  )}
                  onClick={() => setActiveTab('wins')}
                >
                  <WinsIcon
                    className="h-4 w-4"
                    id="desktop"
                    active={activeTab === 'wins'}
                  />
                  Wins
                </Button>
              </div>
            </div>

            {/* Messages - Scrollable */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full bg-sidebar">
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className="flex items-start space-x-2"
                    >
                      <Avatar className="h-10 w-10 border-2 border-neutral-800">
                        <AvatarImage
                          src={message.avatar || '/placeholder.svg'}
                        />
                        <AvatarFallback className="bg-neutral-700 text-white text-sm">
                          {message.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-300 text-sm">
                            {message.username}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-[1.3] break-words font-semibold">
                          {message.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Input - Fixed at bottom */}
            <div className="flex-shrink-0 p-4 bg-sidebar">
              {/* <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-primary border-gray-600 text-white placeholder:text-gray-400 focus:border-primary-500"
                />
                <Button
                  onClick={sendMessage}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div> */}

              <div className="relative flex items-center w-full rounded-md bg-neutral-800 overflow-hidden">
                <Input
                  type="text"
                  placeholder="Send a message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-grow h-10 pl-4 pr-24 bg-transparent border-none text-gray-200 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:bg-transparent hover:text-gray-300"
                  >
                    <Smile className="h-5 w-5" />
                    <span className="sr-only">Add emoji</span>
                  </Button>
                  <Button
                    type="submit"
                    size="icon"
                    onClick={sendMessage}
                    className={cn(
                      'h-8 w-8 rounded-md bg-brand-purple text-white hover:bg-brand-purple/90',
                      !inputValue.trim()
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer'
                    )}
                    disabled={!inputValue.trim()}
                  >
                    <Send className="h-5 w-5" />
                    <span className="sr-only">Send message</span>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between w-full mt-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-[#BABABA] hover:text-[#6f6bff] p-1.5 rounded-md">
                    <DiscordIcon className="h-3 w-3" />
                  </div>
                  <div className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-[#BCBCBC] hover:text-[#6f6bff] p-1.5 rounded-md">
                    <XIcon className="h-3 w-3" />
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 p-1 px-1.5 text-xs rounded-md">
                  Chat Rules
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar - Overlay */}
      <div
        className={`lg:hidden fixed top-16 right-0 h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out z-40 ${
          isOpen ? 'w-80 bg-sidebar shadow-lg' : 'w-0'
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 w-full">
            <div className="flex items-center w-full p-1 bg-neutral-800 rounded-md gap-1">
              <Button
                className={cn(
                  'flex-1  border-gray-700 text-white bg-neutral-800  hover:text-white hover:bg-neutral-700 font-bold',
                  activeTab === 'chat' && 'bg-neutral-700 text-white'
                )}
                onClick={() => setActiveTab('chat')}
              >
                <ChatIcon
                  className="h-4 w-4"
                  id="mobile"
                  active={activeTab === 'chat'}
                />
                Chat
              </Button>
              <Button
                className={cn(
                  'flex-1  border-gray-700 text-gray-400 bg-neutral-800 hover:bg-neutral-700 hover:text-white font-bold',
                  activeTab === 'wins' && 'bg-neutral-700 text-white'
                )}
                onClick={() => setActiveTab('wins')}
              >
                <WinsIcon
                  className="h-4 w-4"
                  id="mobile"
                  active={activeTab === 'wins'}
                />
                Wins
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full bg-sidebar">
              <div className="p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-2">
                    <Avatar className="h-10 w-10 border-2 border-neutral-800">
                      <AvatarImage src={message.avatar || '/placeholder.svg'} />
                      <AvatarFallback className="bg-neutral-700 text-white text-sm">
                        {message.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-300 text-sm">
                          {message.username}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm leading-[1.3] break-words font-semibold">
                        {message.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Input */}
          <div className="flex-shrink-0 p-4 bg-sidebar">
            <div className="relative flex items-center w-full rounded-md bg-neutral-800 overflow-hidden">
              <Input
                type="text"
                placeholder="Send a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-grow h-10 pl-4 pr-24 bg-transparent border-none text-gray-200 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:bg-transparent hover:text-gray-300"
                >
                  <Smile className="h-5 w-5" />
                  <span className="sr-only">Add emoji</span>
                </Button>
                <Button
                  type="submit"
                  size="icon"
                  onClick={sendMessage}
                  className={cn(
                    'h-8 w-8 rounded-md bg-brand-purple text-white hover:bg-brand-purple/90',
                    !inputValue.trim()
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'
                  )}
                  disabled={!inputValue.trim()}
                >
                  <Send className="h-5 w-5" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between w-full mt-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-[#BABABA] hover:text-[#6f6bff] p-1.5 rounded-md">
                  <DiscordIcon className="h-3 w-3" />
                </div>
                <div className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-[#BCBCBC] hover:text-[#6f6bff] p-1.5 rounded-md">
                  <XIcon className="h-3 w-3" />
                </div>
              </div>
              <div className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 p-1 px-1.5 text-xs rounded-md">
                Chat Rules
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Toggle Button - Bottom Right (only when closed) */}
      <div
        className={`fixed bottom-14 -translate-y-1/2 z-50 transition-all block lg:hidden duration-300 ease-in-out ${
          isOpen ? 'right-80' : 'right-0'
        }`}
      >
        <Button
          onClick={onToggle}
          className="rounded-l-md rounded-r-none h-8 w-8 p-0 bg-brand-purple text-white hover:bg-brand-purple/80 shadow-lg cursor-pointer"
        >
          {isOpen ? (
            <ArrowRight className="h-5 w-5" />
          ) : (
            <ArrowLeft className="h-5 w-5" />
          )}
          <span className="sr-only">{isOpen ? 'Close chat' : 'Open chat'}</span>
        </Button>
      </div>
    </>
  )
}
