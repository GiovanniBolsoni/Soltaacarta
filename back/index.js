require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.post('/pergunte-ao-gemini', async (req, res) => {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: req.body.prompt }]
      })
    })

    const data = await response.json()
    console.log('Resposta da API:', JSON.stringify(data, null, 2))
    const respostaIA = data?.choices?.[0]?.message?.content;

    return res.json({ resposta: respostaIA })

  } catch (err) {
    console.error('Erro:', err)
    return res.status(500).json({ erro: 'Erro ao gerar resposta com IA.' })
  }
})

app.listen(3000, () => {
  console.log('Beleza, rodando em http://localhost:3000')
})