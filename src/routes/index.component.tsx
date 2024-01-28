import crystal from "@/assets/sprites/crystal.png";
import play from "@/assets/sprites/play.png";
import arrow from "@/assets/sprites/arrow.png";
import invite from "@/assets/sprites/invite.png";
import { useStartGame } from "@/hooks/use-start-game";
import { Link } from "@tanstack/react-router";

export const component = function Index() {
  const { setStartGame } = useStartGame();

  return (
    <section className="mb-10">
      <Link
        to="/clan"
        className="flex relative max-w-[400px] mx-auto mb-20 flex-col justify-center items-center"
      >
        <svg width="400" height="100">
          <text x="100" y="50" className="stroke-behind">
            Join clan
          </text>
        </svg>
        <img className="absolute right-20 bottom-[35px]" src={arrow} alt="" />
      </Link>
      <Link to="/shop" className="flex justify-center">
        <img src={crystal} alt="" />
        <img src={crystal} alt="" />
        <img src={crystal} alt="" />
      </Link>
      <div className="flex flex-col items-center">
        <button onClick={() => setStartGame(true)}>
          <img src={play} alt="" />
        </button>

        <Link to="/invite">
          <img src={invite} alt="" />
        </Link>
      </div>
    </section>
  );
};
