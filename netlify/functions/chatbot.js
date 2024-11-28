const fetch = require('node-fetch');
require('dotenv').config();

exports.handler = async (event) => {
  try {
    const { conversation } = JSON.parse(event.body);

    const response = await fetch('https://api.openai.com/v1/assistants/asst_QuRLJBdbCY71q30tfwrr407u/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Use your API key stored in Netlify's environment variables
      },
      body: JSON.stringify({
        messages: conversation, // Pass the conversation history
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Error in OpenAI Assistant API');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: data.choices[0].message.content }),
    };
  } catch (error) {
    console.error('Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process request' }),
    };
  }
};
