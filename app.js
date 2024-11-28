// Select DOM elements
const chatContainer = document.getElementById('chat-container');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

// Conversation history
let conversation = [];

// Function to append messages to the chat
function appendMessage(role, content) {
  const message = document.createElement('div');
  message.classList.add('message', role);
  message.textContent = content;
  chatContainer.appendChild(message);
  chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to bottom
}

// Handle form submission
chatForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent page reload

  const userMessage = userInput.value;
  appendMessage('user', userMessage); // Display user's message
  conversation.push({ role: 'user', content: userMessage }); // Add to conversation

  // Clear the input field
  userInput.value = '';

  // Fetch bot response
  appendMessage('bot', 'Thinking...'); // Temporary message
  try {
    const response = await fetch('/.netlify/functions/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation }),
    });
    const data = await response.json();

    // Remove "Thinking..." message and display bot response
    chatContainer.lastChild.remove();
    appendMessage('bot', data.reply);
    conversation.push({ role: 'assistant', content: data.reply }); // Add bot reply to conversation
  } catch (error) {
    chatContainer.lastChild.remove();
    appendMessage('bot', 'Error: Unable to connect to the server.');
    console.error(error);
  }
});
