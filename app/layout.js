import "./globals.css";

export const metadata = {
  title: "Blog Web App",
  description: "A blog web app built with React and FastAPI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      ></meta>
      <title>Blog</title>
      <body className="bg-gray-100">{children}</body>
    </html>
  );
}
