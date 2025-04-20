export default function ChatLog({ log }) {
    return (
      <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {log.map((entry, idx) => (
          <div key={idx}>
            <strong>You:</strong> {entry.user}
            <br />
            <strong>GPT:</strong> {entry.bot}
            <hr />
          </div>
        ))}
      </div>
    );
  }
  