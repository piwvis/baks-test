import coin from "@/assets/sprites/big-coin.png";
import avatar from "@/assets/sprites/items/coin.png";
import pixi from "@/assets/sprites/pixi-frame.png";
import star from "@/assets/sprites/star.png";
import { Link } from "@tanstack/react-router";
import arrow from "@/assets/sprites/arrow.png";
import invite from "@/assets/sprites/invite.png";

const cats = [
  {
    name: "Cat",
    image: avatar,
    value: 1000,
    stars: 1,
  },
];

export const component = function Index() {
  return (
    <section className="flex gap-4 mb-10 flex-col items-center justify-start ">
      <div className="flex w-full max-w-[380px] justify-center items-center">
        <svg width="350" height="100">
          <text
            x="70"
            y="50"
            className="stroke-behind uppercase stroke-[14px] tracking-[6.5px] text-[65px]"
          >
            2 cats
          </text>
        </svg>
      </div>

      <div className="flex flex-col gap-4 h-[235px]  w-[383px] justify-start items-start">
        <span className="text-3xl px-4 text-white font-bold">
          Invite cats to get 💎{" "}
        </span>
        <div className="flex flex-col justify-start items-start">
          <div className="z-10 relative p-4 flex justify-start items-start flex-col gap-5">
            <div className="flex gap-2 justify-center items-center">
              <img className="w-[62px] h-[65px]" src={coin} alt="" />
              <span className="font-bold">
                <p className="text-2xl">Invite cat </p>
                <p className="text-xl">1000 for you and cat</p>
              </span>
            </div>
            <p className="h-[2px] top-1/2 ml-[14px] absolute w-[330px]  bg-black" />

            <div className="flex gap-2 justify-center items-center">
              <img className="w-[62px] h-[65px]" src={star} alt="" />
              <span className="font-bold">
                <p className="text-xl">Invite cat with TG Premium </p>
                <p className="text-xl">5000 for you and cat</p>
              </span>
            </div>
          </div>
          <img className={"absolute px-4 sm:px-0 mx-auto"} src={pixi} alt="" />
        </div>
      </div>

      <div className="flex mt-14 justify-center items-center text-white">
        <p className="text-white font-bold text-3xl">Learn More</p>
      </div>
      <div className="flex w-full max-w-[358px] justify-start items-start">
        <svg width="190" height="70">
          <text
            x="4"
            y="50"
            className="stroke-behind tracking-[2.5px] stroke-[10px]"
          >
            My cats
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
              <img className="w-4 h-5 ml-44" src={arrow} alt="" />
            </Link>
          ))}
        </div>
        <img className={"absolute  px-4 mx-auto"} src={pixi} alt="" />
      </div>
      <Link to="/invite">
        <img src={invite} alt="" />
      </Link>
    </section>
  );
};
