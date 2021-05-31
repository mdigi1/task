import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChangedFiles, ChangedFilesSchema } from './entities/changed-files.entity';
import { ChangedFilesService } from './changed-files.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: ChangedFiles.name,
				schema: ChangedFilesSchema
			}
		]),
		HttpModule,
	],
	providers: [ChangedFilesService],
	exports: [ChangedFilesService]
})
export class ChangedFilesModule { }
