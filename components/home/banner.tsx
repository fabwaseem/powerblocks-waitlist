import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Banner() {
  return (
    <section
      className="relative w-full h-[250px] bg-cover bg-center flex items-center justify-center px-4 md:px-8 lg:px-12 overflow-hidden rounded-2xl"
      style={{ backgroundImage: "url('/images/banner.png')" }}
    >
      <div className="absolute inset-0 bg-black opacity-30"></div>{' '}
      {/* Optional overlay for text readability */}
      <div className="relative z-10 flex flex-col lg:flex-row justify-center md:justify-between items-center w-full gap-4 py-4">
        {/* Left Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-extrabold text-white font-mono tracking-tight">
            Bitcoin Hash Discovery
          </h1>
          <div className="flex flex-row items-center space-x-10 mt-3">
            <div className="flex space-x-2 md:space-x-0">
              <div className="flex flex-col items-center justify-center p-1.5 px-2 lg:p-2 lg:px-2.5 bg-gradient-to-t from-[#625EF7] to-[#8583FD] rounded-lg border-2 border-[#BDBCBC] bg-countdown-blue text-white font-mono text-base md:text-xl">
                <span className="text-xl lg:text-3xl font-bold leading-none">
                  02
                </span>
                <span className="text-xs lg:text-sm leading-none">days</span>
              </div>
              <div className="flex flex-col items-center justify-center mx-2 gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
              <div className="flex flex-col items-center justify-center p-1.5 px-2 lg:p-2 lg:px-2.5 rounded-lg border-2 bg-gradient-to-t from-[#625EF7] to-[#8583FD] border-[#BDBCBC] bg-countdown-blue text-white font-mono text-base md:text-xl">
                <span className="text-xl lg:text-3xl font-bold leading-none">
                  18
                </span>
                <span className="text-xs lg:text-sm leading-none">hours</span>
              </div>
              <div className="flex flex-col items-center justify-center mx-2 gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
              <div className="flex flex-col items-center justify-center p-1.5 px-2 lg:p-2 lg:px-2.5 rounded-lg border-2 bg-gradient-to-t from-[#625EF7] to-[#8583FD] border-[#BDBCBC] bg-countdown-blue text-white font-mono text-base md:text-xl">
                <span className="text-xl lg:text-3xl font-bold leading-none">
                  34
                </span>
                <span className="text-xs lg:text-sm leading-none">min</span>
              </div>
            </div>
            <Link
              href="#"
              className="items-center justify-center hidden sm:inline-flex lg:px-5 lg:py-2.5 px-3 py-1.5 rounded-lg text-white font-semibold text-base bg-gradient-brand-pink shadow-lg hover:opacity-90 transition-opacity"
            >
              View Event <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-right space-y-3">
          <h2 className="text-2xl lg:text-4xl font-semibold text-white font-mono tracking-tight">
            Mega Jackpot
          </h2>
          <p className="text-5xl lg:text-7xl font-extrabold bg-gradient-to-r from-[#EE4FFB] to-[#FBFDD4] bg-clip-text text-transparent font-mono tracking-tight">
            $100,000,000
          </p>
        </div>
      </div>
    </section>
  )
}
