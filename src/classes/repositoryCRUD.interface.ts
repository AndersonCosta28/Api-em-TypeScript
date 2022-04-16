import Usuario from "./usuario.entity";

export default interface RepositoryCRUD {
    save(obj: Usuario): Promise<Boolean>;
    update(id: Number, obj: Usuario): Promise<Boolean>;
    delete(id: Number): Promise<Boolean | String>;
    findOne(id: Number): Promise<any>;
    findAll(): Promise<Array<any>>;
}