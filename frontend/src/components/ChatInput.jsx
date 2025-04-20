import { useState } from 'react';

export default function ChatInput({ onSend }) {
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);

  const send = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  const startVoice = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      onSend(transcript);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognition.start();
  };

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && send()}
        placeholder="Ask something..."
      />
      <button onClick={send}>Send</button>
      <button onClick={startVoice} disabled={listening}>
        {listening ? 'Listening…' : '🎙️ Speak'}
      </button>
    </div>
  );
}
