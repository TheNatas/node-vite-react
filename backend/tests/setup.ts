import { dbService } from '../src/services/database.service';

// Setup test environment
process.env.NODE_ENV = 'test';
process.env.DB_PATH = './data/test-leveldb';

beforeAll(async () => {
  await dbService.connect();
});

afterAll(async () => {
  await dbService.disconnect();
});

// Clear database before each test
beforeEach(async () => {
  await dbService.clear();
});
