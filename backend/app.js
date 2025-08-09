const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/get-reddit-sentiment', (req, res) => {
    const topic = req.query.topic;
    const proc = spawn('python3', ['get_sentiment.py', topic]);
    
    let output = '';
    proc.stdout.on('data', (data) => {
        output += data.toString();
    });

    res.send(output.trim());
})

app.listen(3000, () => console.log(`Server running on port ${port}`));
