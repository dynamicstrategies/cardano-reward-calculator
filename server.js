const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the 'out' directory
app.use('/reward-calculator', express.static(path.join(__dirname, 'out')));

app.listen(PORT, () => {
	console.log(`Express Server listening on port ${PORT}`)
})

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'out', 'index.html'));
});
