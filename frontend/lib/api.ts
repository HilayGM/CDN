// API utility functions for interacting with the backend

export async function uploadImage(file: File) {
    const formData = new FormData()
    formData.append("file", file)
  
    const response = await fetch("http://localhost:3001/images/upload", {
      method: "POST",
      body: formData,
    })
  
    if (!response.ok) {
      throw new Error("Failed to upload image")
    }
  
    return response.json()
  }
  
  export async function getImages() {
    const response = await fetch("http://localhost:3001/images/list")
  
    if (!response.ok) {
      throw new Error("Failed to fetch images")
    }
  
    return response.json()
  }
  
  export async function deleteImage(imageId: string) {
    const response = await fetch(`http://localhost:3001/images/delete/${imageId}`, {
      method: "DELETE",
    })
  
    if (!response.ok) {
      throw new Error("Failed to delete image")
    }
  
    return response.json()
  }
  
  