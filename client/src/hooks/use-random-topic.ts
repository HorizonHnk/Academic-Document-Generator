import { useState } from "react";
import { getRandomTopic } from "@/lib/random-topics";

export function useRandomTopic() {
  const [isLoading, setIsLoading] = useState(false);

  const generateTopic = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return getRandomTopic();
  };

  return {
    generateTopic,
    isLoading,
  };
}
