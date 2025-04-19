"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { AuthContext } from "./authContext"

export const ChatContext = createContext()

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
      // Comment out the socket connection
      /*
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
        query: {
          userId: user._id,
        },
      })

      setSocket(newSocket)

      return () => {
        newSocket.disconnect()
      }
      */

      // Instead, set a mock socket or just skip
      console.log("Socket connection would be initialized here")
    }
  }, [user])

  // Socket event listeners
  useEffect(() => {
    if (socket) {
      // Comment out socket event listeners
      /*
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
      */
    }

    return () => {
      if (socket) {
        // Comment out socket event cleanup
        /*
        socket.off("getOnlineUsers")
        socket.off("receiveMessage")
        socket.off("messagesRead")
        */
      }
    }
  }, [socket, currentChat])

  // Get user's chats
  const getChats = async () => {
    try {
      setLoading(true)
      setError(null)

      // Comment out the API call
      /*
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const res = await axios.get("/api/chats", config)
      setChats(res.data)
      return res.data
      */

      // Instead, use mock data
      const mockChats = [
        {
          _id: "chat1",
          listing: {
            _id: "1",
            title: "Healthy Bakra for Qurbani",
            images: ["/placeholder.svg"],
          },
          buyer: {
            _id: "user123",
            name: "Demo User",
            profileImage: null,
          },
          seller: {
            _id: "seller1",
            name: "Ali Farms",
            profileImage: null,
          },
          latestMessage: {
            content: "Is this goat still available?",
            sender: {
              _id: "user123",
              name: "Demo User",
            },
            createdAt: new Date().toISOString(),
          },
          unreadCount: 0,
          createdAt: new Date().toISOString(),
        },
        {
          _id: "chat2",
          listing: {
            _id: "2",
            title: "Premium Cow for Eid",
            images: ["/placeholder.svg"],
          },
          buyer: {
            _id: "user123",
            name: "Demo User",
            profileImage: null,
          },
          seller: {
            _id: "seller2",
            name: "Malik Farms",
            profileImage: null,
          },
          latestMessage: {
            content: "What is the weight of this cow?",
            sender: {
              _id: "user123",
              name: "Demo User",
            },
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          },
          unreadCount: 1,
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        },
      ]

      setChats(mockChats)
      return mockChats
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch chats")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Get chat messages
  const getChatMessages = async (chatId) => {
    try {
      setLoading(true)
      setError(null)

      // Comment out the API call
      /*
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const res = await axios.get(`/api/chats/${chatId}/messages`, config)
      setMessages(res.data)

      // Mark messages as read
      if (socket) {
        socket.emit("markMessagesAsRead", { chatId, userId: user._id })
      }

      return res.data
      */

      // Instead, use mock data
      const mockMessages = [
        {
          _id: "msg1",
          chatId: "chat1",
          content: "Hello, I'm interested in your goat for Qurbani.",
          sender: {
            _id: "user123",
            name: "Demo User",
          },
          createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        },
        {
          _id: "msg2",
          chatId: "chat1",
          content: "Yes, it's still available. When would you like to see it?",
          sender: {
            _id: "seller1",
            name: "Ali Farms",
          },
          createdAt: new Date(Date.now() - 3540000).toISOString(), // 59 minutes ago
        },
        {
          _id: "msg3",
          chatId: "chat1",
          content: "Is this goat still available?",
          sender: {
            _id: "user123",
            name: "Demo User",
          },
          createdAt: new Date().toISOString(),
        },
      ]

      // Filter messages for the current chat
      const chatMessages = mockMessages.filter((msg) => msg.chatId === chatId)
      setMessages(chatMessages)

      return chatMessages
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch messages")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Start a new chat for a listing
  const startChat = async (listingId, sellerId) => {
    try {
      setLoading(true)
      setError(null)

      // Comment out the API call
      /*
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const res = await axios.post("/api/chats", { listingId, sellerId }, config)

      // Add new chat to chats list
      setChats((prev) => [res.data, ...prev])

      return res.data
      */

      // Instead, create a mock chat
      const listing = mockListings.find((l) => l._id === listingId)
      if (!listing) {
        throw new Error("Listing not found")
      }

      const userData = JSON.parse(localStorage.getItem("userData"))

      const newChat = {
        _id: `chat-${Date.now()}`,
        listing: {
          _id: listing._id,
          title: listing.title,
          images: listing.images,
        },
        buyer: {
          _id: userData._id,
          name: userData.name,
          profileImage: userData.profileImage || null,
        },
        seller: {
          _id: sellerId,
          name: listing.seller.name,
          profileImage: listing.seller.profileImage || null,
        },
        latestMessage: null,
        unreadCount: 0,
        createdAt: new Date().toISOString(),
      }

      // Add new chat to chats list
      setChats((prev) => [newChat, ...prev])

      return newChat
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start chat")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Send a message
  const sendMessage = async (chatId, content) => {
    try {
      setError(null)

      // Comment out the API call
      /*
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const res = await axios.post(`/api/chats/${chatId}/messages`, { content }, config)

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
      */

      // Instead, create a mock message
      const userData = JSON.parse(localStorage.getItem("userData"))

      const newMessage = {
        _id: `msg-${Date.now()}`,
        chatId: chatId,
        content: content,
        sender: {
          _id: userData._id,
          name: userData.name,
        },
        createdAt: new Date().toISOString(),
      }

      // Update messages list
      setMessages((prev) => [...prev, newMessage])

      // Update chat list to show latest message
      setChats((prev) => {
        const updatedChats = prev.map((chat) => {
          if (chat._id === chatId) {
            return {
              ...chat,
              latestMessage: newMessage,
            }
          }
          return chat
        })

        return updatedChats
      })

      return newMessage
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message")
      throw err
    }
  }

  // Add mock listings reference
  const mockListings = [
    {
      _id: "1",
      title: "Healthy Bakra for Qurbani",
      images: ["/placeholder.svg"],
      seller: {
        _id: "seller1",
        name: "Ali Farms",
      },
    },
    {
      _id: "2",
      title: "Premium Cow for Eid",
      images: ["/placeholder.svg"],
      seller: {
        _id: "seller2",
        name: "Malik Farms",
      },
    },
  ]

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
