import { Prisma } from "@prisma/client";
import { IGenericErrorMessage } from "../interface/error";

const ClientError = (error: Prisma.PrismaClientKnownRequestError) => {
  let errors: IGenericErrorMessage[] = [];
  let message = "";

  if (error.code === "P2025") {
    message = (error.meta?.cause as string) || "Record not found!";
    errors = [
      {
        path: "",
        message,
      },
    ];
  } else if (error.code === "P2003") {
    if (error.message.includes("delete()` invocation:")) {
      message = "Delete failed";
      errors = [
        {
          path: "",
          message,
        },
      ];
    }
  }
  const statusCode = 400;
  return {
    statusCode,
    message,
    errorMessages: errors,
  };
};

export default ClientError;
