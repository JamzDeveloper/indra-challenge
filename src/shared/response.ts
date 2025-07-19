
export class ApiResponse<T = any> {
  public readonly success: boolean;
  public readonly data?: T;
  public readonly message?: string;
  public readonly errors?: any;
  public readonly statusCode: number;

  constructor(
    statusCode: number,
    options: {
      success: boolean;
      data?: T;
      message?: string;
      errors?: any;
    }
  ) {
    this.statusCode = statusCode;
    this.success = options.success;
    this.data = options.data;
    this.message = options.message;
    this.errors = options.errors;
  }

 toJSON() {
  return {
    statusCode: this.statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE"
    },
    body: JSON.stringify({
      success: this.success,
      ...(this.message && { message: this.message }),
      ...(this.data && { data: this.data }),
      ...(this.errors && { errors: this.errors }),
    }),
  };
}


  static ok<T = any>(data: T, message = "Operación exitosa") {
    return new ApiResponse<T>(200, { success: true, data, message }).toJSON();
  }

  static created<T = any>(data: T, message = "Recurso creado correctamente") {
    return new ApiResponse<T>(201, { success: true, data, message }).toJSON();
  }

  static badRequest(message = "Solicitud inválida", errors?: any) {
    return new ApiResponse(400, { success: false, message, errors }).toJSON();
  }

  static unauthorized(message = "No autorizado") {
    return new ApiResponse(401, { success: false, message }).toJSON();
  }

  static forbidden(message = "Acceso prohibido") {
    return new ApiResponse(403, { success: false, message }).toJSON();
  }

  static notFound(message = "Recurso no encontrado") {
    return new ApiResponse(404, { success: false, message }).toJSON();
  }

  static internalError(message = "Error interno del servidor", errors?: any) {
    return new ApiResponse(500, { success: false, message, errors }).toJSON();
  }
}
