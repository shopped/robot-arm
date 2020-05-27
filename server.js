const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express()
const port = 3000
app.use(bodyParser.json());
app.use(cors())

const redis = require("redis");
const client = redis.createClient();
const { promisify } = require("util");
const getAsync = promisify(client.get).bind(client);

client.on("error", function(error) {
    console.error(error);
});

app.get('/', (req, res) => {
    res.send('Hello World!\n')
});

app.get('/init', async (req, res) => {
    const init = await getAsync("init");
    res.send(init);
})
app.post('/init', async (req, res) => {
    const data = JSON.stringify(req.body.data);
    await client.set("init", data);
    res.send('K');
})

app.get('/pos', (req, res) => {
    res.send('todo');
})
app.post('/pos', (req, res) => {
    res.send('todo');
})

app.post('/pubsub', (req, res) => {
    publisher.publish("arms", req.body.data);
    res.send("ok am working async look at your robot arms rn")
});

app.listen(port, () => console.log(`:^) http://localhost:${port}`))