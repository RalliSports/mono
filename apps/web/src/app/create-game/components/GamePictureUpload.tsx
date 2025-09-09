import Image from 'next/image'
import { UploadButton } from '@/lib/uploadthing'

interface GamePictureUploadProps {
  session: string | null
  avatar: string
  setAvatar: (avatar: string) => void
}

export default function GamePictureUpload({ session, avatar, setAvatar }: GamePictureUploadProps) {
  return (
    <div className=" flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between ">
          <h3 className="text-xl font-bold text-white">Upload Game Picture</h3>
        </div>

        {/* Upload Area */}
        <div className="flex flex-row items-top justify-between  w-full">
          <UploadButton
            endpoint="gameImage"
            input={{ sessionId: session || '' }}
            onClientUploadComplete={(response) => {
              setAvatar(response[0].ufsUrl)

              // Call the callback to trigger refresh

              // Do something with the response
              alert('Upload Completed')
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`)
            }}
            className="bg-blue-900 rounded-2xl p-2 text-black"
          />

          {/* Current Avatar Preview */}
          {
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-3">Current photo:</p>
              <div className="w-16 h-16 mx-auto bg-slate-700 rounded-xl overflow-hidden">
                <Image
                  src={avatar || '/images/pfp-1.svg'}
                  alt="Current avatar"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}
