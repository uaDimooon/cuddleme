import { useState } from 'react';
import ChatInput from './components/ChatInput';
import ChatLog from './components/ChatLog';
import client from './graphql/client';
import { SEND_MESSAGE } from './graphql/queries';

function App() {
  const [log, setLog] = useState([]);

  const sendMessage = async (message) => {
    setLog((prev) => [...prev, { user: message, bot: '...' }]);

    try {
      const res = await client.request(SEND_MESSAGE, { message });
      const reply = res.handleNaturalRequest;

      setLog((prev) =>
        prev.map((entry, i) =>
          i === prev.length - 1 ? { ...entry, bot: reply } : entry
        )
      );
    } catch (e) {
      console.error(e);
      setLog((prev) =>
        prev.map((entry, i) =>
          i === prev.length - 1 ? { ...entry, bot: '❌ Error talking to server.' } : entry
        )
      );
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>🦴 CuddleMe Chat</h1>
      <ChatLog log={log} />
      <ChatInput onSend={sendMessage} />
    </div>
  );
}

export default App;
