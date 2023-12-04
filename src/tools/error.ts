import { Opcode } from './opcode';

export function ServerError(message: string, props?: {
	opcode: string;
	stack?: string;
	input?: string;
}) {
	const {
		opcode,
		stack,
		input
	}  = props || {
		opcode: Opcode.UnkownError,
		stack: null,
		input: null
	};

	return {
		opcode,
		message,
		stack,
		input
	};
}

export function SQLExceptionError(sql: string, err: Error) {
	throw ServerError(`${sql} ---> SQL 쿼리 실행에 실패 했습니다.`, {
		opcode: Opcode.SQLError,
		stack: err.stack,
		input: sql
	});
}