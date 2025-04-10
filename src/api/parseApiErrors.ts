export interface ParsedApiErrors {
  general?: string;
  [field: string]: string[] | string | undefined;
}

export const parseApiErrors = (error: any): ParsedApiErrors => {
  const parsed: ParsedApiErrors = {};

  // Axios klaidos atveju error.response.data
  const errorData =
    error?.response?.data?.errors ||
    error?.data?.errors ||
    error?.errors ||
    error?.data?.data?.errors ||
    null;

  if (errorData) {
    Object.keys(errorData).forEach((field) => {
      parsed[field] = errorData[field]; // išlaikom visą masyvą
    });

    const firstField = Object.keys(errorData)[0];
    if (firstField && errorData[firstField]?.[0]) {
      parsed.general = errorData[firstField][0];
    }
  } else {
    parsed.general =
      error?.response?.data?.message ||
      error?.data?.message ||
      error?.message ||
      "Unknown error";
  }

  return parsed;
};

