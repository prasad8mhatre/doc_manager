import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../src/users/users.controller';
import { UsersService } from '../src/users/users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const mockUsersService = {
      findAll: jest.fn(),
      updateRole: jest.fn(),
      deleteUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [{ id: 1, username: 'John Doe', password: 'XXXXXXXX', role: 'user' }];
      jest.spyOn(usersService, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('updateRole', () => {
    it('should update user role successfully', async () => {
      const userId = '1';
      const role = 'admin';
      const result = { id: +userId, role,username: 'John Doe', password: 'XXXXXXXX' };
      jest.spyOn(usersService, 'updateRole').mockResolvedValue(result);

      expect(await controller.updateRole(userId, role)).toEqual(result);
    });

    it('should throw an error when role update fails', async () => {
      const userId = 'non-existent-id';
      const role = 'admin';
      jest.spyOn(usersService, 'updateRole').mockRejectedValue(new Error('User not found'));

      try {
        await controller.updateRole(userId, role);
      } catch (error) {
        expect(error.message).toBe('User not found');
      }
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const userId = '1';
      const result = { id: +userId };
      jest.spyOn(usersService, 'deleteUser').mockResolvedValue(result);

      expect(await controller.deleteUser(userId)).toEqual(result);
    });

    it('should throw an error when user deletion fails', async () => {
      const userId = 'non-existent-id';
      jest.spyOn(usersService, 'deleteUser').mockRejectedValue(new Error('User not found'));

      try {
        await controller.deleteUser(userId);
      } catch (error) {
        expect(error.message).toBe('User not found');
      }
    });
  });
});
