import AppDataSource from "../../dbSource";
import SessionModel from "../../models/session";
import UserModel from "../../models/user";
import { SQLExceptionError, ServerError } from "../../tools/error";
import { Opcode } from "../../tools/opcode";
import bcrypt from "bcrypt";
import crypto from "crypto";

export default class AuthController {
	/** signup */
	public static async signup(props: {
		email: string;
		password: string;
		survey_inmate?: string;
		survey_residence?: string;
		survey_taste?: string;
		survey_amount?: string;
	}) {
		const {
			email,
			password,
			survey_inmate,
			survey_residence,
			survey_taste,
			survey_amount
		} = props;
		
		/** 동일 이메일 유저가 이미 있으면 반려 */
		const findUser = await AppDataSource.getRepository(UserModel)
		.createQueryBuilder("user")
		.select("user.id", "id")
		.where("user.email = :email", { email })
		.andWhere("user.enabled = :enabled", { enabled: true })
		.getRawOne()
		.catch((err) => {
			throw SQLExceptionError("signup.findUser", err);
		});

		if (findUser) {
			throw ServerError("이미 존재하는 이메일 입니다.", {
				opcode: Opcode.AlreadyExistEmail
			});
		}

		/** 패스워드 암호화 */
		const hash = await bcrypt.hash(password, 12);

		/** 유저 생성 */
		const user = new UserModel({
			email,
			password: hash,
			survey_inmate,
			survey_residence,
			survey_taste,
			survey_amount
		});

		await user.save()
		.catch((err) => {
			throw SQLExceptionError("signup.createUser", err);
		});

		/** 세션 토큰 발급 */
		const token = await this.generateToken();

		/** 세션 생성 */
		const session = new SessionModel({
			userId: user.id,
			token
		});

		await session.save()
		.catch((err) => {
			throw SQLExceptionError("signup.createSession", err);
		});

		return token;
	}

	/** login */
	public static async login(props: {
		email: string;
		password: string;
	}) {
		const {
			email,
			password
		} = props;

		/** 유저 정보 찾기 */
		const findUser = await AppDataSource.getRepository(UserModel)
		.createQueryBuilder("user")
		.select([
			"user.id as id",
			"user.password as password"
		])
		.where("user.email = :email", { email })
		.getRawOne()
		.then((res) => {
			return res;
		})
		.catch((err) => {
			throw SQLExceptionError("login.findPassword", err);
		});

		/** 유저 검색 */
		if (!findUser) {
			throw ServerError("존재하지 않는 이메일 입니다.", {
				opcode: Opcode.NotFindEmail
			});
		}

		/** 패스워드 검증 */
		const identical = await bcrypt.compare(password, findUser.password)
		.catch((err) => {
			throw ServerError("비밀번호가 일치하지 않습니다. (알 수 없는 비밀번호 형식)", {
				opcode: Opcode.NotFindEmail
			});
		});
		
		/** 패스워드 검증 실패 반려 */
		if (!identical) {
			throw ServerError("비밀번호가 일치하지 않습니다.", {
				opcode: Opcode.NotIdenticalPassword
			});
		}
		
		/** 세션 토큰 발급 */
		const token = await this.generateToken();

		/** 세션 생성 */
		const session = new SessionModel({
			userId: findUser.userId,
			token
		});

		await session.save()
		.catch((err) => {
			throw SQLExceptionError("login.createSession", err);
		});

		return token;
	}

	/** create token */
	public static async generateToken(length: number = 128) {
		return crypto.randomBytes(length).toString("hex");
	}
}