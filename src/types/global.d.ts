export {};

declare global {
  interface Window {
    useUser: (useToken: string) => UseQueryResult<UserDataType, Error>;
  }
}
