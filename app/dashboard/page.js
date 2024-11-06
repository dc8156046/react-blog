"use client";
import Header from "../header";
import Footer from "../footer";
import Side from "../side";

export default function Page() {
  return (
    <>
      <Header />
      <div className="flex min-h-screen">
        <Side />
        <main className="flex-1 p-10">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Card Title 1</h2>
              <p className="text-gray-600">Content for card 1...</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Card Title 2</h2>
              <p className="text-gray-600">Content for card 2...</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Card Title 3</h2>
              <p className="text-gray-600">Content for card 3...</p>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
