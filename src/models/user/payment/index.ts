import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import UserModel from "..";
import WaterModel from "../../water";

@Entity({ name: "user_payment" })
export default class UserPaymentModel extends BaseEntity {
	constructor(data?: Partial<UserPaymentModel>) {
		super();
		
		if (data) {
			Object.assign(this, data);
		}
	}

	/** user payment id */
	@PrimaryGeneratedColumn("uuid")
	public id: string;

	/** water id */
	@Column({ type: "uuid", nullable: true, default: null })
	public waterId: string;

	/** water amount */
	@Column({ type: "int", nullable: true, default: null })
	public water_amount: number;
	
	/** card number */
	@Column({ type: "varchar", length: 16, nullable: false })
	public number: string;

	/** createdAt */
	@CreateDateColumn()
	public createdAt: Date;

	/** relation */
	@ManyToOne(() => UserModel, ({ payment }) => payment, ({ onDelete: "CASCADE" }))
	public user: UserModel;

	@ManyToOne(() => WaterModel, ({ payment }) => payment, ({ onDelete: "SET NULL", nullable: true }))
	public water: WaterModel;
}