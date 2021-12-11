import type { LoadOptions } from 'js-yaml'

export interface FrontMatterResult<T> {
  readonly attributes: T
  readonly body: string
  readonly bodyBegin: number;
  readonly frontmatter?: string
}

interface FM {
  <T>(file: string, options?: LoadOptions): FrontMatterResult<T>
  test(file: string): boolean
}

declare const fm: FM
export default fm