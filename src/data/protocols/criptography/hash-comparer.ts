export interface HashComparer {
  compare: (plainValue: string, hashedValue: string) => Promise<boolean>
}
