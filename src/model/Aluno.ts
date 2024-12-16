export class Aluno{
    public uid: string;
    public curso: string;
    public nome: string;
    public urlFoto: string;
    constructor(uid: string, curso: string, nome: string, urlFoto: string){
        this.uid = uid;
        this.nome = nome;
        this.curso = curso;
        this.urlFoto = urlFoto;
    }
}
