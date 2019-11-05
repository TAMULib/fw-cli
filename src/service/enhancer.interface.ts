export interface Enhancer {
  enhance: (path: string, json: any) => any;
}
