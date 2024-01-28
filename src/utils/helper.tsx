import { useUser } from "@/hooks/use-user";

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

export const useAssignWindowMethods = () => {
  window.useUser = useUser;
};
