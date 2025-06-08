import Hero from "../Components/Hero";
import MenuDishes from "../Components/MenuDishes";
import About from "../Components/About";
export default function Home() {
  return (
    <>
      <div className="bg-gray-900 text-gray-400">
      <Hero />
      <MenuDishes />
      <About/>
      </div>
    </>
  );
}
