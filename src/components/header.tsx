import pr_count from "@/assets/sprites/present-count.png";
import cat_count from "@/assets/sprites/cat-count.png";
import { Link } from "@tanstack/react-router";
import { useGetUser } from "@/hooks/use-user";

export default function Header() {
  const { data: user } = useGetUser(localStorage.getItem("token"));

  return (
    <div className="flex font-primary justify-between items-center">
      <Link to="/gift" className="relative">
        <img className=" " src={pr_count} alt="" />
        <span className=" absolute  text-4xl top-7 left-4">
          {user?.data?.boxCount}
        </span>
      </Link>
      <Link to="/" className="relative">
        <img src={cat_count} alt="" />
        <span className="absolute text-4xl  top-9 left-4">
          {user?.data?.user?.tokenBalance}
        </span>
      </Link>
    </div>
  );
}
