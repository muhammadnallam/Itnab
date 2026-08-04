export class ValidationError extends Error {
    constructor(message, field) {
        super(message);
        this.name = "ValidationError";
        this.status = 400;
        this.field = field;
    }
}

export class InternalError extends Error {
    constructor(message) {
        super(message || "حدث خطأ ما من جانبنا, يرجى المحاولة لاحقًا");
        this.name = "InternalError";
        this.status = 500;
    }
}

export class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
        this.status = 404;
    }
}

export class AuthorizationError extends Error {
    constructor(message) {
        super(message);
        this.name = "AuthorizationError";
        this.status = 403;
    }
}

export class AuthenticationError extends Error {
    constructor(message) {
        super(message);
        this.name = "AuthenticationError";
        this.status = 401;
    }
}
