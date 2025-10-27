import { cn } from '@/lib/utils'
import { useState } from 'react'

interface StyledUploadButtonProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number
  disabled?: boolean
  isUploading?: boolean
  className?: string
  children?: React.ReactNode
}

export default function StyledUploadButton({
  onFileSelect,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  disabled = false,
  isUploading = false,
  className = '',
  children,
}: StyledUploadButtonProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (file: File | null) => {
    setError(null)

    if (!file) return

    // Validate file type
    if (accept && !file.type.match(accept.replace('*', '.*'))) {
      setError('Please select a valid image file')
      return
    }

    // Validate file size
    if (maxSize && file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
      return
    }

    onFileSelect(file)
  }

  const handleDragEvents = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent) => {
    handleDragEvents(e)
    setIsDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    handleDragEvents(e)
    setIsDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    handleDragEvents(e)
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileChange(files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFileChange(files[0])
    }
  }

  return (
    <div className={cn('relative', className)}>
      <label
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragEvents}
        onDrop={handleDrop}
        className={cn(
          'group relative block w-full cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300',
          'bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md',
          'hover:from-slate-700/60 hover:to-slate-800/60',
          isDragActive
            ? 'border-[#00CED1] bg-[#00CED1]/5 from-[#00CED1]/10 to-blue-500/10'
            : 'border-slate-600/50 hover:border-slate-500/70',
          disabled || isUploading ? 'opacity-50 cursor-not-allowed' : '',
          error ? 'border-red-500/50 bg-red-500/5' : '',
        )}
      >
        <div className="p-6 text-center">
          {isUploading ? (
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto border-4 border-[#00CED1]/30 border-t-[#00CED1] rounded-full animate-spin"></div>
              <p className="text-white font-semibold">Uploading...</p>
              <p className="text-slate-400 text-sm">Please wait while we process your image</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Upload Icon */}
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-slate-700/80 to-slate-800/60 rounded-xl flex items-center justify-center border border-slate-600/30 group-hover:from-[#00CED1]/20 group-hover:to-blue-500/20 group-hover:border-[#00CED1]/50 transition-all duration-300">
                <svg
                  className="w-8 h-8 text-slate-400 group-hover:text-[#00CED1] transition-colors duration-300"
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
              <div className="space-y-2">
                <p className="text-white font-semibold group-hover:text-[#00CED1] transition-colors duration-300">
                  {children || 'Click to upload or drag and drop'}
                </p>
                <p className="text-slate-400 text-sm">PNG, JPG up to {Math.round(maxSize / 1024 / 1024)}MB</p>
              </div>

              {/* Styled Upload Button */}
              <div className="pt-2">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#00CED1] to-blue-500 hover:from-[#00CED1]/90 hover:to-blue-500/90 text-white font-semibold rounded-xl transition-all duration-300 transform group-hover:scale-105 shadow-lg">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Choose File
                </div>
              </div>
            </div>
          )}
        </div>

        <input
          type="file"
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled || isUploading}
          className="sr-only"
        />
      </label>

      {/* Error Message */}
      {error && <p className="mt-2 text-sm text-red-400 text-center">{error}</p>}
    </div>
  )
}
