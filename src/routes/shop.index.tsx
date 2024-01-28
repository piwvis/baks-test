import inventory from "@/assets/sprites/buttons/inventory.png";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import carousel_bg from "@/assets/sprites/carousel/carousel-bg.png";
import border from "@/assets/sprites/items/border.png";
import coin from "@/assets/sprites/items/coin.png";
import { useMemo, useState } from "react";
import { FileRoute, Link } from "@tanstack/react-router";
import { useShopList } from "@/hooks/use-user";

export const shop_sections = ["BOOST", "HEALTH", "SKIN"];

export const Route = new FileRoute("/shop/").createRoute({
  component: ShopIndexComponent,
});

function ShopIndexComponent() {
  const [section, setSection] = useState(0);
  const { data: items } = useShopList();
  const itemsSection = useMemo(() => {
    const itemsSection = [];
    itemsSection.push(
      items?.data.filter((item) => item.itemType === shop_sections[section]),
    );
    console.log("array test", itemsSection);
    return itemsSection[0];
  }, [items?.data, section]);
  console.log("array", itemsSection);

  return (
    <div className="flex justify-center items-center flex-col">
      <div className="flex justify-center">
        <Carousel
          opts={{
            watchDrag: false,
          }}
          setSection={setSection}
        >
          <CarouselContent>
            {shop_sections.map((section) => {
              return (
                <CarouselItem className="flex pl-0  relative cursor-default justify-center items-center">
                  <svg
                    className="flex items-center justify-center"
                    width="225"
                    height="100"
                  >
                    <text x="50" y="65" className="stroke-behind   text-6xl">
                      {section}
                    </text>
                  </svg>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious variant={null} />
          <CarouselNext variant={null} />
        </Carousel>
      </div>
      <div className="flex h-[510px] w-[383px] justify-start items-start">
        <div className="px-8 mt-10 grid justify-center grid-cols-2 gap-x-5 gap-y-12">
          {itemsSection &&
            itemsSection.map((item) => {
              console.log(item);
              return (
                <Link
                  to={"/shop/$itemId"}
                  params={{ itemId: item?.id }}
                  className="w-[145px] flex flex-col justify-center items-center relative h-[148px] outline-2 outline-slate-700 z-10"
                >
                  <img className="max-w-[110px]" src={item?.url} alt="" />
                  <img className="absolute top-0" src={border} alt="" />
                  <div className="absolute flex justify-between items-center gap-2 -bottom-12">
                    <p className="text-5xl font-primary font-bold text-black">
                      {item?.price}
                    </p>
                    <img className="w-[40px] h-[38px]" src={coin} alt="" />
                  </div>
                </Link>
              );
            })}
        </div>

        <img
          className={"absolute px-4 sm:px-0 mx-auto"}
          src={carousel_bg}
          alt=""
        />
      </div>
      <div className="flex flex-col items-center">
        <button>
          <img src={inventory} alt="" />
        </button>
      </div>
    </div>
  );
}
