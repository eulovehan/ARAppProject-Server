import { ServerError } from "./error";
import { Opcode } from "./opcode";

export default class Invalid {
	public static varchar(data: any, props: {
		title: string;
		maxLength?: number;
		minLength?: number;
		nullable?: boolean;
	}) {
		const {
			title,
			nullable
		} = props;

		let {
			maxLength,
			minLength
		} = props;

		if (!maxLength) {
			maxLength = 255;
		}

		if (!minLength) {
			minLength = 0;
		}

		if (nullable && !data) {
			return true;
		}

		if (!(typeof data === "string")) {
			throw ServerError(`${title} 데이터 타입 검증에 실패 했습니다.`, {
				opcode: Opcode.InvalidInput,
				input: data
			});
		}

		if (data.length > maxLength) {
			throw ServerError(`${title}은(는) ${maxLength}자 내로 입력해주세요.`, {
				opcode: Opcode.InvalidInput,
				input: data
			});
		}

		if (data.length < minLength) {
			throw ServerError(`${title}은(는) ${minLength}자 이상 입력해주세요.`, {
				opcode: Opcode.InvalidInput,
				input: data
			});
		}
		
		return true;
	}

	public static email(data: string, props: {
		title: string;
		isSoftCheck?: boolean;
		nullable?: boolean;
	}) {
		const {
			title,
			isSoftCheck,
			nullable
		} = props;
		
		if (nullable && !data) {
			return false;
		}
		
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/g;
		const check: boolean = regex.test(data);

		const isFailed = (() => {
			if (!check) {
				return ServerError(`${title} 이메일 형식 검증에 실패했어요.`, {
					opcode: Opcode.InvalidInput,
					input: data
				});
			}

			if (data.length > 255) {
				return ServerError(`${title} 이메일 길이가 너무 길어요.`, {
					opcode: Opcode.InvalidInput,
					input: data
				});
			}
		})();
		
		if (isFailed) {
			if (isSoftCheck) {
				return false;
			} else {
				throw isFailed;
			}
		}
		
		return true;
	}
}