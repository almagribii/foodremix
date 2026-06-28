import Lottie from "lottie-react";
import bot from "./bot.json";

export default function Chatbot({ loop }: { loop?: boolean }) {
  return <Lottie loop={loop} animationData={bot} />;
}
