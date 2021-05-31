import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RepoModule } from './repo/repo.module';
import { ChangedFilesModule } from './changed-files/changed-files.module';

@Module({
  imports: [
    RepoModule,
    MongooseModule.forRoot('mongodb://localhost:27017/task-app'),
    ChangedFilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
