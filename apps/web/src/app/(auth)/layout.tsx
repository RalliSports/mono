import Logo from "@/components/ui/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#F5F5DC] via-white to-[#FFAB91]/10 relative overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute inset-0">
          {/* Animated gradient blobs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#00CED1]/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFAB91]/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-200"></div>
          <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-400"></div>

          {/* Floating elements */}
          <div className="absolute top-20 left-20 w-4 h-4 bg-[#00CED1]/20 rounded-full animate-float"></div>
          <div className="absolute top-40 right-32 w-2 h-2 bg-[#FFAB91]/30 rounded-full animate-float delay-1000"></div>
          <div className="absolute bottom-32 left-40 w-3 h-3 bg-blue-500/20 rounded-full animate-float delay-2000"></div>
        </div>

        <header className="absolute z-30 w-full">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex h-16 items-center justify-between md:h-20">
              {/* Site branding */}
              <div className="mr-4 shrink-0">
                <Logo />
              </div>
            </div>
          </div>
        </header>

        <main className="relative flex grow min-h-screen">
          {/* Content */}
          <div className="w-full lg:w-1/2">
            <div className="flex h-full flex-col justify-center px-4 sm:px-6 lg:px-12">
              <div className="mx-auto w-full max-w-lg">
                <div className="backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-12">
                  {children}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Enhanced illustration */}
          <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
            <div className="relative w-full max-w-md">
              {/* Main card */}
              <div className="relative backdrop-blur-sm bg-white/90 rounded-3xl shadow-2xl border border-white/30 p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1 text-center">
                      <span className="text-sm font-medium text-gray-600">
                        ralli.pro
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-[#00CED1] to-[#00CED1]/80 rounded-2xl p-4 text-white">
                      <div className="text-2xl font-bold">$12,847</div>
                      <div className="text-sm opacity-90">Total Winnings</div>
                    </div>
                    <div className="bg-gradient-to-br from-[#FFAB91] to-[#FFAB91]/80 rounded-2xl p-4 text-white">
                      <div className="text-2xl font-bold">84%</div>
                      <div className="text-sm opacity-90">Win Rate</div>
                    </div>
                  </div>

                  {/* Activity feed */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-700">
                      Recent Activity
                    </h3>
                    <div className="space-y-2 max-h-32 overflow-hidden">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-sm animate-pulse"
                          style={{ animationDelay: `${i * 200}ms` }}
                        >
                          <span className="text-gray-600">
                            Win streak +{i + 1}
                          </span>
                          <span className="text-green-600 font-medium">
                            +${Math.floor(Math.random() * 500) + 100}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-4 animate-float">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-4 animate-float delay-1000">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#00CED1] rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-600">Live betting</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
