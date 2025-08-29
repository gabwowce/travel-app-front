// src/setup/timestampedConsole.ts
type AnyFn = (...args: any[]) => void;

const orig = {
  log: console.log.bind(console) as AnyFn,
  warn: console.warn.bind(console) as AnyFn,
  error: console.error.bind(console) as AnyFn,
  info: console.info.bind(console) as AnyFn,
  debug: (console.debug
    ? console.debug.bind(console)
    : console.log.bind(console)) as AnyFn,
};

function ts() {
  const d = new Date();
  const pad = (n: number, s = 2) => String(n).padStart(s, "0");
  const ms = String(d.getMilliseconds()).padStart(3, "0");

  // YYYY-MM-DD HH:mm:ss.mmm
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${ms}`
  );
}

function wrap(fn: AnyFn): AnyFn {
  return (...args: any[]) => {
    if (args.length > 0 && typeof args[0] === "string") {
      fn(`[${ts()}] ${args[0]}`, ...args.slice(1));
    } else {
      fn(`[${ts()}]`, ...args);
    }
  };
}

export function installTimestampedConsole() {
  console.log = wrap(orig.log);
  console.warn = wrap(orig.warn);
  console.error = wrap(orig.error);
  console.info = wrap(orig.info);
  console.debug = wrap(orig.debug);
}
