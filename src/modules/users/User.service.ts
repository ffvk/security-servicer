import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { Pool } from 'pg';
import { UserEntity } from './dto/User-Entity';
import pool from 'src/config/utils/pool.utils';
import { DASHBOARD_URL, LOGIN_API_URL } from 'src/config/config/config';


@Injectable()
export class UsersService {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

async findByTokenAndRealm(token: string, realm: string): Promise<UserEntity | null> {
  const client = await this.pool.connect();
  try {
    let sql = `
      SELECT ue.username, ue.email, r.name AS realm
      FROM identity.user_entity ue
      INNER JOIN identity.user_attribute ua ON ue.id = ua.user_id
      INNER JOIN identity.realm r ON r.id = ue.realm_id
      WHERE ua.name = 'token' AND ua.value = $1
    `;
    const params: any[] = [token];

    if (realm) {
      sql += ` AND r.name = $2`;
      params.push(realm);
    }

    const { rows } = await client.query(sql, params);

    if (rows.length === 0) {
      throw new HttpException('User not found for given token and realm', HttpStatus.NOT_FOUND);
    }

    const dbUser = rows[0];

    const user: UserEntity = {
      username: dbUser.username,
      email: dbUser.email,
      realm: dbUser.realm,
      token: token,
    };

    // 🔐 Call external login API
    const response = await axios.post(
      LOGIN_API_URL,
      {
        email: user.email,
        password: user.token,
      },
    );

    // ✅ Return combined data
    return {
      ...user,
      redirecUrl: DASHBOARD_URL,
      loginData: response.data,
    };
  } catch (err: any) {
    if (err instanceof HttpException) throw err;

    const errorMessage =
      err.response?.data
        ? JSON.stringify(err.response.data)
        : err.message;


    throw new HttpException(
      `Error: ${errorMessage}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  } finally {
    client.release();
  }
}

}
