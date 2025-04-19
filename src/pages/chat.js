"use client"

import { useState, useEffect, useContext, useRef } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import Image from "next/image"
import { Send, User, ArrowLeft } from "react-feather"
import { ChatContext } from "../context/chatContext"
import { AuthContext } from "../context/authContext"

export default function Chat() {
  const router = useRouter()
  const { id } = router.query
  const { user } = useContext(AuthContext)
  const { chats, currentChat, setCurrentChat, messages, loading, getChats, getChatMessages, sendMessage, onlineUsers } =
    useContext(ChatContext)

  const [messageInput, setMessageInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef(null)
  const [isMobileView, setIsMobileView] = useState(false)
  const [showChatList, setShowChatList] = useState(true)

  // Check if mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Fetch chats on component mount
  useEffect(() => {
    if (user) {
      getChats()
    } else {
      router.push("/login")
    }
  }, [user, getChats, router])

  // Set current chat based on URL param
  useEffect(() => {
    if (id && chats.length > 0) {
      const chat = chats.find((chat) => chat._id === id)
      if (chat) {
        setCurrentChat(chat)
        setShowChatList(false)
      }
    }
  }, [id, chats, setCurrentChat])

  // Fetch messages when current chat changes
  useEffect(() => {
    if (currentChat) {
      getChatMessages(currentChat._id)
    }
  }, [currentChat, getChatMessages])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleChatSelect = (chat) => {
    setCurrentChat(chat)
    router.push(`/chat?id=${chat._id}`, undefined, { shallow: true })

    if (isMobileView) {
      setShowChatList(false)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!messageInput.trim() || !currentChat) return

    try {
      setIsSending(true)
      await sendMessage(currentChat._id, messageInput)
      setMessageInput("")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSending(false)
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId)
  }

  const getOtherUser = (chat) => {
    if (!user || !chat) return null
    return chat.buyer._id === user._id ? chat.seller : chat.buyer
  }

  const backToList = () => {
    setShowChatList(true)
  }

  if (!user) {
    return null // Will redirect to login in useEffect
  }

  return (
    <>
      <Head>
        <title>Messages | Qurbani App</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-6 px-4">
          <h1 className="text-2xl font-bold mb-6">Messages</h1>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex h-[calc(100vh-200px)]">
              {/* Chat List - Hidden on mobile when viewing a chat */}
              {(!isMobileView || showChatList) && (
                <div className="w-full md:w-1/3 border-r border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="font-semibold">Recent Conversations</h2>
                  </div>

                  {loading && chats.length === 0 ? (
                    <div className="flex flex-col gap-2 p-2">
                      {[...Array(5)].map((_, index) => (
                        <div key={index} className="flex items-center p-3 animate-pulse">
                          <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : chats.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <p>No conversations yet.</p>
                      <p className="mt-2 text-sm">Start chatting with sellers by browsing listings.</p>
                    </div>
                  ) : (
                    <div className="overflow-y-auto h-full">
                      {chats.map((chat) => {
                        const otherUser = getOtherUser(chat)
                        const isOnline = isUserOnline(otherUser?._id)

                        return (
                          <div
                            key={chat._id}
                            onClick={() => handleChatSelect(chat)}
                            className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                              currentChat && currentChat._id === chat._id ? "bg-green-50" : ""
                            }`}
                          >
                            <div className="relative">
                              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                {otherUser?.profileImage ? (
                                  <Image
                                    src={otherUser.profileImage || "/placeholder.svg"}
                                    alt={otherUser.name}
                                    width={48}
                                    height={48}
                                    className="rounded-full"
                                  />
                                ) : (
                                  <User size={24} className="text-gray-500" />
                                )}
                              </div>
                              {isOnline && (
                                <span className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center mb-1">
                                <h3 className="font-medium text-gray-800 truncate">{otherUser?.name}</h3>
                                {chat.latestMessage && (
                                  <span className="text-xs text-gray-500">
                                    {formatTime(chat.latestMessage.createdAt)}
                                  </span>
                                )}
                              </div>
                              <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-600 truncate">
                                  {chat.latestMessage ? chat.latestMessage.content : "No messages yet"}
                                </p>
                                {chat.unreadCount > 0 && (
                                  <span className="ml-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {chat.unreadCount}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Chat Area */}
              {(!isMobileView || !showChatList) && (
                <div className="w-full md:w-2/3 flex flex-col">
                  {currentChat ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b border-gray-200 flex items-center">
                        {isMobileView && (
                          <button onClick={backToList} className="mr-2 p-1 rounded-full hover:bg-gray-100">
                            <ArrowLeft size={20} />
                          </button>
                        )}

                        <div className="relative">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            {getOtherUser(currentChat)?.profileImage ? (
                              <Image
                                src={getOtherUser(currentChat).profileImage || "/placeholder.svg"}
                                alt={getOtherUser(currentChat).name}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            ) : (
                              <User size={20} className="text-gray-500" />
                            )}
                          </div>
                          {isUserOnline(getOtherUser(currentChat)?._id) && (
                            <span className="absolute bottom-0 right-3 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
                          )}
                        </div>

                        <div>
                          <h3 className="font-medium">{getOtherUser(currentChat)?.name}</h3>
                          <p className="text-xs text-gray-500">
                            {isUserOnline(getOtherUser(currentChat)?._id) ? "Online" : "Offline"}
                          </p>
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                        {loading ? (
                          <div className="flex flex-col gap-2">
                            {[...Array(5)].map((_, index) => (
                              <div key={index} className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
                                <div
                                  className={`max-w-[70%] p-3 rounded-lg animate-pulse ${
                                    index % 2 === 0 ? "bg-gray-300" : "bg-green-200"
                                  }`}
                                  style={{ width: `${Math.floor(Math.random() * 150) + 100}px` }}
                                ></div>
                              </div>
                            ))}
                          </div>
                        ) : messages.length === 0 ? (
                          <div className="h-full flex items-center justify-center">
                            <div className="text-center text-gray-500">
                              <p>No messages yet.</p>
                              <p className="mt-1 text-sm">Start the conversation by sending a message.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {messages.map((message) => {
                              const isOwnMessage = message.sender._id === user._id

                              return (
                                <div
                                  key={message._id}
                                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                                >
                                  <div
                                    className={`max-w-[70%] p-3 rounded-lg ${
                                      isOwnMessage
                                        ? "bg-green-600 text-white rounded-br-none"
                                        : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                                    }`}
                                  >
                                    <p>{message.content}</p>
                                    <p
                                      className={`text-xs mt-1 text-right ${
                                        isOwnMessage ? "text-green-100" : "text-gray-500"
                                      }`}
                                    >
                                      {formatTime(message.createdAt)}
                                    </p>
                                  </div>
                                </div>
                              )
                            })}
                            <div ref={messagesEndRef} />
                          </div>
                        )}
                      </div>

                      {/* Message Input */}
                      <div className="p-3 border-t border-gray-200">
                        <form onSubmit={handleSendMessage} className="flex items-center">
                          <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                          <button
                            type="submit"
                            disabled={!messageInput.trim() || isSending}
                            className="bg-green-600 text-white p-2 rounded-r-lg disabled:opacity-50"
                          >
                            <Send size={20} />
                          </button>
                        </form>
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <p className="text-lg mb-2">Select a conversation</p>
                        <p className="text-sm">Choose a conversation from the list to start chatting.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
