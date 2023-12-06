export enum Opcode {
	/** 성공 */
	Success = "Success",
	
	/** 요청 제한 */
	RequestLimit = "RequestLimit",

	/** 서버 에러 */
	SQLError = "SQLError",

	/** 알 수 없는 에러 */
	UnkownError = "UnkownError",

	/** 요청 검증 실패 */
	InvalidRequest = "InvalidRequest",

	/** 입력 검증 실패 */
	InvalidInput = "InvalidInput",

	/** 이미 존재하는 회원 이메일 */
	AlreadyExistEmail = "AlreadyExistEmail",

	/** 이메일이 없음 */
	NotFindEmail = "NotFindEmail",

	/** 패스워드 검증 실패 */
	NotIdenticalPassword = "NotIdenticalPassword",

	/** 세션 아웃 */
	SessionOut = "SessionOut",

	/** 상품이 존재하지 않음 */
	NotExistsWaterId = "NotExistsWaterId",
	
	/** 배송 3일전에는 변경 불가 */
	NotChangeWaterOptions = "NotChangeWaterOptions",

	/** 카드가 존재하지 않음 */
	NotExistsCardId = "NotExistsCardId",
}