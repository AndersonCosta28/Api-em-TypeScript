"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgreSQL = void 0;
const pg_1 = require("pg");
class PostgreSQL {
    constructor(connection) {
        this.connection = connection;
        this.pool = new pg_1.Pool(connection);
        this.client = new pg_1.Client(connection);
        this.client.connect();
        // this.CriarTabelas()
    }
    executar() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resultado = yield this.client.query(this.query);
                return resultado;
            }
            catch (e) {
                console.error(e);
                throw new Error('Erro ao executar: \n' + e);
            }
        });
    }
    executarERetornaBoolean() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.executar();
                if (result.rowCount > 0)
                    return true;
                else
                    return false;
            }
            catch (error) {
                throw error;
            }
        });
    }
    save(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            this.query = {
                text: 'INSERT INTO Usuario (nome,idade) VALUES ($1, $2)',
                values: [obj.nome, obj.idade]
            };
            return yield this.executarERetornaBoolean();
        });
    }
    ;
    update(id, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const ExisteUsuario = yield this.findRowCountByID(id);
            if (!ExisteUsuario)
                throw new Error('Não foi possível encontrar o usuário');
            this.query = {
                text: 'UPDATE Usuario set nome = $1,idade = $2 WHERE id = $3',
                values: [obj.nome, obj.idade, id]
            };
            return yield this.executarERetornaBoolean();
        });
    }
    ;
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ExisteUsuario = yield this.findRowCountByID(id);
            if (!ExisteUsuario)
                throw new Error('Não foi possível encontrar o usuário');
            this.query = {
                text: 'DELETE FROM Usuario WHERE id = $1',
                values: [id]
            };
            return yield this.executarERetornaBoolean();
        });
    }
    ;
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.query = {
                text: "SELECT * FROM Usuario WHERE id = $1",
                values: [id]
            };
            const result = yield this.executar();
            if (!result.rowCount)
                throw new Error('Não foi possível encontrar o usuário');
            return result.rows;
        });
    }
    ;
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            this.query = {
                text: 'SELECT * FROM Usuario'
            };
            const result = yield this.executar();
            return result.rows;
        });
    }
    ;
    findRowCountByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.query = {
                text: "SELECT * FROM Usuario WHERE id = $1",
                values: [id]
            };
            const result = yield this.executar();
            return result.rowCount;
        });
    }
    UsuarioFoiEncontrado(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ExisteUsuario = yield this.findRowCountByID(id);
            if (!ExisteUsuario)
                throw new Error('Não foi possível encontrar o usuário');
        });
    }
    CriarTabelas() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.query('CREATE TABLE IF NOT EXISTS Usuario(	id SERIAL PRIMARY KEY,	nome VARCHAR(255),	idade NUMERIC(3,0));', (error, res) => {
                if (error)
                    console.log(error);
                console.log(res);
            });
        });
    }
}
exports.PostgreSQL = PostgreSQL;
//# sourceMappingURL=user.repository.js.map