import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import UserModel from "../user";

@Entity({ name: "error" })
export default class ErrorModel extends BaseEntity {
	constructor(data?: Partial<ErrorModel>) {
		super();

		if (data) {
			Object.assign(this, data);
		}
	}

	/** error id */
	@PrimaryGeneratedColumn("uuid")
	public id: string;

	/** user id */
	@Column({ type: "uuid", nullable: true, default: null })
	public userId: string;

	/** error message */
	@Column({ type: "varchar", length: 255, nullable: false })
	public message: string;

	/** error stack */
	@Column({ type: "text", nullable: false })
	public stack: string;

	/** error createdAt */
	@CreateDateColumn()
	public createdAt: Date;

	/** relation */
	@ManyToOne(() => UserModel, ({ error }) => error, ({ onDelete: "SET NULL", nullable: true }))
	public user: UserModel;
}