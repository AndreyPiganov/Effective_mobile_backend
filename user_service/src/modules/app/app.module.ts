import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from '../../config/winston.config';
import configuration from '../../config/configuration';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { LoggingInterceptor } from '../../common/interceptors/LogginInterceptor';
import { DatabaseModule } from '../database/database.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        DatabaseModule,
        UserModule,
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration]
        }),
        WinstonModule.forRoot({
            transports: winstonConfig.transports,
            format: winstonConfig.format,
            level: winstonConfig.level
        })
    ],
    providers: [Reflector, { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor }]
})
export class AppModule {}
