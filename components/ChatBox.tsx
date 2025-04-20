import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import fetchData from "../utils/fetchData";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

// Memoize the MessageBubble component to prevent unnecessary re-renders
const MessageBubble = memo(({ msg }: { msg: Message }) => {
  const slideAnim = useRef(new Animated.Value(msg.isUser ? 100 : -100)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.messageBubble,
        msg.isUser ? styles.userMessage : styles.botMessage,
        { transform: [{ translateX: slideAnim }] },
      ]}
    >
      {!msg.isUser && (
        <Ionicons
          name="chatbox-ellipses"
          size={16}
          color="#666"
          style={styles.botIcon}
        />
      )}
      <Text
        style={[styles.messageText, { color: msg.isUser ? "#fff" : "#000" }]}
        numberOfLines={0}
        adjustsFontSizeToFit={false}
      >
        {msg.text}
      </Text>
    </Animated.View>
  );
});

// Add a loading indicator component
const LoadingIndicator = () => (
  <View style={[styles.messageBubble, styles.botMessage, styles.loadingBubble]}>
    <View style={styles.loadingDots}>
      <Text style={[styles.messageText, { color: "#000" }]}>Đang xử lý</Text>
      <Animated.Text style={styles.loadingDot}>.</Animated.Text>
      <Animated.Text style={[styles.loadingDot, { animationDelay: "0.2s" }]}>
        .
      </Animated.Text>
      <Animated.Text style={[styles.loadingDot, { animationDelay: "0.4s" }]}>
        .
      </Animated.Text>
    </View>
  </View>
);

export default function ChatBox() {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const sendScaleAnim = useRef(new Animated.Value(1)).current;
  const inputRef = useRef<TextInput>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  // Memoize the addMessage function to prevent unnecessary re-renders
  const addMessage = useCallback((text: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
    };
    setMessages((prev) => [...prev, newMessage]);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  // Memoize the sendMessage function
  const sendMessage = useCallback(async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage("");
    addMessage(userMessage, true);
    setIsLoading(true);
    setRetryCount(0);

    const attemptSend = async (retryCount: number) => {
      try {
        console.log(`Sending message, attempt ${retryCount + 1}`);
        const response = await fetchData.chatWithAI(userMessage);
        console.log("Response received:", response);

        if (response && response.message) {
          addMessage(response.message, false);
          setIsLoading(false);
          setIsRetrying(false);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error: any) {
        console.error("Error sending message:", error);

        if (error.message.includes("401")) {
          addMessage("Bạn chưa đăng nhập để sử dụng", false);
          setIsLoading(false);
          setIsRetrying(false);
        } else if (
          retryCount < maxRetries &&
          (error.message.includes("timeout") ||
            error.message.includes("network") ||
            error.message.includes("kết nối"))
        ) {
          // Retry for network/timeout errors
          setIsRetrying(true);
          setRetryCount(retryCount + 1);

          // Wait a bit before retrying
          setTimeout(() => {
            attemptSend(retryCount + 1);
          }, 2000);
        } else {
          addMessage(
            error.message || "Có lỗi xảy ra, vui lòng thử lại sau",
            false
          );
          setIsLoading(false);
          setIsRetrying(false);
        }
      }
    };

    // Start the first attempt
    attemptSend(0);
  }, [message, addMessage]);

  // Memoize the toggleChat function
  const toggleChat = useCallback(() => {
    setIsVisible(!isVisible);
  }, [isVisible]);

  // Memoize the handlePressIn function
  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  // Memoize the handlePressOut function
  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  // Memoize the handleSendPressIn function
  const handleSendPressIn = useCallback(() => {
    Animated.spring(sendScaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  }, [sendScaleAnim]);

  // Memoize the handleSendPressOut function
  const handleSendPressOut = useCallback(() => {
    Animated.spring(sendScaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [sendScaleAnim]);

  // Memoize the handleFocus function
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  // Memoize the handleBlur function
  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  // Memoize the handleChangeText function
  const handleChangeText = useCallback((text: string) => {
    setMessage(text);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, fadeAnim]);

  return (
    <>
      <Animated.View
        style={{ transform: [{ scale: pulseAnim }, { scale: scaleAnim }] }}
      >
        <TouchableOpacity
          style={styles.chatButton}
          onPress={toggleChat}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Ionicons name="chatbubbles" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={isVisible}
        animationType="none"
        transparent={true}
        onRequestClose={toggleChat}
      >
        <View style={styles.modalContainer}>
          <Animated.View
            style={[
              styles.chatContainer,
              { opacity: fadeAnim, transform: [{ scale: fadeAnim }] },
            ]}
          >
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Ionicons name="bulb" size={24} color="#007AFF" />
                <Text style={styles.headerText}>AI Assistant</Text>
              </View>
              <TouchableOpacity onPress={toggleChat} style={styles.closeButton}>
                <Ionicons name="close-circle" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
            >
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}
              {isLoading && <LoadingIndicator />}
              {isRetrying && (
                <View style={[styles.messageBubble, styles.botMessage]}>
                  <Text style={[styles.messageText, { color: "#000" }]}>
                    Đang thử lại lần {retryCount + 1}/{maxRetries + 1}...
                  </Text>
                </View>
              )}
            </ScrollView>

            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.inputContainer}
            >
              <TextInput
                ref={inputRef}
                style={[styles.input, isFocused && styles.inputFocused]}
                value={message}
                onChangeText={handleChangeText}
                placeholder="Type a message..."
                placeholderTextColor="#999"
                multiline
                onFocus={handleFocus}
                onBlur={handleBlur}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!message.trim() || isLoading) && styles.sendButtonDisabled,
                ]}
                onPress={sendMessage}
                disabled={!message.trim() || isLoading}
                onPressIn={handleSendPressIn}
                onPressOut={handleSendPressOut}
              >
                <Animated.View
                  style={{ transform: [{ scale: sendScaleAnim }] }}
                >
                  <Ionicons name="paper-plane" size={24} color="white" />
                </Animated.View>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  chatButton: {
    position: "absolute",
    right: 20,
    bottom: 80,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    zIndex: 1000,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  chatContainer: {
    flex: 1,
    marginTop: 50,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  closeButton: {
    padding: 5,
  },
  messagesContainer: {
    flex: 1,
    padding: 15,
  },
  messagesContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  userMessage: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
    borderTopRightRadius: 5,
  },
  botMessage: {
    backgroundColor: "#E8ECEF",
    alignSelf: "flex-start",
    borderTopLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    flexShrink: 1,
    flexWrap: "wrap",
  },
  botIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
    elevation: 2,
  },
  inputFocused: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  sendButton: {
    backgroundColor: "#007AFF",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: "#B0B0B0",
  },
  loadingBubble: {
    backgroundColor: "#F0F0F0",
    padding: 12,
  },
  loadingDots: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingDot: {
    fontSize: 20,
    marginLeft: 2,
    opacity: 0.7,
  },
});
