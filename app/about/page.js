import Header from "../header";
import Footer from "../footer";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto my-8">
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-2">
            About Page
          </h1>
          <div className="flex items-center mb-4">
            <p>
              This is a simple blog application built with React, Tailwind CSS,
              and FastAPI.
            </p>
            <p>
              The application has three main features: Home, Posts, and About.
              The Home page displays a list of posts, the Posts page (needs
              login) allows you to add, edit, and delete posts, and the About
              page provides information about the application.
            </p>
            <p>
              The application uses React Router to manage navigation, and it
              uses React Hooks to manage state and side effects. Tailwind CSS is
              used for styling, and the JSONPlaceholder API is used to fetch and
              update data.
            </p>
            <p>
              The application demonstrates how to build a simple blog using
              React, Tailwind CSS, and FastAPI. It covers common features like
              fetching data from an API, handling user input, and managing state
              in a React application.
            </p>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              About developer
            </h2>
            <p>
              This application was developed by Dan Chen. You can find the
              source code on GitHub at https://github.com/dc8156046/react-blog.
              Feel free to reach out if you have any questions or feedback.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}