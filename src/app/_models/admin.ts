export class Admin {
  constructor(
    id:bigint,login: string, password: string,role:string[]) {
    this.login = login;
    this.password = password;
    this.role = role;
    this.id = id;
  }

  id:bigint;
  login:string;
  password:string;
  role:string[];
}
