import { useEffect, useState } from "react";
import "@/app/globals.css";

export default function YclientsButton() {
  const [widgetReady, setWidgetReady] = useState(false);

  useEffect(() => {
    if (document.querySelector('script[src="https://w298112.yclients.com/widgetJS"]')) {
      setWidgetReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://w298112.yclients.com/widgetJS";
    script.async = true;
    script.defer = true;
    script.setAttribute("data-id", "yclients-widget-script");

    const handleLoad = () => {
      setWidgetReady(true);
      script.removeEventListener("load", handleLoad);
    };

    script.addEventListener("load", handleLoad);

    document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", handleLoad);
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return null;
}