import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react";
import { useStores } from "app/store/Hook";

export const Tabs: React.FC = observer(() => {
    const {store} = useStores();
    const {pathname} = useLocation();
    const scrollRef = useRef(null);

    const getElementOffset = (el: HTMLElement | null) => {
        let rect = el!.getBoundingClientRect();
        let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return {top: rect.top + scrollTop, left: rect.left + scrollLeft};
    };

    useEffect(() => {
        const element = document.getElementById(`tab-link-/${pathname.split("/")[1]}`);
        if (element !== null) {
            let offset = getElementOffset(element);

            if (scrollRef.current === null) {
                return;
            }
            // @ts-ignore
            scrollRef.current.scrollLeft(offset.left);
        }
    });

    const currentNet = store.getNetworkConfig();

    return (
        <nav className="fixed top-0 w-full bg-darkprimary-200 h-12 z-30 flex">
            <Scrollbars autoHide autoHeight autoHeightMin={0} autoHeightMax={48}
                        ref={scrollRef}>
                <div className="flex h-12 w-auto">
                    {currentNet && <Link key="local" to="/" className={`flex items-center bg-darkprimary-100`}>
                          <p className={`text-sm px-6 py-2 rounded-lg whitespace-no-wrap text-primary-500`}>
                              {currentNet.name}
                          </p>
                      </Link>}
                    {Object.entries(store.getOtherDashes()).map(([netName, netPath]) => (
                        <a key={netName} href={`${netPath}`} className={`flex items-center`}>
                            <p className={`text-sm px-6 py-2 rounded-lg whitespace-no-wrap text-grey-600`}>
                                {netName}
                            </p>
                        </a>
                    ))}
                    <Link to="/add-node"
                          className={`flex items-center ${pathname.startsWith("/add-node") && "bg-darkprimary-100"}`}
                          id={`tab-link-/add-node`}
                    >
                        <p className={`text-sm px-6 py-2 rounded-lg whitespace-no-wrap ${pathname.startsWith("/add-node") && "text-primary-500" || "text-grey-600"}`}>
                            <FontAwesomeIcon icon="plus-circle" className="mr-2"/>
                            <span className="font-semibold text-sm">Add your node</span>
                        </p>
                    </Link>
                </div>
            </Scrollbars>
        </nav>
    );
});
