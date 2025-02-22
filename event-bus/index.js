const bodyParser = require('body-parser');
const express = require('express');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());

const errorHandler = (err) => console.log(err.message);

const events = [];

app.post('/events', (req, res) => {
  const event = req.body;

  events.push(event);

  axios.post('http://posts-cluster-service:4000/events', event).catch(errorHandler);

  axios.post('http://comments-service:4001/events', event).catch(errorHandler);

  axios.post('http://query-service:4002/events', event).catch(errorHandler);

  axios.post('http://moderation-service:4003/events', event).catch(errorHandler);

  res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
  res.send(events);
});

const port = 4005;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));