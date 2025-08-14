import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, User, Send, Shield } from "lucide-react";
import { useLocation } from "wouter";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
}

interface LoginStep3Props {
  onComplete: () => void;
  onBack: () => void;
}

export default function LoginStep3({ onComplete, onBack }: LoginStep3Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [isAccessGranted, setIsAccessGranted] = useState(false);
  const [showActionButton, setShowActionButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Auto-start conversation when component mounts
  useEffect(() => {
    if (!conversationStarted) {
      startConversation();
    }
  }, [conversationStarted]);

  const startConversation = async () => {
    setConversationStarted(true);
    setIsTyping(true);
    
    try {
      const response = await apiRequest("POST", "/api/agent/security", {
        message: "START_CONVERSATION",
        employeeId: "demo-user" // This would come from the session in real implementation
      });
      
      const data = await response.json();
      setIsTyping(false);
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: data.message,
        sender: 'bot',
        timestamp: new Date()
      }]);
    } catch (error) {
      setIsTyping(false);
      toast({
        title: "Connection Error",
        description: "Unable to connect to security system. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/agent/security", {
        message,
        employeeId: "demo-user" // This would come from the session in real implementation
      });
      return response.json();
    },
    onSuccess: (data) => {
      setIsTyping(false);
      
      // Remove any existing typing indicators
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      
      // Add the bot's response to messages
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: data.message,
        sender: 'bot',
        timestamp: new Date()
      }]);
      
      // Check for access status keywords
      const messageLower = data.message.toLowerCase();
      if (messageLower.includes("access granted") || 
          messageLower.includes("verified") || 
          messageLower.includes("authenticated") ||
          messageLower.includes("identity confirmed")) {
        
        setIsAccessGranted(true);
        setShowActionButton(true);
        
        toast({
          title: "Authentication Complete",
          description: "Identity verified successfully!",
        });
      } else if (messageLower.includes("access rejected") || 
                 messageLower.includes("verification failed") ||
                 messageLower.includes("identity not confirmed")) {
        
        setIsAccessGranted(false);
        setShowActionButton(true);
        
        toast({
          title: "Verification Failed",
          description: "Identity could not be verified. Please try again.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      setIsTyping(false);
      // Remove any existing typing indicators
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      toast({
        title: "Security Verification Failed",
        description: error.message || "Unable to verify your response. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    sendMessageMutation.mutate(inputMessage.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderTypingIndicator = () => (
    <div className="flex items-center space-x-1 px-3 py-2">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span className="text-xs text-gray-500 ml-2">ALERT GUARD is typing...</span>
    </div>
  );

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="space-y-4">
      {/* Subtle Chat Header */}
      <div className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
          <Shield className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">ALERT GUARD</h3>
          <p className="text-xs text-gray-600">Security Verification System</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="bg-white border border-gray-200 rounded-lg h-80 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isTyping && (
          <div className="text-center text-gray-500 py-8">
            <Bot className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">Initializing security verification...</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            {message.sender === 'bot' ? (
              <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="text-white h-3 w-3" />
              </div>
            ) : (
              <div className="w-7 h-7 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="text-white h-3 w-3" />
              </div>
            )}
            
            <div
              className={`max-w-xs lg:max-w-md rounded-2xl px-3 py-2 ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-md'
                  : 'bg-gray-100 text-gray-800 rounded-bl-md'
              }`}
            >
              {message.isTyping ? (
                renderTypingIndicator()
              ) : (
                <>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <span className={`text-xs mt-1 block ${
                    message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </span>
                </>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start space-x-3">
            <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="text-white h-3 w-3" />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-3 py-2">
              {renderTypingIndicator()}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex space-x-3">
        <Input
          type="text"
          placeholder="Type your response..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 rounded-full border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          disabled={isTyping || sendMessageMutation.isPending}
        />
        <Button 
          onClick={handleSendMessage}
          className="bg-purple-600 hover:bg-purple-700 rounded-full px-4"
          disabled={isTyping || sendMessageMutation.isPending || !inputMessage.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <Button 
        className="w-full bg-green-600 hover:bg-green-700"
        data-testid="proceed-button"
        onClick={() => {
          if(isAccessGranted){
            setLocation("/dashboard");
          } else {
            setLocation("/");
          }
        }}
      >
        {isAccessGranted ? "Enter Dashboard" : "Go Back"}
      </Button>

      {/* Back Button */}
      <div className="text-center">
        <Button 
          variant="link" 
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          ← Back to OTP
        </Button>
      </div>
    </div>
  );
}
