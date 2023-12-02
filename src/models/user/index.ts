import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

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
	@Column({ type: "varchar", length: 64, nullable: true })
	public survey_inmate: string;

	/** 거주지 */
	@Column({ type: "varchar", length: 64, nullable: true })
	public survey_residence: string;

	/** 맛 */
	@Column({ type: "varchar", length: 64, nullable: true })
	public survey_taste: string;

	/** 식수량 */
	@Column({ type: "varchar", length: 64, nullable: true })
	public survey_amount: string;
}