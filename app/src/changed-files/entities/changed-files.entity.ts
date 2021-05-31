import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import { Document } from 'mongoose'
import * as mongoose from 'mongoose';



@Schema()
export class ChangedFiles extends Document {

	@Prop()
	files: [{
		file_name: String,
		count: number
	}];

	@Prop()
	pullURL: String;




}

export const ChangedFilesSchema = SchemaFactory.createForClass(ChangedFiles);

