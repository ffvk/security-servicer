import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserEntity } from './dto/User-Entity';
import axios from 'axios';

@Injectable()
export class UsersService {
  // Mock user validation
  async findByTokenAndRealm(token: string, realm: string): Promise<UserEntity | null> {
    if (token === 'a' && realm === 'b') {
      const user: UserEntity = {
        username: 'mockuser',
        email: 'mammen.mathew@singularisfuture.com', // email to use for login
        password: 'Mammen@123',
        realm: 'mec',
        token: token,
      };

      // Call login API
      try {
        const response = await axios.post(
          'https://devapi.singulariswow.com/auth/tokens/login',
          {
            email: user.email,
            password: user.password, // use your password
          },

        );

        // Attach login result to user object
        return {
          ...user,
          redirecUrl: "https://dev.singulariswow.com/learner/dashboard",
          loginData: response.data, // contains token or other response
        };
      } catch (err) {
        throw new HttpException(
          `Login API failed: ${err.response?.data || err.message}`,
          HttpStatus.BAD_GATEWAY,
        );
      }
    }

    return null;
  }
}
