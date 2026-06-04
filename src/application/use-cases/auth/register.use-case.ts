import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import { RegisterDto } from '../../dtos/auth.dto';
import { SafeUser } from '../../../domain/entities/user.entity';

interface RegisterResult {
  user: SafeUser;
  token: string;
}

/**
 * Caso de uso: Registrar un usuario nuevo.
 * 1. Verificar que el email no exista.
 * 2. Hashear la contraseña con bcrypt (salt ≥ 10).
 * 3. Crear el usuario en BD.
 * 4. Generar JWT con { id, email, role }.
 */
export class RegisterUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: RegisterDto): Promise<RegisterResult> {
    // Verificar email duplicado
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictError('A user with this email already exists.');
    }

    // Hashear contraseña
    const password_hash = await bcrypt.hash(dto.password, 12);

    // Crear usuario
    const user = await this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password_hash,
      role: dto.role || 'user',
      profile_type: dto.profile_type,
    });

    // Generar JWT
    const token = this.generateToken(user);

    return { user, token };
  }

  private generateToken(user: SafeUser): string {
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
 * Error personalizado para conflictos (email duplicado, etc.)
 */
export class ConflictError extends Error {
  public readonly statusCode = 409;
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}
