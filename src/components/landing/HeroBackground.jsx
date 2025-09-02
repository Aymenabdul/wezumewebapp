export default function HeroBackground() {
  return (
    <>
      <div className="absolute inset-0 z-0">
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 900 600"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <rect x="0" y="0" width="900" height="600" fill="#0066FF" />
          <path
            d="M0 391L50 369.7C100 348.3 200 305.7 300 325.3C400 345 500 427 600 467C700 507 800 505 850 504L900 503L900 601L850 601C800 601 700 601 600 601C500 601 400 601 300 601C200 601 100 601 50 601L0 601Z"
            fill="#FFFFFF"
            strokeLinecap="round"
            strokeLinejoin="miter"
          >
            <animate
              attributeName="d"
              values="M0 391L50 369.7C100 348.3 200 305.7 300 325.3C400 345 500 427 600 467C700 507 800 505 850 504L900 503L900 601L850 601C800 601 700 601 600 601C500 601 400 601 300 601C200 601 100 601 50 601L0 601Z;
                      M0 510L50 477.2C100 444.3 200 378.7 300 375.8C400 373 500 433 600 445.2C700 457.3 800 421.7 850 403.8L900 386L900 601L850 601C800 601 700 601 600 601C500 601 400 601 300 601C200 601 100 601 50 601L0 601Z;
                      M0 391L50 369.7C100 348.3 200 305.7 300 325.3C400 345 500 427 600 467C700 507 800 505 850 504L900 503L900 601L850 601C800 601 700 601 600 601C500 601 400 601 300 601C200 601 100 601 50 601L0 601Z"
              dur="6s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
    </>
  );
}


// export default function HeroBackground() {
//   return (
//     <>
//       <div className="absolute inset-0 z-0">
//         <svg
//           className="w-full h-full object-cover"
//           viewBox="0 0 900 600"
//           xmlns="http://www.w3.org/2000/svg"
//           preserveAspectRatio="xMidYMid slice"
//         >
//           {/* Blue background */}
//           <rect x="0" y="0" width="900" height="600" fill="#0066FF" />

//           {/* White wave (static) */}
//           <path
//             d="M0 391L50 369.7C100 348.3 200 305.7 300 325.3C400 345 500 427 600 467C700 507 800 505 850 504L900 503L900 601L850 601C800 601 700 601 600 601C500 601 400 601 300 601C200 601 100 601 50 601L0 601Z"
//             fill="#FFFFFF"
//             strokeLinecap="round"
//             strokeLinejoin="miter"
//           />
//         </svg>
//       </div>
//     </>
//   );
// }
