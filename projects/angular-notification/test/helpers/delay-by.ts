export function delayBy(ms: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });
}
