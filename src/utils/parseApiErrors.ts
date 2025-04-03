export type ParsedApiErrors = {
  [field: string]: string[];
  general?: string;
};

export const parseApiErrors = (error: any): ParsedApiErrors => {
  const parsed: ParsedApiErrors = {};

  const errorData =
    error?.data?.errors ||
    error?.errors ||
    error?.data?.data?.errors ||
    null;

  if (errorData) {
    Object.keys(errorData).forEach((field) => {
      parsed[field] = errorData[field]; // išlaikom visą masyvą
    });

    // Bendras pranešimas – imam pirmą klaidą, jei galima
    const firstField = Object.keys(errorData)[0];
    if (firstField && errorData[firstField]?.[0]) {
      parsed.general = errorData[firstField][0];
    }
  } else {
    // fallback
    parsed.general = error?.data?.message || error?.message || "Įvyko klaida";
  }

  return parsed;
};
