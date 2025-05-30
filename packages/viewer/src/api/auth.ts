import { alovaInstance } from "./alova";
import { UserEntity } from "@/api/user";
export interface SignInOptions {
  username: string;
  password: string;
}
export function signIn(options: SignInOptions): Promise<UserEntity> {
  return alovaInstance.Post("/auth/login", options);
}
export function signOut() {
  return alovaInstance.Post("/auth/logout");
}
