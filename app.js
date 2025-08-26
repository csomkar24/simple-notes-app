import express from 'express';
import queries from './dbConnect.js';

const app = express();
app.use(express.static('./public'));
app.use(express.json());

app.get('/notes', async (req, res) => {
    const result = await queries.getAllNotes();
    res.json(result);
});

app.get('/notes/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await queries.getNoteById(id);
        if (!result) {
            return res.status(404).json({ message: `Note with ID ${id} not found` });
        }
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
})

app.post('/create-note', async (req, res) => {
    const { title, content } = req.body;
    const result = await queries.createNote(title, content);
    res.json(result)
});

// app.use((req, res) => {
//     res.send("Working properly!");
// });

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke out!");
});

app.listen(3000, () => {
    console.log("Server listening on http://localhost:3000");
});