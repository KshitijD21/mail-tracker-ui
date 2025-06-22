import Image from "next/image";

export default function AuthHeader() {
  return (
    <div className="flex p-3 bg-white dark:bg-gray-900 ">
      <Image src={"/logo.png"} alt="Logo" width={180} height={30} />
    </div>
  );
}
