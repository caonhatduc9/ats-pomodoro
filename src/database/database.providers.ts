import { DataSource } from "typeorm";

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => {
            const dataSource = new DataSource({
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: 'root',
                password: '',
                database: 'ats_pomodoro',
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                migrations: [
                    "src/migrations/*.ts",
                    "dist/migrations/*{.ts,.js}"
                ],
                synchronize: true,
            })
            return dataSource.initialize();
        }
    }

]