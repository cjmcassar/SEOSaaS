export default function NotPaid() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="rounded-lg bg-gray-800 p-4 shadow-lg">
        <h1 className="text-2xl font-bold">
          It appears you have either exhausted your monthly project allocation
          or you're not a subscribed user. Please reach out to our team to
          upgrade your account or wait until your allocation is refreshed.{" "}
        </h1>
      </div>
    </div>
  );
}
