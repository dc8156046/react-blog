import Link from "next/link";
export default function Footer() {
  return (
    <footer className="bg-white shadow mt-8">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-gray-600">
          <p>
            Short Introduction: This is a blog website sharing various
            interesting articles and stories.
          </p>
        </div>
        <div className="space-x-4">
          <Link href="/about" className="text-gray-600 hover:underline">
            About Us
          </Link>
          <Link href="/contact" className="text-gray-600 hover:underline">
            Contact Us
          </Link>
          <Link href="#" className="text-gray-600 hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
