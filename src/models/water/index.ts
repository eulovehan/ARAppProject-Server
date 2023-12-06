import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import UserPaymentModel from "../user/payment";
import UserModel from "../user";

@Entity({ name: "water" })
export default class WaterModel extends BaseEntity {
	constructor(data?: Partial<WaterModel>) {
		super();

		if (data) {
			Object.assign(this, data);
		}
	}

	/** water id */
	@PrimaryGeneratedColumn("uuid")
	public id: string;

	/** water title */
	@Column({ type: "varchar", length: 64, nullable: false })
	public title: string;

	/** water price */
	@Column({ type: "int", nullable: false })
	public price: number;

	/** water image url */
	@Column({ type: "varchar", length: 255, nullable: false })
	public imageUrl: string;
	
	/** water createdAt */
	@CreateDateColumn()
	public createdAt: Date;

	/** relation */
	@OneToMany(() => UserModel, ({ water }) => water, ({ onDelete: "SET NULL", nullable: true }))
	public user: Array<UserModel>;

	@OneToMany(() => UserPaymentModel, ({ water }) => water, ({ onDelete: "SET NULL", nullable: true }))
	public payment: Array<UserPaymentModel>;
}