import { useAuthStore } from '@/store/auth'

const InfoCards = () => {
  const { user } = useAuthStore()

  return (
    <>
      {user && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
          {/* Profile Card */}
          <div className="bg-neutral-800 rounded-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">TB</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Sup dawg,</p>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">TB732</span>
                  <span className="bg-brand-pink text-white text-xs px-2 py-1 rounded-full">
                    2
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex mb-2">
                <div
                  className="h-2 bg-brand-pink rounded-l-full"
                  style={{ width: '35%' }}
                ></div>
                <div className="h-2 bg-neutral-700 rounded-r-full flex-1"></div>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-white">
                <span className="font-bold">$1,399</span>
                <span className="text-gray-400 ml-1">played</span>
              </span>
              <span className="text-white">
                <span className="font-bold">$2,000.00</span>
                <span className="text-gray-400 ml-1">next level</span>
              </span>
            </div>
          </div>

          {/* Rewards Card */}
          <div className="bg-neutral-800 rounded-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-brand-pink/30 rounded-md flex items-center justify-center">
                <svg
                  width="44"
                  height="41"
                  viewBox="0 0 44 41"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                >
                  <path
                    d="M16.12 8.2024e-05C12.34 -0.019918 8.66 3.62008 10.34 8.14008H4C2.93913 8.14008 1.92172 8.56151 1.17157 9.31166C0.421427 10.0618 0 11.0792 0 12.1401V16.1401C0 16.6705 0.210714 17.1792 0.585786 17.5543C0.960859 17.9294 1.46957 18.1401 2 18.1401H20V12.1401H24V18.1401H42C42.5304 18.1401 43.0391 17.9294 43.4142 17.5543C43.7893 17.1792 44 16.6705 44 16.1401V12.1401C44 11.0792 43.5786 10.0618 42.8284 9.31166C42.0783 8.56151 41.0609 8.14008 40 8.14008H33.66C36 1.60008 27.2 -3.01992 23.14 2.62008L22 4.14008L20.86 2.58008C19.6 0.800082 17.86 0.020082 16.12 8.2024e-05ZM16 4.14008C17.78 4.14008 18.68 6.30008 17.42 7.56008C16.16 8.82008 14 7.92008 14 6.14008C14 5.60965 14.2107 5.10094 14.5858 4.72587C14.9609 4.3508 15.4696 4.14008 16 4.14008ZM28 4.14008C29.78 4.14008 30.68 6.30008 29.42 7.56008C28.16 8.82008 26 7.92008 26 6.14008C26 5.60965 26.2107 5.10094 26.5858 4.72587C26.9609 4.3508 27.4696 4.14008 28 4.14008ZM2 20.1401V36.1401C2 37.201 2.42143 38.2184 3.17157 38.9685C3.92172 39.7187 4.93913 40.1401 6 40.1401H38C39.0609 40.1401 40.0783 39.7187 40.8284 38.9685C41.5786 38.2184 42 37.201 42 36.1401V20.1401H24V36.1401H20V20.1401H2Z"
                    fill="#EE4FFB"
                  />
                </svg>
              </div>
              <div>
                <p className="text-brand-pink text-sm font-medium">
                  5 Available rewards
                </p>
                <p className="text-white text-2xl font-bold">$73.22</p>
              </div>
            </div>

            <button className="w-full bg-gradient-brand-pink text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2">
              Go to rewards
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Mission Card */}
          <div className="bg-neutral-800 rounded-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-brand-pink/30 rounded-md flex items-center justify-center">
                <svg
                  width="43"
                  height="43"
                  viewBox="0 0 43 43"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                >
                  <path
                    d="M19.35 0V4.4505C15.566 4.93037 12.0488 6.65446 9.35161 9.35161C6.65446 12.0488 4.93037 15.566 4.4505 19.35H0V23.65H4.4505C4.93037 27.434 6.65446 30.9512 9.35161 33.6484C12.0488 36.3455 15.566 38.0696 19.35 38.5495V43H23.65V38.5495C27.434 38.0696 30.9512 36.3455 33.6484 33.6484C36.3455 30.9512 38.0696 27.434 38.5495 23.65H43V19.35H38.5495C38.0696 15.566 36.3455 12.0488 33.6484 9.35161C30.9512 6.65446 27.434 4.93037 23.65 4.4505V0M19.35 8.772V12.9H23.65V8.7935C29.025 9.675 33.325 13.975 34.228 19.35H30.1V23.65H34.2065C33.325 29.025 29.025 33.325 23.65 34.228V30.1H19.35V34.2065C13.975 33.325 9.675 29.025 8.772 23.65H12.9V19.35H8.7935C9.675 13.975 13.975 9.675 19.35 8.772ZM21.5 19.35C20.9298 19.35 20.3829 19.5765 19.9797 19.9797C19.5765 20.3829 19.35 20.9298 19.35 21.5C19.35 22.0702 19.5765 22.6171 19.9797 23.0203C20.3829 23.4235 20.9298 23.65 21.5 23.65C22.0702 23.65 22.6171 23.4235 23.0203 23.0203C23.4235 22.6171 23.65 22.0702 23.65 21.5C23.65 20.9298 23.4235 20.3829 23.0203 19.9797C22.6171 19.5765 22.0702 19.35 21.5 19.35Z"
                    fill="#EE4FFB"
                  />
                </svg>
              </div>
              <div>
                <p className="text-brand-pink text-sm font-medium">
                  Next Mission
                </p>
                <p className="text-white font-bold">
                  Deposit $500 or more with Card
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="bg-gradient-brand-pink text-white font-medium py-2 px-4 rounded-md transition-colors">
                View next mission
              </button>
              <span className="text-brand-pink bg-brand-pink/30 font-medium py-2 px-4 rounded-md transition-colors">
                35 more mission lefts
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default InfoCards
