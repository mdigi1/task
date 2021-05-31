import { HttpService, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Model, ObjectId } from 'mongoose';
import { ACCESS_TOKEN, API_URL } from 'src/changed-files/changed-files.constants';
import { ChangedFilesModule } from './changed-files.module';
import { ChangedFiles } from './entities/changed-files.entity';

@Injectable()
export class ChangedFilesService {
	constructor(
		@InjectModel(ChangedFiles.name) private readonly changedFilesModel: Model<ChangedFiles>,
		private readonly httpServise: HttpService) { }


	async saveChangedFiles(cuttedLink: string) {
		const final_result: number[] = await this.linkHandler(cuttedLink);
		const changed_files = new this.changedFilesModel({ files: [...final_result] });
		await changed_files.save();
		return changed_files._id;
	}

	async updateChangedFiles(id, cuttedLink: string): Promise<ChangedFiles> {
		const final_result: number[] = await this.linkHandler(cuttedLink);
		const existing_repository = await this.changedFilesModel.findByIdAndUpdate(id.changed_files, [...final_result]).exec();
		return existing_repository;
	}


	async linkHandler(cuttedLink: string): Promise<number[]> {
		let allResponses = [];
		for (let i = 1; ; i++) {
			let response = (await this.httpServise.get(API_URL.repos +
				`/${cuttedLink}` +
				"/pulls?per_page=50&page=" +
				i + "&" + ACCESS_TOKEN.token).toPromise())
			if (response.data.length == 0) {
				break;
			}
			allResponses.push(response);
		}

		let arrOfAllPullsSeparated = [];
		for (let i = 0; i < allResponses.length; i++) {
			let res = allResponses[i].data;
			arrOfAllPullsSeparated.push(res);
		}

		let mergerArrOfPulls = [].concat.apply([], arrOfAllPullsSeparated);



		//get all opened PR
		let prLinks = [];
		for (let i = 0; i < mergerArrOfPulls.length; i++) {
			prLinks.push(mergerArrOfPulls[i].url);
		}

		let prLinksWithCommits = [];
		for (let j = 0; j < prLinks.length; j++) {
			let res = await this.httpServise.get(prLinks[j] + "?" + ACCESS_TOKEN.token).toPromise();
			if (res.data.commits > 1) {
				prLinksWithCommits.push(res.data._links.commits.href);

			}
		}

		let parsedCommits: number[] = await this.parseCommits(prLinksWithCommits);
		return parsedCommits;

	}

	async parseCommits(arr: number[]): Promise<number[]> {
		let result = [];


		for (let i = 0; i < arr.length; i++) {
			let pullLink = arr[i];
			let res = await this.httpServise.get(arr[i] + "?" + ACCESS_TOKEN.token).toPromise();
			const { ...data } = res.data;
			let files: number[] = await this.perserFileNames(data, pullLink);
			result.push(files)
		}
		return result;
	}

	async perserFileNames(obj: Object, link): Promise<number[]> {
		let filenames = [];
		for (let key in obj) {
			let responseFiles = await this.httpServise.get(obj[key].url + "?" + ACCESS_TOKEN.token).toPromise();
			for (let m = 0; m < responseFiles.data.files.length; m++) {
				filenames.push(responseFiles.data.files[m].filename);
			}
		}
		let counter = await this.counterFunction(filenames);
		counter.push(link)
		return counter;
	}

	async counterFunction(arr: Array<number>): Promise<number[]> {
		let arrOfResult = [];
		let result = await arr.reduce((data, curr) => {
			data[curr] = data[curr] ? ++data[curr] : 1;
			return data;
		}, {});

		Object.entries(result).forEach(([val, numTimes]) => {
			if (numTimes > 1) {
				arrOfResult.push({
					file_name: val,
					count: numTimes,
				})
			}

		});
		return arrOfResult;
	}

	async delete(id): Promise<ChangedFiles> {
		return this.changedFilesModel.findByIdAndDelete(id._id);
	}
}

