const bodyParser = require('body-parser');
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {
  '11fe45ef': {
    id: '11fe45ef',
    title: 'Quais ações small caps vocês tem na carteira de vocês?',
    comments: [
      { id: 'dd334ff', content: 'Eu tenho Rani3 e Leve3, pagam ótimos dividendos!', status: 'approved' },
      { id: 'ab331ff', content: 'Eu tenho só bancos, Pine e BR Partners', status: 'approved' }
    ],
  }
};

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, postId, content, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === 'CommentUpdated') {
    const { id, postId, content, status } = data;

    const post = posts[postId] || [];
    const comment = post.comments.find((comment) => comment.id === id);

    comment.status = status;
    comment.content = content;
  }
}

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  console.log('Received event:', req.body.type);

  const { type, data } = req.body;

  handleEvent();

  res.status(200).send({});
});

const port = 4002;
app.listen(port, async () => {
  console.log(`Listening on http://localhost:${port}`)

  try {
    const response = await axios.get("http://event-bus-service:4005/events");

    for (let event of response.data) {
      console.log("Processing event:", event.type);
      handleEvent(event.type, event.data);
    }
  } catch (err) {
    console.log(err.message);
  }
});