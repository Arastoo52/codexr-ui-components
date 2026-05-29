import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

const FlyToCart = () => {
    const [cartCount, setCartCount] = useState(0);
    const [isWiggling, setIsWiggling] = useState(false);
    const [flyingItem, setFlyingItem] = useState(null);

    const cartRef = useRef(null);
    const imageRef = useRef(null);

    const handleAddToCart = () => {
        // Prevent starting another animation while one is in progress
        if (flyingItem) return;

        if (imageRef.current && cartRef.current) {
            const imageRect = imageRef.current.getBoundingClientRect();
            const cartRect = cartRef.current.getBoundingClientRect();

            setFlyingItem({
                startX: imageRect.left,
                startY: imageRect.top,
                width: imageRect.width,
                height: imageRect.height,
                // Target center of the cart icon
                endX: cartRect.left + cartRect.width / 2 - 20,
                endY: cartRect.top + cartRect.height / 2 - 20,
            });

            // Handle the completion manually to avoid multiple triggers from onAnimationComplete
            setTimeout(() => {
                setFlyingItem(null); // Remove the flying item
                setCartCount(prev => prev + 1); // Increment cart count
                
                // Trigger wiggle animation on cart
                setIsWiggling(true);
                setTimeout(() => {
                    setIsWiggling(false);
                }, 200); // Reset wiggle after it completes
            }, 700); // 700ms matches the animation duration
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6 relative font-sans text-gray-900 overflow-hidden">

            {/* Top Right Cart Icon */}
            <div className="absolute top-8 right-32 z-50">
                <motion.button
                    ref={cartRef}
                    animate={isWiggling ? { scale: 1.15, rotate: -15 } : { scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className={`relative p-2 transition-colors duration-300 ${cartCount > 0 ? 'text-rose-500' : 'text-gray-900'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-basket-cancel">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M17 10l-2 -6" />
                        <path d="M7 10l2 -6" />
                        <path d="M12 20h-4.756a3 3 0 0 1 -2.965 -2.544l-1.255 -7.152a2 2 0 0 1 1.977 -2.304h13.999a2 2 0 0 1 1.977 2.304l-.3 1.713" />
                        <path d="M10 14a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                        <path d="M16 19a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                        <path d="M17 21l4 -4" />
                    </svg>
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#F8F9FA]">
                            {cartCount}
                        </span>
                    )}
                </motion.button>
            </div>

            {/* Product Card */}
            <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] w-full max-w-[380px] border border-gray-100 relative">

                {/* Product Image Section */}
                <div className="relative flex justify-center items-center h-72 mb-8 bg-gradient-to-b from-gray-50 to-white rounded-3xl overflow-visible">
                    <img
                        ref={imageRef}
                        src="/cola drink.png"
                        alt="Cold Drink Can"
                        className={`w-auto h-64 object-contain relative z-10 drop-shadow-2xl transition-opacity duration-300 ${flyingItem ? 'opacity-30' : 'opacity-100'}`}
                    />
                </div>

                {/* Product Details Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Classic Cola</h2>
                    <p className="text-gray-500 text-sm leading-relaxed font-medium">
                        Crisp, refreshing, and ice-cold. Experience the timeless taste with zero sugar and maximum flavor. Perfect for your everyday refreshment.
                    </p>
                </div>

                {/* Action Area */}
                <div className="flex items-center justify-between mt-auto">
                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        className="bg-black text-white px-7 py-3.5 rounded-md font-semibold text-sm hover:bg-gray-800 transition-all active:scale-95 flex items-center gap-2 shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.25)]"
                    >
                        <span>Add to cart</span>
                        <ShoppingCart className="w-4 h-4" />
                    </button>

                    {/* Price */}
                    <div className="text-2xl font-black text-gray-900 tracking-tight">
                        $2.99
                    </div>
                </div>

            </div>

            {/* Fly to Cart Animation Overlay */}
            <AnimatePresence>
                {flyingItem && (
                    <motion.img
                        src="/cola drink.png"
                        className="fixed z-[100] object-contain drop-shadow-2xl pointer-events-none"
                        initial={{
                            x: flyingItem.startX,
                            y: flyingItem.startY,
                            width: flyingItem.width,
                            height: flyingItem.height,
                            opacity: 1,
                        }}
                        animate={{
                            x: flyingItem.endX,
                            y: [flyingItem.startY, flyingItem.startY - 80, flyingItem.endY],
                            width: 30,
                            height: 30,
                            opacity: 0.8,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.7,
                            x: { duration: 0.7, ease: "linear" },
                            y: { duration: 0.7, ease: "easeInOut", times: [0, 0.4, 1] },
                            width: { duration: 0.7, ease: "easeInOut" },
                            height: { duration: 0.7, ease: "easeInOut" },
                            opacity: { duration: 0.7, ease: "linear" }
                        }}
                        style={{ top: 0, left: 0 }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default FlyToCart;