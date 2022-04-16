import express from 'express';

const app = express();
app.use(express.json());

type RequestBody = {
    nome: string;
    idade: number | string;
}

app.post('/', (request, response) => {
    const user = request.body as RequestBody;

    return response.send({
        message: `Hello ${user.nome} you have ${user.idade} age old`,
    });
});

app.listen(3000, () => console.log('Listening 3000'));