import Link from "next/link"
import Image from "next/image"

const OurTeam = () => {
    return (
        <div className="our-team-block pt-[100px] sm:pt-16 pt-10 bg-white">
            <div className="container">
                <div className="heading-block">
                    {/* Adapted Heading for Fascinante Digital */}
                    <div className="heading3">Meet Our Digital Experts</div>
                </div>
                <div className="list-member md:mt-10 mt-6 grid xl:grid-cols-4 sm:grid-cols-2 gap-8">
                    {/* Team Member 1 - CEO */}
                    <div className="col-12 col-xl-3 col-lg-3 col-md-6 col-sm-6">
                        <div className="bg-img w-full">
                            <Image width={1000} height={1000} className="w-full h-full display-block" src="/images/member/328x350.png" alt="Team Member Photo" />
                            <div className="list-social bg-white">
                                <Link href="http://facebook.com" target="_blank"> <i className="icon-facebook text-sm"></i></Link>
                                <Link href="http://linkedin.com" target="_blank"> <i className="icon-in text-sm"></i></Link>
                                <Link href="http://twitter.com" target="_blank"> <i className="icon-twitter fs-12"></i></Link>
                                <Link href="http://instagram.com" target="_blank"> <i className="icon-insta fs-12"></i></Link>
                            </div>
                        </div>
                        <div className="infor text-center pt-4">
                            {/* Updated Name */}
                            <div className="name heading6">Alexander Oviedo</div>
                            {/* Updated Position */}
                            <div className="caption1 text-secondary">CEO</div>
                        </div>
                    </div>
                    {/* Team Member 2 - Redes Sociales */}
                    <div className="col-12 col-xl-3 col-lg-3 col-md-6 col-sm-6">
                        <div className="bg-img w-full">
                            <Image width={1000} height={1000} className="w-full h-full display-block" src="/images/member/328x350.png" alt="Team Member Photo" />
                            <div className="list-social bg-white">
                                <Link href="http://facebook.com" target="_blank"> <i className="icon-facebook text-sm"></i></Link>
                                <Link href="http://linkedin.com" target="_blank"> <i className="icon-in text-sm"></i></Link>
                                <Link href="http://twitter.com" target="_blank"> <i className="icon-twitter fs-12"></i></Link>
                                <Link href="http://instagram.com" target="_blank"> <i className="icon-insta fs-12"></i></Link>
                            </div>
                        </div>
                        <div className="infor text-center pt-4">
                            {/* Updated Name */}
                            <div className="name heading6">Andry Alva</div>
                            {/* Updated Position */}
                            <div className="caption1 text-secondary">Social Media Manager</div>
                        </div>
                    </div>
                    {/* Team Member 3 - PPC */}
                    <div className="col-12 col-xl-3 col-lg-3 col-md-6 col-sm-6">
                        <div className="bg-img w-full">
                            <Image width={1000} height={1000} className="w-full h-full display-block" src="/images/member/328x350.png" alt="Team Member Photo" />
                            <div className="list-social bg-white">
                                <Link href="http://facebook.com" target="_blank"> <i className="icon-facebook text-sm"></i></Link>
                                <Link href="http://linkedin.com" target="_blank"> <i className="icon-in text-sm"></i></Link>
                                <Link href="http://twitter.com" target="_blank"> <i className="icon-twitter fs-12"></i></Link>
                                <Link href="http://instagram.com" target="_blank"> <i className="icon-insta fs-12"></i></Link>
                            </div>
                        </div>
                        <div className="infor text-center pt-4">
                            {/* Updated Name */}
                            <div className="name heading6">Nohely Rivas</div>
                            {/* Updated Position */}
                            <div className="caption1 text-secondary">PPC Specialist</div>
                        </div>
                    </div>
                    {/* Team Member 4 - SEO */}
                    <div className="col-12 col-xl-3 col-lg-3 col-md-6 col-sm-6">
                        <div className="bg-img w-full">
                            <Image width={1000} height={1000} className="w-full h-full display-block" src="/images/member/328x350.png" alt="Team Member Photo" />
                            <div className="list-social bg-white">
                                <Link href="http://facebook.com" target="_blank"> <i className="icon-facebook text-sm"></i></Link>
                                <Link href="http://linkedin.com" target="_blank"> <i className="icon-in text-sm"></i></Link>
                                <Link href="http://twitter.com" target="_blank"> <i className="icon-twitter fs-12"></i></Link>
                                <Link href="http://instagram.com" target="_blank"> <i className="icon-insta fs-12"></i></Link>
                            </div>
                        </div>
                        <div className="infor text-center pt-4">
                            {/* Updated Name */}
                            <div className="name heading6">Alberto Roldan</div>
                            {/* Updated Position */}
                            <div className="caption1 text-secondary">SEO Specialist</div>
                        </div>
                    </div>
                    {/* This fifth item was hidden in the original code, keeping it hidden */}
                    <div className="col-12 col-xl-3 col-lg-3 col-md-6 col-sm-6 hidden">
                        <div className="bg-img w-full">
                            <Image width={1000} height={1000} className="w-full h-full display-block" src="/images/member/328x350.png" alt="Team Member Photo" />
                            <div className="list-social bg-white">
                                <Link href="http://facebook.com" target="_blank"> <i className="icon-facebook text-sm"></i></Link>
                                <Link href="http://linkedin.com" target="_blank"> <i className="icon-in text-sm"></i></Link>
                                <Link href="http://twitter.com" target="_blank"> <i className="icon-twitter fs-12"></i></Link>
                                <Link href="http://instagram.com" target="_blank"> <i className="icon-insta fs-12"></i></Link>
                            </div>
                        </div>
                        <div className="infor text-center pt-4">
                            {/* Example of a hidden member */}
                            <div className="name heading6">Hidden Member</div>
                            <div className="caption1 text-secondary">Hidden Position</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default OurTeam
