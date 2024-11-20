import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Inject,
    LoggerService,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseInterceptors
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UserService } from './user.service';
import { LoggingInterceptor } from 'src/common/interceptors/LogginInterceptor';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { UserCreateDto } from './dto/user.create.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { QueryUser } from './dto/query.user';

@ApiTags('Users')
@Controller('/users')
@UseInterceptors(LoggingInterceptor)
export class UserController {
    constructor(
        private readonly userService: UserService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
    ) {}

    @Get('/')
    @ApiOperation({ summary: 'Получить всех пользователей' })
    @ApiResponse({ status: 200, description: 'Список пользователей успешно получен' })
    @ApiQuery({ name: 'page', type: 'number', description: 'Страница пользователей', example: 1, required: false })
    @ApiQuery({
        name: 'itemsPerPage',
        type: 'number',
        description: 'Количество пользователей на странице',
        example: 5,
        required: false
    })
    @ApiResponse({ status: 500, description: 'Ошибка при получении пользователей' })
    getAllUsers(@Query() query: QueryUser) {
        try {
            return this.userService.getAllUsers(query.page, query.itemsPerPage);
        } catch (e) {
            this.logger.error('Error in userController:', e);
            throw new HttpException('Ошибка при получении пользователей', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Получить пользователя по ID' })
    @ApiParam({ name: 'id', description: 'ID пользователя', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Пользователь успешно найден' })
    @ApiResponse({ status: 404, description: 'Пользователь не найден' })
    @ApiResponse({ status: 500, description: 'Ошибка при получении пользователя по ID' })
    getUserById(@Param('id', ParseIntPipe) id: number) {
        try {
            return this.userService.getUserById(id);
        } catch (e) {
            this.logger.error(`Error in userController:`, e);
            throw new HttpException('Ошибка при получении пользователя по ID', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/')
    @ApiOperation({ summary: 'Создать нового пользователя' })
    @ApiResponse({ status: 201, description: 'Пользователь успешно создан' })
    @ApiResponse({ status: 400, description: 'Ошибка валидации данных' })
    @ApiResponse({ status: 500, description: 'Ошибка при создании пользователя' })
    createUser(@Body() dto: UserCreateDto) {
        try {
            return this.userService.createUser(dto);
        } catch (e) {
            this.logger.error(`Error in userController:`, e);
            throw new HttpException('Ошибка при создании пользователя', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put('/resolve-issues')
    @ApiOperation({
        summary: 'Обнулить флаг проблемы и вернуть количество пользователей с проблемами',
        description:
            'Этот эндпоинт обнуляет флаг "isIssues" для всех пользователей и возвращает количество пользователей, у которых ранее было "true".'
    })
    resolveUserIssues() {
        try {
            return this.userService.resolveUserIssues();
        } catch (e) {
            this.logger.error('Error in userController:', e);
            throw new HttpException('Ошибка при обновлении флагов проблем', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put('/:id')
    @ApiOperation({ summary: 'Обновить информацию о пользователе' })
    @ApiParam({ name: 'id', description: 'ID пользователя', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Пользователь успешно обновлён' })
    @ApiResponse({ status: 400, description: 'Ошибка валидации данных' })
    @ApiResponse({ status: 404, description: 'Пользователь не найден' })
    @ApiResponse({ status: 500, description: 'Ошибка при обновлении пользователя' })
    updateUser(@Body() dto: UserUpdateDto, @Param('id', ParseIntPipe) id: number) {
        try {
            return this.userService.updateUser(id, dto);
        } catch (e) {
            this.logger.error('Error in userController:', e);
            throw new HttpException('Ошибка при обновлении пользователя', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Удалить пользователя по ID' })
    @ApiParam({ name: 'id', description: 'ID пользователя', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Пользователь успешно удалён' })
    @ApiResponse({ status: 404, description: 'Пользователь не найден' })
    @ApiResponse({ status: 500, description: 'Ошибка при удалении пользователя' })
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        try {
            return this.userService.deleteUser(id);
        } catch (e) {
            this.logger.error('Error in userController:', e);
            throw new HttpException('Ошибка при удалении пользователя', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
