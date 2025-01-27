import withLazyLoad from "../utils/lazyloading"; // Assuming you have the lazy load utility from before

// Utility to simulate a delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Lazy-loaded Home component with delay
const LazyHome = withLazyLoad(async () => {
  await delay(2000); // Add a 2-second delay for testing purposes
  return import("../components/Home");
});

const HomePage = () => {
  return (
    <div>
      <LazyHome />
      
    </div>
  );
};

export default HomePage;
