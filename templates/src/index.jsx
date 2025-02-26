import {createRoot} from "react-dom/client";
import {SpSpa} from "pithekos-lib";
import App from "./App";
import './index.css';

createRoot(document.getElementById("root"))
    .render(
        <SpSpa
            requireNet={%%REQUIRENET%%}
            titleKey="pages:%%PROJECTID%%:title"
            currentId="%%PROJECTID%%"
        >
            <App/>
        </SpSpa>
    );
