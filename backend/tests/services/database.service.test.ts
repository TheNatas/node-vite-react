import { dbService } from '../../src/services/database.service';
import { DatabaseError } from '../../src/types/errors';

describe('DatabaseService', () => {
  describe('connection', () => {
    it('should connect to database successfully', async () => {
      expect(dbService.isConnected()).toBe(true);
    });

    it('should handle multiple connect calls', async () => {
      await dbService.connect();
      await dbService.connect();
      expect(dbService.isConnected()).toBe(true);
    });
  });

  describe('basic operations', () => {
    it('should put and get a value', async () => {
      await dbService.put('test-key', 'test-value');
      const value = await dbService.get('test-key');
      expect(value).toBe('test-value');
    });

    it('should return null for non-existent key', async () => {
      const value = await dbService.get('non-existent');
      expect(value).toBeNull();
    });

    it('should delete a value', async () => {
      await dbService.put('test-key', 'test-value');
      await dbService.del('test-key');
      const value = await dbService.get('test-key');
      expect(value).toBeNull();
    });

    it('should handle deleting non-existent key', async () => {
      await expect(dbService.del('non-existent')).resolves.not.toThrow();
    });
  });

  describe('batch operations', () => {
    beforeEach(async () => {
      await dbService.put('prefix:1', 'value1');
      await dbService.put('prefix:2', 'value2');
      await dbService.put('other:1', 'value3');
    });

    it('should get all entries', async () => {
      const entries = await dbService.getAll();
      expect(entries.length).toBeGreaterThanOrEqual(3);
    });

    it('should get entries by prefix', async () => {
      const entries = await dbService.getAll('prefix:');
      expect(entries).toHaveLength(2);
      expect(entries[0].key).toContain('prefix:');
    });

    it('should clear entries by prefix', async () => {
      await dbService.clear('prefix:');
      const allEntries = await dbService.getAll();
      const prefixEntries = allEntries.filter((e) => e.key.startsWith('prefix:'));
      expect(prefixEntries).toHaveLength(0);
    });
  });

  describe('error handling', () => {
    it('should throw DatabaseError when database is not initialized', async () => {
      const newDbService = Object.create(
        Object.getPrototypeOf(dbService),
        Object.getOwnPropertyDescriptors(dbService)
      );
      // Force db to be null
      (newDbService as any).db = null;

      expect(() => newDbService.getDb()).toThrow(DatabaseError);
    });
  });
});
