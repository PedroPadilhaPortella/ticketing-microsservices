import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';


const scriptAsync = promisify(scrypt);

export class PasswordService {

  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const passwordBuffer = (await scriptAsync(password, salt, 64)) as Buffer;
    return `${passwordBuffer.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, password: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const passwordBuffer = (await scriptAsync(password, salt, 64)) as Buffer;
    return passwordBuffer.toString('hex') === hashedPassword;
  }
}