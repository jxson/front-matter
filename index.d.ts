export interface FrontMatterResult<T> {
  readonly attributes: T
  readonly body: string
  readonly bodyBegin: number;
  readonly frontmatter?: string
}

interface FM {
  <T>(file: string): FrontMatterResult<T>
  test(file: string): boolean
}

export const fm: FM