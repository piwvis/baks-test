import Header from "@/components/header";
import { useAssignWindowMethods, loadScripts } from "@/utils/helper";
import { useRef, useEffect } from "react";
import { Outlet } from "@tanstack/react-router";
import bg from "@/assets/sprites/bg.png";
import { useStartGame } from "@/hooks/use-start-game";
import { Route } from "@/routes/$userToken";
import { useUserValidity } from "@/hooks/use-user-validity";

export default function Root() {
  const { isStart } = useStartGame();
  const windowWidth = useRef(window.innerWidth);
  const windowHeight = useRef(window.innerHeight);

  const userToken = Route.useParams();

  useEffect(() => {
    isStart && loadScripts();
  }, [isStart]);

  useAssignWindowMethods();
  useUserValidity(userToken.userToken);

  if (isStart) {
    return (
      <div className="overflow-hidden">
        <canvas
          id="testCanvas"
          className="mx-auto"
          width={windowWidth.current}
          height={windowHeight.current}
        ></canvas>
        ;
      </div>
    );
  }

  return (
    <>
      <main
        style={{ backgroundImage: `url(${bg})` }}
        className="w-[100vw] max-w-[100vw] bg-cover min-h-[100vh] flex flex-col justify-between text-black mx-auto outline  2xl:max-w-[768px]"
      >
        <Header />
        <Outlet />
      </main>
    </>
  );
}
