import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsDate, IsOptional, IsString } from 'class-validator'

export class SaveRepoDto {
	@ApiProperty({ description: 'link to the repository' })
	@IsString({ each: true })
	@IsArray()
	@Transform(({ value }) => (Array.isArray(value) ? value : [value]))
	link: string[];

	@IsOptional({ each: true })
	sha: string[];

	@IsOptional({ each: true })
	node_id: string[];

	@IsOptional()
	open_issues_count: string;

	@IsOptional()
	subscribers_count: string;

	@IsOptional()
	open_pr: string;

	@IsOptional()
	closed_pr: string;

	@IsOptional()
	@IsDate()
	updatedAt: Date;

	@IsOptional()
	changed_files: {
		file_name: string,
		count: number
	};


}
