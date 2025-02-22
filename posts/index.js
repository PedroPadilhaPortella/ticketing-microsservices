const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const express = require('express');
const axios = require('axios');
const cors = require('cors');


const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {
  '11fe45ef': { id: '11fe45ef', title: 'Quais ações small caps vocês tem na carteira de vocês?' }
};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts/create', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;
  posts[id] = { id, title };

  await axios.post('http://event-bus-service:4005/events', { type: 'PostCreated', data: { id, title } });

  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('Received event:', req.body.type);
  res.status(201).send({});
});

const port = 4000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));