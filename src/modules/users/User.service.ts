import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserEntity } from './dto/User-Entity';
import axios from 'axios';
import { RowDataPacket } from 'mysql2';
import { DatabaseService } from 'src/config/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async findByTokenAndRealm(token: string, realm: string): Promise<UserEntity | null> {
    try {
      // 🔍 Step 1: Query the MySQL database
      const sql = `
        SELECT ue.username, ue.email, ue.password, r.name AS realm
        FROM USER_ENTITY ue
        INNER JOIN USER_ATTRIBUTE ua ON ue.id = ua.user_id
        INNER JOIN REALM r ON r.id = ue.realm_id
        WHERE ua.name = 'token' AND ua.value = ? AND r.name = ?
      `;

      const rows = await this.db.query<RowDataPacket[]>(sql, [token, realm]);
      const users = rows as { username: string; email: string; password: string; realm: string }[];

      if (users.length === 0) {
        throw new HttpException('User not found for given token and realm', HttpStatus.NOT_FOUND);
      }

      const dbUser = users[0];

      const user: UserEntity = {
        username: dbUser.username,
        email: dbUser.email,
        password: dbUser.password, // from DB
        realm: dbUser.realm,
        token: token,
      };

      // 🔐 Step 2: Call login API
      const response = await axios.post(
        'https://devapi.singulariswow.com/auth/tokens/login',
        {
          email: user.email,
          password: user.password,
        },
      );

      // ✅ Step 3: Return combined result
      return {
        ...user,
        redirecUrl: 'https://dev.singulariswow.com/learner/dashboard',
        loginData: response.data,
      };
    } catch (err: any) {
      if (err instanceof HttpException) throw err;

      throw new HttpException(
        `Error: ${err.response?.data || err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
