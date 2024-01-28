import { FileRoute, Link } from "@tanstack/react-router";
import join from "@/assets/sprites/buttons/join.png";
import baks from "@/assets/sprites/baks.png";
import avatar from "@/assets/sprites/items/coin.png";
import pixi from "@/assets/sprites/pixi-frame.png";

export const Route = new FileRoute("/clan/$clanId").createRoute({
  component: ClanComponent,
});

const clanData = [
  {
    image: baks,
    name: "BaksTon",
    rank: 1,
    mined: 10000000,
  },
];

const cats = [
  {
    name: "Cat",
    image: avatar,
    value: 1000,
    stars: 1,
  },
];

function ClanComponent() {
  return (
    <section className="mb-20">
      <div className="flex flex-col justify-center z-10 text-black items-center">
        <img src={clanData[0].image} className="w-[136px] h-[136px]" alt="" />
        <span className="text-3xl font-bold text-white">
          {clanData[0].name}
        </span>
      </div>
      <div className="text-2xl ml-5 my-5 font-primary text-white flex flex-col">
        <span>rank: 💎</span>
        <span>Boost Rate : 3.3x</span>
        <span>members: 356 🐈‍⬛</span>
        <span>mined: 455 433 044</span>
      </div>
      <div className="flex flex-col items-center">
        <button>
          <img src={join} alt="" />
        </button>
      </div>
      <div className="flex w-full max-w-[358px] justify-start items-start">
        <svg width="250" height="70">
          <text
            x="15"
            y="50"
            className="stroke-behind tracking-[2.5px] stroke-[10px]"
          >
            Clan Rating
          </text>
        </svg>
      </div>
      <div className="flex  h-[210px] w-[383px] justify-start items-start">
        <div className="p-5 flex justify-start items-start">
          {cats.map((cat) => (
            <Link
              to="/"
              className="flex gap-4 flex-row justify-center items-center relative z-10"
            >
              <div className="flex justify-between z-10 text-black items-center">
                <img src={cat.image} className="w-12 h-12" alt="" />
              </div>
              <div className="flex flex-col text-xl justify-start items-start">
                <p className="font-bold ">{cat.name}</p>
                <div className="flex gap-4 text-xl">
                  <div className="flex gap-2">
                    <p className="uppercase font-primary text-xl">
                      {cat.value}
                    </p>
                    <img className="w-[26px] h-[25px]" src={avatar} alt="" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <img className={"absolute  px-4 mx-auto"} src={pixi} alt="" />
      </div>
    </section>
  );
}
