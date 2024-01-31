export {};

declare global {
  interface Window {
    getUser: (useToken: string) => UseQueryResult<UserDataType, Error>;
    getBox: (useToken: string) => UseQueryResult<UserDataType, Error>;
    setScore: (
      userToken: string,
      score: string,
    ) => UseQueryResult<UserDataType, Error>;
    user: UserDataType;
    token?: string;
    health: number;
    reduceHealth: () => void;
  }
}
