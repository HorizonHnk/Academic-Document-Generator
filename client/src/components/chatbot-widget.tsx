import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Bot, User, Loader2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "Hi! I'm your PaperGen AI assistant. I can help you navigate the website, explain features, and answer questions about our document generators. What would you like to know?",
  timestamp: new Date(),
};

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "I apologize, but I couldn't process your request. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please make sure the AI service is configured and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div
        className={cn(
          "fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out",
          isOpen ? "w-[360px] h-[500px] max-h-[80vh]" : "w-auto h-auto"
        )}
      >
        {isOpen ? (
          <div className="flex flex-col h-full bg-background border rounded-lg shadow-lg overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium text-sm">PaperGen Assistant</span>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                data-testid="button-minimize-chatbot"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2",
                      message.role === "user" ? "flex-row-reverse" : ""
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {message.role === "user" ? (
                        <User className="h-3.5 w-3.5" />
                      ) : (
                        <Bot className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "rounded-lg px-3 py-2 max-w-[85%] text-sm",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                      data-testid={`chat-message-${message.role}-${message.id}`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                    <div className="rounded-lg px-3 py-2 bg-muted">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-3 border-t">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1 text-sm"
                  data-testid="input-chat-message"
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  data-testid="button-send-message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Button
            size="lg"
            variant="outline"
            className="h-14 w-14 rounded-full shadow-lg opacity-50 bg-background/30 backdrop-blur-sm border-primary/30 text-primary hover:opacity-100 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
            onClick={() => setIsOpen(true)}
            data-testid="button-open-chatbot"
          >
            <Bot className="h-6 w-6" />
          </Button>
        )}
      </div>
    </>
  );
}
