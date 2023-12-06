import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import UserCardModel from "./card";
import UserPaymentModel from "./payment";
import SessionModel from "../session";
import ErrorModel from "../error";
import WaterModel from "../water";

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
	/** 구독 설정중인 물 id */
	@Column({ type: "uuid", length: 36, nullable: true, default: null })
	public waterId: string;
	
	/** 개수 */
	@Column({ type: "int", nullable: true, default: null })
	public water_amount: number;

	/** 배달주기(일) */
	@Column({ type: "int", nullable: true, default: null })
	public water_cycle: number;

	/** 물 배송일 */
	@Column({ type: "timestamp", nullable: true, default: null })
	public water_deliveredAt: Date;

	/** 기본 배송지 */
	@Column({ type: "varchar", length: 255, nullable: true, default: null })
	public address: string;

	/** 배송지 상세 */
	@Column({ type: "varchar", length: 255, nullable: true, default: null })
	public detailAddress: string;

	/** 배송지 공동현관 비밀번호 */
	@Column({ type: "varchar", length: 32, nullable: true, default: null })
	public addressPublicPassword: string;

	/** relation */
	@OneToMany(() => UserCardModel, ({ user }) => user, ({ onDelete: "CASCADE" }))
	public card: Array<UserCardModel>;

	@OneToMany(() => UserPaymentModel, ({ user }) => user, ({ onDelete: "CASCADE" }))
	public payment: Array<UserPaymentModel>;

	@OneToMany(() => SessionModel, ({ user }) => user, ({ onDelete: "CASCADE" }))
	public session: Array<SessionModel>;

	@OneToMany(() => ErrorModel, ({ user }) => user, ({ onDelete: "SET NULL", nullable: true }))
	public error: Array<ErrorModel>;

	@ManyToOne(() => WaterModel, ({ user }) => user, ({ onDelete: "SET NULL", nullable: true }))
	public water: WaterModel;
}