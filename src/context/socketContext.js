"use client"

import { createContext, useState, useEffect, useContext } from "react"
import io from "socket.io-client"
import { AuthContext } from "./authContext"

export const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (user) {
      // Get token from localStorage
      const token = localStorage.getItem("token")
      
      if (!token) return
      
      // Create socket connection with authentication
      const newSocket = io("http://localhost:5000", {
        auth: { token }
      })
      
      setSocket(newSocket)
      
      // Socket event listeners
      newSocket.on("connect", () => {
        console.log("Connected to socket server")
      })
      
      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users)
      })
      
      newSocket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message)
      })
      
      // Clean up on unmount
      return () => {
        newSocket.disconnect()
      }
    }
  }, [user])
  
  // Function to send a message via socket
  const emitMessage = (chatId, message) => {
    console.log("Emitting message:", message)
    if (socket && socket.connected) {
        console.log("Socket is connected")
        console.log(socket)
      socket.emit("sendMessage",  { chatId, message })


    }
  }
  
  // Function to mark messages as read via socket
  const markAsRead = (chatId) => {
    if (socket && socket.connected && user) {
      socket.emit("markMessagesAsRead", { chatId, userId: user._id })
    }
  }
  
  return (
    <SocketContext.Provider value={{ socket, onlineUsers, emitMessage, markAsRead }}>
      {children}
    </SocketContext.Provider>
  )
}