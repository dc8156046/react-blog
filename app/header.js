export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-xl font-bold">
          <a href="#" className="text-blue-500">
            LOGO
          </a>
        </div>
        <div className="space-x-4">
          <a
            href="/signup"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Sign Up
          </a>
          <a
            href="/login"
            className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white"
          >
            Login
          </a>
        </div>
      </div>
    </header>
  );
}
