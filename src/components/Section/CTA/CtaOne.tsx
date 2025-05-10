import Link from "next/link";

const CtaOne = () => {
    return (
        // Main container with relative positioning and height
        // Applied a modern gradient background using inline style
        // Removed the 'rounded-xl' class to make corners straight
        <div
            className="cta-block style-two relative lg:h-[120px] h-[180px] overflow-hidden"
            style={{
                backgroundImage: 'linear-gradient(to right, #C026D3, #6D28D9)' // Fuchsia-600 to Purple-700 gradient
            }}
        >
            {/* Removed the Image component for the background */}
            {/* The gradient is applied directly via the style prop */}

            {/* Container for content, centered vertically and horizontally */}
            <div className="container flex items-center justify-between max-lg:flex-col max-lg:justify-center gap-6 h-full">
                {/* Heading text adapted for Fascinante Digital */}
                <div className="heading5 max-lg:text-center text-white drop-shadow">
                    Ready to elevate your digital presence?
                </div>
                {/* Call to action button */}
                {/* Adjusted button styling for better contrast on the gradient */}
                <Link
                    // Changed hover:text-white to hover:text-black for better contrast
                    className="button-main rounded-full bg-white text-fuchsia-700 hover:bg-purple-800 hover:text-black text-button px-9 py-3 transition-colors duration-300 ease-in-out shadow-lg"
                    href="/contact/contact-two" // Assuming this is the correct contact page link
                >
                    Let&apos;s Talk
                </Link>
            </div>
        </div>
    );
};

export default CtaOne;
