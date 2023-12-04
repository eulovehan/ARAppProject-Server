import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import UserModel from "..";

@Entity({ name: "user_card" })
export default class UserCardModel extends BaseEntity {
	constructor(data?: Partial<UserCardModel>) {
		super();

		if (data) {
			Object.assign(this, data);
		}
	}

	/** card id */
	@PrimaryGeneratedColumn("uuid")
	public id: string;

	/** is enabled */
	@Column({ type: "boolean", nullable: false, default: true })
	public enabled: boolean;

	/** card number */
	@Column({ type: "varchar", length: 16, nullable: false })
	public number: string;

	/** card password */
	@Column({ type: "varchar", length: 2, nullable: false })
	public password: string;

	/** card exp month */
	@Column({ type: "varchar", length: 2, nullable: false })
	public exp_month: string;
	
	/** card exp year */
	@Column({ type: "varchar", length: 2, nullable: false })
	public exp_year: string;

	/** name */
	@Column({ type: "varchar", length: 20, nullable: false })
	public name: string;

	/** phone */
	@Column({ type: "varchar", length: 11, nullable: false })
	public phone: string;

	/** birth */
	@Column({ type: "varchar", length: 8, nullable: false })
	public birth: string;

	/** card createdAt */
	@CreateDateColumn()
	public createdAt: Date;

	/** relation */
	@ManyToOne(() => UserModel, ({ card }) => card, ({ onDelete: "CASCADE" }))
	public user: UserModel;
}