import { Injectable, NotFoundException, HttpService, ConflictException, InternalServerErrorException, HttpException, HttpStatus, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChangedFilesService } from 'src/changed-files/changed-files.service';
import { SaveRepoDto } from './dto/save-repo.dto';
import { UpdateRepoDto } from './dto/update-repo.dto';
//import { Commits } from './entities/commits.entity';
import { Repo } from './entities/repo.entity';
import { API_URL, issues } from '../changed-files/changed-files.constants';



@Injectable()
export class RepoService {
	constructor(
		@InjectModel(Repo.name) private readonly repoModel: Model<Repo>,
		private readonly httpServise: HttpService,
		private readonly changedFilesService: ChangedFilesService) { }


	async findAll(count = 10, offset = 0): Promise<Repo[]> {
		try {
			const repos = await this.repoModel.find().skip(offset).limit(count)
			return repos;
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.I_AM_A_TEAPOT);
		}
	}

	async findOne(id: string): Promise<Repo> {
		try {
			const repo = await this.repoModel.findOne({ _id: id }).populate('changed_files').exec();
			if (!repo) {
				throw new NotFoundException(`repo with #${id} not found`);
			}
			return repo;
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.NOT_FOUND);
		}
	}

	// save repository exist and other information 
	async saveRepo(saveRepoDto: SaveRepoDto): Promise<string> {
		const link = await this.repoModel.findOne({ link: saveRepoDto.link }).exec();
		const cuttedLink = JSON.stringify(saveRepoDto.link).slice(21, -2);
		if (link == null) {
			const repo = new this.repoModel(saveRepoDto);
			repo.changed_files = await this.changedFilesService.saveChangedFiles(cuttedLink);
			await repo.save();
			return `repository ${repo.link} is successfully added to DB. id: ${repo._id}`
		} else {
			const filter = { changed_files: link.changed_files }
			const updated = await this.changedFilesService.updateChangedFiles(filter, cuttedLink);
			return `repository is refetched. id: ${updated.id}`
		}
	}

	// add comment
	async updateRepo(id: string, updateRepoDto: UpdateRepoDto): Promise<Repo> {
		try {
			const existingRepo = await this.repoModel
				.findOneAndUpdate({ _id: id }, { $set: updateRepoDto }, { new: true })
				.exec();
			if (!existingRepo) {
				throw new NotFoundException(`repo with #${id} not found`);
			}
			return existingRepo;
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.NOT_FOUND);
		}
	}

	async removeRepo(id: string): Promise<Repo> {
		try {
			const deletedRepo = await this.repoModel.findByIdAndRemove(id);
			await this.changedFilesService.delete({ _id: deletedRepo.changed_files });
			if (!deletedRepo) {
				throw new NotFoundException(`repo with #${id} not found`)
			}
			return deletedRepo.id;

		} catch (e) {
			throw new HttpException(e.message, HttpStatus.NOT_FOUND);
		}
	}
}

