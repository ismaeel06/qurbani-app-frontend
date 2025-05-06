"use client"

import { createContext, useState, useEffect, useContext, useRef, useCallback } from "react"
import { useRouter } from "next/router" 
import { AuthContext } from "./authContext"
import { SocketContext } from "./socketContext"

export const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([])
  const [messages, setMessages] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useContext(AuthContext)
  const { socket, onlineUsers, emitMessage, markAsRead } = useContext(SocketContext)
  
  // Track if we need to refresh messages
  const shouldRefreshMessages = useRef(false)
  
  // Initial load of chats
  useEffect(() => {
    if (user) {
      getChats()
    }
  }, [user])
  
  // Socket event listeners setup
  useEffect(() => {
    if (!socket || !user) return
    
    const handleReceiveMessage = async (data) => {
      if (currentChat && data.chatId === currentChat._id) {
        // Option 1: Add the new message directly
        // setMessages(prev => [...prev, data])
        
        // Option 2: Refresh the entire message list (better for sync)
        shouldRefreshMessages.current = true
        await getChatMessages(currentChat._id, true)
        
        // Mark as read since user is in this chat
        markAsRead(currentChat._id)
      }
      
      // Always refresh chats list when a new message arrives
      await getChats()
    }
    
    const handleMessagesRead = ({ chatId }) => {
      if (currentChat && chatId === currentChat._id) {
        // Update read status in the UI
        setMessages(prev => 
          prev.map(msg => 
            user._id === msg.sender._id ? { ...msg, read: true } : msg
          )
        )
      }
    }
    
    const handleChatUpdated = async () => {
      // Refresh both chats and current messages
      await getChats()
      if (currentChat) {
        await getChatMessages(currentChat._id, true)
      }
    }
    
    socket.on("receiveMessage", handleReceiveMessage)
    socket.on("messagesRead", handleMessagesRead)
    socket.on("chatUpdated", handleChatUpdated)
    
    return () => {
      socket.off("receiveMessage", handleReceiveMessage)
      socket.off("messagesRead", handleMessagesRead)
      socket.off("chatUpdated", handleChatUpdated)
    }
  }, [socket, currentChat, user])
  
  // Effect to handle message refreshes when current chat changes
  useEffect(() => {
    if (currentChat) {
      getChatMessages(currentChat._id)
      markAsRead(currentChat._id)
    } else {
      setMessages([])
    }
  }, [currentChat])
  
  const getChats = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      const response = await fetch(`http://localhost:5000/api/chats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setChats(data)
      }
    } catch (error) {
      console.error("Error fetching chats:", error)
    } finally {
      setLoading(false)
    }
  }
  
  const getChatMessages = async (chatId, silent = false) => {
    try {
      if (!silent) setLoading(true)
      const token = localStorage.getItem("token")
      
      const response = await fetch(`http://localhost:5000/api/chats/${chatId}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
        return data
      }
      return []
    } catch (error) {
      console.error("Error fetching messages:", error)
      return []
    } finally {
      if (!silent) setLoading(false)
    }
  }
  
  const sendMessage = async (chatId, content) => {
    try {
      const token = localStorage.getItem("token")
      
      const response = await fetch(`http://localhost:5000/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      })
      
      if (response.ok) {
        const data = await response.json()
        
        // Add the new message to the messages state
        setMessages(prev => [...prev, data])
        
        // Emit the message via socket
        emitMessage(chatId, data)
        
        // Refresh chats to update last message
        await getChats()
        
        return data
      }
    } catch (error) {
      console.error("Error sending message:", error)
      throw error
    }
  }
  
  const createChat = async (listingId, sellerId) => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      const response = await fetch("http://localhost:5000/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ listingId, sellerId })
      })
      
      if (response.ok) {
        const data = await response.json()
        
        // Update chats list
        await getChats()
        
        // Return the new chat
        return data
      }
    } catch (error) {
      console.error("Error creating chat:", error)
    } finally {
      setLoading(false)
    }
  }
  
  // Start a new chat for a listing and navigate to it
  const startChat = useCallback(async (listingId, sellerId) => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem("token")
      
      const response = await fetch("http://localhost:5000/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ listingId, sellerId })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to start chat")
      }
      
      const newChat = await response.json()
      
      // Add new chat to chats list and refresh chats
      setChats(prev => [newChat, ...prev])
      
      // Set this as the current chat
      setCurrentChat(newChat)
      
      return newChat
    } catch (err) {
      setError(err.message || "Failed to start chat")
      console.error("Error starting chat:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])
  
  return (
    <ChatContext.Provider
      value={{
        chats,
        messages,
        currentChat,
        loading,
        error,
        onlineUsers,
        getChats,
        getChatMessages,
        sendMessage,
        createChat,
        startChat,
        setCurrentChat
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}