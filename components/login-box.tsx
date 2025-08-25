import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import supaDwag from '@/public/images/supa-dwag.svg'

export default function LoginBox() {
  return (
    <div className="w-full bg-gradient-to-b from-[#171923] to-[#212029] rounded-lg border border-gray-700 overflow-hidden">
      {/* <div className="grid lg:grid-cols-2 min-h-[200px]"> */}
      <div className="grid lg:grid-cols-[2fr_2fr]">
        {/* Left side - Login form */}
        <div className="p-8 flex flex-col justify-center">
          {/* Top buttons */}
          <div className="flex gap-4 mb-4">
            <Button className="bg-[#6864F6]/50 hover:bg-[#6864F6] text-white px-8 py-3 rounded-sm font-medium">
              LOGIN
            </Button>
            <Button
              variant="outline"
              className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 p-4 rounded-sm font-medium"
            >
              CREATE ACCOUNT
            </Button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-white text-lg font-medium">
                Username or Email
              </Label>
              <Input
                id="email"
                type="email"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 h-10 rounded-sm text-lg"
                placeholder=""
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="password"
                className="text-white text-lg font-medium"
              >
                Passwords
              </Label>
              <Input
                id="password"
                type="password"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 h-10 rounded-sm text-lg"
                placeholder=""
              />
            </div>

            <Button className="w-full bg-gradient-to-r from-[#EE4FFB] to-[#8D2F95] text-white p-4 rounded-sm text-lg font-medium mt-4">
              LOGIN
            </Button>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="relative flex justify-end">
          <Image
            src={supaDwag}
            alt="Two dogs with palm trees and moon in synthwave style"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
}
