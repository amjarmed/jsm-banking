import {Loader} from 'lucide-react';

function Loading() {
  // LAODING PAGE
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <h1 className="text-2xl  font-bold text-blue-600">
        <Loader className="animate-spin size-16" />
      </h1>
    </div>
  );
}

export default Loading;
