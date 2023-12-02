import { Opcode } from './opcode';

export function ServerError (message: string, props?: {
	opcode: string;
	stack: string;
}) {
	const {
		opcode,
		stack
	}  = props || {
		opcode: Opcode.UnkownError,
		stack: null
	};

	return {
		opcode,
		message,
		stack
	};
}