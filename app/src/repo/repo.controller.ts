import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { SaveRepoDto } from './dto/save-repo.dto';
import { UpdateRepoDto } from './dto/update-repo.dto';
import { Repo } from './entities/repo.entity';
import { RepoService } from './repo.service';

@ApiTags('repo')
@Controller('repo')
export class RepoController {
	constructor(private readonly repoService: RepoService) { }


	@ApiNotFoundResponse()
	@Get(':id')
	findOneRepo(@Param('id') id: string): Promise<Repo> {
		return this.repoService.findOne(id);

	}

	@Get()
	findAllRepos(@Query('count') count: number,
		@Query('offset') offset: number): Promise<Repo[]> {
		return this.repoService.findAll(count, offset);
	}

	@Post()
	saveRepo(@Body() saveRepoDto: SaveRepoDto) {
		return this.repoService.saveRepo(saveRepoDto);
	}

	@Delete(':id')
	removeRepo(@Param('id') id: string): Promise<Repo> {
		return this.repoService.removeRepo(id);
	}

	@Put(':id')
	updateRepo(
		@Param('id') id: string,
		@Body() updateRepoDto: UpdateRepoDto): Promise<Repo> {
		return this.repoService.updateRepo(id, updateRepoDto);
	}
}

