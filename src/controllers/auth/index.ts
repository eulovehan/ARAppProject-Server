import AppDataSource from "../../dbSource";
import { SQLExceptionError, ServerError } from "../../tools/error";
import { Opcode } from "../../tools/opcode";
import bcrypt from "bcrypt";

export default class AuthController {
	/** login */
	public static async login(props: {
		email: string;
		password: string;
	}) {
		const {
			email,
			password
		} = props;

		/** 패스워드 찾기 */
		const { findPassword } = await AppDataSource.getRepository("User")
		.createQueryBuilder("user")
		.select("user.password", "password")
		.where("user.email = :email", { email })
		.getRawOne()
		.catch((err) => {
			throw SQLExceptionError("login.findPassword", err);
		});

		/** 유저 검색 */
		if (!findPassword) {
			throw ServerError("존재하지 않는 이메일 입니다.", {
				opcode: Opcode.NotFindEmail
			});
		}

		/** 패스워드 검증 */
		const identical = await bcrypt.compare(password, findPassword);
		
		/** 패스워드 검증 실패 */
		if (!identical) {
			throw ServerError("비밀번호가 일치하지 않습니다.", {
				opcode: Opcode.NotIdenticalPassword
			});
		}

		return;
	}
}