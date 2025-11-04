import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { UserRepository } from './user.repository';
import { CreateUserDTO, LoginDTO, User, UserResponse, AuthResponse } from '../types/user.types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 10;

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  private userToResponse(user: User): UserResponse {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userResponse } = user;
    return userResponse;
  }

  async register(data: CreateUserDTO): Promise<AuthResponse> {
    // Verificar se o email já existe
    const emailExists = await this.userRepository.emailExists(data.email);
    if (emailExists) {
      throw new Error('Email already registered');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    // Criar usuário
    const user: User = {
      id: randomUUID(),
      email: data.email,
      password: hashedPassword,
      name: data.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.userRepository.create(user);

    // Gerar token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      user: this.userToResponse(user),
      token,
    };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    // Buscar usuário por email
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Gerar token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      user: this.userToResponse(user),
      token,
    };
  }

  async verifyToken(token: string): Promise<{ userId: string; email: string }> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async getUserById(id: string): Promise<UserResponse | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return null;
    }
    return this.userToResponse(user);
  }
}

// Singleton instance creation
import { dbService } from './database.service';

let authServiceInstance: AuthService | null = null;

export const getAuthService = (): AuthService => {
  if (!authServiceInstance) {
    const userRepository = new UserRepository(dbService.getDb());
    authServiceInstance = new AuthService(userRepository);
  }
  return authServiceInstance;
};
