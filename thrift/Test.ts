

export interface UserService {
  isUser(id: string): boolean;
  getContent(contentId: string): string;
  getContentList(ids: string[]): string[];
  getManyContentList(ids: string[]): {[propName: string]: {[propName:string]:string}};
}

export interface User {
  id: string;
  name: string;
}
