export const log = (input: string, chalkFunc: (...text: unknown[]) => string) => {
  console.log(chalkFunc(input))
}
