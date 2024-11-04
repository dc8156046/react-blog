import Header from "./header";
import Footer from "./footer";

export default function Page() {
  return (
    <>
      <Header />
      <main className="container mx-auto my-8">
        <h2 className="text-2xl font-bold mb-4">Blog List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <article className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Blog Title 1</h3>
            <p className="text-gray-700">
              Here is a short introduction to the blog content...
            </p>
            <a href="#" className="text-blue-500 hover:underline">
              Read More
            </a>
          </article>
          <article className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Blog Title 2</h3>
            <p className="text-gray-700">
              Here is a short introduction to the blog content...
            </p>
            <a href="#" className="text-blue-500 hover:underline">
              Read More
            </a>
          </article>
          <article className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Blog Title 3</h3>
            <p className="text-gray-700">
              Here is a short introduction to the blog content...
            </p>
            <a href="#" className="text-blue-500 hover:underline">
              Read More
            </a>
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
}
