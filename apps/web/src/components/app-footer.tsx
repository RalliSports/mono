import Link from "next/link";

export function AppFooter({ border = false }: { border?: boolean }) {
  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Top area: Blocks */}
        <div className="grid gap-10 py-8 sm:grid-cols-12 md:py-12">
          {/* 1st block */}
          <div className="space-y-4 sm:col-span-12 lg:col-span-4">
            <div>
              <Link
                href="/"
                className="inline-flex items-center"
                aria-label="Ralli"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#FFAB91] to-[#00CED1] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">R</span>
                  </div>
                  <span className="text-xl font-bold text-white">Ralli</span>
                </div>
              </Link>
            </div>
            <div className="text-sm text-gray-400">
              Sports betting with friends. Challenge, compete, and win together.
            </div>
            <div className="text-sm text-gray-500">
              &copy; 2025 Ralli - All rights reserved.
            </div>
          </div>

          {/* 2nd block */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium text-white">Sports</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-gray-400 transition hover:text-white"
                  href="/nfl"
                >
                  NFL
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 transition hover:text-white"
                  href="/nba"
                >
                  NBA
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 transition hover:text-white"
                  href="/soccer"
                >
                  Soccer
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 transition hover:text-white"
                  href="/baseball"
                >
                  Baseball
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 transition hover:text-white"
                  href="/leaderboard"
                >
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* 3rd block */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium text-white">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-gray-400 transition hover:text-white"
                  href="/about"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 transition hover:text-white"
                  href="/how-it-works"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 transition hover:text-white"
                  href="/blog"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 transition hover:text-white"
                  href="/careers"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* 4th block */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium text-white">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-gray-400 transition hover:text-white"
                  href="/help"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 transition hover:text-white"
                  href="/terms"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 transition hover:text-white"
                  href="/privacy"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 transition hover:text-white"
                  href="/contact"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* 5th block */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium text-white">Social</h3>
            <ul className="flex gap-2">
              <li>
                <Link
                  className="flex items-center justify-center w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                  href="#"
                  aria-label="Twitter"
                >
                  <span className="text-gray-400 hover:text-white">𝕏</span>
                </Link>
              </li>
              <li>
                <Link
                  className="flex items-center justify-center w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                  href="#"
                  aria-label="Instagram"
                >
                  <span className="text-gray-400 hover:text-white">📷</span>
                </Link>
              </li>
              <li>
                <Link
                  className="flex items-center justify-center w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                  href="#"
                  aria-label="Discord"
                >
                  <span className="text-gray-400 hover:text-white">💬</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
