import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
  Modal,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = "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";

export default function AIAssistantPage({ setCurrentPage }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const flatListRef = useRef(null);

  // Load settings only, not chat history
  useEffect(() => {
    loadSettings();
    // Always start with fresh chat
    setMessages([{
      id: "1",
      sender: "ai",
      text: "👋 Hello! I'm your AI Assistant. You can chat with me in Arabic or English. How can I help you today?",
      timestamp: new Date().toISOString(),
    }]);
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('ai_assistant_settings');
      if (settings) {
        const { darkMode } = JSON.parse(settings);
        setDarkMode(darkMode || false);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('ai_assistant_settings', JSON.stringify({
        darkMode,
      }));
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  // Remove chat history saving since we don't want to persist it
  const detectLanguage = (text) => {
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text) ? "arabic" : "english";
  };

  const copyToClipboard = async (text) => {
    Alert.alert("Copied!", "Message copied to clipboard");
  };

  const showMessageOptions = (message) => {
    Alert.alert(
      "Message Options",
      "Choose an action",
      [
        {
          text: "Copy",
          onPress: () => copyToClipboard(message.text)
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userLang = detectLanguage(input);
    const userMessage = { 
      id: Date.now().toString(), 
      sender: "user", 
      text: input.trim(),
      timestamp: new Date().toISOString(),
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const systemPrompt = `You are a helpful AI assistant. Respond in the same language the user uses. Keep responses clear and concise.`;

      const messagesForAPI = [
        { role: "system", content: systemPrompt },
        ...updatedMessages.map(msg => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text
        }))
      ];

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
          "HTTP-Referer": "https://yourapp.com",
          "X-Title": "AI Assistant",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat",
          messages: messagesForAPI,
          max_tokens: 800,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error("Invalid response format from API");
      }

      const aiMessage = data.choices[0].message.content.trim();

      const aiMessageObj = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiMessage,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, aiMessageObj];
      setMessages(finalMessages);
      
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: userLang === "arabic"
          ? "⚠️ عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى."
          : "⚠️ Sorry, there was a connection error. Please try again.",
        timestamp: new Date().toISOString(),
      };
      const errorMessages = [...updatedMessages, errorMessage];
      setMessages(errorMessages);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    Alert.alert(
      "Clear Chat",
      "Are you sure you want to clear all messages?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            const welcomeMessage = [{
              id: "1",
              sender: "ai",
              text: "👋 Hello! Chat cleared! How can I help you today?",
              timestamp: new Date().toISOString(),
            }];
            setMessages(welcomeMessage);
          }
        }
      ]
    );
  };

  // Function to handle going back to settings
  const handleBackToSettings = () => {
    // Clear the chat when leaving
    setMessages([]);
    setInput("");
    setCurrentPage("settings");
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === "user" ? styles.userMessage : styles.aiMessage,
        darkMode && (item.sender === "user" ? styles.darkUserMessage : styles.darkAiMessage),
      ]}
    >
      <TouchableOpacity 
        onLongPress={() => showMessageOptions(item)}
        delayLongPress={500}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.messageText,
          darkMode && styles.darkMessageText
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.timestamp,
          darkMode && styles.darkTimestamp
        ]}>
          {new Date(item.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit'
          })}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const currentTheme = {
    background: darkMode ? "#1A1A1A" : "#FAF7F0",
    header: darkMode ? "#2D2D2D" : "#5C4033",
    input: darkMode ? "#3A3A3A" : "#F2EDE6",
    text: darkMode ? "#FFFFFF" : "#000000",
    secondaryText: darkMode ? "#CCCCCC" : "#666666",
    border: darkMode ? "#444444" : "#D9CBBE"
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: currentTheme.header }]}>
        <TouchableOpacity 
          onPress={handleBackToSettings} 
          style={styles.headerButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerText}>AI Assistant</Text>
        
        <TouchableOpacity 
          onPress={() => setSettingsVisible(true)} 
          style={styles.headerButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="settings-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => {
          if (flatListRef.current && messages.length > 0) {
            setTimeout(() => {
              flatListRef.current.scrollToEnd({ animated: true });
            }, 100);
          }
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.typingContainer}>
          <ActivityIndicator
            size="small"
            color={darkMode ? "#B08968" : "#8B5E3C"}
          />
          <Text style={[styles.typingText, { color: currentTheme.secondaryText }]}>
            AI is thinking...
          </Text>
        </View>
      )}

      {/* Input Area */}
      <View style={[
        styles.inputContainer,
        { 
          backgroundColor: currentTheme.background, 
          borderTopColor: currentTheme.border 
        }
      ]}>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: currentTheme.input,
              color: currentTheme.text,
            }
          ]}
          placeholder="Type your message..."
          placeholderTextColor={currentTheme.secondaryText}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          multiline
          maxLength={500}
          returnKeyType="send"
          blurOnSubmit={false}
        />
        <TouchableOpacity 
          style={[
            styles.sendButton, 
            { backgroundColor: currentTheme.header },
            (!input.trim() || loading) && styles.sendButtonDisabled
          ]} 
          onPress={sendMessage}
          disabled={!input.trim() || loading}
        >
          <Ionicons 
            name="send" 
            size={18} 
            color={(!input.trim() || loading) ? "#999999" : "#FFFFFF"} 
          />
        </TouchableOpacity>
      </View>

      {/* Settings Modal */}
      <Modal
        visible={settingsVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSettingsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent,
            { backgroundColor: currentTheme.background }
          ]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: currentTheme.text }]}>
                Settings
              </Text>
              <TouchableOpacity 
                onPress={() => setSettingsVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color={currentTheme.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingText}>
                <Ionicons 
                  name={darkMode ? "moon" : "moon-outline"} 
                  size={20} 
                  color={currentTheme.text} 
                />
                <Text style={[styles.settingLabel, { color: currentTheme.text }]}>
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={(value) => {
                  setDarkMode(value);
                  saveSettings();
                }}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={darkMode ? "#f5dd4b" : "#f4f3f4"}
              />
            </View>

            <TouchableOpacity 
              style={[styles.clearButton, { backgroundColor: "#E74C3C" }]}
              onPress={clearChat}
            >
              <Ionicons name="trash-outline" size={18} color="#fff" />
              <Text style={styles.clearButtonText}>Clear Current Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.closeButton, { backgroundColor: currentTheme.header }]}
              onPress={() => setSettingsVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerButton: {
    padding: 4,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  chatContainer: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    maxWidth: "85%",
    marginVertical: 6,
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#B08968",
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#6F4E37",
  },
  darkUserMessage: {
    backgroundColor: "#4A6572",
  },
  darkAiMessage: {
    backgroundColor: "#344955",
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 20,
  },
  darkMessageText: {
    color: "#FFF",
  },
  timestamp: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  darkTimestamp: {
    color: "rgba(255,255,255,0.7)",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  typingText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: Dimensions.get('window').height * 0.35,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});