import Header from "../header";
import Footer from "../footer";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="bg-gray-100 flex items-center justify-center h-screen">
        <h1>About Page</h1>
        <div className="max-w-md mx-auto p-4 bg-white rounded-md shadow-md">
          <p>
            This is a simple blog application built with React, Tailwind CSS,
            and FastAPI.
          </p>
          <p>
            The application has three main features: Home, Posts, and About. The
            Home page displays a list of posts, the Posts page (needs login)
            allows you to add, edit, and delete posts, and the About page
            provides information about the application.
          </p>
          <p>
            The application uses React Router to manage navigation, and it uses
            React Hooks to manage state and side effects. Tailwind CSS is used
            for styling, and the JSONPlaceholder API is used to fetch and update
            data.
          </p>
          <p>
            The application demonstrates how to build a simple blog using React,
            Tailwind CSS, and FastAPI. It covers common features like fetching
            data from an API, handling user input, and managing state in a React
            application.
          </p>
          <h3>About developer</h3>
          <p>
            This application was developed by Dan Chen. You can find the source
            code on GitHub at https://github.com/dc8156046/react-blog. Feel free
            to reach out if you have any questions or feedback.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
