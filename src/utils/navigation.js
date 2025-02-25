// utils/navigation.js
"use client"; // Required for Next.js App Router

import { useRouter } from "next/navigation";

let routerInstance = null;

export const setRouter = (router) => {
  routerInstance = router;
};

export const navigate = (path) => {
  if (routerInstance) {
    routerInstance.push(path);
  } else {
    console.error("Router instance not available");
  }
};

export const goBack = () => {
  if (routerInstance) {
    routerInstance.back(); // Navigates to the previous route
  } else {
    console.error("Router instance not available");
  }
};