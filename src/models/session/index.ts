import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import UserModel from "../user";

@Entity({ name: "session" })
export default class SessionModel extends BaseEntity {
	constructor(data?: Partial<SessionModel>) {
		super();
		
		if (data) {
			Object.assign(this, data);
		}
	}

	/** session id */
	@PrimaryGeneratedColumn("uuid")
	public id: string;

	/** user id */
	@Column({ type: "uuid", length: 36, nullable: false })
	public userId: string;

	/** session token */
	@Column({ type: "varchar", length: 255, nullable: false })
	public token: string;

	/** session createdAt */
	@CreateDateColumn()
	public createdAt: Date;

	/** relation */
	@ManyToOne(() => UserModel, ({ session }) => session, ({ onDelete: "CASCADE" }))
	public user: UserModel;
}