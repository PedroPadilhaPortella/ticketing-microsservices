const bodyParser = require('body-parser');
const express = require('express');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
  console.log('Received event:', req.body.type);

  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved';
    await axios.post('http://event-bus-service:4005/events', {
      type: 'CommentModerated',
      data: { ...data, status }
    });
  }

  res.send({});
});

const port = 4003;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));