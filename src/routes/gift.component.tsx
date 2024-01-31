import buy from "@/assets/sprites/buttons/buy-box.png";
import open from "@/assets/sprites/buttons/open-box.png";
import cat from "@/assets/sprites/white-cat-large.png";
import { useClaim, useGetUser } from "@/hooks/use-user";

export const component = function Index() {
  const { data: user } = useGetUser(localStorage.getItem("token"));
  const { mutate } = useClaim();
  return (
    <section className="">
      <div className="flex flex-col justify-center items-center">
        <img className="max-w-[273px] max-h-[273px]" src={cat} alt="" />
        <svg width="400" height="200">
          <text
            x="70"
            y="50"
            className="stroke-behind stroke-[14px] tracking-[6.5px] text-[65px]"
          >
            You have
          </text>
          <text
            x="70"
            y="120"
            className="stroke-behind stroke-[14px] tracking-[6.5px] text-[65px]"
          >
            {user?.data?.boxCount} BOXES
          </text>
        </svg>
      </div>

      <div className="flex flex-col items-center">
        <button onClick={() => mutate(localStorage.getItem("token"))}>
          <img src={open} alt="" />
        </button>

        <button>
          <img src={buy} alt="" />
        </button>
      </div>
    </section>
  );
};
