const express = require('express');
const { spawn } = require('child_process');
const db = require('./firebase');
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
        res.send(output.trim());
    });
})

app.get('/get-internships', async (res) => {
    try {
        const snapshot = await db.collection('internships').get();
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error getting data');
    }
})

app.get('/get-news', async (res) => {
    try {
        const snapshot = await db.collection('news').get();
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error getting data');
    }
})

app.listen(port, () => console.log(`Server running on port ${port}`));
