const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 8080;

app.get('path', (req, res) => {
    console.log('Hello World');
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});