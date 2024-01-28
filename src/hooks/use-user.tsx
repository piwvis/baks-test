import { API } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export type UserDataType = {
  status: boolean;
  user: {
    chatId: number /** Чат айди (ТГ) игрока */;
    wallet: string | undefined /** Адрес кошелька пользователя */;
    tokenBalance: number /** Баланс токенов пользователя */;
  };
  invited: number /** Количество приглашенных пользователей */;
  refLink: string /** Реферальный код пользователя, пример: 'ASd746D'.
         Используем для формирования реферальной ссылки такого формата: https://t.me/testyh1_bot?start=${refLink}*/;
  boxCount: number /** Количество боксов, доступных для клейма */;
  bestScore: number /** Лучший счёт в игре */;
  skinUrl: string /** Ссылка на скин, который установлен у пользователя */;
};

export type Item = {
  ownerId: number;
  itemId: string;
  type: ItemToSell;
};

export type ItemToSell = {
  id: string;
  price: number;
  name: string;
  itemType: string;
  url: string;
};

export type ShopList = {
  status: boolean;
  data: ItemToSell[];
};

export const useUser = (userToken: string) => {
  const query = useQuery({
    queryKey: ["user", userToken],
    queryFn: async () =>
      axios
        .get<UserDataType>(`${API.API_URL}/users/get?token=${userToken}`)
        .then((res) => res.data)
        .catch((err) => {
          if (err.response.status === 404) {
            throw new Error(`User is not exist`);
          }
          throw err;
        }),
  });
  return query;
};

export const useClaim = (userToken: string) => {
  const query = useQuery({
    queryKey: ["user", userToken],
    queryFn: async () =>
      axios
        .get<{ status: boolean; value: number }>(
          `${API.API_URL}/users/claim?token=${userToken}`,
        )
        .then((res) => res.data)
        .catch((err) => {
          if (err.response.status === 404) {
            throw new Error(`User is not exist`);
          }
          throw err;
        }),
  });
  return query;
};

export const useSetScore = (userToken: string, score: number) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["score"],
    mutationFn: () =>
      axios.post<{ status: boolean }>(
        `${API.API_URL}/users/claim?token=${userToken}`,
        {
          token: userToken,
          score: score,
        },
      ),
    onError({ message }: { message: string }) {
      console.log(message);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return mutation;
};

export const useSetSkin = (userToken: string, skinUrl: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["skin"],
    mutationFn: () =>
      axios.post<{ status: boolean }>(`${API.API_URL}/users/skin`, {
        token: userToken,
        url: skinUrl,
      }),
    onError({ message }: { message: string }) {
      console.log(message);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return mutation;
};

export const useUpdateUserAddress = (userToken: string, address: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["address"],
    mutationFn: () =>
      axios.post<{ status: boolean }>(`${API.API_URL}/users/wallet`, {
        token: userToken,
        wallet: address,
      }),
    onError({ message }: { message: string }) {
      console.log(message);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return mutation;
};

export const useUserItems = (userToken: string) => {
  const query = useQuery({
    queryKey: ["user-items", userToken],
    queryFn: async () =>
      axios
        .get<{
          status: boolean;
          data: Item[];
        }>(`${API.API_URL}/store/my?token=${userToken}`)
        .then((res) => res.data)
        .catch((err) => {
          if (err.response.status === 404) {
            throw new Error(`User is not exist`);
          }
          throw err;
        }),
  });
  return query;
};

export const useShopList = () => {
  const query = useQuery({
    queryKey: ["shop-items"],
    queryFn: async () =>
      axios
        .get<ShopList>(`${API.API_URL}/store/list`)
        .then((res) => res.data)
        .catch((err) => {
          if (err.response.status === 404) {
            throw new Error(`User is not exist`);
          }
          throw err;
        }),
  });
  return query;
};

export const useBuyItem = (userToken: string, itemId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["buy-item"],
    mutationFn: () =>
      axios.post<{ status: boolean }>(`${API.API_URL}/store/buy`, {
        token: userToken,
        itemId: itemId,
      }),
    onError({ message }: { message: string }) {
      console.log(message);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return mutation;
};

export const useGiveBox = (userToken: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["give-box"],
    mutationFn: () =>
      axios.post<{ status: boolean }>(`${API.API_URL}/users/box`, {
        token: userToken,
      }),
    onError({ message }: { message: string }) {
      console.log(message);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return mutation;
};

export const useSubData = (userToken: string) => {
  const query = useQuery({
    queryKey: ["shop-items"],
    queryFn: async () =>
      axios
        .get<object>(`${API.API_URL}/users/sub?token=${userToken}`)
        .then((res) => res.data)
        .catch((err) => {
          if (err.response.status === 404) {
            throw new Error(`User is not exist`);
          }
          throw err;
        }),
  });
  return query;
};
