export default function Footer() {
  return (
    <footer className="w-full bg-blue-600 text-white py-4">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
        <p className="text-sm md:text-base">
          © {new Date().getFullYear()} Wezume. All rights reserved.
        </p>
        <a
          href="/privacy-policy"
          className="text-sm md:text-base underline hover:text-blue-200 transition mt-2 md:mt-0"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
