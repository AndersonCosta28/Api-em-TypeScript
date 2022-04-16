import { query } from 'express';
import { Pool, Client, QueryConfig } from 'pg';
import Usuario from './usuario.entity';
import RepositoryCRUD from './repositoryCRUD.interface';

type Query = {
    text: string,
    values: [];
}

export default class PostgreRepository implements RepositoryCRUD {
    pool: Pool;
    client: Client;
    query?: Query | string | any;

    constructor(private connection: Object) {
        this.pool = new Pool(connection);
        this.client = new Client(connection);

        this.client.connect();
        this.CriarTabelas()
    }

    async executar(): Promise<any> {
        try {
            const resultado = await this.client.query(this.query);
            return resultado
        }
        catch (e) {
            console.error(e)
            throw new Error('Erro ao executar: \n' + e)
        }
    }

    async executarERetornaBoolean(): Promise<Boolean> {
        try {
            const result = await this.executar()
            if (result.rowCount > 0)
                return true
            else
                return false
        } catch (error) {
            throw error;
        }
    }

    async save(obj: Usuario): Promise<Boolean> {
        this.query = {
            text: 'INSERT INTO Usuario (nome,idade) VALUES ($1, $2)',
            values: [obj.nome, obj.idade]
        }
        return await this.executarERetornaBoolean();
    };

    async update(id: Number, obj: Usuario): Promise<Boolean> {
        const ExisteUsuario = await this.findRowCountByID(id);
        if (!ExisteUsuario) throw new Error('Não foi possível encontrar o usuário')

        this.query = {
            text: 'UPDATE Usuario set nome = $1,idade = $2 WHERE id = $3',
            values: [obj.nome, obj.idade, id]
        }
        return await this.executarERetornaBoolean();
    };

    async delete(id: Number): Promise<Boolean | String> {
        const ExisteUsuario = await this.findRowCountByID(id);
        if (!ExisteUsuario) throw new Error('Não foi possível encontrar o usuário')

        this.query = {
            text: 'DELETE FROM Usuario WHERE id = $1',
            values: [id]
        }
        return await this.executarERetornaBoolean();
    };

    async findOne(id: Number): Promise<Usuario> {
        this.query = {
            text: "SELECT * FROM Usuario WHERE id = $1",
            values: [id]
        }
        const result = await this.executar();
        if (!result.rowCount) throw new Error('Não foi possível encontrar o usuário');

        return result.rows;
    };

    async findAll(): Promise<Array<Usuario>> {
        this.query = {
            text: 'SELECT * FROM Usuario'
        }
        const result = await this.executar();
        return result.rows;
    };

    async findRowCountByID(id: Number): Promise<Number> {
        this.query = {
            text: "SELECT * FROM Usuario WHERE id = $1",
            values: [id]
        }
        const result = await this.executar();
        return result.rowCount;
    }

    async UsuarioFoiEncontrado(id: Number) {
        const ExisteUsuario = await this.findRowCountByID(id);
        if (!ExisteUsuario) throw new Error('Não foi possível encontrar o usuário')
    }

    async CriarTabelas() {
        await this.client.query('CREATE TABLE IF NOT EXISTS Usuario(	id SERIAL PRIMARY KEY,	nome VARCHAR(255) NOT NULL,	idade NUMERIC(3,0) NOT NULL);', (error, res) => {
            if (error) console.log(error)
            console.log(res)
        })
    }
}