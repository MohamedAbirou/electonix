import Link from "next/link";
import Container from "../container";
import FooterList from "./footer-list";
import { MdFacebook } from "react-icons/md";
import { FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";

export const Footer = () => {
  return (
    <footer className="bg-slate-700 px-3 text-slate-200 text-sm mt-16">
      <Container>
        <div className="flex flex-col md:flex-row justify-between pt-16 pb-8">
          <FooterList>
            <h3 className="font-bold text-base mb-2">Shop Categories</h3>
            <Link href="#">Phones</Link>
            <Link href="#">Laptops</Link>
            <Link href="#">Desktops</Link>
            <Link href="#">Watches</Link>
            <Link href="#">Tvs</Link>
            <Link href="#">Accessories</Link>
          </FooterList>
          <FooterList>
            <h3 className="font-bold text-base mb-2">Customer Service</h3>
            <Link href="#">Contact Us</Link>
            <Link href="#">Shipping Policy</Link>
            <Link href="#">Returns & Exchanges</Link>
            <Link href="#">FAQs</Link>
          </FooterList>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="font-bold text-base mb-2">About Us</h3>
            <p className="mb-2">
              At our electronics store, we are dedicated to providing the latest
              and greatest devices and accessories to our customers. With a wide
              selection of phones, Tvs, Laptops, Watches and Accessories.
            </p>
            <p>
              &copy; {new Date().getFullYear()} E-Shop, All rights reserved.
            </p>
          </div>
          <FooterList className="items-center">
            <h3 className="font-bold text-base mb-2">Follow Us</h3>
            <div className="flex gap-2">
              <Link href="#">
                <MdFacebook size={24} className="hover:fill-[#316FF6]" />
              </Link>
              <Link href="#">
                <FaXTwitter size={24} className="hover:fill-black" />
              </Link>
              <Link href="#">
                <FaInstagram size={24} className="hover:fill-pink-500" />
              </Link>
              <Link href="#">
                <FaYoutube size={24} className="hover:fill-[#FF0000]" />
              </Link>
            </div>
          </FooterList>
        </div>
      </Container>
    </footer>
  );
};
