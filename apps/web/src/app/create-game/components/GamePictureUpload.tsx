import Image from 'next/image'
import StyledUploadThing from '@/components/ui/StyledUploadThing'

interface GamePictureUploadProps {
  session: string | null
  avatar: string
  setAvatar: (avatar: string) => void
}

export default function GamePictureUpload({ session, avatar, setAvatar }: GamePictureUploadProps) {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Upload Game Picture</h3>
        </div>

        {/* Compact Upload Area - Horizontal Layout */}
        <div className="flex items-center gap-4">
          {/* Current Photo Preview */}
          <div className="flex-shrink-0">
            <p className="text-slate-400 text-xs mb-2 text-center">Current:</p>
            <div className="w-16 h-16 bg-slate-700 rounded-xl overflow-hidden border border-slate-600/50">
              <Image
                src={avatar || '/images/pfp-1.svg'}
                alt="Current avatar"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Compact Upload Button */}
          <div className="flex-1">
            <div className="group relative block w-full cursor-pointer rounded-lg border-2 border-dashed transition-all duration-300 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md hover:from-slate-700/60 hover:to-slate-800/60 border-slate-600/50 hover:border-[#00CED1]/50">
              <div className="p-3 text-center">
                <div className="space-y-2">
                  {/* Small Upload Icon */}
                  <div className="w-8 h-8 mx-auto bg-gradient-to-br from-slate-700/80 to-slate-800/60 rounded-lg flex items-center justify-center border border-slate-600/30 group-hover:from-[#00CED1]/20 group-hover:to-blue-500/20 group-hover:border-[#00CED1]/50 transition-all duration-300">
                    <svg
                      className="w-4 h-4 text-slate-400 group-hover:text-[#00CED1] transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>

                  {/* Compact Text */}
                  <div>
                    <p className="text-white font-semibold text-xs group-hover:text-[#00CED1] transition-colors duration-300">
                      Upload New
                    </p>
                    <p className="text-slate-400 text-xs">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>

              {/* Hidden UploadThing Button */}
              <div className="absolute inset-0 opacity-0">
                <StyledUploadThing
                  endpoint="gameImage"
                  input={{ sessionId: session || '' }}
                  onClientUploadComplete={(response) => {
                    setAvatar(response[0].ufsUrl)
                    alert('Upload Completed')
                  }}
                  onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`)
                  }}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
