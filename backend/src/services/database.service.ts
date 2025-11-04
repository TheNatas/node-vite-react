import { Level } from 'level';
import path from 'path';
import { DatabaseError } from '../types/errors';

export class DatabaseService {
  private static instance: DatabaseService;
  private db: Level<string, string> | null = null;
  private dbPath: string;

  private constructor() {
    this.dbPath = process.env.DB_PATH || './data/leveldb';
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async connect(): Promise<void> {
    try {
      if (this.db) {
        return;
      }

      const absolutePath = path.resolve(this.dbPath);
      this.db = new Level<string, string>(absolutePath, { valueEncoding: 'json' });
      await this.db.open();
      console.log(`📦 LevelDB connected at: ${absolutePath}`);
    } catch (error) {
      console.error('Failed to connect to LevelDB:', error);
      throw new DatabaseError('Failed to connect to database');
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.db) {
        await this.db.close();
        this.db = null;
        console.log('📦 LevelDB disconnected');
      }
    } catch (error) {
      console.error('Failed to disconnect from LevelDB:', error);
      throw new DatabaseError('Failed to disconnect from database');
    }
  }

  public getDb(): Level<string, string> {
    if (!this.db) {
      throw new DatabaseError('Database not initialized. Call connect() first.');
    }
    return this.db;
  }

  public async get(key: string): Promise<string | null> {
    try {
      const db = this.getDb();
      const value = await db.get(key);
      return value;
    } catch (error: any) {
      if (error.code === 'LEVEL_NOT_FOUND') {
        return null;
      }
      throw new DatabaseError(`Failed to get key: ${key}`);
    }
  }

  public async put(key: string, value: string): Promise<void> {
    try {
      const db = this.getDb();
      await db.put(key, value);
    } catch (error) {
      throw new DatabaseError(`Failed to put key: ${key}`);
    }
  }

  public async del(key: string): Promise<void> {
    try {
      const db = this.getDb();
      await db.del(key);
    } catch (error: any) {
      if (error.code === 'LEVEL_NOT_FOUND') {
        return;
      }
      throw new DatabaseError(`Failed to delete key: ${key}`);
    }
  }

  public async getAll(prefix?: string): Promise<Array<{ key: string; value: string }>> {
    try {
      const db = this.getDb();
      const results: Array<{ key: string; value: string }> = [];

      for await (const [key, value] of db.iterator()) {
        if (!prefix || key.startsWith(prefix)) {
          results.push({ key, value });
        }
      }

      return results;
    } catch (error) {
      throw new DatabaseError('Failed to get all entries');
    }
  }

  public async clear(prefix?: string): Promise<void> {
    try {
      const db = this.getDb();
      
      if (prefix) {
        for await (const key of db.keys()) {
          if (key.startsWith(prefix)) {
            await db.del(key);
          }
        }
      } else {
        await db.clear();
      }
    } catch (error) {
      throw new DatabaseError('Failed to clear database');
    }
  }

  public isConnected(): boolean {
    return this.db !== null;
  }
}

export const dbService = DatabaseService.getInstance();
