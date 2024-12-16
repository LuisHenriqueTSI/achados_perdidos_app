export class Empresa {
  public uid: string;
  public nome: string;
  public tecnologias: string;
  public endereco: string;
  public latitude: number;
  public longitude: number;
  public urlFoto: string;
  constructor(
    uid: string,
    nome: string,
    tecnologias: string,
    endereco: string,
    latitude: number,
    longitude: number,
    urlFoto: string,
  ) {
    this.uid = uid;
    this.nome = nome;
    this.tecnologias = tecnologias;
    this.endereco = endereco;
    this.latitude = latitude;
    this.longitude = longitude;
    this.urlFoto = urlFoto;
  }
}
