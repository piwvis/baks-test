import { useUser } from "@/hooks/use-user";

export function loadScripts() {
  const dynamicScripts: string[] = [
    "src/assets/game/createjs.js",
    "src/assets/game/jquery.js",
    "src/assets/game/bootstrap.js",
    "src/assets/game/preload.js",
    "src/assets/game/app.js",
    "src/assets/game/after.js",
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
