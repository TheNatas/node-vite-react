import request from 'supertest';
import { Application } from 'express';
import { createApp } from '../../src/app';
import { taskRepository } from '../../src/services/task.repository';

describe('Task API Integration Tests', () => {
  let app: Application;

  beforeAll(() => {
    app = createApp();
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('API is running');
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Integration Test Task',
        description: 'This is an integration test',
      };

      const response = await request(app).post('/api/tasks').send(taskData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        title: taskData.title,
        description: taskData.description,
        completed: false,
      });
      expect(response.body.data.id).toBeDefined();
    });

    it('should return 400 for invalid task data', async () => {
      const response = await request(app).post('/api/tasks').send({
        title: 'AB', // Too short
        description: 'Valid description',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 for missing title', async () => {
      const response = await request(app).post('/api/tasks').send({
        description: 'Valid description',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      await taskRepository.create({
        title: 'Task 1',
        description: 'Description 1',
      });

      await taskRepository.create({
        title: 'Task 2',
        description: 'Description 2',
      });

      const task3 = await taskRepository.create({
        title: 'Completed Task',
        description: 'Description 3',
      });
      await taskRepository.update(task3.id, { completed: true });
    });

    it('should return all tasks', async () => {
      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.count).toBe(3);
    });

    it('should filter pending tasks', async () => {
      const response = await request(app).get('/api/tasks?filter=pending');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((t: any) => !t.completed)).toBe(true);
    });

    it('should filter completed tasks', async () => {
      const response = await request(app).get('/api/tasks?filter=completed');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].completed).toBe(true);
    });

    it('should search tasks by title', async () => {
      const response = await request(app).get('/api/tasks?search=Task 1');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe('Task 1');
    });

    it('should search tasks by description', async () => {
      const response = await request(app).get('/api/tasks?search=Description 2');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });

    it('should return 400 for invalid filter', async () => {
      const response = await request(app).get('/api/tasks?filter=invalid');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a task by id', async () => {
      const created = await taskRepository.create({
        title: 'Test Task',
        description: 'Test Description',
      });

      const response = await request(app).get(`/api/tasks/${created.id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(created.id);
    });

    it('should return 400 for non-existent task', async () => {
      const response = await request(app).get('/api/tasks/non-existent-id');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      const created = await taskRepository.create({
        title: 'Original Task',
        description: 'Original Description',
      });

      const updateData = {
        title: 'Updated Task',
        completed: true,
      };

      const response = await request(app).put(`/api/tasks/${created.id}`).send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Task');
      expect(response.body.data.completed).toBe(true);
      expect(response.body.data.description).toBe('Original Description');
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app).put('/api/tasks/non-existent-id').send({
        title: 'Updated Task',
      });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid update data', async () => {
      const created = await taskRepository.create({
        title: 'Test Task',
        description: 'Test Description',
      });

      const response = await request(app).put(`/api/tasks/${created.id}`).send({
        title: 'AB', // Too short
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const created = await taskRepository.create({
        title: 'Task to Delete',
        description: 'Description',
      });

      const response = await request(app).delete(`/api/tasks/${created.id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const found = await taskRepository.findById(created.id);
      expect(found).toBeNull();
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app).delete('/api/tasks/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/tasks/stats', () => {
    beforeEach(async () => {
      await taskRepository.create({ title: 'Task 1', description: 'Desc 1' });
      await taskRepository.create({ title: 'Task 2', description: 'Desc 2' });
      const task3 = await taskRepository.create({ title: 'Task 3', description: 'Desc 3' });
      await taskRepository.update(task3.id, { completed: true });
    });

    it('should return task statistics', async () => {
      const response = await request(app).get('/api/tasks/stats');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual({
        total: 3,
        completed: 1,
        pending: 2,
      });
    });
  });

  describe('DELETE /api/tasks', () => {
    beforeEach(async () => {
      await taskRepository.create({ title: 'Task 1', description: 'Desc 1' });
      await taskRepository.create({ title: 'Task 2', description: 'Desc 2' });
    });

    it('should delete all tasks', async () => {
      const response = await request(app).delete('/api/tasks');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const tasks = await taskRepository.findAll();
      expect(tasks).toHaveLength(0);
    });
  });
});
