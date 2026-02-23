const { InferenceClient } = require("@huggingface/inference");
 
const ChatBot = async (req, res) => {
  const { message } = req.body;
  //   console.log("message:", message);
 
  if (!message) {
    return res.status(400).json({ error: "Message is required!" });
  }
 
  try {
    const client = new InferenceClient(process.env.HF_TOKEN);
 
    const chatCompletion = await client.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct:novita",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });
 
    const reply = chatCompletion.choices[0].message.content;
 
    // console.log("Reply:", reply);
 
    // frontend руу буцаах
    res.json({ reply });
  } catch (err) {
    console.error("HF ERROR:", err);
    res.status(500).json({
      error: "Failed to generate text",
      details: err.message,
    });
  }
};
module.exports = ChatBot;