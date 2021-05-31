import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChangedFilesModule } from 'src/changed-files/changed-files.module';
import { ChangedFilesService } from 'src/changed-files/changed-files.service';
// import { Commits, CommitsSchema } from './entities/commits.entity';
import { Repo, RepoSchema } from './entities/repo.entity';
import { RepoController } from './repo.controller';
import { RepoService } from './repo.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Repo.name,
        schema: RepoSchema
      }
    ]),
    HttpModule,
    ChangedFilesModule
  ],
  controllers: [RepoController],
  providers: [RepoService]
})
export class RepoModule { }
