import Image from 'next/image'
import { useRef, useState } from 'react'
import StyledUploadThing from '@/components/ui/StyledUploadThing'

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
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFilePreview = (file: File) => {
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = () => {
    if (selectedFile) {
      // Create a DataTransfer object to simulate file selection
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(selectedFile)

      // Create a proper ChangeEvent
      const event = {
        target: {
          files: dataTransfer.files,
          value: '',
        },
      } as React.ChangeEvent<HTMLInputElement>

      onFileSelect(event)
      setPreviewImage(null)
      setSelectedFile(null)
    }
  }

  const handleCancel = () => {
    setPreviewImage(null)
    setSelectedFile(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Update Profile Picture</h3>
          <button
            onClick={handleCancel}
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
          ) : previewImage ? (
            /* Preview Mode */
            <div className="space-y-4">
              {/* Preview Image */}
              <div className="text-center">
                <p className="text-white font-semibold mb-3">Preview:</p>
                <div className="w-32 h-32 mx-auto bg-slate-700 rounded-xl overflow-hidden border-2 border-slate-600/50">
                  <Image
                    src={previewImage}
                    alt="Preview"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleUpload}
                  className="flex-1 bg-gradient-to-r from-[#00CED1] to-blue-500 hover:from-[#00CED1]/90 hover:to-blue-500/90 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Upload This Image
                </button>
                <button
                  onClick={() => {
                    setPreviewImage(null)
                    setSelectedFile(null)
                  }}
                  className="px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white rounded-xl transition-all duration-200"
                >
                  Choose Different
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Custom Upload Area */}
              <div className="relative">
                <div className="group relative block w-full cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md hover:from-slate-700/60 hover:to-slate-800/60 border-slate-600/50 hover:border-[#00CED1]/50">
                  <div className="p-4 text-center">
                    <div className="space-y-3">
                      {/* Upload Icon */}
                      <div className="w-10 h-10 mx-auto bg-gradient-to-br from-slate-700/80 to-slate-800/60 rounded-lg flex items-center justify-center border border-slate-600/30 group-hover:from-[#00CED1]/20 group-hover:to-blue-500/20 group-hover:border-[#00CED1]/50 transition-all duration-300">
                        <svg
                          className="w-5 h-5 text-slate-400 group-hover:text-[#00CED1] transition-colors duration-300"
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

                      {/* Text Content */}
                      <div className="space-y-1">
                        <p className="text-white font-semibold text-sm group-hover:text-[#00CED1] transition-colors duration-300">
                          Upload Profile Picture
                        </p>
                        <p className="text-slate-400 text-xs">PNG, JPG up to 5MB</p>
                      </div>

                      {/* Styled Upload Button */}
                      <div className="pt-1">
                        <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-[#00CED1] to-blue-500 hover:from-[#00CED1]/90 hover:to-blue-500/90 text-white font-semibold text-sm rounded-lg transition-all duration-300 transform group-hover:scale-105 shadow-lg">
                          <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          Choose File
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleFilePreview(file)
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {/* Current Avatar Preview */}
              <div className="mt-6 text-center">
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}
