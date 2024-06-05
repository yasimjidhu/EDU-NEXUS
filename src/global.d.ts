// src/global.d.ts
export {};

declare global {
  interface Window {
    onSignIn: (googleUser: any) => void;
  }
}
interface Window {
    gapi: any;
  }