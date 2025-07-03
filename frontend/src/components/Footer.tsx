'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center">
          <p className="text-sm text-gray-500">
            © {currentYear} Kotobalize. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
