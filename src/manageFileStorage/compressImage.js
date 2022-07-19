// receive an image and return a compressed image

import { uploadFile } from "./uploadFile"

function compressImage (file, personId, commentId, tooLargeError) {
  
  const MAX_WIDTH = 600
  const MAX_HEIGHT = 600
  const MIME_TYPE = 'image/jpeg'
  const QUALITY = 0.9

  const blobURL = URL.createObjectURL(file)
  const img = new Image()
  img.src = blobURL
  img.onerror = function () {
    URL.revokeObjectURL(this.src)
    // Handle the failure properly
    console.log('Cannot load image')
    
  }
  img.onload = function () {
    URL.revokeObjectURL(this.src)
    const [newWidth, newHeight] = calculateSize(img, MAX_WIDTH, MAX_HEIGHT)
    const canvas = document.createElement('canvas')
    canvas.width = newWidth
    canvas.height = newHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, newWidth, newHeight)
    canvas.toBlob(
      blob => {
        // Handle the compressed image. es. upload or save in local state
       
          if (blob.size < 100000) {
            uploadFile('image', blob, personId, commentId)
          } else {
            tooLargeError()
            const error = `image is too big, ${blob.size}`
            console.log('image too big', error, 'blob',blob.size)
            return error
          }
          displayInfo('Original file', file)
          displayInfo('Compressed file', blob)
        
          },
          MIME_TYPE,
          QUALITY
          
     )
    //document.getElementById('root').append(canvas)
  }

  function calculateSize (img, maxWidth, maxHeight) {
    let width = img.width
    let height = img.height

    // calculate the width and height, constraining the proportions
    if (width > height) {
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }
    } else {
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height)
        height = maxHeight
      }
    }
    return [width, height]
  }

  // Utility functions for demo purpose

  function displayInfo (label, file) {
    
    const fileSize = `${label} - ${readableBytes(file.size)}`
    console.log(fileSize)
  }

  function readableBytes (bytes) {
    const i = Math.floor(Math.log(bytes) / Math.log(1024)),
      sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i]
  }
}

export { compressImage as default }
