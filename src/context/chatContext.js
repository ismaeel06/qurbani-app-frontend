"use client"

import { createContext, useState, useEffect, useContext, useCallback } from "react"
import { AuthContext } from "./authContext"
import { io } from "socket.io-client"
import axios from "axios"

export const ChatContext = createContext()


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [chats, setChats] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const { user } = useContext(AuthContext)

  // Initialize socket connection
  useEffect(() => {
    if (user) {
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
        query: {
          userId: user._id,
        },
      })

      setSocket(newSocket)

      return () => {
        newSocket.disconnect()
      }
    }
  }, [user])

  // Socket event listeners
  useEffect(() => {
    if (socket) {
      // Update online users
      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users)
      })

      // Receive new message
      socket.on("receiveMessage", (newMessage) => {
        if (currentChat && currentChat._id === newMessage.chatId) {
          setMessages((prev) => [...prev, newMessage])
        }

        // Update chat list to show latest message
        setChats((prev) => {
          const updatedChats = prev.map((chat) => {
            if (chat._id === newMessage.chatId) {
              return {
                ...chat,
                latestMessage: newMessage,
                unreadCount: chat._id === currentChat?._id ? 0 : chat.unreadCount + 1,
              }
            }
            return chat
          })

          return updatedChats
        })
      })

      // Mark messages as read
      socket.on("messagesRead", ({ chatId }) => {
        setChats((prev) => {
          return prev.map((chat) => {
            if (chat._id === chatId) {
              return { ...chat, unreadCount: 0 }
            }
            return chat
          })
        })
      })
    }

    return () => {
      if (socket) {
        socket.off("getOnlineUsers")
        socket.off("receiveMessage")
        socket.off("messagesRead")
      }
    }
  }, [socket, currentChat])

  // Get user's chats
  const getChats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("token")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const res = await axios.get(`${API_URL}/api/chats`, config)
      setChats(res.data)
      return res.data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch chats")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Get chat messages
  const getChatMessages = useCallback(async (chatId) => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("token")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const res = await axios.get(`${API_URL}/api/chats/${chatId}/messages`, config)
      setMessages(res.data)

      // Mark messages as read
      if (socket) {
        socket.emit("markMessagesAsRead", { chatId, userId: user._id })
      }

      return res.data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch messages")
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  // Start a new chat for a listing
  const startChat = useCallback(async (listingId, sellerId) => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("token")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const res = await axios.post(`${API_URL}/api/chats`, { listingId, sellerId }, config)

      // Add new chat to chats list
      setChats((prev) => [res.data, ...prev])

      return res.data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start chat")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Send a message
  const sendMessage = useCallback(async (chatId, content) => {
    try {
      setError(null)

      const token = localStorage.getItem("token")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const res = await axios.post(`${API_URL}/api/chats/${chatId}/messages`, { content }, config)

      // Emit message to socket
      if (socket) {
        socket.emit("sendMessage", {
          ...res.data,
          sender: {
            _id: user._id,
            name: user.name,
          },
        })
      }

      // Update messages list
      setMessages((prev) => [...prev, res.data])

      // Update chat list to show latest message
      setChats((prev) => {
        const updatedChats = prev.map((chat) => {
          if (chat._id === chatId) {
            return {
              ...chat,
              latestMessage: res.data,
            }
          }
          return chat
        })

        return updatedChats
      })

      return res.data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message")
      throw err
    }
  }, [socket, user])

  return (
    <ChatContext.Provider
      value={{
        socket,
        chats,
        currentChat,
        setCurrentChat,
        messages,
        loading,
        error,
        onlineUsers,
        getChats,
        getChatMessages,
        startChat,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
