import { Inject, Injectable, LoggerService, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { User } from '@prisma/client';
import { UserCreateDto } from './dto/user.create.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { SuccessResponse } from 'src/common/response/succes.response';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: DatabaseService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
    ) {}

    async getAllUsers(page: number = 1, itemsPerPage: number = 5): Promise<User[]> {
        try {
            const offset = (page - 1) * itemsPerPage;
            const users = await this.prisma.user.findMany({ skip: offset, take: itemsPerPage });
            this.logger.log('Successfully fetched all users');
            return users;
        } catch (e) {
            this.logger.error('Error get all users:', e);
            throw new Error('Could not get users');
        }
    }

    async getUserById(id: number): Promise<User> {
        try {
            const user = await this.prisma.user.findFirst({
                where: { id }
            });
            if (!user) {
                this.logger.warn(`User with ID ${id} not found`);
                throw new NotFoundException(`По данному id ${id} не найдено остатка`);
            }
            this.logger.log('Fetched user by id success');
            return user;
        } catch (e) {
            this.logger.error('Error get user by id:', e);
            throw e;
        }
    }

    async createUser(dto: UserCreateDto): Promise<User> {
        try {
            const user = await this.prisma.user.create({
                data: {
                    ...dto
                }
            });
            this.logger.log('Create user success');
            return user;
        } catch (e) {
            this.logger.error('Error create user:', e);
            throw new Error('Could not create user');
        }
    }

    async updateUser(id: number, dto: UserUpdateDto): Promise<User> {
        try {
            const user = await this.prisma.user.findFirst({ where: { id } });
            if (!user) {
                this.logger.warn(`User with ID ${id} not found`);
                throw new NotFoundException('С данным id не найдено пользователя');
            }

            const updateUser = await this.prisma.user.update({
                where: { id },
                data: { ...dto }
            });
            this.logger.log('Updated user success');
            return updateUser;
        } catch (e) {
            this.logger.error('Error update user:', e);
            throw e;
        }
    }

    async deleteUser(id: number): Promise<SuccessResponse> {
        try {
            const user = await this.prisma.user.findUnique({ where: { id } });
            if (!user) {
                this.logger.warn(`User with ID ${id} not found`);
                throw new NotFoundException(`Пользователя по данному id ${id} не найдено`);
            }
            await this.prisma.user.delete({
                where: { id }
            });
            this.logger.log('User delete success');

            return { success: true };
        } catch (e) {
            this.logger.error('Error delete user:', e);
            throw e;
        }
    }

    async resolveUserIssues(): Promise<number> {
        const count = await this.prisma.user.count({
            where: { hasIssues: true }
        });
        if (count === 0) {
            this.logger.warn(`User count = 0`);
            throw new NotFoundException(`Количество пользователей ${count}, создайте хотя бы одного :)`);
        }
        await this.prisma.user.updateMany({
            where: { hasIssues: true },
            data: { hasIssues: false }
        });

        return count;
    }
}
