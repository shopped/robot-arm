const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
app.use(bodyParser.json());

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
    await client.set("init", req.body.data);
    res.send('K');
})

app.get('/pos', (req, res) => {
    res.send('todo');
})
app.post('/pos', (req, res) => {
    res.send('todo');
})

app.post('/go', (req, res) => {
    publisher.publish("arms", req.body.data);
    res.send("ok am working async look at your robot arms rn")
});

app.listen(port, () => console.log(`:^) http://localhost:${port}`))