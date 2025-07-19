
import { ApiResponse } from "../../src/shared/response";

describe("ApiResponse", () => {
  it("should create a successful response with data", () => {
    const response = ApiResponse.ok({ foo: "bar" }, "Todo bien");

    expect(response).toEqual({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
      },
      body: JSON.stringify({
        success: true,
        message: "Todo bien",
        data: { foo: "bar" },
      }),
    });
  });

  it("should create a created response", () => {
    const response = ApiResponse.created({ id: 1 }, "Creado");

    expect(response).toEqual({
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
      },
      body: JSON.stringify({
        success: true,
        message: "Creado",
        data: { id: 1 },
      }),
    });
  });

  it("should create a bad request response", () => {
    const response = ApiResponse.badRequest("Error en datos", {
      campo: "requerido",
    });

    expect(response).toEqual({
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
      },
      body: JSON.stringify({
        success: false,
        message: "Error en datos",
        errors: { campo: "requerido" },
      }),
    });
  });

  it("should create an unauthorized response", () => {
    const response = ApiResponse.unauthorized();

    expect(response).toEqual({
      statusCode: 401,
       headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE"
    },
      body: JSON.stringify({
        success: false,
        message: "No autorizado",
      }),
    });
  });

  it("should create a forbidden response", () => {
    const response = ApiResponse.forbidden();

    expect(response).toEqual({
      statusCode: 403,
       headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE"
    },
      body: JSON.stringify({
        success: false,
        message: "Acceso prohibido",
      }),
    });
  });

  it("should create a not found response", () => {
    const response = ApiResponse.notFound();

    expect(response).toEqual({
      statusCode: 404,
       headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE"
    },
      body: JSON.stringify({
        success: false,
        message: "Recurso no encontrado",
      }),
    });
  });

  it("should create an internal error response with error details", () => {
    const response = ApiResponse.internalError("Falla total", { stack: "..." });

    expect(response).toEqual({
      statusCode: 500,
       headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE"
    },
      body: JSON.stringify({
        success: false,
        message: "Falla total",
        errors: { stack: "..." },
      }),
    });
  });

  it("should serialize to JSON properly with all fields", () => {
    const response = new ApiResponse(200, {
      success: true,
      data: { foo: "bar" },
      message: "Ok",
      errors: { warning: "none" },
    }).toJSON();

    expect(response).toEqual({
      statusCode: 200,
       headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE"
    },
      body: JSON.stringify({
        success: true,
        message: "Ok",
        data: { foo: "bar" },
        errors: { warning: "none" },
      }),
    });
  });
});
