export type BtnLogMeta = {
  screen?: string;
  id?: string | number;
  [k: string]: any;
};

export function logBtn(name: string, meta?: BtnLogMeta) {
  const ts = new Date().toISOString().replace("T", " ").slice(0, 19);
  // 👇 formatas toks pat kaip tavo kiti logai
  console.log(`[${ts}] 🖱️ [BTN] ${name}`, meta ? JSON.stringify(meta) : "");
}

// Wrapperis – apgaubia bet kokį onPress ir automatiškai logina
export function withPressLog<T extends (...args: any[]) => any>(
  name: string,
  handler?: T,
  meta?: BtnLogMeta
): T {
  return ((...args: any[]) => {
    logBtn(name, meta);
    // @ts-ignore
    return handler?.(...args);
  }) as T;
}
