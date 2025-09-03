import Image from 'next/image'
import { useRef } from 'react'
import { UploadButton } from '@/lib/uploadthing'

interface ProfilePictureUploadModalProps {
  isOpen: boolean
  onClose: () => void
  isUploading: boolean
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  session: string | null
  onUploadComplete?: () => void
  avatar: string
  setAvatar: (avatar: string) => void
}

export default function ProfilePictureUploadModal({
  isOpen,
  onClose,
  isUploading,
  onFileSelect,
  session,
  onUploadComplete,
  avatar,
  setAvatar,
}: ProfilePictureUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Update Profile Picture</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6m0 12L6 6" />
            </svg>
          </button>
        </div>

        {/* Upload Area */}
        <div className="space-y-4">
          {isUploading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#00CED1]/30 border-t-[#00CED1] rounded-full animate-spin"></div>
              <h4 className="text-white font-semibold mb-2">Uploading...</h4>
              <p className="text-slate-400 text-sm">Please wait while we process your image</p>
            </div>
          ) : (
            <>
              {/* Drag & Drop Area */}
              {/* <div
                onDragEnter={onDrag}
                onDragLeave={onDrag}
                onDragOver={onDrag}
                onDrop={onDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                  dragActive
                    ? 'border-[#00CED1] bg-[#00CED1]/10'
                    : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/30'
                }`}
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-slate-700/50 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>

                <p className="text-slate-500 text-xs mt-3">PNG, JPG up to 5MB</p>
              </div> */}
              <UploadButton
                endpoint="profilePicture"
                input={{ sessionId: session || '' }}
                onClientUploadComplete={(response) => {
                  setAvatar(response[0].ufsUrl)

                  // Call the callback to trigger refresh

                  // Do something with the response
                  alert('Upload Completed')
                  onUploadComplete?.()
                }}
                onUploadError={(error: Error) => {
                  // Do something with the error.
                  alert(`ERROR! ${error.message}`)
                }}
              />

              {/* Hidden File Input */}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileSelect} className="hidden" />

              {/* Current Avatar Preview */}
              {
                <div className="mt-6 text-center">
                  <p className="text-slate-400 text-sm mb-3">Current photo:</p>
                  <div className="w-16 h-16 mx-auto bg-slate-700 rounded-xl overflow-hidden">
                    <Image
                      src={avatar || '/images/pfp1.svg'}
                      alt="Current avatar"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              }
            </>
          )}
        </div>
      </div>
    </div>
  )
}
