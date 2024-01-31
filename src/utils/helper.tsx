import axios from "axios";
import { API } from "./api";

export function loadScripts() {
  const dynamicScripts: string[] = [
    "/game/createjs.js",
    "/game/jquery.js",
    "/game/bootstrap.js",
    "/game/preload.js",
    "/game/app.js",
    "/game/after.js",
  ];

  dynamicScripts.forEach((url) => {
    const node = document.createElement("script");
    node.src = url;
    node.type = "text/javascript";
    node.async = false;
    document.getElementsByTagName("body")[0].appendChild(node);
  });
}

const getUser = async (userToken: string) => {
  const { data } = await axios.get(
    `${API.API_URL}/users/get?token=${userToken}`,
  );
  return data;
};

const setScore = async (userToken: string, score: string) => {
  const { data } = await axios.post(`${API.API_URL}/users/score`, {
    token: userToken,
    score: score,
  });
  return data;
};

const getBox = async (userToken: string) => {
  const { data } = await axios.post(`${API.API_URL}/users/box`, {
    token: userToken,
  });
  return data;
};

const reduceHealth = () => {
  window.health = window.health - 1;
};

export const useAssignWindowMethods = () => {
  window.getUser = getUser;
  window.reduceHealth = reduceHealth;
  window.getBox = getBox;
  window.setScore = setScore;
  window.health = 1;
};
