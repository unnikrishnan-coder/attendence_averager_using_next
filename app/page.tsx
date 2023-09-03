import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";

const Home = () => {
  return (
    <>
    <Navbar />
      <div className="bg-[--black-bg] text-[--white-text] h-[90vh] text-center flex justify-center items-center">
      <div>
      <h1 className="text-3xl mt-6">Helpfull Tools every student need!</h1>
      <p className="text-lg mt-6">Some helper tools for students. Check it out you won&apos;t regret </p>
      <button className="mt-6 p-3 border rounded-full">
        <Link href="/signup">Get Started</Link>
      </button>
      </div>
    </div>
    </>
  )
}

export default Home