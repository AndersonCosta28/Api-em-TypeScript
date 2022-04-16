import PostgreRepository from './classes/postgres.repository'
import * as dotenv from 'dotenv'
import express from 'express';
import Usuario from './classes/usuario.entity';
import RepositoryCRUD from './classes/repositoryCRUD.interface';

const app = express();
app.use(express.json());
dotenv.config({ path: __dirname + "/.env" })

const conexao = {
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
}

const banco: RepositoryCRUD = new PostgreRepository(conexao);

app.get('/usuario', (request, response) => {
    banco.findAll().then(result => {
        return response.send(result)
    }).catch(e => response.send('Erro ao encontrar todos os usuários: \n' + e))
});

app.get('/usuario/:id', (request, response) => {
    const id = Number(request.params.id);
    if (!id) return response.send('ID inválido');

    banco.findOne(id).then(result => {
        return response.send(result)
    }).catch(e => response.send('Erro ao encontrar o usuário pelo ID: \n' + e.message))
});

app.post('/usuario', (request, response) => {
    const user = request.body as Usuario;
    banco.save(user).then(result => {
        if (result)
            return response.send({ message: `Usuário salvo com sucesso`, });
        else
            return response.send({ message: 'Não foi possível inserir usuário' })
    }).catch(e => response.send('Erro ao salvar salvar o usuário. \n ' + e))
});

app.delete('/usuario/:id', (request, response) => {
    const id = Number(request.params.id);
    if (!id) return response.send('ID inválido');

    banco.delete(id).then(result => {
        return response.send(result)
    }).catch(e => response.send('Erro ao deletar o usuário: \n' + e.message))
});

app.put('/usuario/:id', (request, response) => {
    const id = Number(request.params.id);
    if (!id) return response.send('ID inválido');

    const user = request.body as Usuario;
    banco.update(id, user).then(result => {
        if (result)
            return response.send({ message: `Usuário atualizado com sucesso`, });
        else
            return response.send({ message: 'Não foi possível atualizar usuário' })
    }).catch(e => response.send('Erro ao atualizar salvar o usuário \n' + e))
})

app.listen(3000, () => console.log('Listening 3000'));