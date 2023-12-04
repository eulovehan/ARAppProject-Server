import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import UserCardModel from "./card";
import UserPaymentModel from "./payment";
import SessionModel from "../session";
import ErrorModel from "../error";

@Entity({ name: "user" })
export default class UserModel extends BaseEntity {
	constructor(data?: Partial<UserModel>) {
		super();
		
		if (data) {
			Object.assign(this, data);
		}
	}

	/** user id */
	@PrimaryGeneratedColumn("uuid")
	public id: string;

	/** is enabled */
	@Column({ type: "boolean", nullable: false, default: true })
	public enabled: boolean;

	/** user email */
	@Column({ type: "varchar", length: 150, nullable: false, unique: true })
	public email: string;

	/** user password */
	@Column({ type: "varchar", length: 80, nullable: false })
	public password: string;

	/** user signupat */
	@CreateDateColumn()
	public signupAt: Date;

	/** surveys */
	/** 동거인 */
	@Column({ type: "varchar", length: 64, nullable: true, default: null })
	public survey_inmate: string;

	/** 거주지 */
	@Column({ type: "varchar", length: 64, nullable: true, default: null })
	public survey_residence: string;

	/** 맛 */
	@Column({ type: "varchar", length: 64, nullable: true, default: null })
	public survey_taste: string;

	/** 식수량 */
	@Column({ type: "varchar", length: 64, nullable: true, default: null })
	public survey_amount: string;

	/** waters */
	/** 개수 */
	@Column({ type: "int", nullable: true, default: null })
	public water_amount: number;

	/** 배달주기(일) */
	@Column({ type: "int", nullable: true, default: null })
	public water_cycle: number;

	/** 물 업데이트일 */
	@Column({ type: "timestamp", nullable: true, default: null })
	public water_updatedAt: Date;

	/** relation */
	@OneToMany(() => UserCardModel, ({ user }) => user, ({ onDelete: "CASCADE" }))
	public card: Array<UserCardModel>;

	@OneToMany(() => UserPaymentModel, ({ user }) => user, ({ onDelete: "CASCADE" }))
	public payment: Array<UserPaymentModel>;

	@OneToMany(() => SessionModel, ({ user }) => user, ({ onDelete: "CASCADE" }))
	public session: Array<SessionModel>;

	@OneToMany(() => ErrorModel, ({ user }) => user, ({ onDelete: "SET NULL", nullable: true }))
	public error: Array<ErrorModel>;
}