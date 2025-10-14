export class UserEntity {
  username: string;
  email: string;
  realm: string;
  token: string;
  loginData?: any; // optional, will store API response
  password?:string;
   redirecUrl?: string; // 
}
