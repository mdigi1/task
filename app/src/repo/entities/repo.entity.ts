import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator'
import { Document, Types, Schema as MongooseSchema } from 'mongoose'
// import { Commits } from './commits.entity';


@Schema()
export class Repo extends Document {

	@Prop([String])
	link: string[];

	@IsOptional()
	@Prop()
	comment: string;

	@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ChangedFiles' })
	changed_files: Types.ObjectId
	
	@Prop({ type: Date, default: Date.now() })
	createdAt: Date;


}

export const RepoSchema = SchemaFactory.createForClass(Repo);

