import { API } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type UserValidityType = {
  status: string;
  token: string;
  until: string;
};

export const useUserValidity = (userToken: string) => {
  const query = useQuery({
    queryKey: ["user-validity", userToken],
    queryFn: async () =>
      axios
        .get<UserValidityType>(`${API.API_URL}/users/auth?key=${userToken}`)
        .then((res) => res.data)
        .catch((err) => {
          if (err.response.status === 404) {
            throw new Error(`User is not valid`);
          }
          throw err;
        }),
  });
  return query;
};
