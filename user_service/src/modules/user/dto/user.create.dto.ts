import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GenderEnum } from './enums/gender.enums';

export class UserCreateDto {
    @ApiProperty({
        description: 'Имя пользователя',
        example: 'Иван'
    })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({
        description: 'Фамилия пользователя',
        example: 'Иванов'
    })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({
        description: 'Возраст пользователя',
        example: 25,
        minimum: 0
    })
    @IsInt()
    @IsNotEmpty()
    age: number;

    @ApiProperty({
        description: 'Пол пользователя',
        enum: GenderEnum,
        example: GenderEnum.MALE
    })
    @IsEnum(GenderEnum, { message: 'Пол должен быть одним из: MALE, FEMALE' })
    gender: GenderEnum;

    @ApiProperty({
        description: 'Есть ли проблемы у пользователя',
        example: true
    })
    @IsBoolean()
    hasIssues: boolean;
}
