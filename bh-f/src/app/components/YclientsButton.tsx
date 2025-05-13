import { useEffect, useState } from "react";
import "@/app/globals.css";

export default function YclientsButton() {
  const [widgetReady, setWidgetReady] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://w298112.yclients.com/widgetJS";
    script.async = true;

    script.onload = () => {
      setWidgetReady(true);
    };

    document.body.appendChild(script);
  }, []);

  return null;
}
