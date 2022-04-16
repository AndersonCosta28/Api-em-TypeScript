"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_repository_1 = require("./classes/user.repository");
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
dotenv.config({ path: __dirname + "/.env" });
const conexao = {
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
};
const banco = new user_repository_1.PostgreSQL(conexao);
app.get('/usuario', (request, response) => {
    banco.findAll().then(result => {
        return response.send(result);
    }).catch(e => response.send('Erro ao encontrar todos os usuários: \n' + e));
});
app.get('/usuario/:id', (request, response) => {
    const id = Number(request.params.id);
    if (!id)
        return response.send('ID inválido');
    banco.findOne(id).then(result => {
        return response.send(result);
    }).catch(e => response.send('Erro ao encontrar o usuário pelo ID: \n' + e.message));
});
app.post('/usuario', (request, response) => {
    const user = request.body;
    banco.save(user).then(result => {
        if (result)
            return response.send({ message: `Usuário salvo com sucesso`, });
        else
            return response.send({ message: 'Não foi possível inserir usuário' });
    }).catch(e => response.send('Erro ao salvar salvar o usuário. \n ' + e));
});
app.delete('/usuario/:id', (request, response) => {
    const id = Number(request.params.id);
    if (!id)
        return response.send('ID inválido');
    banco.delete(id).then(result => {
        return response.send(result);
    }).catch(e => response.send('Erro ao deletar o usuário: \n' + e.message));
});
app.put('/usuario/:id', (request, response) => {
    const id = Number(request.params.id);
    if (!id)
        return response.send('ID inválido');
    const user = request.body;
    banco.update(id, user).then(result => {
        if (result)
            return response.send({ message: `Usuário atualizado com sucesso`, });
        else
            return response.send({ message: 'Não foi possível atualizar usuário' });
    }).catch(e => response.send('Erro ao atualizar salvar o usuário \n' + e));
});
app.listen(3000, () => console.log('Listening 3000'));
//# sourceMappingURL=index.js.map