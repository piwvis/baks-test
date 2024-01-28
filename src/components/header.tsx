import pr_count from "@/assets/sprites/present-count.png";
import cat_count from "@/assets/sprites/cat-count.png";
import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <div className="flex font-primary justify-between items-center">
      <Link to="/gift" className="relative">
        <img className=" " src={pr_count} alt="" />
        <span className=" absolute text-4xl top-7 left-4">12</span>
      </Link>
      <Link to="/" className="relative">
        <img src={cat_count} alt="" />
        <span className="absolute text-4xl  top-9 left-4">123</span>
      </Link>
    </div>
  );
}
