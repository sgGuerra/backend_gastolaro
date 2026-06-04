import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import { LoginDto } from '../../dtos/auth.dto';
import { SafeUser } from '../../../domain/entities/user.entity';

interface LoginResult {
  user: SafeUser;
  token: string;
}

/**
 * Caso de uso: Login de usuario.
 * 1. Buscar usuario por email.
 * 2. Comparar contraseña con bcrypt.
 * 3. Generar JWT con { id, email, role }.
 */
export class LoginUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: LoginDto): Promise<LoginResult> {
    // Buscar usuario (incluye password_hash)
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new AuthenticationError('Invalid email or password.');
    }

    // Comparar contraseña
    const isValid = await bcrypt.compare(dto.password, user.password_hash);
    if (!isValid) {
      throw new AuthenticationError('Invalid email or password.');
    }

    // Generar JWT
    const token = this.generateToken(user);

    // Retornar sin password_hash
    const { password_hash: _, ...safeUser } = user;

    return { user: safeUser, token };
  }

  private generateToken(user: { id: string; email: string; role: string }): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any },
    );
  }
}

/**
 * Error personalizado para autenticación fallida.
 */
export class AuthenticationError extends Error {
  public readonly statusCode = 401;
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}
