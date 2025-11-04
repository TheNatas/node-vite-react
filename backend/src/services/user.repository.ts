import { Level } from 'level';
import { User } from '../types/user.types';

export class UserRepository {
  constructor(private db: Level<string, string>) {}

  async create(user: User): Promise<User> {
    await this.db.put(`user:${user.id}`, JSON.stringify(user));
    await this.db.put(`user:email:${user.email}`, user.id);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    try {
      const data = await this.db.get(`user:${id}`);
      return JSON.parse(data);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'notFound' in error) {
        return null;
      }
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const userId = await this.db.get(`user:email:${email}`);
      return await this.findById(userId);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'notFound' in error) {
        return null;
      }
      throw error;
    }
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error('User not found');
    }

    const updated: User = {
      ...existing,
      ...user,
      id,
      updatedAt: new Date().toISOString(),
    };

    await this.db.put(`user:${id}`, JSON.stringify(updated));
    return updated;
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    if (user) {
      await this.db.del(`user:${id}`);
      await this.db.del(`user:email:${user.email}`);
    }
  }

  async emailExists(email: string): Promise<boolean> {
    try {
      await this.db.get(`user:email:${email}`);
      return true;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'notFound' in error) {
        return false;
      }
      throw error;
    }
  }
}
