const express = require('express');
const app = express();
const cors = require('cors');
const port = 3001;
const routes =  require('./routes/routes');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
// app.get('/', (req, res) => res.send('Hello World!'));
routes.register(app);

app.listen(port, () => console.log(`API server running at ${port}!`));

// ws
require('./alerts')(app);
