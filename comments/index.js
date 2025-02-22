const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const express = require('express');
const axios = require('axios');
const cors = require('cors');


const app = express();

app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {
  '11fe45ef': [
    { id: 'dd334ff', content: 'Eu tenho Rani3 e Leve3, pagam ótimos dividendos!', status: 'approved' },
    { id: 'ab331ff', content: 'Eu tenho só bancos, Pine e BR Partners', status: 'approved' }
  ]
};

app.get('/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  res.send(commentsByPostId[postId] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const postId = req.params.id;
  const id = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = commentsByPostId[postId] || [];
  comments.push({ id, content, status: 'pending' });

  commentsByPostId[postId] = comments;

  await axios.post('http://event-bus-service:4005/events', {
    type: 'CommentCreated',
    data: { id, postId, content, status: 'pending' }
  });

  res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  console.log('Received event:', req.body.type);

  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { id, postId, content, status } = data;

    const comments = commentsByPostId[postId] || [];
    const comment = comments.find((comment) => comment.id === id);


    comment.status = status;

    console.log('Comment moderated', comment);

    await axios.post('http://event-bus-service:4005/events', {
      type: 'CommentUpdated',
      data: { id, postId, content, status }
    });
  }

  res.status(201).send({});
});


const port = 4001;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));