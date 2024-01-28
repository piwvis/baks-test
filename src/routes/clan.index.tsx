import cat from "@/assets/sprites/white-cat.png";
import baks from "@/assets/sprites/baks.png";
import pick from "@/assets/sprites/pick-clan.png";
import carousel_bg from "@/assets/sprites/carousel/carousel-bg.png";
import { FileRoute, Link } from "@tanstack/react-router";
import coin from "@/assets/sprites/items/coin.png";
import arrow from "@/assets/sprites/arrow.png";

const clanData = [
  {
    image: baks,
    name: "BaksTon",
    rank: 1,
    mined: 10000000,
  },
];

export const Route = new FileRoute("/clan/").createRoute({
  component: ClanIndexComponent,
});

function ClanIndexComponent() {
  return (
    <section className="flex gap-2 mb-6 flex-col items-center justify-center ">
      <div className="flex justify-center">
        <img src={cat} alt="" />
      </div>
      <div className="flex flex-col items-center">
        <button>
          <img src={pick} alt="" />
        </button>
      </div>
      <div className="flex w-full max-w-[360px] justify-start items-start">
        <svg width="185" height="70">
          <text
            x="4"
            y="50"
            className="stroke-behind tracking-[2.5px] stroke-[10px]  "
          >
            Top Clans
          </text>
        </svg>
      </div>

      <div className="flex h-[510px] w-[383px] justify-start items-start">
        <div className="p-8 ml-2 flex justify-start items-start">
          {clanData.map((clan) => (
            <Link
              to={"/clan/$clanId"}
              params={{ clanId: "123" }}
              className="flex gap-4 flex-row justify-center items-center relative   z-10"
            >
              <div className="flex justify-between z-10 text-black items-center">
                <img src={clan.image} className="w-[54px] h-[50px]" alt="" />
              </div>
              <div className="flex flex-col text-xl justify-start items-start">
                <p className="font-bold ">{clan.name}</p>
                <div className="flex gap-4 text-xl">
                  <span className="uppercase flex font-primary text-xl">
                    rank:
                    <p>💎</p>
                  </span>
                  <div className="flex gap-2">
                    <p className="uppercase font-primary text-xl">
                      {clan.mined}
                    </p>
                    <img className="w-[26px] h-[25px]" src={coin} alt="" />
                  </div>
                </div>
              </div>
              <img className="w-4 h-5 ml-10" src={arrow} alt="" />
            </Link>
          ))}
        </div>
        <img className={"absolute  px-4 mx-auto"} src={carousel_bg} alt="" />
      </div>
    </section>
  );
}
