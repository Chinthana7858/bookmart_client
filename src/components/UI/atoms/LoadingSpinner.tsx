export default function LoadingSpinner() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4 text-gray-700 animate-pulse">
      <div className="book-loader mx-auto" />
      <div className="text-lg font-medium">Loading...</div>
    </div>
  );
}
