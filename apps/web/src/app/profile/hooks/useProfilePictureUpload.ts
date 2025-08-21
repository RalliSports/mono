import { useToast } from '@/components/ui/toast'
import { useState } from 'react'

export function useProfilePictureUpload(
  session: string | null,
  username: string,
  firstName: string,
  lastName: string,
  setUser: (user: unknown) => void,
  setAvatar: (avatar: string) => void,
) {
  const { addToast } = useToast()
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      alert('File size must be less than 5MB.')
      return
    }

    setIsUploading(true)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)

      // For now, we'll convert to base64 and store directly
      // In production, you'd upload to a cloud storage service
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = e.target?.result as string

        // Add delay for better UX
        setTimeout(async () => {
          const response = await fetch('/api/update-user', {
            method: 'PATCH',
            headers: {
              'x-para-session': session || '',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username,
              avatar: base64,
              firstName,
              lastName,
            }),
          })

          if (response.ok) {
            const data = await response.json()
            setUser(data)
            setAvatar(data.avatar)
            setIsUploadModalOpen(false)
          } else {
            const errorData = await response.json()
            addToast(errorData.error || 'Failed to update user', 'error')
          }

          setIsUploading(false)
        }, 1000) // 1 second delay as requested
      }

      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading file:', error)
      setIsUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  return {
    isUploadModalOpen,
    setIsUploadModalOpen,
    isUploading,
    dragActive,
    handleDrag,
    handleDrop,
    handleFileSelect,
  }
}
