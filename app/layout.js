import "./globals.css";

export const metadata = {
  title: "React Blog Web App with Python FastAPI Backend",
  description:
    "A blog web app built with React and FastAPI, with user authentication and CRUD operations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      ></meta>
      <meta name="description" content={metadata.description}></meta>
      <meta name="author" content="Dan Chen"></meta>
      <meta name="robots" content="index, follow"></meta>
      <meta
        name="keywords"
        content="Python, blog, web app, react, fastapi, Next.js"
      ></meta>

      <title>{metadata.title}</title>
      <body className="bg-gray-100">{children}</body>
    </html>
  );
}
