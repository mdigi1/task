import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator'

export class UpdateRepoDto {

	@ApiProperty({ description: 'commet for the current repo' })
	@IsOptional()
	@IsString()
	comment: string;

}