import { UploadButton } from '@/lib/uploadthing'
import { cn } from '@/lib/utils'
import type { OurFileRouter } from '@/app/api/uploadthing/core'

interface StyledUploadButtonProps {
  endpoint: keyof OurFileRouter
  input?: any
  onClientUploadComplete?: (res: any) => void
  onUploadError?: (error: Error) => void
  isUploading?: boolean
  className?: string
  children?: React.ReactNode
}

export default function StyledUploadButton({
  endpoint,
  input,
  onClientUploadComplete,
  onUploadError,
  isUploading = false,
  className = '',
  children,
}: StyledUploadButtonProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* Custom Upload Area */}
      <div className="relative">
        <div
          className={cn(
            'group relative block w-full cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300',
            'bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md',
            'hover:from-slate-700/60 hover:to-slate-800/60',
            'border-slate-600/50 hover:border-[#00CED1]/50',
            isUploading ? 'opacity-50 cursor-not-allowed' : '',
          )}
        >
          <div className="p-4 text-center">
            {isUploading ? (
              <div className="space-y-2">
                <div className="w-8 h-8 mx-auto border-3 border-[#00CED1]/30 border-t-[#00CED1] rounded-full animate-spin"></div>
                <p className="text-white font-semibold text-sm">Uploading...</p>
                <p className="text-slate-400 text-xs">Please wait while we process your image</p>
              </div>
            ) : (
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
                    {children || 'Click to upload or drag and drop'}
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
            )}
          </div>

          {/* Hidden UploadThing Button */}
          <div className="absolute inset-0 opacity-0">
            <UploadButton
              endpoint={endpoint}
              input={input}
              onClientUploadComplete={onClientUploadComplete}
              onUploadError={onUploadError}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
