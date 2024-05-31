
declare module "*.jpg";
declare module "*.png";
declare module "*.woff2";
declare module "*.woff";
declare module "*.ttf";
declare module "*.scss" {
  const content: Record<string, string>;
  export default content;
}

declare module "*.svg";


import {DefaultSession} from "next-auth";

declare module "next-auth" {

  interface Session {

    userId: string;
    username: string;
    email: string;
    phone: string;
    role: number;
    type: number;

    user: {
      userId: string;
      username: string;
      email: string;
      phone: string;
      role: number;
      type: number;
    }
  }
}


declare global {

  interface Window {

    __TAURI__?: {
      writeText(text: string): Promise<void>;
      invoke(command: string, payload?: Record<string, unknown>): Promise<any>;
      dialog: {
        save(options?: Record<string, unknown>): Promise<string | null>;
      };
      fs: {
        writeBinaryFile(path: string, data: Uint8Array): Promise<void>;
      };
      notification:{
        requestPermission(): Promise<Permission>;
        isPermissionGranted(): Promise<boolean>;
        sendNotification(options: string | Options): void;
      };
    };
  }
}




