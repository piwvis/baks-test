import { FileRoute, Link } from "@tanstack/react-router";
import buy from "@/assets/sprites/buttons/buy.png";
import inventory from "@/assets/sprites/buttons/inventory.png";
import { useMemo } from "react";
import { useShopList } from "@/hooks/use-user";
import coin from "@/assets/sprites/items/coin.png";
import arrow_left from "@/assets/sprites/carousel/arrow-left.png";

export const Route = new FileRoute("/shop/$itemId").createRoute({
  component: ItemComponent,
});

function ItemComponent() {
  const { itemId } = Route.useParams();
  const { data: items } = useShopList();
  const itemData = useMemo(
    () => items?.data.find((item) => item.id === itemId),
    [itemId, items?.data],
  );
  return (
    <section className="mb-20">
      <Link to="/shop">
        <img src={arrow_left} className="h-[72px] mb-10 w-14" />
      </Link>

      <div className="flex mb-20 flex-col gap-5 justify-center items-center">
        <img
          className="max-w-[273px] max-h-[273px]"
          src={itemData?.url}
          alt=""
        />
        <div className="flex items-center gap-4">
          <svg
            className="flex items-center justify-center"
            width="80"
            height="100"
          >
            <text x="10" y="65" className="stroke-behind ">
              {itemData?.price}
            </text>
          </svg>
          <img className="w-[50px] h-[48px]" src={coin} alt="" />
        </div>
      </div>

      <div className="flex flex-col items-center">
        <img src={buy} alt="" />

        <button>
          <img src={inventory} alt="" />
        </button>
      </div>
    </section>
  );
}
