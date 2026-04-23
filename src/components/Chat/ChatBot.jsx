import { useState, useRef, useEffect } from 'react';
import { portfolioData } from '../../data/BotContent.js';
import styles from './ChatBot.module.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm Manav's AI. Select an option below or ask me anything!" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Quick Options List
const quickOptions = [
  { label: "🚀 Projects", query: "Give me an overview of Manav's top projects." },
  { label: "📄 Resume", query: "Summarize Manav's professional resume and skills." },
  { label: "🎓 Qualification", query: "What is Manav's educational background and qualification?" }, // Naya option
  { label: "💼 Experience", query: "Tell me about Manav's development experience." }
];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleChat = async (userQuery) => {
    const messageToSend = userQuery || input;
    if (!messageToSend.trim() || isTyping) return;

    const userMsg = { role: "user", content: messageToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: `You are Manav's assistant. Context: ${portfolioData}` },
            ...messages,
            userMsg
          ]
        })
      });

      const data = await response.json();
      if (data?.choices?.[0]?.message?.content) {
        setMessages(prev => [...prev, { role: "assistant", content: data.choices[0].message.content }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Error connecting to AI. Try again!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.toggle} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '💬'}
      </button>
      
      {isOpen && (
        <div className={styles.window}>
          <div className={styles.header}><strong>Manav AI</strong></div>

          <div className={styles.messages} ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? styles.user : styles.assistant}>
                {m.content}
              </div>
            ))}
            
            {/* Display Options only if it's the start or bot just spoke */}
            {!isTyping && (
              <div className={styles.optionsWrapper}>
                {quickOptions.map((opt) => (
                  <button 
                    key={opt.label} 
                    className={styles.optionBtn} 
                    onClick={() => handleChat(opt.query)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
            
            {isTyping && <div className={styles.typing}>Thinking...</div>}
          </div>

          <form className={styles.inputArea} onSubmit={(e) => { e.preventDefault(); handleChat(); }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;