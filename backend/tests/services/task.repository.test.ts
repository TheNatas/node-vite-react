import { taskRepository } from '../../src/services/task.repository';
import { CreateTaskDTO, UpdateTaskDTO, TaskFilter } from '../../src/types/task.types';
import { NotFoundError } from '../../src/types/errors';

describe('TaskRepository', () => {
  describe('create', () => {
    it('should create a task successfully', async () => {
      const data: CreateTaskDTO = {
        title: 'Test Task',
        description: 'Test Description',
      };

      const task = await taskRepository.create(data);

      expect(task).toMatchObject({
        title: data.title,
        description: data.description,
        completed: false,
      });
      expect(task.id).toBeDefined();
      expect(task.createdAt).toBeDefined();
      expect(task.updatedAt).toBeDefined();
    });

    it('should create a task with userId', async () => {
      const data: CreateTaskDTO = {
        title: 'Test Task',
        description: 'Test Description',
        userId: 'user123',
      };

      const task = await taskRepository.create(data);
      expect(task.userId).toBe('user123');
    });
  });

  describe('findById', () => {
    it('should find a task by id', async () => {
      const created = await taskRepository.create({
        title: 'Test Task',
        description: 'Test Description',
      });

      const found = await taskRepository.findById(created.id);
      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
      expect(found?.title).toBe(created.title);
      expect(found?.description).toBe(created.description);
    });

    it('should return null for non-existent id', async () => {
      const found = await taskRepository.findById('non-existent-id');
      expect(found).toBeNull();
    });
  });

  describe('findAll', () => {
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
        title: 'Task 3',
        description: 'Description 3',
      });

      await taskRepository.update(task3.id, { completed: true });
    });

    it('should return all tasks', async () => {
      const tasks = await taskRepository.findAll();
      expect(tasks.length).toBe(3);
    });

    it('should filter by pending tasks', async () => {
      const tasks = await taskRepository.findAll({ filter: TaskFilter.PENDING });
      expect(tasks.length).toBe(2);
      expect(tasks.every((t) => !t.completed)).toBe(true);
    });

    it('should filter by completed tasks', async () => {
      const tasks = await taskRepository.findAll({ filter: TaskFilter.COMPLETED });
      expect(tasks.length).toBe(1);
      expect(tasks.every((t) => t.completed)).toBe(true);
    });

    it('should search by title', async () => {
      const tasks = await taskRepository.findAll({ search: 'Task 1' });
      expect(tasks.length).toBe(1);
      expect(tasks[0].title).toBe('Task 1');
    });

    it('should search by description', async () => {
      const tasks = await taskRepository.findAll({ search: 'Description 2' });
      expect(tasks.length).toBe(1);
      expect(tasks[0].description).toBe('Description 2');
    });

    it('should search case-insensitively', async () => {
      const tasks = await taskRepository.findAll({ search: 'task 1' });
      expect(tasks.length).toBe(1);
    });

    it('should filter by userId', async () => {
      await taskRepository.create({
        title: 'User Task',
        description: 'Description',
        userId: 'user123',
      });

      const tasks = await taskRepository.findAll({ userId: 'user123' });
      expect(tasks.length).toBe(1);
      expect(tasks[0].userId).toBe('user123');
    });
  });

  describe('update', () => {
    it('should update task title', async () => {
      const created = await taskRepository.create({
        title: 'Original Title',
        description: 'Description',
      });

      // Small delay to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      const updateData: UpdateTaskDTO = { title: 'Updated Title' };
      const updated = await taskRepository.update(created.id, updateData);

      expect(updated.title).toBe('Updated Title');
      expect(updated.description).toBe('Description');
      expect(new Date(updated.updatedAt).getTime()).toBeGreaterThan(
        new Date(created.updatedAt).getTime()
      );
    });

    it('should update task completion status', async () => {
      const created = await taskRepository.create({
        title: 'Task',
        description: 'Description',
      });

      const updated = await taskRepository.update(created.id, { completed: true });
      expect(updated.completed).toBe(true);
    });

    it('should throw NotFoundError for non-existent task', async () => {
      await expect(
        taskRepository.update('non-existent', { title: 'New Title' })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      const created = await taskRepository.create({
        title: 'Task to Delete',
        description: 'Description',
      });

      await taskRepository.delete(created.id);
      const found = await taskRepository.findById(created.id);
      expect(found).toBeNull();
    });

    it('should throw NotFoundError for non-existent task', async () => {
      await expect(taskRepository.delete('non-existent')).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteAll', () => {
    it('should delete all tasks', async () => {
      await taskRepository.create({ title: 'Task 1', description: 'Desc 1' });
      await taskRepository.create({ title: 'Task 2', description: 'Desc 2' });

      await taskRepository.deleteAll();
      const tasks = await taskRepository.findAll();
      expect(tasks.length).toBe(0);
    });
  });

  describe('count', () => {
    beforeEach(async () => {
      await taskRepository.create({ title: 'Task 1', description: 'Desc 1' });
      await taskRepository.create({ title: 'Task 2', description: 'Desc 2' });
      const task3 = await taskRepository.create({ title: 'Task 3', description: 'Desc 3' });
      await taskRepository.update(task3.id, { completed: true });
    });

    it('should count all tasks', async () => {
      const count = await taskRepository.count();
      expect(count).toBe(3);
    });

    it('should count pending tasks', async () => {
      const count = await taskRepository.count({ filter: TaskFilter.PENDING });
      expect(count).toBe(2);
    });

    it('should count completed tasks', async () => {
      const count = await taskRepository.count({ filter: TaskFilter.COMPLETED });
      expect(count).toBe(1);
    });
  });
});
