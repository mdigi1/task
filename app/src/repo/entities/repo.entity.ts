import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator'
import { Document, Types, Schema as MongooseSchema } from 'mongoose'
// import { Commits } from './commits.entity';


@Schema({
	timestamps: true,
})
export class Repo extends Document {

	@Prop([String])
	link: string[];

	@IsOptional()
	@Prop()
	comment: string;

	@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ChangedFiles' })
	changed_files: Types.ObjectId


}

export const RepoSchema = SchemaFactory.createForClass(Repo);

