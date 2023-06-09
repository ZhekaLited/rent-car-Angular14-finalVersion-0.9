export class Users {
  constructor(
    id: bigint, name: string, surname: string, birthday: Date,
    passid: string, balance: number, timearent: string, carsid: bigint,
    namecars: string,model:string,price:bigint,damage:string,deviations:string,
    disbalance:boolean,userid:bigint,status:string) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.birthday = birthday;
    this.passid = passid;
    this.balance = balance;
    this.timearent = timearent;
    this.carsid = carsid;
    this.namecars = namecars;
    this.model = model;
    this.price = price;
    this.damage = damage;
    this.deviations = deviations;
    this.disbalance = disbalance;
    this.userid = userid;
    this.status = status;
  }

  id: bigint;
  name: string;
  surname: string;
  birthday: Date;
  passid: string;
  balance: number;
  timearent: string;
  carsid: bigint;
  namecars:string;
  model:string;
  price:bigint;
  damage:string;
  deviations:string;
  disbalance:boolean;
  userid:bigint;
  status:string;
}
