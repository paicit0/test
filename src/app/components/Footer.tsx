import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="text-sm bg-blue-500 text-white text-center p-4 fixed inset-x-0 bottom-0">
      <div className="">
      GITHUB: <Link className="font-bold" href="https://github.com/paicit0/board" target="_blank">https://github.com/paicit0/board</Link> © 2024 BOARD. All rights reserved.
      </div>
      <div className="text-xl md:font-bold flex-1 md:text-center">
        <Link href="/patch">Features</Link>
      </div>
    </footer>
  );
};

export default Footer;