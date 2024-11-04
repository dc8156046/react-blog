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
          <a href="#" className="text-gray-600 hover:underline">
            About Us
          </a>
          <a href="#" className="text-gray-600 hover:underline">
            Contact Us
          </a>
          <a href="#" className="text-gray-600 hover:underline">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
