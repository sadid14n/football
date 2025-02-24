import { motion } from "framer-motion";
import { FaFutbol } from "react-icons/fa";

const AnimationAlert = ({ type, player, onClose }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1.5, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex items-center justify-center z-[9999]"
    >
      {type === "goal" && (
        <div className="flex flex-col items-center space-y-2">
          <FaFutbol className="text-white text-9xl animate-bounce" />
          <p className="text-white text-3xl font-bold">
            {player?.split(" ")[0]} ⚽ Goal!
          </p>
        </div>
      )}

      {type === "yellowCards" && (
        <div className="py-2 px-3 rounded-lg shadow-lg bg-blue-950 text-yellow-400 md:text-3xl text-md font-bold sm:scale-100 scale-150">
          {player?.split(" ")[0]} 🟨
        </div>
      )}
      {type === "redCards" && (
        <div className="py-2 px-3 rounded-lg shadow-lg bg-blue-950 text-red-600 md:text-3xl text-md font-bold sm:scale-100 scale-150">
          {player?.split(" ")[0]} 🟥
        </div>
      )}
    </motion.div>
  );
};

export default AnimationAlert;
