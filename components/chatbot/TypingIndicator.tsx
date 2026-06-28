export default function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1 p-2">
      <div className="w-1.5 h-1.5 bg-current opacity-60 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="w-1.5 h-1.5 bg-current opacity-60 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="w-1.5 h-1.5 bg-current opacity-60 rounded-full animate-bounce" />
    </div>
  );
}
