import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

config({path: './api/config/.env'})

const app = express();
app.use(cors());
 
app.get('/api', async (req, res) => {
    try {
        const { text, source, target } = req.query;
        const url = `https://api.mymemory.translated.net/get?q=${text}&langpair=${source}|${target}`;
        const response = await fetch(url);
        const json = await response.json();
        const matches = await json.matches;
        const translatedText = matches[matches.length - 1].translation || 'No translation found';
        res.send(translatedText);
    } catch (error) {
        console.log(error);
        res.send('Something went wrong!');
    }
});

if (process.env.NODE_ENV !== "PRODUCTION") {
    const PORT = process.env.PORT
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app